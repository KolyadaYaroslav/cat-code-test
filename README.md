# catcode-prod-test — ВетГенетика

🐄 Полнофункциональный прототип онлайн-магазина для искусственного осеменения КРС с REST API.

**Фронтенд:** Ванильный JS (SPA)  
**Бэкенд:** Node.js + TypeScript + Express  
**База данных:** SQLite (разработка) / PostgreSQL (production)  
**Аутентификация:** JWT токены с bcrypt хешированием

## Быстрый старт

### 1️⃣ Бэкенд (Терминал 1)

```bash
cd backend
npm run dev
```

Запустится на `http://localhost:3000`

### 2️⃣ Фронтенд (Терминал 2)

```bash
cd catcode-prod-test
python3 -m http.server 8000
```

Откройте `http://localhost:8000` в браузере.

## Возможности

### ✅ Реализовано

- **Каталог товаров** — загружается с API, поиск, фильтр по категориям
- **Регистрация & вход** — безопасное хеширование, JWT токены
- **Корзина** — локальное управление (добавить, удалить, изменить количество)
- **Оформление заказа** — сохраняется в БД с деталями получателя и оплаты
- **История заказов** — в личном кабинете с синхронизацией через API
- **Отслеживание заказа** — по номеру с трекером статусов

### Статусы заказа

```
Оформлен → Оплачен → Собирается → В пути → Доставлен
```

## Структура

```
├── catcode-prod-test/              # Фронтенд
│   ├── index.html
│   └── assets/
│       ├── app.js                  # SPA-приложение (хеш-роутинг)
│       ├── store.js                # Состояние + localStorage
│       ├── api.js                  # REST клиент
│       ├── api-adapter.js          # Интеграция API со Store
│       ├── data.js                 # Демо-данные (опционально)
│       └── styles.css
│
└── backend/                        # REST API
    ├── src/
    │   ├── index.ts                # Express сервер
    │   ├── db/database.ts          # SQLite + инициализация
    │   ├── routes/
    │   │   ├── auth.ts             # /api/auth/register, /login, /me
    │   │   ├── products.ts         # /api/products, /search, /categories
    │   │   └── orders.ts           # /api/orders (CRUD)
    │   ├── services/               # Бизнес-логика
    │   ├── middleware/             # JWT, CORS
    │   └── utils/                  # Хеширование, токены
    ├── package.json
    └── database.db                 # SQLite база
```

## API Endpoints

### Аутентификация
```
POST   /api/auth/register              Создать аккаунт
POST   /api/auth/login                 Вход
GET    /api/auth/me                    Текущий пользователь
```

### Товары
```
GET    /api/products                   Все товары
GET    /api/products/:id               Товар по ID
GET    /api/products/categories/list   Список категорий
GET    /api/products/search/query?q=   Поиск
```

### Заказы
```
POST   /api/orders                     Создать заказ
GET    /api/orders                     Мои заказы
GET    /api/orders/:id                 Заказ по ID
PATCH  /api/orders/:id/status          Обновить статус
```

## Технологический стек

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- SPA с хеш-маршрутизацией
- Fetch API для работы с REST

### Backend
- Node.js + Express + TypeScript
- SQLite3 с промисами
- bcrypt для хеширования паролей
- jsonwebtoken для аутентификации
- CORS для кросс-доменных запросов

### Развёртывание
- **Dev:** `npm run dev` (ts-node)
- **Prod:** `npm run build && npm start` (скомпилированный JS)
- **БД:** SQLite локально → PostgreSQL/Supabase на сервере

## Примеры запросов

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"Иван Петров"}'

# Вход
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Получить товары
curl http://localhost:3000/api/products

# Создать заказ (требует токена)
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName":"Иван",
    "address":"Москва, ул. Тверская",
    "items":[{"productId":1,"quantity":2,"price":5000}]
  }'
```

## Production checklist

- [ ] Перейти на PostgreSQL/Supabase
- [ ] Обновить `API_BASE` в фронтенде на prod URL
- [ ] Настроить CORS whitelist
- [ ] Генерировать сильный JWT_SECRET
- [ ] Включить HTTPS/SSL
- [ ] Добавить rate limiting
- [ ] Настроить email-уведомления
- [ ] Подключить платёжный провайдер
- [ ] Добавить логирование и мониторинг
- [ ] Развернуть на сервере (Heroku, Railway, AWS и т.д.)

> 🔒 **Security note:** Это прототип для разработки. Для production нужна полная аудит безопасности,
> подходящий хостинг, SSL, rate limiting, и валидация данных.
