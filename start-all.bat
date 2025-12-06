@echo off
echo =============================================
echo        GB Personal Apps - Starting All
echo =============================================
echo.

:: Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Your local IP address: %IP%
echo.
echo Access from iPhone:
echo   GB Health: http://%IP%:5173
echo   GB Guitar: http://%IP%:5174
echo.
echo =============================================
echo.

:: Start GB Health Backend
echo Starting GB Health Backend on port 8000...
start "GB Health Backend" cmd /k "cd /d %~dp0gb-health\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Start GB Guitar Backend
echo Starting GB Guitar Backend on port 8001...
start "GB Guitar Backend" cmd /k "cd /d %~dp0gb-guitar\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"

:: Wait for backends
timeout /t 4 /nobreak > nul

:: Start GB Health Frontend
echo Starting GB Health Frontend on port 5173...
start "GB Health Frontend" cmd /k "cd /d %~dp0gb-health\frontend && npm install && npm run dev"

:: Start GB Guitar Frontend
echo Starting GB Guitar Frontend on port 5174...
start "GB Guitar Frontend" cmd /k "cd /d %~dp0gb-guitar\frontend && npm install && npm run dev -- --port 5174"

echo.
echo =============================================
echo All apps starting! Open in browser:
echo.
echo   GB Health: http://localhost:5173
echo   GB Guitar: http://localhost:5174
echo.
echo   API Docs (Health): http://localhost:8000/docs
echo   API Docs (Guitar): http://localhost:8001/docs
echo =============================================
echo.
pause
