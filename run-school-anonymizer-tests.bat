@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo   PRUEBAS ANONIMIZADOR ESCOLAR
echo ==========================================
echo.

python scripts\test_anonymizer_school.py
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE% EQU 0 (
  echo [OK] Todas las pruebas pasaron.
) else (
  echo [ERROR] Hay filtraciones detectadas. Revisa la salida.
)

echo.
pause
exit /b %EXIT_CODE%

