# 🔐 Anonimizador de Datos Confidenciales

Una herramienta web local para anonimizar datos confidenciales (nombres, RUT, correos, teléfonos, ubicaciones) manteniendo la consistencia de los datos.

## ✨ Características

- **100% Local**: Todos los datos se procesan en tu computadora, sin envío a ningún servidor en la nube
- **Detección Automática**: Identifica automáticamente nombres, RUT, correos, teléfonos, ubicaciones y direcciones
- **Consistencia**: Los mismos datos reciben siempre el mismo valor anonimizado
- **Múltiples Formatos**: Soporta archivos CSV y Excel
- **Mapeos Reversibles**: Descarga un archivo JSON con los mapeos para recuperar datos si es necesario
- **Interfaz Web**: Interfaz moderna y fácil de usar con Streamlit
- **Progreso en Tiempo Real**: Barra de progreso durante la anonimización
- **Selección Selectiva**: Elige qué columnas deseas anonimizar
- **Gestión de Servidor**: Herramienta para fácil inicio/parada del servidor

## 🚀 Instalación

### Requisitos previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos

1. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Descargar modelo spaCy**:
   ```bash
   python -m spacy download es_core_news_sm
   ```

## 📱 Uso

### Opción 1: Usar el gestor de servidor (Recomendado para Windows)

Este script te permite iniciar/detener el servidor de forma fácil y evita que el proceso se quede corriendo continuamente.

```bash
manage_server.bat
```

**Opciones del menú:**
- Presiona `1` para iniciar el servidor (abre en `http://localhost:8501`)
- Presiona `Ctrl+C` en la terminal cuando termines para detener
- Presiona `3` para salir del gestor

### Opción 2: Iniciar directamente

```bash
python -m streamlit run app.py
```

Para detener: presiona `Ctrl+C` en la terminal o usa el botón **"🛑 Detener Servidor"** en la barra lateral de la app.

## 📋 Flujo de Uso

### Paso 1: Subir Archivo
1. Ve a la pestaña **"📤 Subir Archivo"**
2. Arrastra o selecciona un archivo CSV o Excel
3. El app mostrará un resumen del archivo

### Paso 2: Configurar y Anonimizar
1. Ve a la pestaña **"👁️ Vista Previa"**
2. Selecciona las columnas que deseas anonimizar (o usa todas)
3. Elige si deseas guardar los mapeos (recomendado)
4. Haz clic en **"🚀 Anonimizar"**
5. Verás una barra de progreso con el % de avance

### Paso 3: Descargar Resultados
1. Ve a la pestaña **"💾 Descargar"**
2. Descarga los datos anonimizados en tu formato preferido:
   - **CSV**: Para abrir en Excel, Google Sheets, etc.
   - **Excel**: Formato .xlsx
3. Descarga los mapeos **(JSON)** si los habilitaste en Paso 2
   - Guárdalos en lugar seguro si necesitas recuperar datos

### Paso 4: Detener el Servidor
- Haz clic en **"🛑 Detener Servidor"** en la barra lateral, o
- Presiona `Ctrl+C` en la ventana del terminal

## 🔍 Qué se Detecta Automáticamente

| Tipo de Dato | Ejemplo Original | Ejemplo Anonimizado |
|---|---|---|
| **Nombres y Apellidos** | Juan Pérez García | Persona_001 |
| **RUT Chileno** | 12.345.678-9 | RUT_001 |
| **Correos Electrónicos** | juan.perez@mail.com | correo_001@anonimizado.local |
| **Teléfonos** | +56 9 1234 5678 | +56-9-XXXX-0001 |
| **Ubicaciones** | Santiago, Región Metropolitana | Ubicacion_001 |
| **Direcciones** | Calle Principal 123, Apt 4 | Direccion_001 |

## 🔒 Seguridad

### ✅ Lo que garantizamos
- **100% Local**: No hay conexión a internet
- **Sin almacenamiento en servidor**: Los datos no se guardan en ningún servidor
- **Sin registro**: No se registran las anonimizaciones
- **Datos temporales**: Los archivos temporales se eliminan automáticamente

### Recomendaciones de Seguridad

