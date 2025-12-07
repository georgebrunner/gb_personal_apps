@echo off
echo =============================================
echo     GB Personal Apps - Autostart Setup
echo =============================================
echo.

:: Create shortcut in Startup folder
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set VBS_PATH=%~dp0start-all-silent.vbs
set SHORTCUT_PATH=%STARTUP_FOLDER%\GB Personal Apps.lnk

:: Create the shortcut using PowerShell
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"%VBS_PATH%\"'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = 'Start GB Personal Apps'; $Shortcut.Save()"

if exist "%SHORTCUT_PATH%" (
    echo SUCCESS! Autostart has been configured.
    echo.
    echo The following apps will start automatically on login:
    echo   - GB Health  (http://localhost:5173)
    echo   - GB Guitar  (http://localhost:5174)
    echo   - GB Todo    (http://localhost:5175)
    echo   - GB Finance (http://localhost:5176)
    echo   - GB Food    (http://localhost:5177)
    echo.
    echo Shortcut created at:
    echo   %SHORTCUT_PATH%
) else (
    echo ERROR: Failed to create autostart shortcut.
    echo Please run this script as Administrator.
)

echo.
echo =============================================
pause
