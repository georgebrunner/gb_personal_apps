@echo off
echo Starting GB Guitar...
echo.
echo Starting Backend (FastAPI) on http://localhost:8001
echo Starting Frontend (React) on http://localhost:5174
echo.
echo To access from iPhone: Use your laptop's local IP address
echo.

:: Start backend in new window
start "GB Guitar Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"

:: Wait a moment for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend in new window
start "GB Guitar Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo GB Guitar is starting...
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5174
echo API Docs: http://localhost:8001/docs
echo.
pause
