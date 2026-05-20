# 🔐 Anonimizador de Datos Confidenciales

Herramienta Python para anonimizar datos sensibles en archivos CSV/Excel, manteniendo consistencia en datos repetidos.

## Características

✅ **Detección automática de datos sensibles:**
- Nombres y apellidos
- RUT (Rol Único Tributario chileno)
- Correos electrónicos
- Números de teléfono
- Ubicaciones y direcciones

✅ **Anonimización consistente:** Si "Juan García" aparece 3 veces, se reemplaza por "Persona_001" en las 3 ocasiones.

✅ **Mapeo auditado:** Genera archivo JSON con diccionario de mapeos para referencia.

✅ **Múltiples formatos:** Soporta CSV y Excel (.xlsx, .xls).

## Instalación

```bash
pip install -r requirements.txt
```

## Uso

### Opción 1: Línea de comandos

Anonimizar todas las columnas:
```bash
python anonymizer.py datos.csv
# Genera: datos_anonymized.csv y datos_anonymized_mappings.json
```

Anonimizar columnas específicas:
```bash
python anonymizer.py datos.xlsx salida.xlsx nombre,apellido,email
```

### Opción 2: Desde código Python

```python
from anonymizer import anonymize_file

anonymize_file(
    input_file='datos.csv',
    output_file='datos_anonimizado.csv',
    columns=['nombre', 'apellido', 'correo'],
    save_mapping=True
)
```

### Opción 3: Usar clase DataAnonymizer

```python
from anonymizer import DataAnonymizer
import pandas as pd

df = pd.read_csv('datos.csv')
anonymizer = DataAnonymizer()

df_anonimizado = anonymizer.anonymize_dataframe(df)
anonymizer.save_mappings('mapeos.json')
```

## Formatos de anonimización

| Tipo detectado | Ejemplo original | Ejemplo anonimizado |
|---|---|---|
| Nombres | Juan Pérez | Persona_001 |
| RUT | 12.345.678-9 | RUT_001 |
| Email | juan@example.com | correo_001@anonimizado.local |
| Teléfono | +56 9 1234 5678 | +56-9-XXXX-0001 |
| Ubicación | Santiago, calle Principal | Ubicacion_001 |

## Archivo de mapeos

Se genera automáticamente con nombre `[archivo]_mappings.json`:

```json
{
  "person_juan pérez": "Persona_001",
  "person_maría garcía": "Persona_002",
  "rut_12.345.678-9": "RUT_001",
  "email_juan@example.com": "correo_001@anonimizado.local",
  "location_santiago": "Ubicacion_001"
}
```

## Reutilizar mapeos

Para anonimizar otro archivo con los mismos mapeos:

```bash
python anonymizer.py nuevo_archivo.csv nueva_salida.csv --mapping datos_anonymized_mappings.json
```

## Ejemplos

### CSV simple
```csv
nombre,apellido,email,rut
Juan,Pérez,juan@example.com,12.345.678-9
María,García,maria@example.com,98.765.432-1
```

**Resultado:**
```csv
nombre,apellido,email,rut
Persona_001,Persona_002,correo_001@anonimizado.local,RUT_001
Persona_003,Persona_004,correo_002@anonimizado.local,RUT_002
```

## Notas importantes

⚠️ **Seguridad:**
- Guarda los archivos de mapeos en ubicación segura si necesitas recuperar datos originales
- No compartas los JSON de mapeos públicamente
- Considera encriptar los archivos de mapeos

⚠️ **Limitaciones:**
- Anonimiza basado en patrones (pueden haber falsos positivos/negativos)
- Para máxima precisión, especifica columnas a anonimizar manualmente

## Troubleshooting

**Problema:** `UnicodeDecodeError` al leer CSV
**Solución:** El archivo probablemente usa otra codificación. Modifica la línea en `anonymizer.py`:
```python
df = pd.read_csv(input_file, encoding='latin-1')  # o 'iso-8859-1'
```

**Problema:** Excel dice que el archivo está dañado
**Solución:** Intenta guardar como CSV en lugar de .xlsx

## Licencia
Uso libre para datos sensibles y confidenciales.
