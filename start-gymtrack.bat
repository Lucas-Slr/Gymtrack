@echo off
echo ========================================
echo    DEMARRAGE DE GYMTRACK
echo ========================================
echo.
echo Ce script va demarrer l'application GymTrack
echo avec Docker Compose.
echo.
echo Assurez-vous que Docker Desktop est en cours d'execution.
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

echo Docker detecte. Demarrage de l'application...
echo.

REM Construire et démarrer les conteneurs
docker-compose up --build -d

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
echo - MongoDB: localhost:27017
echo.
echo Comptes de test disponibles :
echo - Email: test@example.com
echo - Mot de passe: password
echo.
echo Pour arreter l'application, executez : stop-gymtrack.bat
echo.
pause
