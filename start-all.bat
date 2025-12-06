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
echo   GB Health:  http://%IP%:5173
echo   GB Guitar:  http://%IP%:5174
echo   GB Todo:    http://%IP%:5175
echo   GB Finance: http://%IP%:5176
echo.
echo =============================================
echo.

:: Start GB Health Backend
echo Starting GB Health Backend on port 8000...
start "GB Health Backend" cmd /k "cd /d %~dp0gb-health\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Start GB Guitar Backend
echo Starting GB Guitar Backend on port 8001...
start "GB Guitar Backend" cmd /k "cd /d %~dp0gb-guitar\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"

:: Start GB Finance Backend
echo Starting GB Finance Backend on port 8002...
start "GB Finance Backend" cmd /k "cd /d %~dp0gb-finance\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8002"

:: Start GB Todo Backend
echo Starting GB Todo Backend on port 8003...
start "GB Todo Backend" cmd /k "cd /d %~dp0gb-todo\backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8003"

:: Wait for backends
timeout /t 4 /nobreak > nul

:: Start GB Health Frontend
echo Starting GB Health Frontend on port 5173...
start "GB Health Frontend" cmd /k "cd /d %~dp0gb-health\frontend && npm install && npm run dev"

:: Start GB Guitar Frontend
echo Starting GB Guitar Frontend on port 5174...
start "GB Guitar Frontend" cmd /k "cd /d %~dp0gb-guitar\frontend && npm install && npm run dev -- --port 5174"

:: Start GB Todo Frontend
echo Starting GB Todo Frontend on port 5175...
start "GB Todo Frontend" cmd /k "cd /d %~dp0gb-todo\frontend && npm install && npm run dev -- --port 5175"

:: Start GB Finance Frontend
echo Starting GB Finance Frontend on port 5176...
start "GB Finance Frontend" cmd /k "cd /d %~dp0gb-finance\frontend && npm install && npm run dev -- --port 5176"

echo.
echo =============================================
echo All apps starting! Open in browser:
echo.
echo   GB Health:  http://localhost:5173
echo   GB Guitar:  http://localhost:5174
echo   GB Todo:    http://localhost:5175
echo   GB Finance: http://localhost:5176
echo.
echo   API Docs (Health):  http://localhost:8000/docs
echo   API Docs (Guitar):  http://localhost:8001/docs
echo   API Docs (Finance): http://localhost:8002/docs
echo   API Docs (Todo):    http://localhost:8003/docs
echo =============================================
echo.
pause
