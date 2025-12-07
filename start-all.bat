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
echo   GB Food:    http://%IP%:5177
echo.
echo =============================================
echo.

:: Start GB Health Backend
echo Starting GB Health Backend on port 8000...
start /min "GB Health Backend" cmd /c "cd /d %~dp0gb-health\backend && pip install -r requirements.txt -q && uvicorn app.main:app --host 0.0.0.0 --port 8000"

:: Start GB Guitar Backend
echo Starting GB Guitar Backend on port 8001...
start /min "GB Guitar Backend" cmd /c "cd /d %~dp0gb-guitar\backend && pip install -r requirements.txt -q && uvicorn app.main:app --host 0.0.0.0 --port 8001"

:: Start GB Finance Backend
echo Starting GB Finance Backend on port 8002...
start /min "GB Finance Backend" cmd /c "cd /d %~dp0gb-finance\backend && pip install -r requirements.txt -q && uvicorn app.main:app --host 0.0.0.0 --port 8002"

:: Start GB Todo Backend
echo Starting GB Todo Backend on port 8003...
start /min "GB Todo Backend" cmd /c "cd /d %~dp0gb-todo\backend && pip install -r requirements.txt -q && uvicorn app.main:app --host 0.0.0.0 --port 8003"

:: Start GB Food Backend
echo Starting GB Food Backend on port 8004...
start /min "GB Food Backend" cmd /c "cd /d %~dp0gb-food\backend && pip install -r requirements.txt -q && uvicorn app.main:app --host 0.0.0.0 --port 8004"

:: Wait for backends
timeout /t 4 /nobreak > nul

:: Start GB Health Frontend
echo Starting GB Health Frontend on port 5173...
start /min "GB Health Frontend" cmd /c "cd /d %~dp0gb-health\frontend && npm install --silent && npm run dev"

:: Start GB Guitar Frontend
echo Starting GB Guitar Frontend on port 5174...
start /min "GB Guitar Frontend" cmd /c "cd /d %~dp0gb-guitar\frontend && npm install --silent && npm run dev -- --port 5174"

:: Start GB Todo Frontend
echo Starting GB Todo Frontend on port 5175...
start /min "GB Todo Frontend" cmd /c "cd /d %~dp0gb-todo\frontend && npm install --silent && npm run dev -- --port 5175"

:: Start GB Finance Frontend
echo Starting GB Finance Frontend on port 5176...
start /min "GB Finance Frontend" cmd /c "cd /d %~dp0gb-finance\frontend && npm install --silent && npm run dev -- --port 5176"

:: Start GB Food Frontend
echo Starting GB Food Frontend on port 5177...
start /min "GB Food Frontend" cmd /c "cd /d %~dp0gb-food\frontend && npm install --silent && npm run dev -- --port 5177"

echo.
echo =============================================
echo All apps starting! Open in browser:
echo.
echo   GB Health:  http://localhost:5173
echo   GB Guitar:  http://localhost:5174
echo   GB Todo:    http://localhost:5175
echo   GB Finance: http://localhost:5176
echo   GB Food:    http://localhost:5177
echo.
echo   API Docs (Health):  http://localhost:8000/docs
echo   API Docs (Guitar):  http://localhost:8001/docs
echo   API Docs (Finance): http://localhost:8002/docs
echo   API Docs (Todo):    http://localhost:8003/docs
echo   API Docs (Food):    http://localhost:8004/docs
echo =============================================
echo.
pause
