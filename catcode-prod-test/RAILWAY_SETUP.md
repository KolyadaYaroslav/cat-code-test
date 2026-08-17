# Railway Setup Guide

Решение для ошибки Railpack при деплое на Railway.

## ⚠️ Проблема

```
Script start.sh not found
Railpack could not determine how to build the app
```

Railway видит две папки (backend и catcode-prod-test) и не знает какую использовать.

## ✅ Решение

### Способ 1: Переконфигурировать Railway Dashboard (Быстрый)

1. Откройте **Railway Dashboard** → Ваш проект
2. Перейдите в **Settings → Environment**
3. Найдите или создайте переменную `ROOT_DIRECTORY`:
   ```
   ROOT_DIRECTORY=backend
   ```
4. Перейдите в **Settings → Build**
5. Установите:
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
6. Нажмите **Redeploy**

### Способ 2: Использовать Railway CLI (Продвинутый)

```bash
# 1. Установить Railway CLI
npm install -g @railway/cli

# 2. Залогиниться
railway login

# 3. Связать с проектом
railway link

# 4. Развернуть backend
cd backend
railway up --no-cache

# 5. Установить переменные окружения
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
railway variables set PORT=3000
```

### Способ 3: Удалить и Пересоздать Проект

1. На GitHub → Settings → Integrations → Railway → Remove
2. На Railway → Delete Project
3. На GitHub → Settings → Integrations → Railway → Reconnect
4. Выбрать ТОЛЬКО папку `backend` при подключении
5. Railway автоматически обнаружит Procfile и Node.js проект

## 🔧 Файлы конфигурации для Railway

Проверьте что эти файлы есть в root репозитория:

- ✅ `railway.json` — основная конфигурация
- ✅ `railway.toml` — альтернативная конфигурация
- ✅ `railway.yaml` — для специфичных настроек
- ✅ `backend/Procfile` — инструкции для запуска

## 📝 Переменные окружения

На Railway Dashboard → Settings → Variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-long-random-secret-here
DATABASE_URL=postgresql://...  # Если используете PostgreSQL
```

Если используете SQLite (по умолчанию):
```
DATABASE_URL=sqlite:./database.db
```

## 🚀 Быстрое восстановление

Если деплой по-прежнему падает:

### Шаг 1: Проверить Procfile
```bash
cat backend/Procfile
# Должно быть: web: npm start
```

### Шаг 2: Проверить package.json
```bash
cd backend
cat package.json | grep -A 2 '"scripts"'
# Должно быть: "start": "node dist/index.js"
```

### Шаг 3: Проверить что build работает локально
```bash
cd backend
npm run build
npm start
# Должно запуститься на http://localhost:3000
```

### Шаг 4: Пересоздать Railway проект

1. **На Railway:**
   - Project Settings → Delete Project
   
2. **На GitHub:**
   - Settings → Integrations → Railway → Remove
   
3. **На GitHub:**
   - Settings → Integrations → Railway → Install
   - Reconnect только `cat-code-test` репозиторий

4. **На Railway:**
   - Выбрать `backend` как root directory при создании service
   - Или создать новый service с правильным путём

## 📊 Правильная структура для Railway

Railway ожидает:
```
backend/
├── package.json           ✅ должен быть
├── package-lock.json      ✅ должен быть
├── Procfile               ✅ должен быть
├── tsconfig.json          ✅ должен быть
├── src/
│   └── index.ts
├── dist/                  (создаётся при npm run build)
└── node_modules/          (создаётся при npm install)
```

## 🐳 Альтернатива: Использовать Dockerfile

Если Railway продолжает падать, используйте Docker:

```bash
# В Railway Dashboard:
# 1. Settings → Build Configuration → Builder
# 2. Выбрать "Docker"
# 3. Указать Dockerfile: ./backend/Dockerfile
```

Railway автоматически найдёт и будет использовать `backend/Dockerfile`.

## ✅ Проверить статус

После деплоя:

```bash
# Проверить что приложение живо
curl https://your-railway-app.up.railway.app/api/health

# Посмотреть логи
railway logs
```

## 🆘 Если всё ещё не работает

Создайте issue на GitHub с логами:
1. Railway Dashboard → Logs → скопировать full log
2. GitHub → Issues → New Issue → наклеить логи
3. Описать что пробовали

## 📞 Полезные ссылки

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

**Рекомендуемый способ:** Способ 1 (Dashboard) — самый простой и быстрый!

Если нужна помощь — используйте Способ 3 (удалить и пересоздать).
