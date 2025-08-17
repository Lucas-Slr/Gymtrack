@echo off
echo ========================================
echo    DEMARRAGE LOCAL GYMTRACK
echo ========================================
echo.
echo Ce script va demarrer GymTrack en mode local.
echo.

REM Vérifier si MongoDB est en cours d'exécution
echo Verification de MongoDB...
netstat -an | findstr ":27017" >nul
if errorlevel 1 (
    echo MongoDB n'est pas en cours d'execution.
    echo Demarrage de MongoDB...
    start "MongoDB" mongod
    timeout /t 5 /nobreak >nul
)

REM Démarrer le backend
echo Demarrage du backend...
cd backend
start "Backend GymTrack" cmd /k "npm run dev"

REM Attendre un peu
timeout /t 3 /nobreak >nul

REM Démarrer le frontend
echo Demarrage du frontend...
cd ..\Frontend
start "Frontend GymTrack" cmd /k "npm start"

echo.
echo ========================================
echo    APPLICATION DEMARREE !
echo ========================================
echo.
echo L'application sera accessible sur :
echo - Frontend: http://localhost:4200
echo - Backend: http://localhost:5000
echo.
echo Comptes de test :
echo - Email: test@example.com
echo - Mot de passe: password
echo.
echo Pour arreter l'application, fermez les fenetres de terminal.
echo.
pause

