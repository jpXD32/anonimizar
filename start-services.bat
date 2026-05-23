@echo off
REM 🚀 SCRIPT ROBUSTO PARA INICIAR SERVICIOS (Windows)
REM Monitorea y reinicia automáticamente si se caen

echo.
echo ╔════════════════════════════════════════════════╗
echo ║     INICIANDO SERVICIOS (MODO ROBUSTO)        ║
echo ╚════════════════════════════════════════════════╝
echo.

REM 1. Detener servicios anteriores
echo 🛑 Deteniendo servicios anteriores...
taskkill /F /IM python.exe >/dev/null 2>&1
taskkill /F /IM node.exe >/dev/null 2>&1
timeout /t 3 /nobreak >/dev/null

REM 2. Iniciar Backend (Flask)
echo 🚀 Iniciando Backend (Flask) en puerto 5000...
cd /d "%~dp0"
start "Backend - Anonimizador" python backend/app.py
timeout /t 3 /nobreak >/dev/null

REM 3. Verificar Backend
echo 🔍 Verificando Backend...
timeout /t 2 /nobreak >/dev/null
for /L %%i in (1,1,5) do (
  curl -s http://localhost:5000/api/health >/dev/null 2>&1
  if !errorlevel! equ 0 (
    echo    ✅ Backend respondiendo en puerto 5000
    goto backend_ok
  )
  echo    ⏳ Intento %%i/5...
  timeout /t 1 /nobreak >/dev/null
)

:backend_ok

REM 4. Iniciar Frontend (Next.js)
echo 🚀 Iniciando Frontend (Next.js) en puerto 3007...
cd /d "%~dp0frontend"
start "Frontend - Anonimizador" npm run dev
timeout /t 8 /nobreak >/dev/null

REM 5. Verificar Frontend
echo 🔍 Verificando Frontend...
for /L %%i in (1,1,5) do (
  curl -s http://localhost:3007 >/dev/null 2>&1
  if !errorlevel! equ 0 (
    echo    ✅ Frontend respondiendo en puerto 3007
    goto frontend_ok
  )
  echo    ⏳ Intento %%i/5...
  timeout /t 2 /nobreak >/dev/null
)

:frontend_ok

echo.
echo ╔════════════════════════════════════════════════╗
echo ║         ✅ SERVICIOS INICIADOS                ║
echo ╚════════════════════════════════════════════════╝
echo.
echo 📍 Acceso:
echo    Frontend: http://localhost:3007
echo    Backend:  http://localhost:5000/api/health
echo.
echo 📊 Logs:
echo    Backend: tail -f /tmp/backend.log
echo    Frontend: tail -f /tmp/frontend.log
echo.
echo ⏸️  Para detener: Cierra esta ventana
echo.
pause
