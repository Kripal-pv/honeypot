@echo off
echo Starting HoneyShield...

REM Check for Admin privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with Admin privileges...
) else (
    echo WARNING: Not running as Administrator. You won't be able to bind to ports < 1024 (e.g., 21, 22, 80).
    echo Please run this script as Administrator for full functionality.
    pause
)

cd backend
start "HoneyShield Backend" python app.py
cd ..

cd frontend
start "HoneyShield Frontend" npm run dev
timeout /t 5
start http://localhost:5174
cd ..

echo HoneyShield is running!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5174
pause
