import pandas as pd
import re
import json
import psutil
import unicodedata
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from functools import lru_cache
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Carga perezosa del modelo spaCy (singleton a nivel de modulo).
# El backend crea un DataAnonymizer() por cada request; cargar el modelo en
# cada instancia seria lentisimo. Se carga UNA sola vez y se reutiliza.
# ---------------------------------------------------------------------------
_NLP = None
_NLP_LOADED = False
_NLP_MODEL_NAME = None
_DICT_CACHE = {}  # Cache de diccionarios compilados


def _load_nlp():
    """Carga el mejor modelo NER en espanol disponible (lg > md > sm)."""
    global _NLP, _NLP_LOADED, _NLP_MODEL_NAME
    if _NLP_LOADED:
        return _NLP
    _NLP_LOADED = True
    try:
        import spacy
    except Exception:
        logger.warning("spaCy no disponible, usando fallback regex")
        _NLP = None
        return _NLP
    disable = ['tagger', 'parser', 'lemmatizer', 'attribute_ruler', 'morphologizer']
    for model_name in ('es_core_news_lg', 'es_core_news_md', 'es_core_news_sm'):
        try:
            _NLP = spacy.load(model_name, disable=disable)
            _NLP_MODEL_NAME = model_name
            logger.info(f"Modelo NER cargado: {model_name}")
            return _NLP
        except Exception as e:
            logger.debug(f"No se pudo cargar {model_name}: {e}")
            continue
    _NLP = None
    return _NLP


# ---------------------------------------------------------------------------
# Funciones de validación y normalización
# ---------------------------------------------------------------------------

def validate_rut(rut_str: str) -> bool:
    """Valida RUT chileno con dígito verificador."""
    rut_str = rut_str.replace('.', '').replace('-', '').strip()
    if len(rut_str) < 8:
        return False
    try:
        rut_num = int(rut_str[:-1])
        dv = rut_str[-1].upper()

        # Calcular dígito verificador
        mult = 2
        suma = 0
        for d in str(rut_num)[::-1]:
            suma += int(d) * mult
            mult += 1
            if mult > 7:
                mult = 2

        dv_calc = 11 - (suma % 11)
        if dv_calc == 11:
            dv_calc = 0
        elif dv_calc == 10:
            dv_calc = 'K'
        else:
            dv_calc = str(dv_calc)

        return str(dv_calc) == dv
    except:
        return False


def normalize_unicode(text: str) -> str:
    """Normaliza unicode a NFC (composición canónica)."""
    if not isinstance(text, str):
        return ''
    return unicodedata.normalize('NFC', text)


@lru_cache(maxsize=1000)
def _normalize_for_lookup(text: str) -> str:
    """Normaliza texto para búsqueda en diccionarios (cached)."""
    return text.lower().strip()


