@echo off
echo ========================================
echo    RESOLUTION PROBLEMES DOCKER WINDOWS
echo ========================================
echo.
echo Ce script va vous aider a resoudre les problemes
echo de virtualisation pour Docker Desktop.
echo.

echo ETAPE 1: Verification de la virtualisation...
systeminfo | findstr /i "virtualisation"
echo.

echo ETAPE 2: Verification de Hyper-V...
systeminfo | findstr /i "Hyper-V"
echo.

echo ========================================
echo    INSTRUCTIONS MANUELLES REQUISES
echo ========================================
echo.
echo Si vous voyez "Virtualisation activee dans le microprogramme: Non"
echo vous devez activer la virtualisation dans le BIOS :
echo.
echo 1. Redemarrer votre ordinateur
echo 2. Entrer dans le BIOS (F2, F10, ou Del)
echo 3. Chercher et activer :
echo    - Virtualization Technology / Intel VT-x
echo    - AMD-V (si processeur AMD)
echo    - SVM Mode
echo 4. Sauvegarder et redemarrer
echo.
echo ========================================
echo    ACTIVATION DES COMPOSANTS WINDOWS
echo ========================================
echo.
echo Vous devez executer ces commandes en tant qu'administrateur :
echo.
echo 1. Ouvrir PowerShell en tant qu'administrateur
echo 2. Executer : dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
echo 3. Executer : dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
echo 4. Redemarrer l'ordinateur
echo 5. Redemarrer Docker Desktop
echo.
echo ========================================
echo    VERIFICATION FINALE
echo ========================================
echo.
echo Apres redemarrage, verifiez que Docker fonctionne :
echo docker --version
echo docker info
echo.
pause

