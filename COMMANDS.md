# Полезные команды для ВетГенетика

## 🚀 Запуск

### Backend
```bash
cd backend
npm install   # первый раз
npm run dev   # разработка
npm run build # продакшен
npm start     # запуск скомпилированного кода
```

### Frontend
```bash
cd catcode-prod-test
python3 -m http.server 8000   # Python
npx http-server -p 8000       # Node.js
```

## 🧪 Тестирование API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"pass123",
    "name":"Иван Петров",
    "phone":"+7900000000"
  }'
```

### Вход и получение токена
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Результат: {"user":{...},"token":"eyJhbGc..."}
```

### Получить текущего пользователя
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/me
```

### Все товары
```bash
curl http://localhost:3000/api/products | jq
```

### Товар по ID
```bash
curl http://localhost:3000/api/products/1 | jq
```

### Категории
```bash
curl http://localhost:3000/api/products/categories/list | jq
```

### Поиск товаров
```bash
curl "http://localhost:3000/api/products/search/query?q=семя" | jq
```

### Создать заказ
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName":"Иван Петров",
    "recipientPhone":"+7900000000",
    "address":"Москва, ул. Тверская 1",
    "paymentMethod":"cash",
    "items":[
      {"productId":1,"quantity":2,"price":5000},
      {"productId":3,"quantity":1,"price":800}
    ]
  }'
```

### Мои заказы
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/orders | jq
```

### Заказ по ID
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/orders/1 | jq
```

### Обновить статус заказа
```bash
TOKEN="your_token_here"
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Оплачен"}'
```

### Получить следующий статус
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/orders/1/next-status | jq
```

## 🗄️ Работа с БД

### Проверить БД
```bash
sqlite3 backend/database.db ".tables"
```

### Все пользователи
```bash
sqlite3 backend/database.db "SELECT id, email, name FROM users;"
```

### Все товары
```bash
sqlite3 backend/database.db "SELECT id, name, price, stock FROM products;"
```

### Все заказы
```bash
sqlite3 backend/database.db "SELECT id, user_id, status, total FROM orders;"
```

### Статистика
```bash
sqlite3 backend/database.db "
  SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM products) as products,
    (SELECT COUNT(*) FROM orders) as orders;
"
```

### Очистить БД
```bash
rm backend/database.db
# БД пересоздастся при следующем запуске сервера
```

## 🔧 Отладка

### Какой процесс слушает порт?
```bash
lsof -i :3000   # Backend
lsof -i :8000   # Frontend
```

### Остановить процесс
```bash
kill -9 <PID>
```

### Логи бэкенда (в другом терминале)
```bash
tail -f /tmp/vetgenetika-backend.log
```

### DevTools браузера
- Chrome/Firefox: **F12** или **Cmd+Option+I** (macOS)
- Network tab: смотрите запросы к API
- Console: ошибки JavaScript
- Storage: localStorage, cookies

### Проверить синтаксис TypeScript
```bash
cd backend
npx tsc --noEmit
```

### Проверить зависимости
```bash
cd backend
npm ls
```

## 🚢 Production подготовка

### Собрать бэкенд
```bash
cd backend
npm run build
# Выходной файл в dist/
```

### Запустить production версию
```bash
npm start
# или
node dist/index.js
```

### Установить production зависимости
```bash
npm install --production
```

### Установить новую зависимость
```bash
npm install package-name --save
```

### Обновить зависимости
```bash
npm update
npm audit          # проверить уязвимости
npm audit fix      # исправить автоматически
```

## 📝 Файлы конфигурации

### .env (backend)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-key
DATABASE_URL=sqlite:./database.db
```

### tsconfig.json (backend)
Конфигурация TypeScript компилятора

### package.json (backend)
Зависимости и скрипты

## 🔄 Git команды

### Инициализировать репозиторий
```bash
git init
git add .
git commit -m "Initial commit: Backend + Frontend integration"
```

### Игнорировать файлы (создать .gitignore)
```bash
# Backend
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore
echo "*.db" >> .gitignore
```

## 🐳 Docker (опционально)

### Dockerfile для бэкенда
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production

COPY backend/src ./src
RUN npm run build

CMD ["npm", "start"]
```

### Запустить в Docker
```bash
docker build -t vetgenetika-api .
docker run -p 3000:3000 vetgenetika-api
```

## 📊 Мониторинг

### Посмотреть использование памяти Node.js
```bash
node --expose-gc backend/dist/index.js
```

### Профилирование
```bash
node --prof backend/dist/index.js
# Создаст файл isolate-*.log
node --prof-process isolate-*.log > profile.txt
```

---

**Совет:** Используйте VS Code для полноценной работы с проектом:
- Плагин "Thunder Client" для тестирования API
- Плагин "SQLite" для работы с БД
- Built-in Terminal для запуска команд
