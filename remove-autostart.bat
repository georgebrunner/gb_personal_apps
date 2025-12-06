@echo off
echo =============================================
echo   GB Personal Apps - Remove Autostart
echo =============================================
echo.

set SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GB Personal Apps.lnk

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo Autostart has been removed.
    echo GB Personal Apps will no longer start automatically.
) else (
    echo Autostart was not configured.
)

echo.
echo =============================================
pause
