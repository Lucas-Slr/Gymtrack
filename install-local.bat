@echo off
echo ========================================
echo    INSTALLATION LOCALE GYMTRACK
echo ========================================
echo.
echo Ce script va installer GymTrack localement
echo sans Docker (pour les problemes de virtualisation).
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installé.
    echo Veuillez installer Node.js depuis https://nodejs.org/
    echo Version recommandée: 18.x ou plus recente
    pause
    exit /b 1
)

REM Vérifier si MongoDB est installé
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: MongoDB n'est pas installé.
    echo Veuillez installer MongoDB depuis https://www.mongodb.com/try/download/community
    echo Ou utiliser MongoDB Atlas (gratuit)
    pause
    exit /b 1
)

echo Node.js et MongoDB detectes. Installation en cours...
echo.

REM Installer les dépendances backend
echo Installation du backend...
cd backend
call npm install
if errorlevel 1 (
    echo ERREUR: Impossible d'installer les dependances backend.
    pause
    exit /b 1
)

REM Installer les dépendances frontend
echo.
echo Installation du frontend...
cd ..\Frontend
call npm install
if errorlevel 1 (
    echo ERREUR: Impossible d'installer les dependances frontend.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    INSTALLATION TERMINEE AVEC SUCCES !
echo ========================================
echo.
echo Pour demarrer l'application :
echo 1. Demarrer MongoDB : mongod
echo 2. Demarrer le backend : cd backend ^& npm run dev
echo 3. Demarrer le frontend : cd Frontend ^& npm start
echo.
echo Ou utiliser le script : start-local.bat
echo.
pause