def _load_custom_dictionaries(dict_file: Optional[str] = None) -> Dict[str, Set[str]]:
    """Carga diccionarios desde JSON externo (si existe)."""
    default_dicts = {
        'locations': set(),
        'institutions': set(),
    }

    if dict_file and Path(dict_file).exists():
        try:
            with open(dict_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                default_dicts['locations'] = set(data.get('locations', []))
                default_dicts['institutions'] = set(data.get('institutions', []))
                logger.info(f"Diccionarios cargados desde {dict_file}")
        except Exception as e:
            logger.warning(f"No se pudo cargar {dict_file}: {e}")

    return default_dicts


class DataAnonymizer:
    """
    Anonimizador HIBRIDO v6 (NER + Regex + Multi-Actor + Optimizaciones).

    - NER (spaCy es_core_news_lg) para PERSONAS / UBICACIONES / INSTITUCIONES:
      detecta entidades aunque NO esten en ningun diccionario y etiqueta cada
      actor por separado -> resuelve relatos con multiples actores.
    - Regex para datos ESTRUCTURADOS (RUT, email, telefono, ID, direccion).
    - Una sola pasada por offsets con resolucion de solapamientos por prioridad
      (elimina la fragilidad del multi-pass y del orden de reemplazos).
    - Fallback 100% regex si spaCy no esta disponible (nunca crashea).
    - Validación de RUT con dígito verificador.
    - Diccionarios pre-compilados para performance.
    - Logging/debug detallado.
    - Caché de resultados.
    - Batch size adaptativo según memoria.

    API publica (compatible con el backend Flask):
        __init__(confidence_mode='standard', debug=False, dict_file=None)
        self.counter  -> person, location, institution, rut, id_number,
                         email, phone, address, unique_actors
        self.mappings -> {texto_original: {'tag': etiqueta, 'type': tipo, 'confidence': score}}
        self.actors_by_type -> {'person': {actor1, actor2}, 'location': {...}, ...}
        anonymize_narrative(text), anonymize_dataframe(df, columns_to_anonymize),
        get_summary()
    """

    _TAG_PRIORITY = {
        '<rut>': 0, '<id>': 0, '<correo>': 0, '<telefono>': 0,
        '<direccion>': 1, '<nombre>': 2, '<institucion>': 3, '<ubicacion>': 4,
    }
    _CONFIDENCE = {'conservative': 0.95, 'standard': 0.90, 'aggressive': 0.80}

    # Etiquetas NER de spaCy -> (tag, counter_key)
    _NER_MAP = {
        'PER': ('<nombre>', 'person'),
        'PERSON': ('<nombre>', 'person'),
        'LOC': ('<ubicacion>', 'location'),
        'GPE': ('<ubicacion>', 'location'),
        'ORG': ('<institucion>', 'institution'),
    }

    def __init__(self, confidence_mode='standard', debug=False, dict_file=None):
        self.counter = {}
        self.mappings = {}
        self.actors_by_type = {'person': set(), 'location': set(), 'institution': set()}
        self.confidence_mode = confidence_mode if confidence_mode in self._CONFIDENCE else 'standard'
        self.debug = debug
        self.compiled_patterns = self._compile_patterns()
        self._init_data_lists(dict_file)
        self._nlp = _load_nlp()
        self._result_cache = {}  # Caché para textos ya procesados
        self._calculate_batch_size()  # Calcular batch size adaptativo

        if self.debug:
            logger.info(f"Modo debug activado | Confianza: {self.confidence_mode}")

    # ------------------------------------------------------------------ #
    def _init_data_lists(self, dict_file=None):
        """Diccionarios de respaldo (complementan al NER, no lo reemplazan)."""
        # MEJORA: Cargar diccionarios configurables desde JSON si existen
        custom_dicts = _load_custom_dictionaries(dict_file)

        # Diccionarios por defecto
        default_locations = {
            'arica y parinacota', 'arica', 'tarapaca', 'antofagasta', 'atacama',
            'coquimbo', 'valparaiso', 'maule', 'nuble', 'biobio', 'la araucania',
            'los rios', 'los lagos', 'aysen', 'magallanes',
            'metropolitana', 'region metropolitana',
            'santiago', 'independencia', 'conchali', 'huechuraba', 'recoleta',
            'providencia', 'vitacura', 'lo barnechea', 'las condes', 'nunoa',
            'la reina', 'macul', 'penalolen', 'la florida', 'san joaquin',
            'la granja', 'la pintana', 'san ramon', 'san miguel', 'la cisterna',
            'el bosque', 'pedro aguirre cerda', 'lo espejo', 'estacion central',
            'cerrillos', 'maipu', 'lo prado', 'pudahuel', 'cerro navia',
            'renca', 'quilicura', 'colina', 'lampa', 'tiltil',
            'puente alto', 'san jose de maipo', 'pirque', 'san bernardo',
            'buin', 'paine', 'calera de tango', 'curacavi',
            'talagante', 'penaflor', 'el monte', 'padre hurtado',
            'vina del mar', 'villa alemana', 'quilpue',
            'concepcion', 'talcahuano', 'temuco', 'valdivia', 'osorno', 'puerto montt',
            'la serena', 'ovalle', 'los angeles', 'talca', 'curico',
            'linares', 'chillan', 'calama', 'copiapo',
            'iquique', 'punta arenas', 'coihueco',
        }

        default_institutions = {
            'liceo central', 'colegio andres bello', 'colegio pedro de valdivia',
            'liceo de aplicacion', 'instituto nacional', 'liceo experimental',
            'colegio aleman', 'colegio saint george', 'liceo bicentenario',
            'escuela basica municipal', 'universidad de chile',
            'universidad catolica', 'universidad de concepcion',
            'universidad de valparaiso', 'universidad austral',
            'inacap', 'duoc', 'instituto profesional',
            'ministerio de educacion', 'superintendencia de educacion',
            'seremi de educacion', 'departamento de educacion', 'daem',
        }

        # Fusionar diccionarios por defecto con custom (custom tiene prioridad)
        self.locations = default_locations | custom_dicts.get('locations', set())
        self.institutions = default_institutions | custom_dicts.get('institutions', set())

        # MEJORA: Pre-compilar patrones regex para diccionarios (evita recompilar)
        self._location_patterns = self._compile_dict_patterns(sorted(self.locations, key=len, reverse=True))
        self._institution_patterns = self._compile_dict_patterns(sorted(self.institutions, key=len, reverse=True))

        if self.debug:
            logger.info(f"Diccionarios cargados: {len(self.locations)} ubicaciones, {len(self.institutions)} instituciones")

    def _compile_dict_patterns(self, terms: List[str]) -> List[re.Pattern]:
        """Pre-compila patrones regex para términos de diccionario."""
        return [re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE) for term in terms]

    def _compile_patterns(self) -> Dict:
        """Regex para datos ESTRUCTURADOS (precisos y confiables)."""
        return {
            'rut': [
                re.compile(r'\d{1,2}\.\d{3}\.\d{3,6}-[0-9kK]'),
                re.compile(r'\d{1,2}\.\d{4,6}-[0-9kK]'),
                re.compile(r'\d{7,11}-[0-9kK]'),
                re.compile(r'\d{2}\s\d{3}\s\d{3}-[0-9kK]'),
            ],
            'id_numbers': [
                re.compile(r'(?:pasaporte|passport|psp)\s*:?\s*[a-z]?\d{6,9}', re.IGNORECASE),
                re.compile(r'(?:licencia|lic\.?)\s*:?\s*\d{6,8}', re.IGNORECASE),
                re.compile(r'(?:c[eé]dula|carne)\s*:?\s*\d{7,10}', re.IGNORECASE),
                re.compile(r'(?:documento|doc|nro)\s*:?\s*\d{6,12}', re.IGNORECASE),
            ],
            'email': [
                re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
            ],
            'phone': [
                re.compile(r'\+56\s?-?\s?9\s?-?\d{4}\s?-?\d{4}'),
                re.compile(r'\+56\s?-?\s?2\s?-?\d{4}\s?-?\d{4}'),
                re.compile(r'\+56\s?-?\s?\d{2}\s?-?\d{4}\s?-?\d{4}'),
                re.compile(r'\b9\s?\d{4}\s?\d{4}\b'),
                re.compile(r'\b22\s?\d{4}\s?\d{4}\b'),
                re.compile(r'\+56\s?\d{8,9}'),
                re.compile(r'\b9\d{8}\b'),
            ],
            'address': [
                re.compile(r'\b(?:Calle|Avenida|Av\.|Pasaje|Pje\.|Camino|Depto|Dpto|Piso|Bloque|Lote)\s+[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ\s\.#-]+?(?:\s+\d+[A-Za-z0-9]*)?(?=\s*(?:,|\.|;|$))', re.IGNORECASE),
                re.compile(r'\bkm\s?\d+(?:\.\d+)?\b', re.IGNORECASE),
                re.compile(r'-?\d{1,2}\.\d{3,6},\s*-?\d{1,2}\.\d{3,6}'),
            ],
        }

    def _normalize_text(self, value: str) -> str:
        if not isinstance(value, str):
            return ''
        # MEJORA: Normalizar unicode también
        return normalize_unicode(value).lower().strip()

    def _calculate_batch_size(self):
        """MEJORA: Calcula batch size adaptativo según memoria disponible."""
        try:
            memory_percent = psutil.virtual_memory().percent
            if memory_percent > 80:
                self.batch_size = 16  # Memoria alta, usar batch pequeño
            elif memory_percent > 60:
                self.batch_size = 32
            else:
                self.batch_size = 64  # Batch normal
            if self.debug:
                logger.info(f"Batch size adaptativo: {self.batch_size} (memoria: {memory_percent}%)")
        except:
            self.batch_size = 64  # Fallback si psutil no funciona

    def get_confidence_mode(self) -> str:
        return self.confidence_mode

    # ------------------------------------------------------------------ #
    # Recoleccion de spans (start, end, tag, counter_key)
    # ------------------------------------------------------------------ #
    def _structured_spans(self, text: str) -> List:
        spans = []
        for p in self.compiled_patterns['rut']:
            for m in p.finditer(text):
                rut_text = m.group(0)
                # MEJORA: Validar RUT con dígito verificador
                if validate_rut(rut_text):
                    spans.append((m.start(), m.end(), '<rut>', 'rut', 1.0))
                    if self.debug:
                        logger.debug(f"RUT válido detectado: {rut_text}")
                elif self.debug:
                    logger.debug(f"RUT inválido (verificación fallida): {rut_text}")

        for p in self.compiled_patterns['id_numbers']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<id>', 'id_number', 1.0))

        for p in self.compiled_patterns['email']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<correo>', 'email', 1.0))

        for p in self.compiled_patterns['phone']:
            for m in p.finditer(text):
                chunk = m.group(0)
                # Evitar confundir anios (1900-2099) con telefonos.
                if re.fullmatch(r'\s*(?:19|20)\d{2}\s*', chunk):
                    continue
                spans.append((m.start(), m.end(), '<telefono>', 'phone', 1.0))

        for p in self.compiled_patterns['address']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<direccion>', 'address', 1.0))

        return spans

    def _ner_spans(self, doc) -> List:
        """Extrae spans de NER con tracking de actores, confianza mejorada y logging."""
        spans = []
        if doc is None:
            return spans

        # Umbral de confianza segun modo
        confidence_threshold = self._CONFIDENCE.get(self.confidence_mode, 0.90)

        for ent in doc.ents:
            mapped = self._NER_MAP.get(ent.label_)
            if not mapped:
                continue
            tag, key = mapped
            label = ent.text.strip()
            if len(label) < 2:
                continue

            # MEJORA: Heurística mejorada de confianza
            entity_length = len(label.split())
            # Base: multi-palabra es más confiable
            base_confidence = min(0.98, 0.75 + (entity_length * 0.06))
            # Ajuste por modelo (lg es mejor que md/sm)
            if _NLP_MODEL_NAME == 'es_core_news_lg':
                base_confidence = min(0.98, base_confidence + 0.02)

            # En modo conservative, solo aceptar muy altas confianzas
            if self.confidence_mode == 'conservative' and base_confidence < 0.92:
                if self.debug:
                    logger.debug(f"Entidad rechazada (baja confianza): {label} ({base_confidence:.2f})")
                continue

            # Registrar actor unico
            if key in self.actors_by_type:
                self.actors_by_type[key].add(label.lower())

            spans.append((ent.start_char, ent.end_char, tag, key, base_confidence))

            if self.debug:
                logger.debug(f"NER detectado: {label} ({ent.label_}) - confianza: {base_confidence:.2f}")

        return spans

    def _dictionary_spans(self, text: str) -> List:
        """MEJORA: Respaldo usando patrones pre-compilados (mucho más rápido)."""
        spans = []

        # MEJORA: Usar patrones pre-compilados en lugar de compilar dinámicamente
        for pattern in self._institution_patterns:
            for m in pattern.finditer(text):
                spans.append((m.start(), m.end(), '<institucion>', 'institution', 0.95))

        for pattern in self._location_patterns:
            for m in pattern.finditer(text):
                spans.append((m.start(), m.end(), '<ubicacion>', 'location', 0.95))

        return spans

    def _fallback_name_spans(self, text: str) -> List:
        """MEJORA: Detección mejorada de nombres (regex fallback)."""
        spans = []

        # MEJORA: Patrones mejorados para nombres
        # 1. Nombres capitalizados de 2+ palabras: "Juan Perez", "Maria Jose Soto"
        pat = re.compile(
            r'\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,4})\b'
        )
        # Lista mejorada de palabras que NO son nombres
        stop = {
            'El', 'La', 'Los', 'Las', 'Un', 'Una', 'Se', 'Su', 'En', 'De', 'Del',
            'Por', 'Con', 'Para', 'Que', 'Como', 'Fecha', 'Region', 'Comuna',
            'Señora', 'Señor', 'Sra', 'Sr', 'Srta', 'Apoderada', 'Apoderado',
            'Alumna', 'Alumno', 'Estudiante', 'Profesor', 'Director', 'Directora'
        }

        for m in pat.finditer(text):
            first = m.group(1).split()[0]
            if first in stop:
                continue
            spans.append((m.start(1), m.end(1), '<nombre>', 'person', 0.80))

            if self.debug:
                logger.debug(f"Nombre detectado (fallback): {m.group(1)}")

        # 2. MAYUSCULAS sostenidas: "JUAN PEREZ" (menos confiable)
        for m in re.finditer(r'\b([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,}){1,4})\b', text):
            first = m.group(1).split()[0]
            if first not in stop and len(m.group(1)) > 6:  # Debe ser suficientemente largo
                spans.append((m.start(1), m.end(1), '<nombre>', 'person', 0.70))

        return spans

    # ------------------------------------------------------------------ #
    # Merge por prioridad + reemplazo por offsets (una sola pasada)
    # ------------------------------------------------------------------ #
    def _merge_and_replace(self, text: str, spans: List) -> str:
        if not spans:
            return text

        # Normalizar spans: algunos tienen confianza (5 elementos), otros no (4 elementos)
        normalized_spans = []
        for span in spans:
            if len(span) == 5:
                s, e, tag, key, confidence = span
                normalized_spans.append((s, e, tag, key, confidence))
            else:
                s, e, tag, key = span
                normalized_spans.append((s, e, tag, key, 1.0))  # confianza maxima por defecto

        # Orden: prioridad asc, luego posicion, luego span mas largo primero.
        normalized_spans.sort(key=lambda s: (self._TAG_PRIORITY.get(s[2], 9), s[0], -(s[1] - s[0])))
        accepted = []
        for s, e, tag, key, conf in normalized_spans:
            if any(s < ae and e > as_ for as_, ae, _, _, _ in accepted):
                continue  # solapa con uno ya aceptado de mayor prioridad
            accepted.append((s, e, tag, key, conf))

        # Reemplazar de derecha a izquierda para conservar offsets.
        accepted.sort(key=lambda s: s[0], reverse=True)
        result = text
        for s, e, tag, key, conf in accepted:
            original = text[s:e]
            result = result[:s] + tag + result[e:]
            self.counter[key] = self.counter.get(key, 0) + 1
            # Guardar mappings con metadata
            if isinstance(self.mappings.get(original), dict):
                self.mappings[original]['occurrences'] = self.mappings[original].get('occurrences', 1) + 1
            else:
                self.mappings[original] = {'tag': tag, 'type': key, 'confidence': conf}
        return result

    # ------------------------------------------------------------------ #
    # API publica
    # ------------------------------------------------------------------ #
    def _anonymize_with_doc(self, text: str, doc) -> str:
        if not isinstance(text, str) or text.strip() == '':
            return text
        spans = self._structured_spans(text)
        if doc is not None:
            spans += self._ner_spans(doc)
        else:
            spans += self._fallback_name_spans(text)
        # El diccionario de respaldo se usa en standard/aggressive.
        if self.confidence_mode in ('standard', 'aggressive'):
            spans += self._dictionary_spans(text)
        return self._merge_and_replace(text, spans)

    def anonymize_narrative(self, text: str) -> str:
        if not isinstance(text, str) or text.strip() == '':
            return text
        doc = self._nlp(text) if self._nlp is not None else None
        return self._anonymize_with_doc(text, doc)

    def anonymize_dataframe(self, df: pd.DataFrame, columns_to_anonymize: List[str] = None) -> pd.DataFrame:
        """MEJORA: Usa batch_size adaptativo y caché de resultados."""
        df_copy = df.copy()
        if columns_to_anonymize is None:
            columns_to_anonymize = df.columns.tolist()

        narrative_keywords = [
            'relato', 'descripcion', 'descripción', 'narrative', 'texto', 'historia',
            'denuncia', 'detalle', 'comentario', 'observacion', 'observación', 'hecho',
            'caso', 'reporte', 'narracion', 'narración', 'detalles', 'documento', 'contenido'
        ]

        for col in columns_to_anonymize:
            if col not in df_copy.columns:
                continue
            col_lower = self._normalize_text(col)
            if not any(kw in col_lower for kw in narrative_keywords):
                continue

            logger.info(f"Procesando: {col} ({len(df_copy)} filas)")
            texts = df_copy[col].astype(str).tolist()

            # MEJORA: NER en lote con batch_size adaptativo
            if self._nlp is not None:
                docs = list(self._nlp.pipe(texts, batch_size=self.batch_size))
            else:
                docs = [None] * len(texts)

            values = []
            total = len(texts)
            for index, (value, doc) in enumerate(zip(texts, docs), start=1):
                if value.strip() and value != 'nan':
                    # MEJORA: Usar caché para textos duplicados
                    if value in self._result_cache:
                        values.append(self._result_cache[value])
                    else:
                        result = self._anonymize_with_doc(value, doc)
                        values.append(result)
                        self._result_cache[value] = result
                else:
                    values.append(value)

                if index % 25 == 0 or index == total:
                    logger.info(f"{col}: {index}/{total} filas")

            df_copy[f"{col}_Anonimizado"] = values
            logger.info(f"Completado: {col}")

            # Limpiar caché si es muy grande
            if len(self._result_cache) > 10000:
                self._result_cache.clear()
                logger.info("Caché limpiado (> 10000 entradas)")

        return df_copy

    def get_summary(self) -> Dict:
        """Resumen de anonimizacion incluyendo actores unicos y confianza."""
        unique_persons = len(self.actors_by_type.get('person', set()))
        unique_locations = len(self.actors_by_type.get('location', set()))
        unique_institutions = len(self.actors_by_type.get('institution', set()))
        total_unique_actors = unique_persons + unique_locations + unique_institutions

        return {
            'personas': self.counter.get('person', 0),
            'ubicaciones': self.counter.get('location', 0),
            'instituciones': self.counter.get('institution', 0),
            'ruts': self.counter.get('rut', 0),
            'ids': self.counter.get('id_number', 0),
            'emails': self.counter.get('email', 0),
            'telefonos': self.counter.get('phone', 0),
            'direcciones': self.counter.get('address', 0),
            'total': sum(self.counter.values()),
            # NUEVO: Actores unicos (importante para narrativas multi-actor)
            'personas_unicas': unique_persons,
            'ubicaciones_unicas': unique_locations,
            'instituciones_unicas': unique_institutions,
            'actores_unicos_total': total_unique_actors,
            # NUEVO: Tipo de modelo NER usado
            'modelo_ner': _NLP_MODEL_NAME or 'regex-fallback',
            'modo_confianza': self.confidence_mode,
        }


