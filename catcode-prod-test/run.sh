#!/bin/bash
# Скрипт для запуска ВетГенетика Backend + Frontend

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/backend" && pwd)"
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/catcode-prod-test" && pwd)"

echo "🐄 ВетГенетика - запуск системы"
echo ""
echo "Структура:"
echo "  Backend:  $BACKEND_DIR"
echo "  Frontend: $FRONTEND_DIR"
echo ""

# Проверяем Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    exit 1
fi

# Проверяем Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не установлен!"
    exit 1
fi

echo "📦 Установка зависимостей backend..."
cd "$BACKEND_DIR"
npm install --silent

echo ""
echo "🚀 Запуск backend (порт 3000)..."
npm run dev &
BACKEND_PID=$!

echo ""
echo "⏳ Ожидание инициализации backend (3 сек)..."
sleep 3

echo ""
echo "🌐 Запуск frontend (порт 8000)..."
cd "$FRONTEND_DIR"
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✅ Система запущена!"
echo ""
echo "📍 Откройте в браузере: http://localhost:8000"
echo ""
echo "🛑 Для остановки: Ctrl+C"
echo ""

# Обработка сигнала выхода
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '⏹️  Система остановлена'; exit" INT TERM

# Ждём оба процесса
wait $BACKEND_PID $FRONTEND_PID
