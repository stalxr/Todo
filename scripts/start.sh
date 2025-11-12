#!/bin/bash

set -e

cd "$(dirname "$0")/.."

echo "🚀 Запуск Todo приложения..."

if ! command -v go &> /dev/null; then
    echo "❌ Go не установлен. Установите Go: https://golang.org/dl/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Установите Node.js: https://nodejs.org/"
    exit 1
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Установка зависимостей frontend..."
    cd client
    npm install
    cd ..
fi

export PORT=${PORT:-8080}
export DATABASE_PATH=${DATABASE_PATH:-todo.db}
export JWT_SECRET=${JWT_SECRET:-dev_secret_change_me}
export ALLOW_ORIGIN=${ALLOW_ORIGIN:-http://localhost:3000}
export VITE_API_URL=${VITE_API_URL:-http://localhost:8080}

echo "🔧 Переменные окружения:"
echo "   PORT=$PORT"
echo "   DATABASE_PATH=$DATABASE_PATH"
echo "   ALLOW_ORIGIN=$ALLOW_ORIGIN"
echo "   VITE_API_URL=$VITE_API_URL"
echo ""

trap 'kill 0' EXIT

echo "🔷 Запуск backend сервера на порту $PORT..."
cd server
go run main.go &
BACKEND_PID=$!
cd ..

sleep 2

echo "🔶 Запуск frontend на порту 3000..."
cd client
npm run dev -- --host --port 3000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Приложение запущено!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:$PORT"
echo ""
echo "Нажмите Ctrl+C для остановки"

wait

