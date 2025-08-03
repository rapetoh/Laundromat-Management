' Launch Pressia Laundry Management silently
Option Explicit

Dim objShell, currentDir, batFile

' Get current directory
currentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
batFile = currentDir & "\START_APP_NO_BROWSER.bat"

' Create shell object
Set objShell = CreateObject("WScript.Shell")

' Launch the batch file silently
objShell.Run "cmd.exe /c """ & batFile & """", 0, False

' Clean up
Set objShell = Nothing 