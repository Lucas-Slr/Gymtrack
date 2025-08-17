@echo off
echo ========================================
echo    ARRET DE GYMTRACK
echo ========================================
echo.
echo Ce script va arreter l'application GymTrack.
echo.

REM Arrêter les conteneurs
docker-compose down

if errorlevel 1 (
    echo ERREUR: Impossible d'arreter les conteneurs.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    APPLICATION ARRETEE AVEC SUCCES !
echo ========================================
echo.
echo Les conteneurs ont ete arretes.
echo Pour redemarrer l'application, executez : start-gymtrack.bat
echo.
pause
