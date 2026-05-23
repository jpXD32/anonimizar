# 🚀 CÓMO INICIAR LA APLICACIÓN

## ⚡ Opción 1: Inicio Rápido (Recomendado - Windows)

**Simplemente ejecuta:**
```
start-services.bat
```

✅ Se abrirán automáticamente 2 ventanas y los servicios se iniciarán

Luego abre: **http://localhost:3007/**

---

## 🐧 Opción 2: Linux/Mac

```bash
./start-services.sh
```

---

## 🔧 Opción 3: Iniciar manualmente (si algo falla)

**Terminal 1 - Backend:**
```bash
cd C:\Proyectos\anonimizar
python backend/app.py
```

**Terminal 2 - Frontend:**
```bash
cd C:\Proyectos\anonimizar\frontend
npm run dev
```

---

## ✅ Verificar que funciona

- Backend: http://localhost:5000/api/health → debe responder JSON
- Frontend: http://localhost:3007/ → debe cargar la página

---

## 🎯 Uso normal

1. Abre http://localhost:3007/
2. Haz clic en "Comenzar ahora"
3. Sube archivo CSV/XLSX
4. Elige modo de anonimización
5. Selecciona columnas
6. Haz clic "Comenzar anonimización"
7. Descarga resultado

---

## 🛑 Si falla

✅ Ejecuta `start-services.bat` nuevamente
✅ Haz Ctrl+Shift+R en navegador (limpiar caché)
✅ Espera 15 segundos a que cargue completamente
✅ Cierra Task Manager y termina python.exe / node.exe

---

**v3.2 | 100% Local | Sin envío a nube**

---

## 🚨 ¿Puertos ocupados? Usa el script inteligente

Si ves errores como "Port 3000 is in use"...

**Ejecuta en su lugar:**
```
start-services-smart.bat
```

Este script:
✅ Encuentra automáticamente un puerto libre
✅ Mata procesos viejos antes de iniciar
✅ No necesitas limpiar puertos manualmente
✅ Más confiable en Windows

