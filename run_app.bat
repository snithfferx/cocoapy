@echo off
echo Iniciando Colony Counter Application...

:: Activar el entorno virtual
call Scripts\activate.bat

:: Ejecutar la aplicación
python main.py

pause