def anonymize_file(input_file: str, output_file: str = None, columns: List[str] = None, debug=False, dict_file=None):
    """MEJORA: Función principal CLI con logging y diccionarios configurables."""
    input_path = Path(input_file)
    if not input_path.exists():
        logger.error(f"Archivo no encontrado: {input_file}")
        return

    logger.info(f"Leyendo: {input_file}")
    try:
        if input_path.suffix.lower() == '.csv':
            df = pd.read_csv(input_file, encoding='utf-8')
        elif input_path.suffix.lower() in ['.xlsx', '.xls']:
            df = pd.read_excel(input_file)
        else:
            logger.error(f"Formato no soportado: {input_path.suffix}")
            return
    except Exception as e:
        logger.error(f"No se pudo leer: {e}")
        return

    logger.info(f"Columnas: {list(df.columns)} | Filas: {len(df)}")

    # MEJORA: Pasar parámetros de debug y dict_file al anonymizer
    anonymizer = DataAnonymizer(debug=debug, dict_file=dict_file)
    cols = columns if columns else df.columns.tolist()
    df_anonymized = anonymizer.anonymize_dataframe(df, cols)

    if output_file is None:
        output_file = input_path.parent / f"{input_path.stem}_anonymized{input_path.suffix}"
    output_path = Path(output_file)

    try:
        if output_path.suffix.lower() == '.csv':
            df_anonymized.to_csv(output_file, index=False, encoding='utf-8')
        else:
            df_anonymized.to_excel(output_file, index=False)
        logger.info(f"Guardado: {output_file}")
    except Exception as e:
        logger.error(f"No se pudo guardar: {e}")
        return

    s = anonymizer.get_summary()
    logger.info(f"\n[SUMMARY] Modelo: {s['modelo_ner']} | Confianza: {s['modo_confianza']} | Batch: {anonymizer.batch_size}")
    logger.info(f"  Ocurrencias - Nombres: {s['personas']} | Ubicaciones: {s['ubicaciones']} | "
          f"Instituciones: {s['instituciones']}")
    logger.info(f"  Actores Unicos - Personas: {s['personas_unicas']} | Ubicaciones: {s['ubicaciones_unicas']} | "
          f"Instituciones: {s['instituciones_unicas']} | TOTAL: {s['actores_unicos_total']}")
    logger.info(f"  Datos estructurados - RUTs: {s['ruts']} | IDs: {s['ids']} | Correos: {s['emails']} | "
          f"Telefonos: {s['telefonos']} | Direcciones: {s['direcciones']}")
    logger.info(f"  TOTAL ELEMENTOS ANONIMIZADOS: {s['total']}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        logger.error("Uso: python anonymizer.py <archivo> [--debug] [--dict-file <path>]")
        sys.exit(1)

    input_file = sys.argv[1]
    debug = '--debug' in sys.argv
    dict_file = None

    # Buscar --dict-file
    if '--dict-file' in sys.argv:
        idx = sys.argv.index('--dict-file')
        if idx + 1 < len(sys.argv):
            dict_file = sys.argv[idx + 1]

    anonymize_file(input_file, debug=debug, dict_file=dict_file)
