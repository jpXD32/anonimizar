# 🔐 Anonimizador de Datos v3.2

**Herramienta de anonimización local (100% privacidad) para proteger datos sensibles en archivos CSV/Excel.**

> ✅ **System Status**: HEALTHY & OPERATIONAL (May 23, 2026 - 01:17:41)  
> All 4 improvements implemented and tested ✅

---

## 📚 Essential Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[SYSTEM_STATUS.md](SYSTEM_STATUS.md)** | Current system health, config, improvements | Everyone |
| **[CONFIDENCE_MODES_GUIDE.md](CONFIDENCE_MODES_GUIDE.md)** | How to use 🛡️ Conservative / ⚖️ Standard / 🔍 Aggressive modes | End users |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Common issues & solutions | Developers |

---

## 📁 Estructura del Proyecto

```
C:\Proyectos\anonimizar\
│
├── 🔴 anonymizer.py          ← PRINCIPAL: Motor de anonimización (v3.2)
├── 🟢 run_app.py             ← Script para iniciar los servidores
│
├── 📁 frontend/              ← Aplicación web (Next.js) - localhost:3000
│   ├── app/                  ← Páginas: dashboard, help
│   ├── components/           ← Componentes React
│   ├── store/                ← Estado global (Zustand)
│   ├── lib/                  ← API client
│   └── package.json          ← Dependencias Node
│
├── 📁 backend/               ← API REST (Flask) - localhost:5000
│   └── app.py                ← Endpoints: /api/anonymize, /api/download
│
├── 📁 scripts/               ← Utilidades
│   ├── cli.py                ← Interfaz línea de comandos
│   ├── demo.py               ← Demostración
│   └── security_checks.py    ← Validaciones
│
├── 📁 docs/                  ← Documentación
│   ├── MEJORAS_FASE2.md      ← v3.2 improvements
│   ├── STATUS_FINAL.md       ← v2.0 status
│   └── EJEMPLO_ANTES_DESPUES.md ← Use cases
│
└── 📁 _archive/              ← Versiones ANTIGUAS (NO usar)
    ├── anonymizer_v2.py      ← Versión anterior
    ├── app_streamlit.py      ← Streamlit descontinuado
    └── anonymizer.py.backup  ← Respaldo

---

## 🚀 INICIO RÁPIDO

### 1️⃣ Iniciar Servidores
```bash
npm run dev          # En frontend/ → http://localhost:3000
python backend/app.py  # En otra terminal → http://localhost:5000
```

### 2️⃣ Ir a la Aplicación
**Abre: http://localhost:3000/**

### 3️⃣ Cargar Archivo y Anonimizar
1. Click "Comenzar ahora" o "Dashboard"
2. Sube un archivo CSV/Excel
3. Selecciona **Nivel de Detección:**
   - 🛡️ Conservador (95%) - Máxima precisión
   - ⚖️ Estándar (90%) - Balance óptimo ⭐ DEFAULT
   - 🔍 Agresivo (80%) - Máxima detección
4. Elige columnas → "Comenzar anonimización"
5. Descarga resultado

---

## 📊 Capacidades v3.2

**Detecta automáticamente:**
- ✅ Nombres (650+ comunes + contexto + diminutivos)
- ✅ RUTs (múltiples formatos)
- ✅ Emails (dominios especiales)
- ✅ Teléfonos (móvil + fijo + códigos ciudad)
- ✅ Ubicaciones (350+ comunas)
- ✅ Direcciones (complejas: carreteras, hijuelas, GPS)
- ✅ Instituciones (50+ conocidas)
- ✅ Documentos (Pasaporte, Licencia, etc.)

**Modos de Confianza:**
- Conservative: 95% - Solo detecta con certeza total
- Standard: 90% - Balance perfecto
- Aggressive: 80% - Detecta incluso con baja confianza

---

## 🔧 Tecnología Stack

| Componente | Tecnología |
|-----------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Flask, Python 3.11 |
| Motor | Regex patterns + validación contextual |
| Estado | Zustand (store) |
| API | REST (JSON) |
| Base de Datos | Ninguna (100% local) |

---

## 📝 ARCHIVOS PRINCIPALES

### ⭐ USAR ESTOS
- `anonymizer.py` - Motor de anonimización
- `frontend/` - Interfaz web
- `backend/app.py` - API REST
- `scripts/` - Herramientas

### ❌ NO USAR ESTOS (_archive/)
- `anonymizer_v2.py` - Versión antigua
- `app_streamlit.py` - Streamlit descontinuado

---

## 🔄 Flujo Técnico

```
[localhost:3000] (Navegador)
    ↓ Carga archivo
[Frontend Next.js]
    ↓ POST /api/anonymize
[Backend Flask] (localhost:5000)
    ↓ Importa anonymizer.py
[anonymizer.py] Procesa con confidence_mode
    ↓ Detecta patrones regex
    ↓ Valida con confianza
    ↓ Retorna JSON
[Frontend] Muestra resultados
    ↓ Descarga CSV/Excel
```

---

## 📂 Logs y Debugging

Después de cada procesamiento:
- `backend/backend-debug.out.log` - Progreso de filas
- `backend/backend-debug.err.log` - Errores y warnings
- `frontend/frontend-start.err.log` - Errores Next.js

---

## ✅ Estado Actual

- ✅ v3.2: 7 mejoras implementadas
- ✅ Selector de modo de confianza en UI
- ✅ Backend procesa confidence_mode
- ✅ Proyecto organizado y limpio
- ✅ Documentación actualizada

---

## 🎯 Importante

⚠️ **SOLO localhost:3000** (Next.js) es la aplicación activa  
⚠️ Ignora completamente localhost:8501 (Streamlit antiguo)  
⚠️ Backend en localhost:5000 (Flask)  

---

**v3.2 | 2026 | 100% Local | Sin envío a nube**
