import pandas as pd
import re
from pathlib import Path
from typing import Dict, List

# ---------------------------------------------------------------------------
# Carga perezosa del modelo spaCy (singleton a nivel de modulo).
# El backend crea un DataAnonymizer() por cada request; cargar el modelo en
# cada instancia seria lentisimo. Se carga UNA sola vez y se reutiliza.
# ---------------------------------------------------------------------------
_NLP = None
_NLP_LOADED = False
_NLP_MODEL_NAME = None


def _load_nlp():
    """Carga el mejor modelo NER en espanol disponible (lg > md > sm)."""
    global _NLP, _NLP_LOADED, _NLP_MODEL_NAME
    if _NLP_LOADED:
        return _NLP
    _NLP_LOADED = True
    try:
        import spacy
    except Exception:
        _NLP = None
        return _NLP
    disable = ['tagger', 'parser', 'lemmatizer', 'attribute_ruler', 'morphologizer']
    for model_name in ('es_core_news_lg', 'es_core_news_md', 'es_core_news_sm'):
        try:
            _NLP = spacy.load(model_name, disable=disable)
            _NLP_MODEL_NAME = model_name
            return _NLP
        except Exception:
            continue
    _NLP = None
    return _NLP


class DataAnonymizer:
    """
    Anonimizador HIBRIDO v5 (NER + Regex + Multi-Actor).

    - NER (spaCy es_core_news_lg) para PERSONAS / UBICACIONES / INSTITUCIONES:
      detecta entidades aunque NO esten en ningun diccionario y etiqueta cada
      actor por separado -> resuelve relatos con multiples actores.
    - Regex para datos ESTRUCTURADOS (RUT, email, telefono, ID, direccion).
    - Una sola pasada por offsets con resolucion de solapamientos por prioridad
      (elimina la fragilidad del multi-pass y del orden de reemplazos).
    - Fallback 100% regex si spaCy no esta disponible (nunca crashea).
    - NUEVO: Tracking de actores unicos y analisis de confianza NER.

    API publica (compatible con el backend Flask):
        __init__(confidence_mode='standard')
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

    def __init__(self, confidence_mode='standard'):
        self.counter = {}
        self.mappings = {}
        self.actors_by_type = {'person': set(), 'location': set(), 'institution': set()}
        self.confidence_mode = confidence_mode if confidence_mode in self._CONFIDENCE else 'standard'
        self.compiled_patterns = self._compile_patterns()
        self._init_data_lists()
        self._nlp = _load_nlp()

    # ------------------------------------------------------------------ #
    def _init_data_lists(self):
        """Diccionarios de respaldo (complementan al NER, no lo reemplazan)."""
        self.locations = {
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
        self.institutions = {
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
        return value.lower().strip()

    def get_confidence_mode(self) -> str:
        return self.confidence_mode

    # ------------------------------------------------------------------ #
    # Recoleccion de spans (start, end, tag, counter_key)
    # ------------------------------------------------------------------ #
    def _structured_spans(self, text: str) -> List:
        spans = []
        for p in self.compiled_patterns['rut']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<rut>', 'rut'))
        for p in self.compiled_patterns['id_numbers']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<id>', 'id_number'))
        for p in self.compiled_patterns['email']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<correo>', 'email'))
        for p in self.compiled_patterns['phone']:
            for m in p.finditer(text):
                chunk = m.group(0)
                # Evitar confundir anios (1900-2099) con telefonos.
                if re.fullmatch(r'\s*(?:19|20)\d{2}\s*', chunk):
                    continue
                spans.append((m.start(), m.end(), '<telefono>', 'phone'))
        for p in self.compiled_patterns['address']:
            for m in p.finditer(text):
                spans.append((m.start(), m.end(), '<direccion>', 'address'))
        return spans

    def _ner_spans(self, doc) -> List:
        """Extrae spans de NER con tracking de actores y confianza."""
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

            # Calcular confianza: largos de entidad muy cortos < 0.7
            entity_length = len(label.split())
            base_confidence = min(0.95, 0.70 + (entity_length * 0.08))

            # En modo conservative, solo aceptar muy altas confianzas
            if self.confidence_mode == 'conservative' and base_confidence < 0.92:
                continue

            # Registrar actor unico
            if key in self.actors_by_type:
                self.actors_by_type[key].add(label.lower())

            spans.append((ent.start_char, ent.end_char, tag, key, base_confidence))

        return spans

    def _dictionary_spans(self, text: str) -> List:
        """Respaldo: ubicaciones e instituciones conocidas (texto sin acento-sensible)."""
        spans = []
        for institution in sorted(self.institutions, key=len, reverse=True):
            for m in re.finditer(r'\b' + re.escape(institution) + r'\b', text, re.IGNORECASE):
                spans.append((m.start(), m.end(), '<institucion>', 'institution'))
        for location in sorted(self.locations, key=len, reverse=True):
            for m in re.finditer(r'\b' + re.escape(location) + r'\b', text, re.IGNORECASE):
                spans.append((m.start(), m.end(), '<ubicacion>', 'location'))
        return spans

    def _fallback_name_spans(self, text: str) -> List:
        """Deteccion de nombres por regex (solo si NO hay modelo NER)."""
        spans = []
        # Nombres capitalizados de 2+ palabras: "Juan Perez", "Maria Jose Soto".
        pat = re.compile(
            r'\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,4})\b'
        )
        stop = {'El', 'La', 'Los', 'Las', 'Un', 'Una', 'Se', 'Su', 'En', 'De', 'Del',
                'Por', 'Con', 'Para', 'Que', 'Como', 'Fecha', 'Region', 'Comuna'}
        for m in pat.finditer(text):
            first = m.group(1).split()[0]
            if first in stop:
                continue
            spans.append((m.start(1), m.end(1), '<nombre>', 'person'))
        # MAYUSCULAS sostenidas: "JUAN PEREZ".
        for m in re.finditer(r'\b([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,}){1,4})\b', text):
            spans.append((m.start(1), m.end(1), '<nombre>', 'person'))
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

            print(f"[ANON] Procesando: {col} ({len(df_copy)} filas)", flush=True)
            texts = df_copy[col].astype(str).tolist()

            # NER en lote (mucho mas rapido que doc por doc).
            if self._nlp is not None:
                docs = list(self._nlp.pipe(texts, batch_size=64))
            else:
                docs = [None] * len(texts)

            values = []
            total = len(texts)
            for index, (value, doc) in enumerate(zip(texts, docs), start=1):
                if value.strip() and value != 'nan':
                    values.append(self._anonymize_with_doc(value, doc))
                else:
                    values.append(value)
                if index % 25 == 0 or index == total:
                    print(f"[ANON] {col}: {index}/{total} filas", flush=True)

            df_copy[f"{col}_Anonimizado"] = values
            print(f"[OK] Completado: {col}", flush=True)

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


def anonymize_file(input_file: str, output_file: str = None, columns: List[str] = None):
    """Funcion principal CLI."""
    input_path = Path(input_file)
    if not input_path.exists():
        print(f"[ERROR] Archivo no encontrado: {input_file}")
        return

    print(f"[*] Leyendo: {input_file}")
    try:
        if input_path.suffix.lower() == '.csv':
            df = pd.read_csv(input_file, encoding='utf-8')
        elif input_path.suffix.lower() in ['.xlsx', '.xls']:
            df = pd.read_excel(input_file)
        else:
            print(f"[ERROR] Formato no soportado: {input_path.suffix}")
            return
    except Exception as e:
        print(f"[ERROR] No se pudo leer: {e}")
        return

    print(f"[INFO] Columnas: {list(df.columns)}")
    print(f"[INFO] Filas: {len(df)}")

    anonymizer = DataAnonymizer()
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
        print(f"[OK] Guardado: {output_file}")
    except Exception as e:
        print(f"[ERROR] No se pudo guardar: {e}")
        return

    s = anonymizer.get_summary()
    print(f"\n[SUMMARY] Modelo: {s['modelo_ner']} | Confianza: {s['modo_confianza']}")
    print(f"  Ocurrencias - Nombres: {s['personas']} | Ubicaciones: {s['ubicaciones']} | "
          f"Instituciones: {s['instituciones']}")
    print(f"  Actores Unicos - Personas: {s['personas_unicas']} | Ubicaciones: {s['ubicaciones_unicas']} | "
          f"Instituciones: {s['instituciones_unicas']} | TOTAL: {s['actores_unicos_total']}")
    print(f"  Datos estructurados - RUTs: {s['ruts']} | IDs: {s['ids']} | Correos: {s['emails']} | "
          f"Telefonos: {s['telefonos']} | Direcciones: {s['direcciones']}")
    print(f"  TOTAL ELEMENTOS ANONIMIZADOS: {s['total']}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python anonymizer.py <archivo>")
        sys.exit(1)
    anonymize_file(sys.argv[1])
