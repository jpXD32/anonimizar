@echo off
REM Script para entrenar el modelo NER customizado

echo.
echo ========================================
echo ENTRENAMIENTO DE MODELO NER ESCOLAR
echo ========================================
echo.

REM Verificar que Python está disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado
    exit /b 1
)

REM Ejecutar entrenamiento
echo Iniciando entrenamiento...
echo.

python train_custom_ner.py ^
    --output "./model_escolar" ^
    --iterations 50 ^
    --base-model "es_core_news_sm" ^
    --drop-rate 0.5

if errorlevel 1 (
    echo.
    echo ERROR: El entrenamiento falló
    exit /b 1
)

echo.
echo Entrenamiento completado exitosamente!
echo Modelo guardado en: ./model_escolar
echo.
pause
