Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\GeorgeBrunner\Cursor\GB Personal"
WshShell.Run Chr(34) & "C:\Users\GeorgeBrunner\Cursor\GB Personal\start-all.bat" & Chr(34) & " silent", 0, False
Set WshShell = Nothing