1. **Nunca compartas los mapeos públicamente**: El archivo `datos_anonymized_mappings.json` es la clave para desencriptar los datos
2. **Almacena los mapeos de forma segura**: Si necesitas recuperar datos más adelante, guarda el JSON en un lugar seguro
3. **Revisa siempre el resultado**: Antes de descargar, verifica en la vista previa que los datos sensibles estén anonimizados
4. **Para máxima seguridad**:
   - Anonimiza en un servidor seguro o computadora personal
   - No almacenes los datos anonimizados + mapeos juntos
   - Encripta el archivo de mapeos con contraseña

## 📊 Ejemplo Completo de Anonimización

### Antes (Datos Originales)
```csv
Nombre,Apellido,Email,RUT,Ubicación,Relato
Juan,Pérez,juan@mail.com,12.345.678-9,Santiago,"Denancia de Juan Pérez en Santiago sobre..."
María,García,maria@mail.com,98.765.432-1,Valparaíso,"María García reportó en Valparaíso que..."
```

### Después (Anonimizado)
```csv
Nombre,Apellido,Email,RUT,Ubicación,Relato,Relato_Anonimizado
Persona_001,Persona_001,correo_001@anonimizado.local,RUT_001,Ubicacion_001,"Denancia de Juan Pérez en Santiago sobre...","Denancia de Persona_001 en Ubicacion_001 sobre..."
Persona_002,Persona_002,correo_002@anonimizado.local,RUT_002,Ubicacion_002,"María García reportó en Valparaíso que...","Persona_002 reportó en Ubicacion_002 que..."
```

### Archivo de Mapeos (datos_anonymized_mappings.json)
```json
{
  "person_juan": "Persona_001",
  "person_maría": "Persona_002",
  "email_juan@mail.com": "correo_001@anonimizado.local",
  "email_maria@mail.com": "correo_002@anonimizado.local",
  "rut_12.345.678-9": "RUT_001",
  "rut_98.765.432-1": "RUT_002",
  "location_santiago": "Ubicacion_001",
  "location_valparaíso": "Ubicacion_002"
}
```

## 🛠️ Solución de Problemas

### El servidor sigue corriendo después de cerrar
**Solución 1:** Usa el gestor de servidor
```bash
manage_server.bat
# Selecciona opción 2 para detener
```

**Solución 2:** Desde terminal (Windows)
```bash
taskkill /F /IM python.exe /FI "COMMANDLINE like *streamlit*"
```

### No se detectan ciertos datos
- Asegúrate de que están en las columnas seleccionadas
- Verifica que los datos sigan el formato esperado
- Algunos nombres locales pueden no reconocerse si no están en la base de datos interna

### El app va lento
- Reduce el tamaño del archivo (máx 50 MB recomendado)
- Usa menos columnas para anonimizar
- Cierra otras aplicaciones pesadas

### Error: "No module named 'spacy'"
Instala las dependencias:
```bash
pip install -r requirements.txt
python -m spacy download es_core_news_sm
```

### El servidor no inicia con manage_server.bat
1. Asegúrate de tener Python instalado: `python --version`
2. Instala las dependencias: `pip install -r requirements.txt`
3. Intenta abrir el .bat como administrador

## 📦 Archivos Principales

| Archivo | Descripción |
|---|---|
| **app.py** | Interfaz web principal (Streamlit) |
| **anonymizer.py** | Lógica de detección y anonimización con NLP |
| **manage_server.bat** | Gestor interactivo del servidor (Windows) |
| **requirements.txt** | Dependencias de Python |
| **README.md** | Este archivo |

## 📞 Ayuda y Soporte

Para preguntas sobre la anonimización dentro de la aplicación:
- Ve a la pestaña **"ℹ️ Ayuda"** 
- Consulta las secciones FAQ, Seguridad y Ejemplos

## 🆘 Errores Frecuentes

| Error | Solución |
|---|---|
| `ModuleNotFoundError: No module named 'streamlit'` | Ejecuta: `pip install -r requirements.txt` |
| `AttributeError: 'dict' has no attribute 'columns'` | Reinicia la sesión con el botón "🔄 Limpiar Sesión" |
| `File not found` al subir archivo | Verifica que el archivo sea válido CSV o Excel |
| App muy lento | Reduce el tamaño del archivo o número de columnas |

---

**Creado con ❤️ | 100% Local | 🔐 Datos Seguros | v1.0**
