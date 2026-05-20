import pandas as pd
import re
from pathlib import Path
from typing import Dict, Tuple, List
from datetime import datetime
import json

# NLP para detección inteligente
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False

class DataAnonymizer:
    def __init__(self, mapping_file: str = None, use_nlp: bool = True):
        self.counter = {}
        self.mappings = {}
        self.mapping_file = mapping_file
        self.use_nlp = use_nlp and SPACY_AVAILABLE

        # Cargar modelo de spaCy si está disponible
        self.nlp = None
        if self.use_nlp:
            try:
                self.nlp = spacy.load("es_core_news_sm")
            except OSError:
                print("[INFO] Descargando modelo de spaCy para español...")
                import subprocess
                subprocess.check_call(["python", "-m", "spacy", "download", "es_core_news_sm"])
                self.nlp = spacy.load("es_core_news_sm")

        if mapping_file and Path(mapping_file).exists():
            self.load_mappings(mapping_file)

    def detect_rut(self, value: str) -> bool:
        """Detecta números RUT chilenos (formato: XX.XXX.XXX-X o XXXXXXXX-X)"""
        if not isinstance(value, str):
            return False
        rut_pattern = r'\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b|\b\d{8}-[\dkK]\b'
        return bool(re.search(rut_pattern, value))

    def detect_email(self, value: str) -> bool:
        """Detecta direcciones de email"""
        if not isinstance(value, str):
            return False
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return bool(re.search(email_pattern, value))

    def detect_phone(self, value: str) -> bool:
        """Detecta números de teléfono (formato chileno: +56, 9, etc)"""
        if not isinstance(value, str):
            return False
        phone_pattern = r'\b(?:\+56\s?)?(?:9\s?)?\d{8}\b|\b\(\d{2}\)\s?\d{4}\s?\d{4}\b'
        return bool(re.search(phone_pattern, value))

    def is_name_like(self, value: str) -> bool:
        """Verifica si el valor parece un nombre/apellido (mayúscula inicial, palabras)"""
        if not isinstance(value, str) or len(value.strip()) < 2:
            return False

        value = value.strip()

        # Si es una palabra sola, probablemente NO es un nombre completo
        if ' ' not in value:
            return False

        # Si tiene 2+ palabras y empiezan con mayúscula, probablemente es nombre
        parts = value.split()
        if len(parts) >= 2:
            return all(part and part[0].isupper() for part in parts if part)

        return False

    def is_location_like(self, value: str) -> bool:
        """Verifica si el valor parece una ubicación (solo si tiene palabras clave)"""
        if not isinstance(value, str) or len(value.strip()) < 3:
            return False
        value_lower = value.lower()
        # Solo considerar ubicación si tiene palabras clave explícitas
        location_keywords = ['calle', 'avenida', 'pasaje', 'carrera', 'cra.', 'dpto', 'depto', 'piso', 'apto']
        location_cities = ['santiago', 'viña del mar', 'valparaíso', 'concepción', 'temuco', 'los angeles', 'puerto montt']

        has_keyword = any(kw in value_lower for kw in location_keywords)
        has_city = any(city in value_lower for city in location_cities)

        return has_keyword or has_city

    def is_valid_person_name(self, text: str) -> bool:
        """Valida si el texto es realmente un nombre de persona (con soporte para acentos)"""
        if not isinstance(text, str) or len(text.strip()) < 2:
            return False

        # Excluir palabras comunes que no son nombres (con y sin acentos)
        excluded = {
            'actividad', 'escuela', 'colegio', 'liceo', 'alumno', 'alumna', 'profesor', 'docente',
            'director', 'directora', 'apoderado', 'apoderada', 'encargado', 'encargada',
            'trabajador', 'trabajadora', 'funcionario', 'funcionaria', 'jefe', 'jefa',
            'región', 'regíon', 'provincia', 'provincia', 'comuna', 'ciudad', 'pueblo', 'país',
            'escena', 'momento', 'día', 'día', 'mes', 'año', 'hora', 'minuto', 'segundo',
            'clase', 'grupo', 'equipo', 'servicio', 'departamento', 'ministerio',
            'superintendencia', 'municipalidad', 'institución', 'institución', 'organización',
            'curso', 'básico', 'básico', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto',
            'problema', 'situación', 'situación', 'asunto', 'tema', 'materia', 'requisito',
            'actividad', 'tarea', 'trabajo', 'proyecto', 'plano', 'patio', 'sala',
            'ambiente', 'aula', 'biblioteca', 'laboratorio', 'gimnasio', 'comedor',
            'información', 'información', 'educación', 'educación', 'institución', 'institución'
        }

        text_lower = text.lower().strip()
        if text_lower in excluded:
            return False

        # Debe tener al menos 2 palabras para ser considerado nombre completo
        # O ser una palabra con patrón típico de nombre (mayúscula inicial)
        parts = text.split()
        if len(parts) < 2:
            # Una sola palabra: solo si empieza con mayúscula y tiene 3+ caracteres
            return len(text) >= 3 and text[0].isupper()
        else:
            # Múltiples palabras: todas deben empezar con mayúscula (incluyendo acentos)
            return all(part and part[0].isupper() for part in parts)

    def is_valid_location(self, text: str) -> bool:
        """Valida si el texto es realmente una ubicación"""
        if not isinstance(text, str) or len(text.strip()) < 2:
            return False

        # Lista blanca de ubicaciones válidas
        valid_locations = {
            'santiago', 'valparaíso', 'viña del mar', 'concepción', 'temuco',
            'puerto montt', 'la serena', 'los ángeles', 'aysén', 'o\'higgins',
            'la araucanía', 'los lagos', 'antofagasta', 'arica', 'parinacota',
            'atacama', 'coquimbo', 'región', 'provincia', 'ciudad'
        }

        text_lower = text.lower().strip()

        # Si está en la lista blanca, validar
        if text_lower in valid_locations:
            return True

        # Si contiene palabras geográficas clave
        geo_keywords = ['región', 'provincia', 'ciudad', 'comuna', 'calle', 'avenida']
        return any(keyword in text_lower for keyword in geo_keywords)

    def anonymize_text_with_nlp(self, text: str) -> str:
        """
        Anonimiza usando NLP (spaCy) de forma inteligente.
        Solo anonimiza entidades que pasan validación adicional.
        """
        if not self.nlp or not isinstance(text, str) or text.strip() == '':
            return text

        result = text
        doc = self.nlp(text)

        # Procesar entidades detectadas por spaCy (en orden inverso)
        for ent in sorted(doc.ents, key=lambda e: e.start_char, reverse=True):
            entity_text = ent.text
            entity_type = ent.label_

            # Mapear tipos de entidades a etiquetas
            if entity_type == "PER":  # PERSON
                # Validación adicional: debe parecer un nombre real
                if not self.is_valid_person_name(entity_text):
                    continue

                key = f"person_{entity_text.lower()}"
                if key not in self.mappings:
                    self.mappings[key] = entity_text
                replacement = "<nombre>"
                self.counter['person'] = self.counter.get('person', 0) + 1

            elif entity_type == "LOC":  # LOCATION
                # Validación adicional: debe parecer una ubicación real
                if not self.is_valid_location(entity_text):
                    continue

                key = f"location_{entity_text.lower()}"
                if key not in self.mappings:
                    self.mappings[key] = entity_text
                replacement = "<ubicacion>"
                self.counter['location'] = self.counter.get('location', 0) + 1

            elif entity_type == "ORG":  # ORGANIZATION
                # Solo si tiene 2+ palabras para evitar palabras sueltas
                if len(entity_text.split()) < 2:
                    continue

                key = f"organization_{entity_text.lower()}"
                if key not in self.mappings:
                    self.mappings[key] = entity_text
                replacement = "<organizacion>"
                self.counter['organization'] = self.counter.get('organization', 0) + 1

            else:
                continue

            # Reemplazar
            result = result[:ent.start_char] + replacement + result[ent.end_char:]

        return result

    def anonymize_text_in_narrative(self, text: str) -> str:
        """
        Anonimiza datos sensibles DENTRO de un texto narrativo/relato
        Usa NLP si está disponible, sino usa patrones regex.
        """
        if not isinstance(text, str) or text.strip() == '':
            return text

        # Primero: usar NLP para detección inteligente
        if self.use_nlp and self.nlp:
            result = self.anonymize_text_with_nlp(text)
        else:
            result = text

        # Luego: aplicar patrones regex en ORDEN ESPECÍFICO para evitar conflictos
        # ORDEN: RUT → Email → Teléfono → NOMBRES (antes que ubicaciones) → Dirección → Ubicaciones

        # 1. Reemplazar RUTs PRIMERO (ya que son los más específicos y menos conflictivos)
        # Formatos flexibles para capturar variantes:
        # - 12.345.678-9 (formato estándar: 2.3.3-1)
        # - 12345678-9 (sin puntos: 8 dígitos)
        # - 1234567-9 (sin puntos: 7 dígitos)
        # - 12 345 678-9 (con espacios)
        # - 8.808.611-2 (formato: 1.3.3-1)
        # - 17.417.114137-K (formato especial con muchos dígitos)
        rut_patterns = [
            r'\d{1,2}\.\d{3}\.\d{4,6}-[0-9kK]',  # Flexible: 1-2.3.4-6-digito (17.417.114137-K)
            r'\d{2}\.\d{3}\.\d{3}-[0-9kK]',      # 12.345.678-9 (estándar)
            r'\d{1}\.\d{3}\.\d{3}-[0-9kK]',      # 8.808.611-2 (un dígito inicial)
            r'\d{1,2}\s\d{3}\s\d{3}-[0-9kK]',    # 12 345 678-9 (con espacios)
            r'\d{8,11}-[0-9kK]',                 # Sin puntos: 8-11 dígitos + digito verificador
            r'\d{7,9}(?=\s|,|$)',                # RUT sin guion ni verificador: 7-9 dígitos
            r'\d{7}-[0-9kK]',                    # Mínimo: 1234567-9
        ]

        for pattern in rut_patterns:
            matches = list(re.finditer(pattern, result))
            for match in reversed(matches):  # Procesar en orden inverso
                rut = match.group()
                key = f"rut_{rut}"
                if key not in self.mappings:
                    self.mappings[key] = rut
                    self.counter['rut'] = self.counter.get('rut', 0) + 1
                result = result[:match.start()] + "<rut>" + result[match.end():]

        # 2. Reemplazar correos
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
        while True:
            match = re.search(email_pattern, result)
            if not match:
                break
            email = match.group()
            key = f"email_{email}"
            if key not in self.mappings:
                self.mappings[key] = email
                self.counter['email'] = self.counter.get('email', 0) + 1
            result = result.replace(email, "<correo>", 1)

        # 3. Reemplazar teléfonos - EN ORDEN DE ESPECIFICIDAD
        phone_patterns = [
            r'\+56\s*9\s*\d{4}\s*\d{4}',        # +56 9 1234 5678
            r'\+56\s*\d{2}\s*\d{4}\s*\d{4}',    # +56 22 1234 5678
            r'\+56\s*\d{8,9}',                  # +56 912345678
            r'\b9\s*\d{4}\s*\d{4}\b',           # 9 1234 5678
            r'\b9\d{8}\b',                      # 91234567
            r'\(\d{1,2}\)\s*\d{4}\s*\d{4}',     # (2) 1234 5678
        ]

        for pattern in phone_patterns:
            while True:
                match = re.search(pattern, result)
                if not match:
                    break
                phone = match.group()
                key = f"phone_{phone}"
                if key not in self.mappings:
                    self.mappings[key] = phone
                    self.counter['phone'] = self.counter.get('phone', 0) + 1
                result = result.replace(phone, "<telefono>", 1)

        # 4a. Reemplazar DIRECCIONES (Calle, Avenida, Pasaje, etc.)
        # Patrones: "Calle Principal 123", "Avenida Central 456", etc.
        address_pattern = r'\b(Calle|Avenida|Av\.|Avenida|Pasaje|Carrera|Cra\.|Camino|Dpto|Depto|Piso|Apartamento|Apto|Bloque|Lote)\s+[A-Za-z0-9\s\.#-]+(?:\s+\d+[A-Za-z0-9\s\.,#-]*)?'

        while True:
            match = re.search(address_pattern, result, re.IGNORECASE)
            if not match:
                break
            address = match.group().strip()
            key = f"address_{address.lower()}"
            if key not in self.mappings:
                self.mappings[key] = address
                self.counter['address'] = self.counter.get('address', 0) + 1
            result = result[:match.start()] + "<direccion>" + result[match.end():]

        # 4b. Reemplazar ubicaciones (regiones, provincias y comunas de Chile)
        # CASE-INSENSITIVE para capturar todas las variantes (mayúsculas, minúsculas, mixtas)
        # Fuente: BCN Chile - 15 regiones, 25 provincias, 345 comunas

        locations = [
            # REGIONES DE CHILE (15)
            "arica y parinacota", "arica", "tarapaca", "antofagasta", "atacama",
            "coquimbo", "valparaiso", "libertador general bernardo o'higgins",
            "o'higgins", "maule", "biobio", "la araucania", "araucania",
            "los rios", "los lagos", "aysen", "magallanes", "metropolitana de santiago",
            "metropolitana", "antartida", "magallanes y de la antartida chilena",

            # PROVINCIAS PRINCIPALES (25)
            "arica", "parinacota", "iquique", "del tamarugal", "tamarugal",
            "tocopilla", "el loa", "antofagasta", "chanaral", "copiapo",
            "huasco", "elqui", "limari", "choapa", "petorca",
            "los andes", "san felipe de aconcagua", "quillota", "valparaiso",
            "san antonio", "isla de pascua", "cachapoal", "colchagua",
            "cardenal caro", "curico", "talca", "linares", "cauquenes",
            "nuble", "biobio", "concepcion", "arauco", "malleco",
            "cautin", "valdivia", "osorno", "llanquihue", "chiloe",
            "palena", "coihaique", "aisen", "general carrera", "capitan prat",
            "ultima esperanza", "tierra del fuego",

            # COMUNAS PRINCIPALES (350+) - Top 100 más comunes
            "alta hospicio", "camarones", "putre", "huara", "camina", "colchane",
            "pica", "pozo almonte", "maria elena", "calama", "ollague",
            "san pedro de atacama", "antofagasta", "mejillones", "sierra gorda",
            "taltal", "chanaral", "diego de almagro", "copiapo", "caldera",
            "tierra amarilla", "vallenar", "freirina", "huasco", "la serena",
            "coquimbo", "andacollo", "vicuna", "ovalle", "rio hurtado",
            "monte patria", "illapel", "los vilos", "la ligua", "petorca",
            "los andes", "san esteban", "san felipe", "putaendo", "quillota",
            "la cruz", "calera", "limache", "olmue", "valparaiso",
            "vina del mar", "villa alemana", "quilpue", "quinta normal",
            "con con", "concon", "juan fernandez", "san antonio", "cartagena",
            "el tabo", "algarrobo", "santo domingo", "isla de pascua",
            "rancagua", "graneros", "mostazal", "machali", "requinoa",
            "rengo", "san vicente", "pichidegua", "san fernando", "chimbarongo",
            "santa cruz", "pichilemu", "talca", "pelarco", "rio claro",
            "san clemente", "constitucion", "pencahue", "linares", "yerbas buenas",
            "colbun", "longavi", "parral", "retiro", "villa alegre",
            "san javier", "cauquenes", "pelluhue", "chanco", "chillan",
            "san carlos", "niquen", "bulnes", "quillon", "ranquil",
            "treguaco", "quirihue", "chillan viejo", "los angeles", "cabrero",
            "tucapel", "antuco", "mulchen", "negrete", "nacimiento",
            "laja", "yumbel", "concepcion", "talcahuano", "tome",
            "florida", "hualqui", "lota", "coronel",
            "san pedro de la paz", "chiguayante", "lebu", "arauco", "canete",
            "contulmo", "tirua", "angol", "renaico", "collipulli",
            "lonquimay", "curacautin", "ercilla", "victoria", "traiguen",
            "lumaco", "puren", "los sauces", "temuco", "lautaro",
            "vilcun", "cholchol", "cunco", "pucon", "villarrica",
            "freire", "gorbea", "loncoche", "tolten", "carahue",
            "nueva imperial", "galvarino", "padre las casas", "valdivia",
            "mariquina", "lanco", "mafil", "corral", "panguipulli",
            "paillaco", "ranco", "la union", "futrono", "rio bueno",
            "osorno", "san pablo", "puyehue", "puerto octay", "purranque",
            "rio negro", "puerto montt", "puerto varas", "cochamo", "calbuco",
            "maullin", "llanquihue", "frutillar", "castro", "ancud",
            "quemchi", "dalcahue", "quinchao", "chonchi", "quellon",
            "chaitén", "hualaihue", "futaleufú", "palena", "coyhaique",
            "lago verde", "cisnes", "chile chico", "rio ibanez", "cochrane",
            "natales", "torres del paine", "punta arenas", "rio verde",
            "porvenir", "primavera", "santiago", "independencia", "conchalí",
            "huechuraba", "recoleta", "providencia", "vitacura", "lo barnechea",
            "las condes", "nunoa", "la reina", "macul", "penalolen",
            "la florida", "san joaquin", "la granja", "la pintana", "san ramon",
            "san miguel", "la cisterna", "el bosque", "pedro aguirre cerda",
            "lo espejo", "estacion central", "cerrillos", "maipu", "lo prado",
            "pudahuel", "cerro navia", "renca", "quilicura", "colina",
            "lampa", "tiltil", "puente alto", "san jose de maipo", "pirque",
            "san bernardo", "buin", "paine", "calera de tango", "maria pinto",
            "curacavi", "san pedro", "talagante", "penaflor", "el monte",
            "padre hurtado", "peñaflor", "penaflo",
        ]

        # Reemplazar case-insensitively (ordenado por longitud descendente)
        for location in sorted(set(locations), key=len, reverse=True):
            # Solo procesar si tiene al menos 2 caracteres
            if len(location) < 2:
                continue

            pattern = re.compile(r'\b' + re.escape(location) + r'\b', re.IGNORECASE)
            matches = list(pattern.finditer(result))
            for match in reversed(matches):
                found_location = match.group()
                key = f"location_{found_location.lower()}"
                if key not in self.mappings:
                    self.mappings[key] = found_location
                    self.counter['location'] = self.counter.get('location', 0) + 1
                result = result[:match.start()] + "<ubicacion>" + result[match.end():]

        # 5. Reemplazar nombres (personas) - ESTRATEGIA DE MÚLTIPLES PATRONES
        # Estrategia: detectar con mayúscula inicial (más confiable) más nombres comunes minúsculos
        # Incluye: acentos (á, é, í, ó, ú) y letra ñ

        excluded_words = {
            # Instituciones y roles
            'región', 'region', 'regíon', 'servicio', 'escuela', 'departamento', 'ministerio',
            'municipalidad', 'superintendencia', 'dirección', 'direccion', 'provincia', 'ciudad',
            'pueblo', 'país', 'pais', 'universidad', 'colegio', 'liceo', 'hospital', 'juzgado',
            'alumno', 'alumna', 'profesor', 'docente', 'director', 'directora',
            'trabajador', 'trabajadora', 'funcionario', 'funcionaria', 'jefe', 'jefa',
            'estudiante', 'maestro', 'maestra', 'abogado', 'abogada', 'apoderado', 'apoderada',
            # Otros
            'información', 'educación', 'clase', 'actividad', 'problema', 'ambiente',
            'test', 'casos', 'detalles', 'nombres', 'ubicaciones', 'datos'
        }

        # Patrón 1: Nombres que empiezan con mayúscula (más confiable)
        # Detecta: Juan Pérez, JUAN PEREZ, Hualpen, ANTONELA, etc.
        name_pattern_capital = r'\b[A-ZÑ][a-záéíóúñA-ZÑ]+(?:\s+[A-ZÑ][a-záéíóúñA-ZÑ]+)*\b'

        matches = list(re.finditer(name_pattern_capital, result))
        for match in reversed(matches):
            name = match.group().strip()
            name_lower = name.lower()

            # Validar que sea un nombre
            if name_lower not in excluded_words and len(name) >= 4:
                key = f"person_{name_lower}"
                if key not in self.mappings:
                    self.mappings[key] = name
                    self.counter['person'] = self.counter.get('person', 0) + 1
                result = result[:match.start()] + "<nombre>" + result[match.end():]

        # Patrón 2: Nombres comunes en minúsculas (cuando está TODO en minúsculas)
        # Incluye los 100+ nombres más populares en Chile 2024 + apellidos comunes
        # Fuente: https://ergobaby.cl/blog/portabebes/los-100-nombres-mas-populares-para-ninos-ninas-en-2024
        spanish_common_names = [
            # Nombres de niñas - Top 100 Chile 2024
            'sofía', 'sofia', 'valentina', 'isabella', 'camila', 'valeria', 'martina',
            'lucía', 'lucia', 'emma', 'victoria', 'elena', 'gabriela', 'daniela',
            'maría', 'maria', 'amelia', 'ana', 'catalina', 'julieta', 'aitana',
            'ximena', 'luna', 'sara', 'adriana', 'paula', 'emilia', 'carla', 'clara',
            'miranda', 'rocío', 'rocio', 'laura', 'andrea', 'zoe', 'alba', 'olivia',
            'bianca', 'julia', 'renata', 'mía', 'mia', 'regina', 'lorena', 'fernanda',
            'isabel', 'cecilia', 'alejandra', 'diana', 'ángela', 'angela', 'ámbar', 'ambar',
            'sonia', 'luciana', 'rosa', 'carmen', 'yolanda', 'gloria', 'rosario', 'inés', 'ines',
            'silvia', 'claudia', 'alicia', 'vera', 'noelia', 'natalia', 'susana', 'estela',
            'verónica', 'veronica', 'teresa', 'begoña', 'begonia', 'esmeralda', 'elisa', 'magdalena', 'jimena',
            'irene', 'belén', 'belen', 'mariana', 'milagros', 'felicidad', 'esperanza',
            'dolores', 'patricia', 'gracia', 'fabiola', 'consuelo', 'josefina', 'pilar',
            'lorenza', 'marcela', 'tamara', 'rebeca', 'mercedes', 'guadalupe', 'paloma',
            'evangelina', 'manuela', 'ramona', 'lucero', 'ignacia', 'amalia',
            # Nombres de niños - Top 100 Chile 2024
            'mateo', 'santiago', 'sebastián', 'sebastian', 'leonardo', 'matías', 'matias',
            'martín', 'martin', 'alejandro', 'lucas', 'nicolás', 'nicolas', 'samuel',
            'benjamín', 'benjamin', 'thiago', 'emiliano', 'diego', 'tomás', 'tomas',
            'joaquín', 'joaquin', 'gabriel', 'david', 'miguel', 'isaac', 'pablo',
            'ángel', 'angel', 'adrián', 'adrian', 'bruno', 'juan', 'josé', 'jose',
            'maximiliano', 'salvador', 'franco', 'andrés', 'andres', 'rodrigo', 'enzo',
            'agustín', 'agustin', 'antonio', 'manuel', 'emilio', 'rafael', 'vicente',
            'javier', 'hugo', 'carlos', 'león', 'leon', 'ernesto', 'álvaro', 'alvaro',
            'gael', 'mauricio', 'valentín', 'valentin', 'iker', 'jorge', 'ricardo',
            'alberto', 'alonso', 'cristian', 'julian', 'césar', 'cesar', 'damián', 'damian',
            'félix', 'felix', 'hector', 'kevin', 'isaías', 'isaias', 'raúl', 'raul',
            'esteban', 'simón', 'simon', 'alfonso', 'armando', 'darío', 'dario',
            'fabio', 'felipe', 'gustavo', 'jacobo', 'leandro', 'marcos', 'mario',
            'máximo', 'maximo', 'óscar', 'oscar', 'patricio', 'pedro', 'rey', 'romeo',
            'rubén', 'ruben', 'saúl', 'sergio', 'valentino', 'víctor', 'victor',
            'yago', 'yahir', 'zacarías', 'zacarias', 'baltasar', 'casimiro',
            'demetrio', 'edmundo',
            # Apellidos comunes chilenos - Top 100 según Registro Civil Chile
            # Incluye variantes con/sin acentos (para detectar apellidos solos)
            # Fuente: Wikipedia + CNN Chile + Psicología y Mente
            'barría', 'barria', 'pérez', 'perez', 'garcía', 'garcia', 'hernández', 'hernandez',
            'martínez', 'martinez', 'bascuñán', 'bascunan', 'pía', 'pia',
            'gonzalez', 'muñoz', 'rojas', 'diaz', 'soto', 'contreras',
            'silva', 'martinez', 'sepulveda', 'morales', 'rodriguez', 'lopez',
            'fuentes', 'hernandez', 'torres', 'araya', 'flores', 'espinoza',
            'valenzuela', 'castillo', 'tapia', 'reyes', 'gutierrez', 'castro',
            'pizarro', 'alvarez', 'vasquez', 'sanchez', 'fernandez', 'ramirez',
            'carrasco', 'gomez', 'cortes', 'herrera', 'nunez', 'jara', 'vergara',
            'rivera', 'figueroa', 'riquelme', 'garcia', 'miranda', 'bravo', 'vera',
            'molina', 'vega', 'campos', 'sandoval', 'orellana', 'cardenas',
            'olivares', 'alarcon', 'gallardo', 'ortiz', 'garrido', 'salazar',
            'guzman', 'henriquez', 'saavedra', 'navarro', 'aguilera', 'parra',
            'romero', 'aravena', 'vargas', 'caceres', 'yanez', 'leiva', 'escobar',
            'ruiz', 'valdes', 'vidal', 'salinas', 'zuniga', 'pena', 'godoy',
            'lagos', 'maldonado', 'bustos', 'medina', 'pino', 'palma', 'moreno',
            'sanhueza', 'carvajal', 'navarrete', 'saez', 'alvarado', 'donoso',
            'poblete', 'bustamante', 'toro', 'ortega', 'franco', 'rios', 'calderon',
            'zamora', 'santibañez', 'santibanez', 'pavez', 'velasquez',
            # Apellidos comunes españoles
            'martin', 'jimenez', 'domenguez', 'dominguez', 'ramos',
            # Apellidos indígenas / mapuches (chilenos)
            'maripillán', 'maripillan', 'catelicán', 'catelican',
            'ñancupil', 'nancupil', 'queipul', 'quintrala', 'coñuepan',
            'pichun', 'paillahueque', 'paihueque', 'cayuqueo', 'cayuqueu',
            'painemal', 'painemalí', 'painemalí', 'contreras', 'antihueque',
        ]

        for name in spanish_common_names:
            pattern = r'\b' + name + r'\b'
            matches = list(re.finditer(pattern, result, re.IGNORECASE))
            for match in reversed(matches):
                found_name = match.group().strip()
                name_lower = found_name.lower()
                if name_lower not in excluded_words and len(found_name) >= 4:
                    key = f"person_{name_lower}"
                    if key not in self.mappings:
                        self.mappings[key] = found_name
                        self.counter['person'] = self.counter.get('person', 0) + 1
                    result = result[:match.start()] + "<nombre>" + result[match.end():]

        return result

    def anonymize_value(self, value: str, field_type: str) -> str:
        """Anonimiza un valor según su tipo detectado"""
        if not isinstance(value, str) or value.strip() == '':
            return value

        original = value.strip()

        if self.detect_rut(original):
            key = f"rut_{original}"
            if key not in self.mappings:
                count = self.counter.get('rut', 0) + 1
                self.counter['rut'] = count
                self.mappings[key] = f"RUT_{count:03d}"
            return self.mappings[key]

        if self.detect_email(original):
            key = f"email_{original}"
            if key not in self.mappings:
                count = self.counter.get('email', 0) + 1
                self.counter['email'] = count
                self.mappings[key] = f"correo_{count:03d}@anonimizado.local"
            return self.mappings[key]

        if self.detect_phone(original):
            key = f"phone_{original}"
            if key not in self.mappings:
                count = self.counter.get('phone', 0) + 1
                self.counter['phone'] = count
                self.mappings[key] = f"+56-9-XXXX-{count:04d}"
            return self.mappings[key]

        if self.is_location_like(original):
            key = f"location_{original.lower()}"
            if key not in self.mappings:
                count = self.counter.get('location', 0) + 1
                self.counter['location'] = count
                self.mappings[key] = f"Ubicacion_{count:03d}"
            return self.mappings[key]

        if self.is_name_like(original):
            key = f"person_{original.lower()}"
            if key not in self.mappings:
                count = self.counter.get('person', 0) + 1
                self.counter['person'] = count
                self.mappings[key] = f"Persona_{count:03d}"
            return self.mappings[key]

        return value

    def anonymize_dataframe(self, df: pd.DataFrame, columns_to_anonymize: List[str] = None) -> pd.DataFrame:
        """Anonimiza columnas especificadas en un DataFrame"""
        df_copy = df.copy()

        if columns_to_anonymize is None:
            columns_to_anonymize = df.columns.tolist()

        # Lista de palabras clave para detectar columnas narrativas
        narrative_keywords = ['relato', 'descripcion', 'narrative', 'texto', 'historia', 'denuncia',
                             'descripción', 'narración', 'detalle', 'comentario', 'observacion', 'observación']

        for col in columns_to_anonymize:
            if col in df_copy.columns:
                # Detectar si es una columna de relato/narrativa (texto largo)
                col_lower = col.lower().strip()
                is_narrative = any(keyword in col_lower for keyword in narrative_keywords)

                if is_narrative:
                    # Para columnas narrativas, crear una columna nueva anonimizada
                    new_col_name = f"{col}_Anonimizado"
                    df_copy[new_col_name] = df_copy[col].astype(str).apply(
                        lambda x: self.anonymize_text_in_narrative(x)
                    )
                else:
                    # Para columnas normales, crear una columna nueva
                    new_col_name = f"{col}_Anonimizado"
                    df_copy[new_col_name] = df_copy[col].astype(str).apply(
                        lambda x: self.anonymize_value(x, 'general')
                    )

        return df_copy

    def save_mappings(self, output_file: str):
        """Guarda el diccionario de mapeos en un archivo JSON"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.mappings, f, ensure_ascii=False, indent=2)
        print(f"[OK] Mapeos guardados en: {output_file}")

    def load_mappings(self, input_file: str):
        """Carga un diccionario de mapeos previo"""
        with open(input_file, 'r', encoding='utf-8') as f:
            self.mappings = json.load(f)
        print(f"[OK] Mapeos cargados desde: {input_file}")


def anonymize_file(input_file: str, output_file: str = None, columns: List[str] = None,
                   mapping_file: str = None, save_mapping: bool = True):
    """
    Función principal para anonimizar archivos CSV/Excel

    Args:
        input_file: Ruta del archivo de entrada
        output_file: Ruta del archivo anonimizado (por defecto: input_anonymized.ext)
        columns: Lista de columnas a anonimizar (None = todas)
        mapping_file: Archivo de mapeos previos para aplicar
        save_mapping: Si guardar el diccionario de mapeos
    """
    input_path = Path(input_file)

    if not input_path.exists():
        print(f"[ERROR] Archivo no encontrado: {input_file}")
        return

    print(f"[*] Leyendo archivo: {input_file}")

    if input_path.suffix.lower() == '.csv':
        df = pd.read_csv(input_file, encoding='utf-8')
    elif input_path.suffix.lower() in ['.xlsx', '.xls']:
        df = pd.read_excel(input_file)
    else:
        print(f"[ERROR] Formato no soportado: {input_path.suffix}")
        return

    anonymizer = DataAnonymizer(mapping_file)

    print(f"[INFO] Columnas detectadas: {list(df.columns)}")
    if columns:
        cols_to_anonymize = columns
        print(f"[TARGET] Anonimizando columnas específicas: {cols_to_anonymize}")
    else:
        cols_to_anonymize = df.columns.tolist()
        print(f"[TARGET] Anonimizando todas las columnas")

    df_anonymized = anonymizer.anonymize_dataframe(df, cols_to_anonymize)

    if output_file is None:
        name = input_path.stem
        ext = input_path.suffix
        output_file = input_path.parent / f"{name}_anonymized{ext}"

    output_path = Path(output_file)

    if output_path.suffix.lower() == '.csv':
        df_anonymized.to_csv(output_file, index=False, encoding='utf-8')
    else:
        df_anonymized.to_excel(output_file, index=False)

    print(f"[OK] Archivo anonimizado guardado: {output_file}")

    if save_mapping:
        mapping_output = output_path.parent / f"{output_path.stem}_mappings.json"
        anonymizer.save_mappings(str(mapping_output))

    print(f"\n[SUMMARY]")
    print(f"   Filas procesadas: {len(df)}")
    print(f"   Mapeos creados: {len(anonymizer.mappings)}")
    print(f"   - Personas: {anonymizer.counter.get('person', 0)}")
    print(f"   - Ubicaciones: {anonymizer.counter.get('location', 0)}")
    print(f"   - RUTs: {anonymizer.counter.get('rut', 0)}")
    print(f"   - Emails: {anonymizer.counter.get('email', 0)}")
    print(f"   - Teléfonos: {anonymizer.counter.get('phone', 0)}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Uso: python anonymizer.py <archivo_entrada> [archivo_salida] [columnas]")
        print("\nEjemplos:")
        print("  python anonymizer.py datos.csv")
        print("  python anonymizer.py datos.xlsx datos_anonimizado.xlsx")
        print("  python anonymizer.py datos.csv salida.csv nombre,apellido,email")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    columns = sys.argv[3].split(',') if len(sys.argv) > 3 else None

    anonymize_file(input_file, output_file, columns)
