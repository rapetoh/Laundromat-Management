@echo off
echo Creating desktop shortcut for Pressia Laundry Management...
echo.

REM Get the current directory
set "CURRENT_DIR=%~dp0"
set "BAT_FILE=%CURRENT_DIR%START_APP.bat"

REM Create the shortcut
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Pressia Laundry Management.lnk'); $Shortcut.TargetPath = '%BAT_FILE%'; $Shortcut.WorkingDirectory = '%CURRENT_DIR%'; $Shortcut.Description = 'Launch Pressia Laundry Management'; $Shortcut.IconLocation = '%CURRENT_DIR%public\icon.ico'; $Shortcut.Save()"

echo.
echo Shortcut created on desktop!
echo You can now double-click "Pressia Laundry Management" on your desktop to launch the app.
pause 