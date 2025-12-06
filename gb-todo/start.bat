@echo off
echo Starting GB Todo...

:: Start backend
cd /d "%~dp0backend"
start "GB Todo Backend" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

:: Wait a moment for backend to start
timeout /t 2 /nobreak > nul

:: Start frontend
cd /d "%~dp0frontend"
start "GB Todo Frontend" cmd /k "npm run dev"

echo.
echo GB Todo starting...
echo Backend: http://localhost:8003
echo Frontend: http://localhost:5175
echo.
