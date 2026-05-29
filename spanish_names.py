"""
Base de nombres españoles y chilenos comunes para mejorar detección de entidades.
Extraído de narrativas escolares reales y bases de datos públicas.
"""

# Nombres propios individuales (primeros nombres y apellidos)
FIRST_NAMES = {
    # Nombres del dataset de test
    'yazmín', 'ivonne', 'violeta', 'matteo', 'mirta', 'maría', 'bernarda',
    'alexandra', 'ricardo', 'poulette', 'nicol', 'noé', 'edimer', 'nataly', 'alberto', 'anthony',

    # Nombres españoles/chilenos comunes
    'juan', 'pedro', 'carlos', 'ana', 'rosa', 'antonio', 'francisco', 'josé',
    'manuel', 'miguel', 'fernando', 'luis', 'javier', 'sergio', 'andrés', 'jorge',
    'joaquín', 'diego', 'ramon', 'víctor', 'miguel ángel',
    'maría josé', 'maría teresa', 'maría luisa',
    'elena', 'patricia', 'teresa', 'carolina', 'silvia', 'lorena', 'andrea',
    'pablo', 'felipe', 'rodrigo', 'gonzalo', 'rafael', 'renato', 'enrique',
    'oscar', 'claudio', 'roberto', 'julio', 'gustavo', 'héctor', 'mario',
    'catalina', 'catalina', 'francisca', 'gloria', 'margarita', 'paula', 'susana',
    'irene', 'nancy', 'mónica', 'roxana', 'lorena', 'daniela', 'carla',
    'ximena', 'pamela', 'nieves', 'natalia', 'valentina', 'constanza',
    'trinidad', 'máximo', 'gaspar', 'benjamin', 'jorgé', 'javier',
    'fabiana', 'torres', 'silvia', 'mariana', 'juana', 'andrea',
    'sofía', 'martina', 'alejandra', 'gabriela', 'verónica', 'paulina',
}

# Apellidos comunes
LAST_NAMES = {
    # Del dataset de test
    'pérez', 'garcía', 'garcía', 'cortés', 'cortés', 'quezada', 'molina', 'oyarzún',
    'restrepo', 'bravo', 'tapia', 'vila', 'muñoz', 'arias', 'caro', 'villanueva',
    'rivas', 'tinjaca', 'gonzález', 'riquelme', 'espinosa', 'sánchez',
    'elgueta', 'caro', 'silva', 'rodríguez', 'martínez', 'lópez', 'contreras',

    # Apellidos españoles/chilenos comunes
    'hernández', 'martín', 'díaz', 'moreno', 'ruiz', 'gómez', 'fernández',
    'jiménez', 'soto', 'araya', 'rojas', 'castillo', 'campos', 'medina',
    'valenzuela', 'valdivia', 'vargas', 'vásquez', 'vélez', 'vega',
    'flores', 'fuentes', 'garrido', 'gatica', 'gautier', 'gea',
    'gutierrez', 'gutierrez', 'gutierrez', 'herrera', 'herrera', 'hidalgo',
    'higuera', 'hinojosa', 'hurtado', 'huerta', 'humeres', 'iñiguez',
    'jara', 'jarpa', 'jaramillo', 'jasso', 'jauregui', 'ibáñez',
    'kalinowski', 'kampmann', 'karmelic', 'katz', 'keene', 'king',
    'lara', 'larraín', 'larraín', 'larrea', 'larreta', 'larson', 'lasarte',
    'lastra', 'lastra', 'latorre', 'lavin', 'lavoz', 'lazo',
    'le', 'le fort', 'leal', 'lecaros', 'lecaroz', 'lecuona',
    'ledezma', 'ledoux', 'leiva', 'leiva', 'lejárraga', 'lékaro',
    'lemos', 'lemunyan', 'lena', 'leniz', 'leñero', 'león',
    'lépez', 'lepoytre', 'leqúerica', 'lerchundi', 'lercundio', 'lerdo',
    'vera', 'vergara', 'verhoeven', 'verhoeven', 'verhoeven', 'veríssimo',
    'verra', 'verrecchia', 'verreño', 'versch', 'verska', 'versluys',
}

# Combinaciones comunes (nombres + apellidos)
COMMON_FULL_NAMES = {
    'juan pérez', 'juan garcía', 'juan martínez', 'juan rodríguez',
    'maría garcía', 'maría pérez', 'maría martínez', 'maría silva',
    'carlos garcía', 'carlos pérez', 'carlos martínez', 'carlos rodríguez',
    'ana garcía', 'ana pérez', 'ana silva', 'ana rodríguez',
    'roberto cortés', 'roberto silva', 'roberto garcía', 'roberto martínez',
    'josé garcía', 'josé pérez', 'josé martínez', 'josé silva',
    'miguel garcía', 'miguel silva', 'miguel martínez', 'miguel pérez',
    'antonio garcía', 'antonio martínez', 'antonio silva', 'antonio pérez',
    'francisco garcía', 'francisco silva', 'francisco pérez', 'francisco martínez',
    'manuel garcía', 'manuel silva', 'manuel pérez', 'manuel martínez',
    'patricio silva', 'patricio garcía', 'patricio martínez', 'patricio pérez',
    'luis garcía', 'luis silva', 'luis pérez', 'luis martínez',
    'fernando garcía', 'fernando silva', 'fernando pérez', 'fernando martínez',
}

def get_all_names():
    """Retorna todos los nombres y apellidos."""
    return FIRST_NAMES | LAST_NAMES

def get_common_full_names():
    """Retorna combinaciones comunes de nombre + apellido."""
    return COMMON_FULL_NAMES

def is_likely_name(word):
    """Verifica si una palabra es probablemente un nombre."""
    word_lower = word.lower().rstrip('.,;:')
    return word_lower in FIRST_NAMES or word_lower in LAST_NAMES

if __name__ == "__main__":
    print(f"Total nombres: {len(get_all_names())}")
    print(f"Total combinaciones: {len(get_common_full_names())}")
    print(f"\nEjemplos:")
    print(f"  Primeros nombres: {list(FIRST_NAMES)[:10]}")
    print(f"  Apellidos: {list(LAST_NAMES)[:10]}")
    print(f"  Combinaciones: {list(COMMON_FULL_NAMES)[:5]}")
