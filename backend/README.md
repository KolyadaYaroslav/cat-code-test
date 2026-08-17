# ВетГенетика Backend

REST API для онлайн-магазина товаров для осеменения КРС.

## Запуск

```bash
npm install
npm run dev
```

Сервер запустится на `http://localhost:3000`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/me` — текущий пользователь (требует токена)

### Товары
- `GET /api/products` — все товары
- `GET /api/products/:id` — товар по ID
- `GET /api/products/categories/list` — список категорий
- `GET /api/products/search/query?q=<query>` — поиск

### Заказы
- `POST /api/orders` — создать заказ (требует токена)
- `GET /api/orders` — заказы пользователя (требует токена)
- `GET /api/orders/:id` — заказ по ID (требует токена)
- `PATCH /api/orders/:id/status` — обновить статус (требует токена)

## Аутентификация

Используй JWT токен в заголовке:
```
Authorization: Bearer <token>
```

## База данных

SQLite локально, можно перенести на PostgreSQL/Supabase когда нужно.
