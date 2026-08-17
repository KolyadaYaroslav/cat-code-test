# Запуск ВетГенетика с бэкендом

## Архитектура

```
Frontend (ванильный JS)           Backend (Node.js + Express + TypeScript)
┌─────────────────────┐          ┌────────────────────────────┐
│ index.html          │          │ src/index.ts               │
│ assets/app.js       │  <---->  │ src/routes/auth.ts         │
│ assets/api.js       │  REST    │ src/routes/products.ts     │
│ assets/api-adapter  │  API     │ src/routes/orders.ts       │
└─────────────────────┘          └────────────────────────────┘
        :3000                              :3000
                                               ↓
                                        SQLite Database
```

## Быстрый старт

### 1. Запустить бэкенд

```bash
cd backend
npm run dev
```

Бэкенд запустится на `http://localhost:3000`

Проверить здоровье API:
```bash
curl http://localhost:3000/api/health
```

### 2. Запустить фронтенд (в другом терминале)

```bash
python3 -m http.server 8000
```

Или через Node.js:
```bash
npx http-server -p 8000
```

Открыть в браузере: `http://localhost:8000`

## Функциональность

✅ **Полная интеграция с бэкендом:**
- Каталог товаров загружается с API
- Регистрация и вход через API
- Создание заказов передаёт данные на бэкенд
- Состояние пользователя синхронизируется

✅ **Базы данных:**
- SQLite локально (для разработки)
- Легко мигрировать на PostgreSQL/Supabase

✅ **Аутентификация:**
- JWT токены
- Безопасное хеширование паролей (bcrypt)
- Автоматическое восстановление сессии

## Переменные окружения

Backend (`.env`):
```
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-key-super-secure
DATABASE_URL=sqlite:./database.db
```

## Production адаптация

1. **База данных:** Подключить PostgreSQL/Supabase
   - Изменить подключение в `backend/src/db/database.ts`
   - Или использовать Supabase SDK

2. **Frontend API URL:**
   - В `assets/api.js` изменить `API_BASE` на production URL
   - Например: `https://api.vetgenetika.ru`

3. **CORS:** 
   - Настроить whitelist доменов в бэкенде
   - Убрать `*` и указать конкретные домены

4. **JWT Secret:**
   - Генерировать сильный secret
   - Хранить в переменной окружения

5. **Платежи:**
   - Подключить реальный платёжный провайдер (Stripe, Yandex.Kassa и т.д.)
   - Создать эндпоинт для инициации платежей

## API документация

### GET /api/health
Проверка состояния сервера
```bash
curl http://localhost:3000/api/health
```

### POST /api/auth/register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"Иван Петров","phone":"+7900000000"}'
```

### POST /api/auth/login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### GET /api/auth/me
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/auth/me
```

### GET /api/products
```bash
curl http://localhost:3000/api/products
```

### GET /api/products/:id
```bash
curl http://localhost:3000/api/products/1
```

### GET /api/products/categories/list
```bash
curl http://localhost:3000/api/products/categories/list
```

### GET /api/products/search/query?q=семя
```bash
curl http://localhost:3000/api/products/search/query?q=семя
```

### POST /api/orders
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName":"Иван Петров",
    "recipientPhone":"+7900000000",
    "address":"Москва, ул. Тверская 1",
    "paymentMethod":"cash",
    "items":[{"productId":1,"quantity":2,"price":5000}]
  }'
```

### GET /api/orders
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/orders
```

### GET /api/orders/:id
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/orders/1
```

## Отладка

### Frontend логи
Откройте DevTools (F12) → Console

### Backend логи
Смотрите терминал, где запущен `npm run dev`

### Проверить БД
```bash
sqlite3 backend/database.db ".tables"
sqlite3 backend/database.db "SELECT * FROM products;"
```

## Следующие шаги

1. ✅ Подключить реальную БД (PostgreSQL)
2. ⏳ Интегрировать платёжный провайдер
3. ⏳ Добавить email-уведомления (SendGrid/Mailgun)
4. ⏳ Развернуть на сервере (Heroku, Railway, VPS)
5. ⏳ Настроить SSL/HTTPS
6. ⏳ Добавить админ-панель
