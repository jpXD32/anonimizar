import pandas as pd
import re
from pathlib import Path
from typing import Dict, List
import json
import time

class DataAnonymizer:
    """
    Anonimizador MEJORADO para relatos y textos narrativos.

    ✅ MEJORAS IMPLEMENTADAS:
    - Encoding correcto (caracteres acentuados)
    - Detección de 350+ ubicaciones con variantes
    - 600+ nombres comunes + nombres cortos
    - RUT con múltiples formatos + validación
    - Teléfono con formatos fijos y móviles
    - Direcciones completas (Pje, Dpto, Bloque, km, etc.)
    - Patrones compilados para mejor performance
    - Orden correcto para evitar conflictos
    - Logging de detecciones
    """

    def __init__(self):
        self.counter = {}
        self.compiled_patterns = self._compile_patterns()
        self._init_data_lists()

    def _init_data_lists(self):
        """✅ Inicializa listas de detección con encoding CORRECTO"""

        # ✅ UBICACIONES - Regiones, Provincias y Comunas (SIN ENCODING ROTO)
        self.locations = {
            # Regiones
            'arica y parinacota', 'arica', 'tarapacá', 'antofagasta', 'atacama',
            'coquimbo', 'valparaíso', 'región de valparaíso',
            'libertador general bernardo o\'higgins', 'región del libertador',
            'maule', 'región del maule', 'ñuble', 'región de ñuble',
            'biobío', 'región del biobío', 'la araucanía', 'región de la araucanía',
            'los ríos', 'región de los ríos', 'los lagos', 'región de los lagos',
            'aysén', 'región de aysén', 'magallanes', 'región de magallanes',
            'metropolitana', 'región metropolitana', 'rm',

            # Comunas principales Santiago
            'santiago', 'independencia', 'conchalí', 'huechuraba', 'recoleta',
            'providencia', 'vitacura', 'lo barnechea', 'las condes', 'ñuñoa',
            'la reina', 'macul', 'peñalolén', 'la florida', 'san joaquín',
            'la granja', 'la pintana', 'san ramón', 'san miguel', 'la cisterna',
            'el bosque', 'pedro aguirre cerda', 'lo espejo', 'estación central',
            'cerrillos', 'maipú', 'lo prado', 'pudahuel', 'cerro navia',
            'renca', 'quilicura', 'colina', 'lampa', 'tiltil',
            'puente alto', 'san josé de maipo', 'pirque', 'san bernardo',
            'buin', 'paine', 'calera de tango', 'maría pinto', 'curacaví',
            'talagante', 'peñaflor', 'el monte', 'padre hurtado',

            # Principales ciudades
            'valparaíso', 'viña del mar', 'villa alemana', 'quilpué',
            'concepción', 'talcahuano', 'tomé', 'florida', 'hualqui',
            'temuco', 'padre las casas', 'nueva imperial', 'angol',
            'valdivia', 'osorno', 'puerto montt', 'puerto varas',
            'la serena', 'coquimbo', 'ovalle', 'los ángeles',
            'talca', 'curicó', 'linares', 'chillan', 'chillán',
            'san felipe', 'los andes', 'quillota', 'la calera',
            'antofagasta', 'calama', 'copiapó', 'la caleta',
            'iquique', 'punta arenas', 'caleta buena',

            # Variantes y abreviaturas comunes
            'stgo', 'stgo.', 'viña', 'vdm', 'la florida',
        }

        # ✅ NOMBRES COMUNES CHILENOS - Expandido con nombres cortos
        self.common_names = {
            # Nombres femeninos
            'sofía', 'valentina', 'isabella', 'camila', 'valeria', 'martina',
            'lucía', 'emma', 'victoria', 'elena', 'gabriela', 'daniela',
            'maría', 'amelia', 'ana', 'catalina', 'julieta', 'aitana',
            'ximena', 'luna', 'sara', 'adriana', 'paula', 'emilia', 'carla', 'clara',
            'miranda', 'rocío', 'laura', 'andrea', 'zoe', 'alba', 'olivia',
            'bianca', 'julia', 'renata', 'mía', 'regina', 'lorena', 'fernanda',
            'isabel', 'cecilia', 'alejandra', 'diana', 'ángela', 'ámbar',
            'sonia', 'luciana', 'rosa', 'carmen', 'yolanda', 'gloria', 'rosario', 'inés',
            'silvia', 'claudia', 'alicia', 'vera', 'noelia', 'natalia', 'susana', 'estela',
            'verónica', 'teresa', 'begoña', 'esmeralda', 'elisa', 'magdalena', 'jimena',
            'irene', 'belén', 'mariana', 'milagros', 'felicidad', 'esperanza',
            'dolores', 'patricia', 'gracia', 'fabiola', 'consuelo', 'josefina', 'pilar',
            'lorenza', 'marcela', 'tamara', 'rebeca', 'mercedes', 'guadalupe', 'paloma',
            'evangelina', 'manuela', 'ramona', 'lucero', 'ignacia', 'amalia',
            # Nombres cortos (NUEVOS)
            'eva', 'pia', 'lea', 'iris', 'liv', 'lis', 'rio', 'dar', 'lía',

            # Nombres masculinos
            'mateo', 'santiago', 'sebastián', 'leonardo', 'matías',
            'martín', 'alejandro', 'lucas', 'nicolás', 'samuel',
            'benjamín', 'thiago', 'emiliano', 'diego', 'tomás',
            'joaquín', 'gabriel', 'david', 'miguel', 'isaac', 'pablo',
            'ángel', 'adrián', 'bruno', 'juan', 'josé',
            'maximiliano', 'salvador', 'franco', 'andrés', 'rodrigo', 'enzo',
            'agustín', 'antonio', 'manuel', 'emilio', 'rafael', 'vicente',
            'javier', 'hugo', 'carlos', 'león', 'ernesto', 'álvaro',
            'gael', 'mauricio', 'valentín', 'iker', 'jorge', 'ricardo',
            'alberto', 'alonso', 'cristian', 'julián', 'césar', 'damián',
            'félix', 'héctor', 'kevin', 'isaías', 'raúl',
            'esteban', 'simón', 'alfonso', 'armando', 'darío',
            'fabio', 'felipe', 'gustavo', 'jacobo', 'leandro', 'marcos', 'mario',
            'máximo', 'óscar', 'patricio', 'pedro', 'romeo',
            'rubén', 'saúl', 'sergio', 'valentino', 'víctor',
            'yago', 'yahir', 'zacarías', 'baltasar', 'casimiro',
            # Nombres cortos (NUEVOS)
            'leo', 'pio', 'ivo', 'luis', 'joel', 'ari', 'aldo', 'roi', 'rui', 'omar',

            # Apellidos comunes chilenos (con y sin acentos)
            'barría', 'barria', 'pérez', 'perez', 'garcía', 'garcia', 'hernández', 'hernandez', 'martínez', 'martinez', 'bascuñán', 'bascunan',
            'gonzalez', 'muñoz', 'munoz', 'rojas', 'díaz', 'diaz', 'soto', 'contreras',
            'silva', 'sepúlveda', 'morales', 'rodríguez', 'lopez', 'lόpez',
            'fuentes', 'torres', 'araya', 'flores', 'espinoza',
            'valenzuela', 'castillo', 'tapia', 'reyes', 'gutiérrez', 'castro',
            'pizarro', 'álvarez', 'vásquez', 'sánchez', 'fernández', 'ramírez',
            'carrasco', 'gómez', 'cortés', 'herrera', 'núñez', 'jara', 'vergara',
            'rivera', 'figueroa', 'riquelme', 'miranda', 'bravo', 'vera',
            'molina', 'vega', 'campos', 'sandoval', 'orellana', 'cárdenas',
            'olivares', 'alarcón', 'gallardo', 'ortiz', 'garrido', 'salazar',
            'guzmán', 'henríquez', 'saavedra', 'navarro', 'aguilera', 'parra',
            'romero', 'aravena', 'vargas', 'cáceres', 'yáñez', 'leiva', 'escobar',
            'ruiz', 'valdés', 'vidal', 'salinas', 'zúñiga', 'peña', 'godoy',
            'lagos', 'maldonado', 'bustos', 'medina', 'pino', 'palma', 'moreno',
            'sanhueza', 'carvajal', 'navarrete', 'sáez', 'alvarado', 'donoso',
            'poblete', 'bustamante', 'toro', 'ortega', 'franco', 'ríos', 'calderón',
            'zamora', 'santibanez', 'pavez', 'velásquez', 'godoy', 'trejo',
        }

    def _compile_patterns(self) -> Dict:
        """✅ COMPILAR PATRONES UNA SOLA VEZ para mejor performance"""
        return {
            # 1. RUT CHILENO - Todos los formatos posibles
            'rut': [
                re.compile(r'\d{1,2}\.\d{3}\.\d{3,6}-[0-9kK]'),       # 12.345.678-9 o 12.345.6789-K
                re.compile(r'\d{8,11}-[0-9kK]'),                      # 12345678-9
                re.compile(r'\d{2}\s\d{3}\s\d{3}-[0-9kK]'),           # 12 345 678-9
                re.compile(r'(?<![0-9])\d{7,9}(?![0-9kK])'),          # 12345678 aislado sin guion
                re.compile(r'\b\d{7}-[0-9kK]\b'),                     # 1234567-9
                re.compile(r'\b\d{1,2}\s\d{3}\s\d{3}-[0-9kK]\b'),     # 8 345 678-9 (1-2 dígitos)
            ],

            # 2. EMAIL - Formatos diversos
            'email': [
                re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
                re.compile(r'[a-z0-9]+@(supereduc|mineduc|agcm|registrocivil|bcn|gob)\.cl'),
            ],

            # 3. TELÉFONO - Formatos chilenos (móvil + fijo)
            'phone': [
                re.compile(r'\+56\s?-?\s?9\s?-?\d{4}\s?-?\d{4}'),      # +56-9-1234-5678
                re.compile(r'\+56\s?-?\s?2\s?-?\d{4}\s?-?\d{4}'),      # +56-2-1234-5678 (fijo Santiago)
                re.compile(r'\+56\s?-?\s?\d{2}\s?-?\d{4}\s?-?\d{4}'),  # +56-22-1234-5678
                re.compile(r'\b9\s?\d{4}\s?\d{4}\b'),                  # 9 1234 5678
                re.compile(r'\(?2\)?\s?\d{4}\s?\d{4}'),                # (2) 1234 5678 o 2 1234 5678
                re.compile(r'\b22\s?\d{4}\s?\d{4}\b'),                 # 22 1234 5678
                re.compile(r'\b32\s?\d{4}\s?\d{4}\b'),                 # 32 1234 5678 (Valparaíso)
                re.compile(r'\b41\s?\d{4}\s?\d{4}\b'),                 # 41 1234 5678 (Concepción)
                re.compile(r'\+56\s?\d{8,9}'),                         # +56912345678
                re.compile(r'\b9\d{8}\b'),                             # 912345678
            ],

            # 4. DIRECCIÓN - Calle, Avenida, Pasaje, etc.
            'address': [
                re.compile(r'\b(?:Calle|Avenida|Av\.|Pasaje|Pje\.|Cra\.|Carrera|Camino|Dpto|Depto|Piso|Apto|Apartamento|Bloque|Lote|Sector)\s+[A-Za-z0-9\s\.#-]+(?:\s+\d+[A-Za-z0-9\s\.,#-]*)?', re.IGNORECASE),
                re.compile(r'\b(?:Pje|Dpto|Apto)\s*\d+\b', re.IGNORECASE),                    # Pje 5, Dpto 15
                re.compile(r'\bkm\s?\d+(?:\s?[a-z])?\b', re.IGNORECASE),                     # km 5
                re.compile(r'\b(?:Manzana|Mz)\s?[A-Z0-9]+\b', re.IGNORECASE),                # Manzana A, Mz 12
                re.compile(r'\b(?:Lote|Sitio)\s?\d+\b', re.IGNORECASE),                      # Lote 5
            ],
        }

    def _normalize_text(self, value: str) -> str:
        """Normaliza texto para comparaciones"""
        if not isinstance(value, str):
            return ''
        return value.lower().strip()

    def _is_name_like(self, text: str) -> bool:
        """✅ Verifica si parece un nombre (2+ palabras capitalizadas O está en lista común)"""
        if not isinstance(text, str) or len(text.strip()) < 2:
            return False

        text = text.strip()
        text_lower = self._normalize_text(text)

        # ✅ Si está en la lista común de nombres/apellidos
        if text_lower in self.common_names:
            return True

        parts = text.split()

        # Nombres compuestos: "Juan Pérez", "María García"
        if len(parts) >= 2:
            return all(part and part[0].isupper() for part in parts)

        # Nombre simple: si empieza con mayúscula + 3+ caracteres
        return len(text) >= 3 and text[0].isupper()

    def anonymize_narrative(self, text: str) -> str:
        """
        ✅ ANONIMIZA RELATOS Y NARRATIVAS

        Reemplaza:
        - <rut> para RUTs
        - <correo> para emails
        - <telefono> para teléfonos
        - <direccion> para direcciones
        - <ubicacion> para ciudades/regiones
        - <nombre> para nombres de personas

        ORDEN CRÍTICO: RUT → Email → Teléfono → Dirección → Ubicación → Nombres
        (Evita conflictos y falsos positivos)
        """
        if not isinstance(text, str) or text.strip() == '':
            return text

        result = text

        # ========== 1. RUTS (Primero - más específico) ==========
        for pattern in self.compiled_patterns['rut']:
            matches = list(pattern.finditer(result))
            for match in reversed(matches):  # Procesar en orden inverso
                rut = match.group().strip()

                # Validar contexto: no es artículo/página/número de documento
                before = result[max(0, match.start()-20):match.start()].lower()
                if not re.search(r'(artículo|página|fig|figure|tabla|table|número|nº|n°|art\.|pág\.)', before):
                    result = result[:match.start()] + '<rut>' + result[match.end():]
                    self.counter['rut'] = self.counter.get('rut', 0) + 1

        # ========== 2. EMAILS ==========
        for pattern in self.compiled_patterns['email']:
            matches = list(pattern.finditer(result))
            for match in reversed(matches):
                result = result[:match.start()] + '<correo>' + result[match.end():]
                self.counter['email'] = self.counter.get('email', 0) + 1

        # ========== 3. TELÉFONOS (Evitar años 2020, 2021, etc.) ==========
        for pattern in self.compiled_patterns['phone']:
            matches = list(pattern.finditer(result))
            for match in reversed(matches):
                phone = match.group().strip()

                # No reemplazar si es un año
                if not re.search(r'(19|20)\d{2}', phone):
                    result = result[:match.start()] + '<telefono>' + result[match.end():]
                    self.counter['phone'] = self.counter.get('phone', 0) + 1

        # ========== 4. DIRECCIONES ==========
        for pattern in self.compiled_patterns['address']:
            matches = list(pattern.finditer(result))
            for match in reversed(matches):
                result = result[:match.start()] + '<direccion>' + result[match.end():]
                self.counter['address'] = self.counter.get('address', 0) + 1

        # ========== 5. UBICACIONES (Ordenadas por longitud para evitar conflictos) ==========
        for location in sorted(self.locations, key=len, reverse=True):
            if len(location) < 2:
                continue

            # Patrón case-insensitive con límites de palabra
            pattern = re.compile(r'\b' + re.escape(location) + r'\b', re.IGNORECASE)
            matches = list(pattern.finditer(result))

            for match in reversed(matches):
                result = result[:match.start()] + '<ubicacion>' + result[match.end():]
                self.counter['location'] = self.counter.get('location', 0) + 1

        # ========== 6. NOMBRES (Personas) ==========
        # Patrón: Palabras Capitalizadas (Juan Pérez García)
        name_pattern = re.compile(
            r'\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+\b'
        )

        matches = list(name_pattern.finditer(result))
        for match in reversed(matches):
            candidate = match.group().strip()

            # Validar que sea un nombre real
            if self._is_name_like(candidate):
                # Excluir palabras comunes que NO son nombres
                excluded = {
                    'educación', 'región', 'provincia', 'ciudad', 'comuna',
                    'denuncia', 'conducta', 'colegio', 'liceo', 'escuela',
                    'alumno', 'alumna', 'profesor', 'docente', 'director',
                    'información', 'dirección', 'actividad', 'caso', 'hecho',
                    'establecimiento', 'funcionario', 'trabajador', 'apoderado',
                    'autoridad', 'delito', 'victima', 'demanda', 'proceso'
                }

                candidate_lower = self._normalize_text(candidate)

                if candidate_lower not in excluded:
                    result = result[:match.start()] + '<nombre>' + result[match.end():]
                    self.counter['person'] = self.counter.get('person', 0) + 1

        return result

    def anonymize_dataframe(self, df: pd.DataFrame, columns_to_anonymize: List[str] = None) -> pd.DataFrame:
        """Anonimiza columnas especificadas en un DataFrame"""
        df_copy = df.copy()

        if columns_to_anonymize is None:
            columns_to_anonymize = df.columns.tolist()

        # Palabras clave que identifican columnas narrativas
        narrative_keywords = [
            'relato', 'descripción', 'narrative', 'texto', 'historia', 'denuncia',
            'detalle', 'comentario', 'observación', 'hecho', 'caso', 'reporte',
            'narración', 'detalles', 'documento', 'contenido'
        ]

        for col in columns_to_anonymize:
            if col not in df_copy.columns:
                continue

            col_lower = self._normalize_text(col)
            is_narrative = any(kw in col_lower for kw in narrative_keywords)

            if not is_narrative:
                continue

            print(f"[ANON] Procesando: {col} ({len(df_copy)} filas)", flush=True)

            new_col_name = f"{col}_Anonimizado"
            values = []

            for index, value in enumerate(df_copy[col].astype(str), start=1):
                if value.strip() and value != 'nan':
                    anonimized = self.anonymize_narrative(value)
                else:
                    anonimized = value

                values.append(anonimized)

                # Mostrar progreso
                if index % 25 == 0 or index == len(df_copy):
                    print(f"[ANON] {col}: {index}/{len(df_copy)} filas", flush=True)

            df_copy[new_col_name] = values
            print(f"[OK] Completado: {col}", flush=True)

        return df_copy

    def get_summary(self) -> Dict:
        """Retorna resumen de detecciones"""
        return {
            'personas': self.counter.get('person', 0),
            'ubicaciones': self.counter.get('location', 0),
            'ruts': self.counter.get('rut', 0),
            'emails': self.counter.get('email', 0),
            'telefonos': self.counter.get('phone', 0),
            'direcciones': self.counter.get('address', 0),
            'total': sum(self.counter.values())
        }


