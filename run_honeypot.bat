@echo off
echo Starting HoneyShield...

cd backend
start /B python app.py
cd ..

cd frontend
start /B npm run dev -- --host
cd ..

timeout /t 5
start http://localhost:5176

echo HoneyShield is running!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5176
pause
