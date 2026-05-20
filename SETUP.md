# 🚀 Instalación y Configuración del Anonimizador

## Requisitos Previos

- Python 3.8+
- pip (gestor de paquetes de Python)

## Instalación Inicial

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Descargar modelo de spaCy
```bash
python -m spacy download es_core_news_sm
```

## 🖥️ Ejecutar la Aplicación

### Opción 1: Desde el Escritorio (Windows)
Se han creado accesos directos en tu escritorio:

- **Anonimizador - Gestor.lnk** ⭐ (Recomendado)
  - Abre un menú interactivo para iniciar/detener el servidor
  - Mejor para evitar que el proceso se quede corriendo indefinidamente

- **Anonimizador - Directo.lnk**
  - Inicia la app directamente sin menú
  - Presiona Ctrl+C para detener

### Opción 2: Script Batch
```bash
manage_server.bat
```
Proporciona un menú interactivo para gestionar el servidor.

### Opción 3: Línea de Comandos
```bash
python -m streamlit run app.py
```

## 📝 Primeros Pasos

1. **Sube un archivo** en la pestaña "📤 Subir Archivo"
2. **Configura las columnas** en "👁️ Vista Previa"
3. **Anonimiza** haciendo clic en el botón principal
4. **Descarga los resultados** en "💾 Descargar"
5. **Detén el servidor** con el botón "🛑 Detener Servidor" o Ctrl+C

## 🛠️ Estructura del Proyecto

```
anonimizar/
├── app.py                    # Aplicación Streamlit principal
├── anonymizer.py             # Lógica de anonimización
├── manage_server.bat         # Gestor interactivo del servidor
├── requirements.txt          # Dependencias de Python
├── README.md                 # Documentación completa
└── SETUP.md                  # Este archivo
```

## 🔐 Notas Importantes

- **100% Local**: Los datos nunca se envían a internet
- **Mapeos**: Guarda los archivos JSON de mapeos en lugar seguro
- **Reversibilidad**: Sin los mapeos no se pueden recuperar datos originales
- **Formatos soportados**: CSV, XLSX, XLS

## 📞 Soporte

Para más información, consulta:
- **README.md** - Documentación completa
- **Pestaña Ayuda** - Dentro de la aplicación

---

**Versión**: 1.0  
**Última actualización**: 2026-05-20
