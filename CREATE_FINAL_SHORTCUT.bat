@echo off
echo Creating final shortcut for Pressia Laundry Management (No Browser)...
echo.

REM Get the current directory
set "CURRENT_DIR=%~dp0"
set "VBS_FILE=%CURRENT_DIR%LAUNCH_SILENT.vbs"

REM Create the shortcut
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Pressia.lnk'); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"%VBS_FILE%\"'; $Shortcut.WorkingDirectory = '%CURRENT_DIR%'; $Shortcut.Description = 'Launch Pressia Laundry Management (No Browser, No CMD)'; $Shortcut.IconLocation = '%CURRENT_DIR%public\icon.ico'; $Shortcut.Save()"

echo.
echo Final shortcut created on desktop!
echo You can now double-click "Pressia" on your desktop to launch the app without browser or CMD.
pause 