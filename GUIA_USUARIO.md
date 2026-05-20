# Guía de Uso: Anonimizador de Datos

## Instalación Rápida

```bash
pip install -r requirements.txt
```

## Uso Básico

### 1. Anonimizar archivo completo

```bash
python anonymizer.py datos.csv
```

Genera:
- `datos_anonymized.csv` (datos anonimizados)
- `datos_anonymized_mappings.json` (diccionario de mapeos)

### 2. Anonimizar columnas específicas

Solo anonimizar columnas de información personal:

```bash
python anonymizer.py datos.xlsx salida.xlsx -c nombre,apellido,email,rut
```

### 3. Reutilizar mapeos en otro archivo

Si tienes múltiples archivos y quieres aplicar el mismo mapeo:

```bash
# Primer archivo
python anonymizer.py datos_2024.csv

# Usar los mapeos para otro archivo
python anonymizer.py datos_2025.csv -m datos_2024_anonymized_mappings.json
```

**Importante:** Asegura que los datos se reemplacen consistentemente. Ej: "Juan" siempre será "Persona_001".

## Casos de Uso

### Caso 1: Anonimizar relatos de casos

```bash
python anonymizer.py relatos_casos.csv relatos_casos_anonimizado.csv \
  -c nombre_demandante,apellido_demandante,nombre_demandado,email_contacto,ubicacion
```

### Caso 2: Preparar datos para análisis

```bash
python anonymizer.py datos_completos.xlsx datos_para_analisis.xlsx
```

**Resultado:** Todos los datos sensibles quedan anonimizados, seguro para compartir.

### Caso 3: Anonimizar manteniendo solo ciertos campos

```bash
python anonymizer.py datos.csv -c rut,email
```

Los demás campos (nombre, apellido, etc.) se mantienen originales.

## Entender los Mapeos

El archivo `*_mappings.json` contiene la traducción de datos originales a anonimizados:

```json
{
  "person_juan pérez": "Persona_001",
  "person_maría garcía": "Persona_002",
  "email_juan.perez@mail.com": "correo_001@anonimizado.local",
  "rut_12.345.678-9": "RUT_001",
  "location_santiago": "Ubicacion_001"
}
```

**¿Por qué guardarlo?**
- Auditoría: Saber exactamente qué se reemplazó
- Recuperación: Si necesitas volver a datos originales (mantener seguro)
- Reutilización: Aplicar el mismo mapeo a otros archivos

## Formato de Anonimización

| Dato Original | Tipo Detectado | Anonimizado |
|---|---|---|
| Juan Pérez | Nombre | Persona_001 |
| 12.345.678-9 | RUT | RUT_001 |
| juan@mail.com | Email | correo_001@anonimizado.local |
| +56 9 1234 5678 | Teléfono | +56-9-XXXX-0001 |
| Calle Principal 123 | Ubicación | Ubicacion_001 |

## Preguntas Frecuentes

### ¿Qué pasa si un nombre aparece múltiples veces?

Si "Juan García" aparece en 3 filas diferentes, será reemplazado por "Persona_001" en las 3 filas.

```csv
# ANTES:
nombre,email
Juan García,juan@mail.com
Juan García,j.garcia@empresa.cl

# DESPUÉS:
nombre,email
Persona_001,correo_001@anonimizado.local
Persona_001,correo_002@anonimizado.local
```

### ¿Puedo anonimizar solo algunos campos?

Sí, usa la opción `-c`:

```bash
python anonymizer.py datos.csv -c rut,email
```

### ¿Qué formatos soporta?

- CSV (.csv)
- Excel 2007+ (.xlsx)
- Excel 97-2003 (.xls)

### ¿Cómo garantizo máxima privacidad?

1. **Especifica columnas manualmente** (mejor que detección automática):
   ```bash
   python anonymizer.py datos.xlsx -c nombre,apellido,rut,email,direccion
   ```

2. **Guarda los mapeos en lugar seguro** (encriptado o acceso restringido)

3. **Verifica el resultado** antes de compartir:
   ```bash
   head -20 datos_anonymized.csv
   ```

### ¿Qué pasa con los datos anonimizados?

Ya no hay forma de recuperar el dato original sin el archivo `_mappings.json`. Por eso:

- Mantén `_mappings.json` en lugar seguro si necesitas recuperar
- Si no lo necesitas, puedes eliminar el archivo de mapeos
- Compartir solo el CSV anonimizado es seguro (sin mapeos)

### ¿Hay falsos positivos?

Sí, en algunos casos:
- "Reforma" podría detectarse como nombre
- "Nueva York" podría anonimizarse como ubicación

**Solución:** Especifica columnas manualmente:
```bash
python anonymizer.py datos.csv -c nombre,apellido
```

### ¿Cómo integro esto con mi workflow?

```python
from anonymizer import anonymize_file

# En tu código Python
anonymize_file(
    input_file='datos/casos.csv',
    output_file='datos/casos_anonimizado.csv',
    columns=['nombre', 'apellido', 'rut'],
    save_mapping=True
)
```

## Seguridad y Privacidad

⚠️ **IMPORTANTE:**

1. **Nunca compartas `_mappings.json`** públicamente (contiene relación original → anonimizado)

2. **Verifica el resultado** siempre antes de usar:
   ```bash
   # Revisar primeras líneas
   head -5 datos_anonymized.csv
   ```

3. **Para máxima seguridad:**
   - Anonimiza columnas específicas (no todas)
   - Elimina el archivo de mapeos después de anonimizar (si no lo necesitas)
   - Encripta los archivos anonimizados si contienen datos sensibles

## Ejemplos Prácticos

### Ejemplo 1: Datos médicos

```bash
python cli.py pacientes.csv pacientes_anonimizado.csv \
  -c nombre,apellido,rut,email,telefono,direccion,fecha_nacimiento
```

### Ejemplo 2: Casos legales

```bash
python cli.py demandas.xlsx demandas_anonimizado.xlsx \
  -c nombre_demandante,apellido_demandante,nombre_demandado,apartado_demandado,email
```

### Ejemplo 3: Encuestas

```bash
python cli.py respuestas_encuesta.csv respuestas_anonimizado.csv \
  -c nombre_respondente,email_respondente,ubicacion
```

## Troubleshooting

### Error: "Archivo no encontrado"
Verifica que la ruta sea correcta y que el archivo exista.

### Error: "UnicodeDecodeError"
El archivo usa otra codificación. Modifica `anonymizer.py`:
```python
df = pd.read_csv(input_file, encoding='latin-1')
```

### El resultado no se ve anonimizado
Probablemente no se detectó el patrón. Usa `-c` para especificar columnas:
```bash
python cli.py datos.csv -c nombre,email,rut
```

### Los archivos Excel salen dañados
Intenta guardar como CSV en su lugar.

## Documentación Completa

Ver `README.md` para detalles técnicos.
