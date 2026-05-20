# Estructura del Proyecto

```
anonimizar/
├── anonymizer.py                    # Módulo principal de anonimización
├── cli.py                           # Interfaz de línea de comandos mejorada
├── demo.py                          # Demostración interactiva
│
├── QUICKSTART.md                    # Guía de inicio (5 minutos)
├── GUIA_USUARIO.md                  # Guía completa de uso
├── README.md                        # Documentación técnica
├── ESTRUCTURA.md                    # Este archivo
│
├── example_data.csv                 # Datos de ejemplo para pruebas
├── example_data_anonymized.csv      # Resultado del ejemplo
├── example_data_anonymized_mappings.json  # Mapeos del ejemplo
│
├── requirements.txt                 # Dependencias Python
└── .gitignore                       # Git ignore (no commitear datos)
```

## Descripción de Archivos

### Core (Módulos ejecutables)

| Archivo | Descripción | Uso |
|---|---|---|
| `anonymizer.py` | Módulo principal con clase `DataAnonymizer` | `python anonymizer.py archivo.csv` |
| `cli.py` | CLI mejorada con argumentos | `python cli.py -h` (ver opciones) |
| `demo.py` | Demo interactiva | `python demo.py` |

### Documentación

| Archivo | Público | Propósito |
|---|---|---|
| `QUICKSTART.md` | ✅ Sí | Para empezar en 5 minutos |
| `GUIA_USUARIO.md` | ✅ Sí | Manual completo de uso |
| `README.md` | ✅ Sí | Documentación técnica |
| `ESTRUCTURA.md` | ✅ Sí | Este archivo |

### Datos (Ejemplos)

| Archivo | Tipo | Notas |
|---|---|---|
| `example_data.csv` | CSV original | Datos ficticios para pruebas |
| `example_data_anonymized.csv` | CSV anonimizado | Resultado después de procesar |
| `example_data_anonymized_mappings.json` | JSON | Mapeo: original → anonimizado |

### Configuración

| Archivo | Propósito |
|---|---|
| `requirements.txt` | Dependencias Python |
| `.gitignore` | Archivos a ignorar en Git |

---

## Cómo Usar Cada Componente

### 1. Para uso simple (línea de comandos)

```bash
python anonymizer.py datos.csv
```

### 2. Para uso avanzado (con opciones)

```bash
python cli.py datos.csv -c nombre,email,rut -o salida.csv
```

### 3. Para integrar en tu código Python

```python
from anonymizer import anonymize_file, DataAnonymizer

anonymize_file('datos.csv')
```

### 4. Para entender el funcionamiento

```bash
python demo.py
```

---

## Flujo de Trabajo Típico

```
Datos originales (confidenciales)
    ↓
    ├─→ anonymizer.py
    │   ├─→ Detecta datos sensibles
    │   ├─→ Crea mapeos consistentes
    │   └─→ Genera salida anonimizada
    ↓
Datos anonimizados (seguro compartir)
Mapeos guardados (seguro guardado)
```

---

## Extensiones Posibles

### Si necesitas agregar más tipos de datos

Edita `anonymizer.py`:

```python
def detect_ip_address(self, value: str) -> bool:
    """Detecta direcciones IP"""
    ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    return bool(re.search(ip_pattern, value))
```

### Si necesitas cambiar el formato de anonimización

Edita `anonymize_value()` en `anonymizer.py`:

```python
# Cambiar "Persona_001" a "P001" o lo que quieras
self.mappings[key] = f"P{count:03d}"
```

### Si necesitas exportar a otro formato

Modifica la función `anonymize_file()`:

```python
# Agregar soporte a Parquet, JSON, etc.
if output_path.suffix.lower() == '.parquet':
    df_anonymized.to_parquet(output_file)
```

---

## Notas de Seguridad

⚠️ **Importante:**

1. Los mapeos (`*_mappings.json`) son **la llave para desencriptar**
   - Guarda en lugar seguro
   - No compartas públicamente

2. Una vez anonimizado sin mapeos, es imposible recuperar
   - Elimina mapeos si no los necesitas
   - Mejor seguridad = sin forma de revertir

3. Verifica siempre antes de compartir:
   ```bash
   head datos_anonymized.csv
   ```

---

## Actualizar el Proyecto

Para mantener el proyecto actualizado:

1. Instala dependencias nuevas:
   ```bash
   pip install -r requirements.txt --upgrade
   ```

2. Prueba con tus datos:
   ```bash
   python anonymizer.py tu_archivo.csv
   ```

3. Verifica el resultado:
   ```bash
   head -5 tu_archivo_anonymized.csv
   ```

---

## Soporte

- **Error en detección?** → Usa `-c` para especificar columnas
- **Archivo corrupto?** → Intenta convertir a CSV primero
- **¿Cómo reutilizar mapeos?** → Ver `GUIA_USUARIO.md` sección "Reutilizar mapeos"

---

¡Listo! El proyecto está completamente estructurado. 🎉
