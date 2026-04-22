@echo off
title World Cup 2026 Predictor
color 0B
cd /d "%~dp0"

echo.
echo  ============================================
echo   FIFA World Cup 2026 Predictor
echo  ============================================
echo.

:: ── 1. Python requis ────────────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERREUR] Python n'est pas installe ou pas dans le PATH.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK] %%v

:: ── 2. Liberer le port 8000 si occupe ───────────────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Port 8000 libre.

:: ── 3. Dependances Python ───────────────────────────────────────────────────
if not exist "backend\.deps_ok" (
    echo  [>>] Installation des dependances Python...
    python -m pip install -q -r backend\requirements.txt
    if errorlevel 1 ( color 0C & echo  [ERREUR] pip install echoue. & pause & exit /b 1 )
    echo installed > backend\.deps_ok
    echo  [OK] Dependances installees.
) else (
    echo  [OK] Dependances OK.
)

:: ── 4. Build du frontend si absent ──────────────────────────────────────────
if not exist "backend\static\index.html" (
    echo  [>>] Construction du frontend...
    where npm >nul 2>&1
    if errorlevel 1 ( echo  [!] npm non trouve — frontend ignore. & goto start_backend )
    cd frontend
    if not exist "node_modules" ( call npm install --silent )
    call npm run build
    cd ..
    if exist "backend\static\index.html" (
        echo  [OK] Frontend construit.
    ) else (
        echo  [!] Build echoue — API accessible sur /docs
    )
) else (
    echo  [OK] Frontend OK.
)

:start_backend
:: ── 5. Lancer le serveur ────────────────────────────────────────────────────
echo.
echo  ============================================
echo   http://localhost:8000
echo   Arret : Ctrl+C
echo  ============================================
echo.

start /b cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:8000"

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

echo. & pause
