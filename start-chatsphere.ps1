$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting ChatSphere backend on http://localhost:8081"
Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "set PORT=8081&& mvn.cmd spring-boot:run > backend-run.log 2>&1" `
  -WorkingDirectory "$root\backend" `
  -WindowStyle Hidden

Start-Sleep -Seconds 5

Write-Host "Starting ChatSphere frontend on http://localhost:5173"
Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "npm.cmd run dev -- --host 0.0.0.0 --port 5173 --force > frontend-run.log 2>&1" `
  -WorkingDirectory "$root\frontend" `
  -WindowStyle Hidden

Write-Host ""
Write-Host "Open http://localhost:5173"
Write-Host "Backend logs:  backend\backend-run.log"
Write-Host "Frontend logs: frontend\frontend-run.log"
