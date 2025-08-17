@echo off
echo ========================================
echo    TEST DE L'INSTALLATION DOCKER
echo ========================================
echo.
echo Ce script va tester que l'application
echo GymTrack fonctionne correctement.
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installé.
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Installer axios si nécessaire
echo Installation des dépendances de test...
npm install axios --no-save

REM Exécuter le test
echo.
echo Exécution des tests...
node test-docker.js

echo.
pause
