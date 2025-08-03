@echo off
echo Creating silent launch shortcut for Pressia Laundry Management...
echo.

REM Get the current directory
set "CURRENT_DIR=%~dp0"
set "VBS_FILE=%CURRENT_DIR%LAUNCH_SILENT.vbs"

REM Create the shortcut
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Pressia (Silent).lnk'); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"%VBS_FILE%\"'; $Shortcut.WorkingDirectory = '%CURRENT_DIR%'; $Shortcut.Description = 'Launch Pressia Laundry Management (Completely Silent)'; $Shortcut.IconLocation = '%CURRENT_DIR%public\icon.ico'; $Shortcut.Save()"

echo.
echo Silent shortcut created on desktop!
echo You can now double-click "Pressia (Silent)" on your desktop to launch the app completely silently.
pause 