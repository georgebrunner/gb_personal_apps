$ws = New-Object -ComObject WScript.Shell
$startup = [Environment]::GetFolderPath('Startup')
$s = $ws.CreateShortcut("$startup\GB Personal Apps.lnk")
$s.TargetPath = "C:\Users\GeorgeBrunner\Cursor\GB Personal\start-all-silent.vbs"
$s.WorkingDirectory = "C:\Users\GeorgeBrunner\Cursor\GB Personal"
$s.Save()
Write-Host "Shortcut created at: $startup\GB Personal Apps.lnk"
Write-Host "Target: $($s.TargetPath)"
