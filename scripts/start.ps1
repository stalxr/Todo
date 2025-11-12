$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "🚀 Запуск Todo приложения..." -ForegroundColor Cyan

if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Go не установлен. Установите Go: https://golang.org/dl/" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm не установлен. Установите Node.js: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "📦 Установка зависимостей frontend..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

$env:PORT = if ($env:PORT) { $env:PORT } else { "8080" }
$env:DATABASE_PATH = if ($env:DATABASE_PATH) { $env:DATABASE_PATH } else { "todo.db" }
$env:JWT_SECRET = if ($env:JWT_SECRET) { $env:JWT_SECRET } else { "dev_secret_change_me" }
$env:ALLOW_ORIGIN = if ($env:ALLOW_ORIGIN) { $env:ALLOW_ORIGIN } else { "http://localhost:3000" }
$env:VITE_API_URL = if ($env:VITE_API_URL) { $env:VITE_API_URL } else { "http://localhost:8080" }

Write-Host "🔧 Переменные окружения:" -ForegroundColor Cyan
Write-Host "   PORT=$env:PORT"
Write-Host "   DATABASE_PATH=$env:DATABASE_PATH"
Write-Host "   ALLOW_ORIGIN=$env:ALLOW_ORIGIN"
Write-Host "   VITE_API_URL=$env:VITE_API_URL"
Write-Host ""

Write-Host "🔷 Запуск backend сервера на порту $env:PORT..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:rootDir\server
    go run main.go
}

Start-Sleep -Seconds 2

Write-Host "🔶 Запуск frontend на порту 3000..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:rootDir\client
    npm run dev -- --host --port 3000
}

Write-Host ""
Write-Host "✅ Приложение запущено!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend:  http://localhost:$env:PORT"
Write-Host ""
Write-Host "Нажмите Ctrl+C для остановки"

try {
    Wait-Job $backendJob, $frontendJob | Out-Null
} finally {
    Stop-Job $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob
}

