# ВетГенетика — Полный прототип с бэкендом

Онлайн-магазин товаров для осеменения КРС с полноценным REST API на Node.js.

## Структура проекта

```
catcode-prod-test/
├── catcode-prod-test/          # Фронтенд (ванильный JS)
│   ├── index.html
│   ├── assets/
│   │   ├── app.js              # Основное приложение
│   │   ├── store.js            # Состояние (локальное)
│   │   ├── data.js             # Данные (можно удалить, они теперь с бэкенда)
│   │   ├── api.js              # REST клиент для API
│   │   ├── api-adapter.js      # Интеграция API со Store
│   │   └── styles.css
│   └── ...
│
└── backend/                     # Бэкенд (Node.js + TypeScript)
    ├── src/
    │   ├── index.ts            # Главная точка входа
    │   ├── db/database.ts      # SQLite и инициализация БД
    │   ├── routes/
    │   │   ├── auth.ts         # API аутентификации
    │   │   ├── products.ts     # API товаров
    │   │   └── orders.ts       # API заказов
    │   ├── services/           # Бизнес-логика
    │   ├── middleware/         # JWT аутентификация
    │   └── utils/              # Утилиты
    ├── package.json
    ├── tsconfig.json
    └── database.db             # SQLite база (создаётся автоматически)
```

## Запуск системы

### Терминал 1 — Бэкенд

```bash
cd /Users/yaroslavkolyada/Projects/cat-code-test/asdasd/catcode-prod-test/backend
npm run dev
```

Ожидаемый вывод:
```
Connected to SQLite database at ...
Database initialized
Server running on http://localhost:3000
```

### Терминал 2 — Фронтенд

```bash
cd /Users/yaroslavkolyada/Projects/cat-code-test/asdasd/catcode-prod-test/catcode-prod-test
python3 -m http.server 8000
```

Или:
```bash
npx http-server -p 8000
```

### Открыть приложение

Перейдите в браузер на: **http://localhost:8000**

## Что работает

✅ **Каталог товаров** — загружается с API  
✅ **Регистрация** — данные сохраняются в БД  
✅ **Вход** — JWT аутентификация  
✅ **Корзина** — локально (как раньше)  
✅ **Оформление заказа** — сохраняется в БД  
✅ **История заказов** — синхронизируется с API  
✅ **Поиск товаров** — работает через API  

## Тестирование API

```bash
# Проверить здоровье
curl http://localhost:3000/api/health

# Получить товары
curl http://localhost:3000/api/products

# Зарегистрироваться
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "name":"Test User",
    "phone":"+7900000000"
  }'

# Получить ответ вроде:
# {"user":{"id":1,"email":"test@example.com","name":"Test User","phone":"+7900000000","created_at":"2024-08-17..."},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

## Переключение на Production режим

### 1. Использовать PostgreSQL вместо SQLite

В `backend/src/db/database.ts` замените SQLite на PostgreSQL подключение:

```typescript
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost/vetgenetika'
});
```

Или используйте Supabase:
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### 2. Обновить API URL на фронтенде

В `assets/api.js`:
```javascript
const API_BASE = "https://api.yourdomain.com/api"; // вместо localhost:3000
```

### 3. Включить CORS для production

В `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

### 4. Хранить secrets в переменных окружения

Создать `.env.production`:
```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-very-long-random-secret-key-here
DATABASE_URL=postgresql://...
```

### 5. Деплой

На Heroku, Railway, Vercel, или другой сервис:

```bash
# Пример для Heroku
heroku create vetgenetika-api
git push heroku main
heroku config:set JWT_SECRET=your-secret
```

## Возможные проблемы

### "Backend не отвечает"
- Проверьте, запущен ли сервер на порту 3000
- `lsof -i :3000` — показывает процессы на порту
- Проверьте логи в терминале бэкенда

### "CORS ошибка"
- Убедитесь, что бэкенд запущен и слушает CORS запросы
- Проверьте URL в `assets/api.js` (должно быть `http://localhost:3000`)

### "Данные не сохраняются"
- Проверьте наличие файла `backend/database.db`
- `rm backend/database.db` и запустите заново для переинициализации

### "npm run dev не работает"
- `npm install` в папке backend
- `node --version` — должен быть v14+

## Следующие шаги

1. ✅ Базовая система работает
2. ⏳ Добавить платежи (Stripe/Yandex.Kassa)
3. ⏳ Email уведомления (SendGrid)
4. ⏳ Admin панель
5. ⏳ Увеличить покрытие тестами
6. ⏳ Деплой на production

## Документация

- [Backend API](backend/README.md)
- [Frontend структура](catcode-prod-test/README.md) (если есть)
- [Production Setup](SETUP.md)
