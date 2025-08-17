@echo off
echo ========================================
echo    DEMARRAGE GYMTRACK AVEC ATLAS
echo ========================================
echo.
echo Ce script va demarrer l'application GymTrack
echo avec MongoDB Atlas (connexion internet requise).
echo.

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Docker n'est pas installé ou n'est pas dans le PATH.
    echo Veuillez installer Docker Desktop depuis https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Vérifier si Docker Desktop est en cours d'exécution
docker info >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Docker Desktop n'est pas en cours d'exécution.
    echo Veuillez démarrer Docker Desktop et réessayer.
    pause
    exit /b 1
)

echo Docker detecte. Demarrage de l'application avec Atlas...
echo.

REM Construire et démarrer les conteneurs avec Atlas
docker-compose -f docker-compose-atlas.yml up --build -d

if errorlevel 1 (
    echo ERREUR: Impossible de démarrer les conteneurs.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    APPLICATION DEMARREE AVEC SUCCES !
echo ========================================
echo.
echo L'application est maintenant accessible :
echo - Frontend: http://localhost
echo - Backend API: http://localhost:5000
echo - Base de données: MongoDB Atlas (cloud)
echo.
echo IMPORTANT: Connexion internet requise pour la base de données.
echo.
echo Comptes de test disponibles :
echo - Email: test@example.com
echo - Mot de passe: password
echo.
echo Pour arreter l'application, executez : stop-gymtrack-atlas.bat
echo.
pause
