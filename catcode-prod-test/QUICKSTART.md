# ВетГенетика — Quick Start Guide

## Требования

- **Node.js** (v14+) — для бэкенда
- **Python 3** — для статического сервера фронтенда
- **2 терминальных окна** (или вкладки)

## Установка (только один раз)

```bash
# Установить зависимости бэкенда
cd backend
npm install

# Вернуться в корень
cd ..
```

## Запуск (каждый раз)

### Терминал #1 — Бэкенд

```bash
cd backend
npm run dev
```

✅ Ожидайте:
```
Connected to SQLite database at ...
Database initialized
Server running on http://localhost:3000
```

### Терминал #2 — Фронтенд

```bash
cd catcode-prod-test
python3 -m http.server 8000
```

✅ Ожидайте:
```
Serving HTTP on http://127.0.0.1:8000 ...
```

### Откройте браузер

🌐 **http://localhost:8000**

## Тестирование

### Зарегистрироваться
1. Перейдите на страницу логина (`#/login`)
2. Регистрация: `user@test.com` / `password123`
3. Появитесь в личном кабинете

### Купить товар
1. Перейдите в каталог (`#/catalog`)
2. Добавьте несколько товаров в корзину
3. Оформите заказ
4. Смотрите статус в `#/orders`

### Проверить API

```bash
# Статус API
curl http://localhost:3000/api/health

# Получить все товары
curl http://localhost:3000/api/products | jq

# Получить категории
curl http://localhost:3000/api/products/categories/list | jq
```

## Что изменилось?

### До (только фронтенд)
- Всё в localStorage
- Данные статичные в `data.js`
- Пароли в открытом виде

### После (фронтенд + бэкенд)
- ✅ Данные в БД (SQLite)
- ✅ Пароли хешируются (bcrypt)
- ✅ JWT аутентификация
- ✅ Готово к масштабированию
- ✅ Ready for production

## Отладка

### Бэкенд не запускается
```bash
# Проверить, занят ли порт
lsof -i :3000

# Очистить БД и пересоздать
rm backend/database.db
npm run dev
```

### Фронтенд не подключается к бэкенду
- Проверьте, что бэкенд запущен на порту 3000
- Откройте DevTools (F12) → Console → смотрите ошибки
- Убедитесь что API_BASE в `assets/api.js` = `http://localhost:3000/api`

### Данные не сохраняются
- Проверьте, что `backend/database.db` создана
- Перезагрузите фронтенд (F5)
- Проверьте логи бэкенда в терминале

## Production

Когда будете готовы к боевому режиму:

1. **Подключить PostgreSQL:** `backend/src/db/database.ts`
2. **Обновить API URL:** `assets/api.js`
3. **Включить HTTPS:** Nginx/Apache + SSL
4. **Развернуть:** Heroku / Railway / VPS

Подробнее см. [README.md](README.md) и [backend/README.md](backend/README.md)

## Полезные ссылки

- **Frontend** → http://localhost:8000
- **Backend API** → http://localhost:3000/api
- **API Health** → http://localhost:3000/api/health

Удачи! 🚀
