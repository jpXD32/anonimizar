@echo off
REM Script para iniciar/detener el servidor Streamlit

echo.
echo ========================================
echo   GESTOR DE SERVIDOR ANONIMIZADOR
echo ========================================
echo.
echo 1. Iniciar servidor
echo 2. Detener servidor
echo 3. Salir
echo.

setlocal enabledelayedexpansion

:menu
set /p choice="Selecciona una opcion (1-3): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto exit
echo Opcion invalida. Intenta de nuevo.
goto menu

:start
echo.
echo Iniciando servidor en http://localhost:8501...
echo (Presiona Ctrl+C para detener cuando termines)
echo.
cd /d "%~dp0"
python -m streamlit run app.py --server.port=8501
goto menu

:stop
echo.
echo Deteniendo servidor...
taskkill /F /IM python.exe /FI "COMMANDLINE like *streamlit*" >nul 2>&1
if %errorlevel% equ 0 (
    echo Servidor detenido correctamente.
) else (
    echo No hay servidor corriendo.
)
echo.
goto menu

:exit
echo Saliendo...
exit /b 0
