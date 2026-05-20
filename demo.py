#!/usr/bin/env python3
"""
Demostración interactiva del anonimizador
"""

import pandas as pd
from pathlib import Path
from anonymizer import DataAnonymizer, anonymize_file


def demo_basic():
    """Demo básica: anonimizar archivo de ejemplo"""
    print("\n" + "="*60)
    print("DEMO 1: Anonimización Básica")
    print("="*60)

    print("\n[*] Anonimizando datos de ejemplo...")
    anonymize_file('example_data.csv', save_mapping=True)

    print("\n[*] Mostrando resultado anonimizado:")
    df_anonimizado = pd.read_csv('example_data_anonymized.csv')
    print(df_anonimizado.to_string(index=False))

    print("\n[*] Mapeos generados:")
    import json
    with open('example_data_anonymized_mappings.json') as f:
        mappings = json.load(f)
    for key, value in list(mappings.items())[:5]:
        print(f"  {key} -> {value}")
    print(f"  ... ({len(mappings)} mapeos totales)")


def demo_selective():
    """Demo 2: Anonimización selectiva (solo algunas columnas)"""
    print("\n" + "="*60)
    print("DEMO 2: Anonimización Selectiva")
    print("="*60)

    print("\n[*] Anonimizando solo nombre, email y RUT...")
    anonymize_file(
        'example_data.csv',
        output_file='example_data_selective.csv',
        columns=['nombre', 'email', 'rut'],
        save_mapping=True
    )

    print("\n[*] Resultado (solo 3 columnas anonimizadas):")
    df = pd.read_csv('example_data_selective.csv')
    print(df.to_string(index=False))
    print("\n[*] Nota: 'apellido', 'telefono' y 'direccion' conservan valores originales")


def demo_consistency():
    """Demo 3: Consistencia en datos repetidos"""
    print("\n" + "="*60)
    print("DEMO 3: Consistencia en Datos Repetidos")
    print("="*60)

    # Crear datos con duplicados
    data = {
        'nombre': ['Juan Pérez', 'María García', 'Juan Pérez', 'Carlos López'],
        'email': ['juan@mail.com', 'maria@mail.com', 'juan@mail.com', 'carlos@mail.com'],
        'ciudad': ['Santiago', 'Valparaíso', 'Santiago', 'Santiago']
    }
    df = pd.DataFrame(data)

    print("\n[ORIGINAL - Con datos repetidos]")
    print(df.to_string(index=False))

    df.to_csv('demo_duplicates.csv', index=False)
    anonymize_file('demo_duplicates.csv', save_mapping=False)

    df_anonimizado = pd.read_csv('demo_duplicates_anonymized.csv')

    print("\n[ANONIMIZADO - Mantiene consistencia]")
    print(df_anonimizado.to_string(index=False))

    print("\n[*] Observa que:")
    print("  - 'Juan Pérez' aparece como 'Persona_001' en ambas filas (consistente)")
    print("  - 'juan@mail.com' es 'correo_001...' en ambas filas")
    print("  - 'Santiago' es 'Ubicacion_001' en las 3 filas donde aparece")


def demo_reuse_mappings():
    """Demo 4: Reutilizar mapeos en otro archivo"""
    print("\n" + "="*60)
    print("DEMO 4: Reutilización de Mapeos")
    print("="*60)

    # Primer archivo (si existe)
    if Path('example_data.csv').exists():
        print("\n[*] Primer archivo ya anonimizado con mapeos")
        print("    (revisamos si existe example_data_anonymized_mappings.json)")

        if Path('example_data_anonymized_mappings.json').exists():
            print("\n[*] Reutilizando mapeos para nuevo archivo...")

            data2 = {
                'nombre': ['Juan Pérez', 'Ana Rodríguez', 'María García'],
                'email': ['juan.perez@mail.com', 'ana@mail.com', 'maria.garcia@mail.com'],
                'asunto': ['Consulta 1', 'Consulta 2', 'Consulta 3']
            }
            df2 = pd.DataFrame(data2)
            df2.to_csv('demo_nuevo_archivo.csv', index=False)

            print("\n[ORIGINAL - Nuevo archivo]")
            print(df2.to_string(index=False))

            anonymize_file(
                'demo_nuevo_archivo.csv',
                mapping_file='example_data_anonymized_mappings.json',
                save_mapping=False
            )

            df2_anonimizado = pd.read_csv('demo_nuevo_archivo_anonymized.csv')
            print("\n[ANONIMIZADO - Con mapeos reutilizados]")
            print(df2_anonimizado.to_string(index=False))

            print("\n[*] Nota:")
            print("  - 'Juan Pérez' usa el mismo código que en el primer archivo")
            print("  - 'María García' también mantiene su código original")
            print("  - 'Ana Rodríguez' es nueva -> obtiene nuevo código")


def main():
    print("\n" + "#"*60)
    print("# DEMOSTRACIÓN: ANONIMIZADOR DE DATOS")
    print("#"*60)

    demos = [
        ("1", "Anonimización Básica", demo_basic),
        ("2", "Anonimización Selectiva (columnas específicas)", demo_selective),
        ("3", "Consistencia en Datos Repetidos", demo_consistency),
        ("4", "Reutilización de Mapeos", demo_reuse_mappings),
        ("0", "Ejecutar todas las demos", None),
    ]

    print("\nDEMOS DISPONIBLES:\n")
    for code, desc, _ in demos:
        print(f"  [{code}] {desc}")

    while True:
        try:
            choice = input("\nSelecciona demo (0-4) o 'q' para salir: ").strip().lower()

            if choice == 'q':
                print("\n[*] Saliendo...")
                break

            if choice == '0':
                for code, _, func in demos:
                    if func is not None:
                        func()
                        input("\nPresiona Enter para siguiente demo...")
                break

            for code, desc, func in demos:
                if choice == code and func is not None:
                    func()
                    break

        except KeyboardInterrupt:
            print("\n\n[*] Demo interrumpida")
            break
        except Exception as e:
            print(f"\n[ERROR] {str(e)}")

    print("\n" + "#"*60)
    print("# FIN DE LA DEMOSTRACIÓN")
    print("#"*60)


if __name__ == '__main__':
    main()
