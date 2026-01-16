@echo off
REM Script pour lancer un serveur local simple
cd /d "c:\Users\Yzen\Desktop\EMS STFH\Bases"

REM Vérifier si Python est disponible
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Lancement du serveur Python sur http://localhost:8000
    echo Appuyez sur Ctrl+C pour arrêter le serveur
    python -m http.server 8000
) else (
    REM Si Python n'est pas disponible, essayer Node.js
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Lancement du serveur Node.js sur http://localhost:8000
        echo Appuyez sur Ctrl+C pour arrêter le serveur
        npx http-server -p 8000
    ) else (
        echo Erreur: Python ou Node.js doit être installé
        echo Téléchargez Python depuis https://www.python.org
        echo Ou Node.js depuis https://nodejs.org
        pause
    )
)
