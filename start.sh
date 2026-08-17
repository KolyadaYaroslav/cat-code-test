#!/bin/bash

# Скрипт для запуска полной системы ВетГенетика

echo "🚀 Запуск ВетГенетика..."
echo ""

# Запустить бэкенд в фоне
echo "📡 Запуск бэкенда на порту 3000..."
cd backend
npm run dev > /tmp/vetgenetika-backend.log 2>&1 &
BACKEND_PID=$!
echo "Бэкенд PID: $BACKEND_PID"

# Дождаться инициализации бэкенда
sleep 2

# Запустить фронтенд
echo "🌐 Запуск фронтенда на порту 8000..."
cd ..
python3 -m http.server 8000 > /tmp/vetgenetika-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Фронтенд PID: $FRONTEND_PID"

echo ""
echo "✅ Система запущена!"
echo ""
echo "🔗 Откройте в браузере: http://localhost:8000"
echo ""
echo "📊 Логи:"
echo "  Backend:  tail -f /tmp/vetgenetika-backend.log"
echo "  Frontend: tail -f /tmp/vetgenetika-frontend.log"
echo ""
echo "⏹️  Для остановки используйте: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Удерживать скрипт в работе
wait
