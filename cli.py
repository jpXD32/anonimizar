#!/usr/bin/env python3
"""
CLI mejorada para anonimizar datos confidenciales
"""

import argparse
import sys
from pathlib import Path
from anonymizer import anonymize_file, DataAnonymizer

def main():
    parser = argparse.ArgumentParser(
        description='Anonimizador de datos confidenciales (nombres, RUT, emails, teléfonos, ubicaciones)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EJEMPLOS:

  Anonimizar todo el archivo:
    python cli.py datos.csv

  Anonimizar columnas específicas:
    python cli.py datos.xlsx salida.xlsx -c nombre,apellido,email

  Reutilizar mapeos previos:
    python cli.py nuevo_datos.csv -m datos_anonymized_mappings.json

  Especificar ubicación de salida:
    python cli.py datos.csv -o resultados/datos_anonimizado.csv
        """
    )

    parser.add_argument(
        'input_file',
        help='Archivo de entrada (CSV o Excel)'
    )

    parser.add_argument(
        'output_file',
        nargs='?',
        default=None,
        help='Archivo de salida (opcional, por defecto: input_anonymized.ext)'
    )

    parser.add_argument(
        '-c', '--columns',
        type=str,
        default=None,
        help='Columnas a anonimizar separadas por coma (ej: nombre,email,rut)'
    )

    parser.add_argument(
        '-m', '--mapping',
        type=str,
        default=None,
        help='Archivo JSON con mapeos previos para aplicar consistentemente'
    )

    parser.add_argument(
        '-o', '--output',
        type=str,
        default=None,
        dest='output_explicit',
        help='Especificar ubicación del archivo de salida'
    )

    parser.add_argument(
        '--no-mapping-file',
        action='store_true',
        help='No generar archivo de mapeos (por defecto se genera)'
    )

    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Mostrar información detallada durante el proceso'
    )

    args = parser.parse_args()

    input_file = args.input_file
    output_file = args.output_explicit or args.output_file
    columns = args.columns.split(',') if args.columns else None
    mapping_file = args.mapping

    if not Path(input_file).exists():
        print(f"[ERROR] Archivo no encontrado: {input_file}", file=sys.stderr)
        return 1

    try:
        anonymize_file(
            input_file=input_file,
            output_file=output_file,
            columns=columns,
            mapping_file=mapping_file,
            save_mapping=not args.no_mapping_file
        )
        return 0
    except Exception as e:
        print(f"[ERROR] {str(e)}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
