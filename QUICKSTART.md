# Inicio Rápido (5 minutos)

## Paso 1: Instalar dependencias

```bash
pip install pandas openpyxl
```

## Paso 2: Anonimizar tu archivo

### Opción A: CSV

```bash
python anonymizer.py tu_archivo.csv
```

### Opción B: Excel

```bash
python anonymizer.py tu_archivo.xlsx
```

### Opción C: Con columnas específicas

```bash
python anonymizer.py tu_archivo.csv -c nombre,apellido,email,rut
```

## Paso 3: ¡Listo!

Se generarán:
- ✅ `tu_archivo_anonymized.csv` (datos anonimizados)
- ✅ `tu_archivo_anonymized_mappings.json` (diccionario de mapeos)

---

## Ejemplos Prácticos

### Anonimizar relatos de casos

```bash
python anonymizer.py casos.xlsx -c nombre,apellido,rut,email,ubicacion
```

### Anonimizar solo datos sensibles

```bash
python anonymizer.py pacientes.csv -c nombre,apellido,rut,telefono
```

### Reutilizar mapeos en otro archivo

```bash
# Primer archivo
python anonymizer.py datos_2024.csv

# Usar los mapeos para otro archivo (mismo resultado de mapeo)
python anonymizer.py datos_2025.csv -m datos_2024_anonymized_mappings.json
```

---

## ¿Qué se anonimiza automáticamente?

| Dato | Ejemplo Original | Ejemplo Anonimizado |
|---|---|---|
| Nombres | Juan Pérez | Persona_001 |
| RUT | 12.345.678-9 | RUT_001 |
| Email | juan@mail.com | correo_001@anonimizado.local |
| Teléfono | +56 9 1234 5678 | +56-9-XXXX-0001 |
| Ubicación | Calle Principal, Santiago | Ubicacion_001 |

---

## ¿Cómo uso los resultados?

### Compartir datos seguros

```bash
# Anonimiza
python anonymizer.py datos_originales.xlsx

# Comparte solo el archivo anonimizado
# (no compartas los mapeos si quieres máxima privacidad)
```

### Recuperar datos originales

Los mapeos se guardan en `*_mappings.json`:

```json
{
  "person_juan pérez": "Persona_001",
  "email_juan@mail.com": "correo_001@anonimizado.local",
  ...
}
```

Usa esto solo si necesitas recuperar el original (mantén seguro).

---

## Necesitas ayuda?

### Ver todas las opciones

```bash
python cli.py --help
```

### Demo interactiva

```bash
python demo.py
```

### Documentación completa

Ver `GUIA_USUARIO.md` y `README.md`

---

## Casos de Uso Comunes

### 📋 Análisis de datos (sin datos personales)

```bash
python anonymizer.py datos.csv
# Compartir: datos_anonymized.csv
# Eliminar: datos_anonymized_mappings.json
```

### 🏥 Datos médicos

```bash
python anonymizer.py pacientes.csv -c nombre,apellido,rut,email,telefono
```

### ⚖️ Casos legales

```bash
python anonymizer.py demandas.xlsx -c demandante,demandado,abogado,email
```

### 📊 Auditoría

```bash
python anonymizer.py auditoria.csv
# Guardar: auditoria_anonymized_mappings.json (seguro)
# Compartir: auditoria_anonymized.csv
```

---

## Seguridad: 3 Reglas de Oro

1. ✅ **Verifica antes de compartir**
   ```bash
   head -5 datos_anonymized.csv
   ```

2. ⚠️ **Nunca compartas los mapeos** públicamente
   - Son la clave para desencriptar los datos
   - Mantén seguros si necesitas recuperar

3. 🔒 **Especifica columnas manualmente** para máxima precisión
   ```bash
   python anonymizer.py datos.csv -c nombre,email,rut
   ```

---

¡Listo! Tu proyecto de anonimización está configurado. 🎉
