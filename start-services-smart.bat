@echo off
REM 🚀 SCRIPT INTELIGENTE - USA PUERTO LIBRE AUTOMÁTICAMENTE
REM Si puertos 3000-3009 están ocupados, usa 3010+

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ╔════════════════════════════════════════════════╗
echo ║   INICIANDO SERVICIOS (MODO INTELIGENTE)      ║
echo ╚════════════════════════════════════════════════╝
echo.

REM 1. Buscar puerto libre
echo 🔍 Buscando puerto libre...
for /L %%p in (3000,1,4000) do (
  netstat -ano | findstr /R "0\.0\.0\.0:%%p " >/dev/null
  if !errorlevel! neq 0 (
    set NEXT_PORT=%%p
    goto found_port
  )
)

:found_port
echo ✅ Usando puerto: !NEXT_PORT!

REM 2. Detener procesos viejos
echo.
echo 🛑 Limpiando procesos antiguos...
taskkill /F /IM node.exe /T 2>/dev/null
taskkill /F /IM python.exe /T 2>/dev/null
timeout /t 3 /nobreak >/dev/null

REM 3. Iniciar Backend
echo.
echo 🚀 Iniciando Backend...
start "Backend - Anonimizador" python backend/app.py
timeout /t 4 /nobreak >/dev/null

REM 4. Verificar Backend
for /L %%i in (1,1,5) do (
  curl -s http://localhost:5000/api/health >/dev/null 2>&1
  if !errorlevel! equ 0 (
    echo ✅ Backend respondiendo (puerto 5000)
    goto backend_ok
  )
  echo ⏳ Esperando backend... %%i/5
  timeout /t 1 /nobreak >/dev/null
)

:backend_ok

REM 5. Iniciar Frontend con puerto dinámico
echo.
echo 🚀 Iniciando Frontend (puerto !NEXT_PORT!)...
cd frontend
set PORT=!NEXT_PORT!
start "Frontend - Anonimizador" npm run dev
cd ..
timeout /t 8 /nobreak >/dev/null

REM 6. Verificar Frontend
for /L %%i in (1,1,5) do (
  curl -s http://localhost:!NEXT_PORT! >/dev/null 2>&1
  if !errorlevel! equ 0 (
    echo ✅ Frontend respondiendo (puerto !NEXT_PORT!)
    goto frontend_ok
  )
  echo ⏳ Esperando frontend... %%i/5
  timeout /t 2 /nobreak >/dev/null
)

:frontend_ok

echo.
echo ╔════════════════════════════════════════════════╗
echo ║         ✅ SERVICIOS INICIADOS                ║
echo ╚════════════════════════════════════════════════╝
echo.
echo 📍 URLs:
echo    Frontend: http://localhost:!NEXT_PORT!
echo    Backend:  http://localhost:5000/api/health
echo.
echo ⏸️  Presiona cualquier tecla para detener
pause
