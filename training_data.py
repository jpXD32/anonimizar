"""
Dataset de entrenamiento para fine-tuning de modelo NER escolar.

Formato: (texto, {entidades})
Entidades: PERSON, LOC, ORG, SCHOOL_ID (Grupo, Sala, Curso, etc.)
"""

TRAINING_DATA = [
    # Formato: (texto, {"entities": [(inicio, fin, label), ...]})

    # Narrativas escolares reales (aproximadas)
    ("Se presenta la Sra. María García, apoderada de Juan Pérez, alumno de 7° Básico B.",
     {"entities": [(24, 35, "PERSON"), (50, 60, "PERSON"), (73, 86, "SCHOOL_ID")]}),

    ("La Dra. Rosa Silva, madre de Carlos López, informa sobre situación en San Bernardo.",
     {"entities": [(7, 16, "PERSON"), (31, 42, "PERSON"), (72, 84, "LOC")]}),

    ("El director Ing. Roberto Cortés del Colegio San Andrés atendió a los apoderados.",
     {"entities": [(12, 28, "PERSON"), (33, 51, "ORG"), (52, 63, "LOC")]}),

    ("Yo, María Bernarda Restrepo, madre y apoderada de la estudiante Facundo Tomás Bravo Tapia.",
     {"entities": [(4, 24, "PERSON"), (57, 82, "PERSON")]}),

    ("Soy Ricardo Vila Muñoz, RUT 12345678-9, padre de Trinidad Vila Arias, estudiante de 2do básico.",
     {"entities": [(4, 19, "PERSON"), (50, 67, "PERSON")]}),

    ("Poulette Nicol Cortés Quevedo, madre de Máximo Gaspar Rivas Cortés, estudiante de 3° Básico.",
     {"entities": [(0, 28, "PERSON"), (40, 62, "PERSON"), (81, 94, "SCHOOL_ID")]}),

    ("Se presentan apoderados de Juan: su padre e madre ante la dirección del establecimiento.",
     {"entities": [(28, 32, "PERSON")]}),

    ("El Grupo 5 de 7° Básico presentó conductas inapropiadas en Patio Norte.",
     {"entities": [(3, 10, "SCHOOL_ID"), (14, 21, "SCHOOL_ID"), (69, 80, "LOC")]}),

    ("En la Sala 3 del segundo piso, Catalina Muñoz y Leonardo Bravo tuvieron un conflicto.",
     {"entities": [(10, 16, "SCHOOL_ID"), (26, 38, "PERSON"), (43, 57, "PERSON")]}),

    ("Se notifica a Fabiana Torres, apoderada de Javier Contreras del Liceo Central de Talca.",
     {"entities": [(14, 28, "PERSON"), (44, 61, "PERSON"), (66, 85, "ORG")]}),

    ("Estudiantes: Pedro Silva, Pablo Gómez, Andrea Vásquez fueron derivados por conducta.",
     {"entities": [(13, 25, "PERSON"), (27, 39, "PERSON"), (41, 56, "PERSON")]}),

    ("Apoderado informa que su hijo Matteo Elgueta Quezada fue golpeado en San Bernardo.",
     {"entities": [(31, 52, "PERSON"), (71, 84, "LOC")]}),

    ("Conflicto entre estudiantes en la comuna de Villa Alemana, región de Valparaíso.",
     {"entities": [(41, 53, "LOC"), (65, 75, "LOC")]}),

    ("Sra. Nataly Riquelme y Sr. Alberto Espinosa, tutores de Anthony Sánchez.",
     {"entities": [(5, 20, "PERSON"), (28, 44, "PERSON"), (57, 72, "PERSON")]}),

    ("En la Jornada de Reflexión participó el Prof. Gustavo Martínez y Dra. Sofía Núñez.",
     {"entities": [(43, 59, "PERSON"), (66, 78, "PERSON")]}),

    ("Curso 4°A: Juana López, Rodrigo Fuentes, Mariana Díaz presentan bajo rendimiento.",
     {"entities": [(0, 6, "SCHOOL_ID"), (8, 19, "PERSON"), (21, 36, "PERSON"), (38, 51, "PERSON")]}),

    ("Derivación al Departamento de Educación Municipal (DEM) de Santiago por caso de bullying.",
     {"entities": [(19, 54, "ORG"), (58, 66, "LOC")]}),

    ("Se citó a apoderados: Claudio Pérez Mora y su esposa Francisca Rojas ante el director.",
     {"entities": [(20, 37, "PERSON"), (51, 65, "PERSON")]}),

    ("Aula 201: Conflicto entre compañeros Benjamín Carrasco y Maritza Soto.",
     {"entities": [(0, 8, "SCHOOL_ID"), (43, 60, "PERSON"), (65, 78, "PERSON")]}),

    ("Se reporta caso en Colegio Pedro de Valdivia de la región Metropolitana.",
     {"entities": [(22, 46, "ORG"), (53, 72, "LOC")]}),

    # Más casos variados
    ("La estudiante María de los Ángeles González fue sancionada por uso de celular.",
     {"entities": [(16, 47, "PERSON")]}),

    ("Apoderada Ximena Urrutia refiere problema con docente en Liceo Bicentenario.",
     {"entities": [(11, 25, "PERSON"), (56, 73, "ORG")]}),

    ("Niño de Curso 2° Básico B: Jorgé Santiago fue referido a Psicología.",
     {"entities": [(11, 23, "SCHOOL_ID"), (26, 40, "PERSON")]}),

    ("Incidente en Patio Oriente entre alumnos de 6° y 7° Básico.",
     {"entities": [(11, 25, "LOC"), (41, 46, "SCHOOL_ID"), (51, 56, "SCHOOL_ID")]}),

    ("Comunicación de Jefe de UTP Prof. Andrés Molina sobre cumplimiento de normas.",
     {"entities": [(27, 42, "PERSON")]}),

    ("Reunión con apoderados: Jorge Valdez, Susana Torres y Patricia Gutiérrez en Oficina de Dirección.",
     {"entities": [(20, 32, "PERSON"), (34, 47, "PERSON"), (52, 69, "PERSON"), (73, 94, "LOC")]}),

    ("Sala de Enlace: Seguimiento a estudiante Daniel Rojas Fernández.",
     {"entities": [(0, 14, "SCHOOL_ID"), (44, 66, "PERSON")]}),

    ("Alumno del Grupo 3 de 8° Básico: Felipe Contreras solicitó cambio de curso.",
     {"entities": [(15, 22, "SCHOOL_ID"), (26, 34, "SCHOOL_ID"), (36, 52, "PERSON")]}),

    ("Denuncia formal ante Superintendencia de Educación por caso de acoso entre estudiantes.",
     {"entities": [(24, 50, "ORG")]}),

    ("Inspector General Marcelo Sánchez coordina seguimiento en Colegio Metropolitano.",
     {"entities": [(19, 34, "PERSON"), (60, 81, "ORG")]}),
]

def get_training_data():
    """Retorna el dataset de entrenamiento."""
    return TRAINING_DATA

def get_training_data_formatted():
    """Retorna dataset en formato spaCy compatible."""
    formatted = []
    for text, annotations in TRAINING_DATA:
        formatted.append((text, annotations))
    return formatted

def print_dataset_stats():
    """Imprime estadísticas del dataset."""
    print(f"Total de ejemplos: {len(TRAINING_DATA)}")

    total_entities = 0
    entity_counts = {}

    for text, annotations in TRAINING_DATA:
        for start, end, label in annotations["entities"]:
            total_entities += 1
            entity_counts[label] = entity_counts.get(label, 0) + 1

    print(f"Total de entidades: {total_entities}")
    print(f"Entidades por tipo:")
    for label, count in sorted(entity_counts.items()):
        print(f"  {label}: {count}")

if __name__ == "__main__":
    print_dataset_stats()
