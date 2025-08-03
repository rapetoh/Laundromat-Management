@echo off
echo Pinning Pressia Laundry Management to taskbar...
echo.

REM Get the current directory
set "CURRENT_DIR=%~dp0"
set "BAT_FILE=%CURRENT_DIR%START_APP.bat"

REM Create a temporary VBS script to pin to taskbar
echo Set objShell = CreateObject("Shell.Application") > "%TEMP%\pin_to_taskbar.vbs"
echo Set objFolder = objShell.Namespace("%CURRENT_DIR%") >> "%TEMP%\pin_to_taskbar.vbs"
echo Set objFolderItem = objFolder.ParseName("START_APP.bat") >> "%TEMP%\pin_to_taskbar.vbs"
echo Set colVerbs = objFolderItem.Verbs >> "%TEMP%\pin_to_taskbar.vbs"
echo For Each objVerb in colVerbs >> "%TEMP%\pin_to_taskbar.vbs"
echo     If objVerb.Name = "Pin to taskbar" Then >> "%TEMP%\pin_to_taskbar.vbs"
echo         objVerb.DoIt >> "%TEMP%\pin_to_taskbar.vbs"
echo         Exit For >> "%TEMP%\pin_to_taskbar.vbs"
echo     End If >> "%TEMP%\pin_to_taskbar.vbs"
echo Next >> "%TEMP%\pin_to_taskbar.vbs"

REM Run the VBS script
cscript //nologo "%TEMP%\pin_to_taskbar.vbs"

REM Clean up
del "%TEMP%\pin_to_taskbar.vbs"

echo.
echo Pressia Laundry Management has been pinned to your taskbar!
echo You can now click the icon in your taskbar to launch the app.
pause 