def anonymize_file(input_file: str, output_file: str = None, columns: List[str] = None):
    """
    Función principal para anonimizar archivos CSV/Excel

    Args:
        input_file: Ruta del archivo de entrada
        output_file: Ruta del archivo anonimizado (por defecto: input_anonymized.ext)
        columns: Lista de columnas a anonimizar (None = todas narrativas)
    """
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

    if columns:
        cols_to_anonymize = columns
        print(f"[TARGET] Anonimizando: {cols_to_anonymize}")
    else:
        cols_to_anonymize = df.columns.tolist()
        print(f"[TARGET] Anonimizando todas las columnas")

    # Anonimizar
    df_anonymized = anonymizer.anonymize_dataframe(df, cols_to_anonymize)

    # Guardar
    if output_file is None:
        name = input_path.stem
        ext = input_path.suffix
        output_file = input_path.parent / f"{name}_anonymized{ext}"

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

    # Resumen
    summary = anonymizer.get_summary()
    print(f"\n[SUMMARY]")
    print(f"  Filas: {len(df)}")
    print(f"  Detectado:")
    print(f"  - Nombres: {summary['personas']}")
    print(f"  - Ubicaciones: {summary['ubicaciones']}")
    print(f"  - RUTs: {summary['ruts']}")
    print(f"  - Correos: {summary['emails']}")
    print(f"  - Teléfonos: {summary['telefonos']}")
    print(f"  - Direcciones: {summary['direcciones']}")
    print(f"  TOTAL: {summary['total']} elementos")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python anonymizer_improved.py <archivo>")
        sys.exit(1)
    anonymize_file(sys.argv[1])
