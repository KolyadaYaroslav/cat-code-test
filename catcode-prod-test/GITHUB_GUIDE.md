# GitHub Repository Guide

Репозиторий: **https://github.com/KolyadaYaroslav/cat-code-test**

## ✅ Репозиторий готов!

Весь код уже загружен на GitHub!

## 📚 Документация

В репозитории вы найдёте полную документацию:

### Начните отсюда 🔵
- **GIT_INIT.md** — пошаговая инструкция (уже выполнена)
- **GITHUB_FINAL.md** — финальный checklist
- **QUICKSTART.md** — быстрый старт

### Запуск приложения
- **README.md** — обзор проекта
- **COMMANDS.md** — примеры API запросов
- **DOCKER.md** — запуск через Docker

### Развитие проекта
- **NEXT_STEPS.md** — план развития
- **BACKEND_INTEGRATION_SUMMARY.md** — технические детали

## 🚀 Следующие шаги

### 1. Настроить CI/CD

Workflow уже созданы в `.github/workflows/`:
- `ci.yml` — запускается на каждый push
- `deploy.yml` — запускается при push в main
- `release.yml` — запускается при создании тага

Проверьте вкладку **Actions** — там должны быть логи.

### 2. Добавить Secrets для деплоя

Перейдите в **Settings → Secrets and variables → Actions**

Добавьте одно из этого (выберите платформу):

#### 🟢 Railway (Рекомендуется)

```
RAILWAY_TOKEN=<ваш-токен>
RAILWAY_PROJECT_ID=<id-проекта>
```

Как получить:
1. Зарегистрироваться на https://railway.app
2. Создать проект
3. Settings → Tokens → Create Token
4. Из URL проекта: `https://railway.app/project/[PROJECT_ID]`

#### 🟠 Heroku

```
HEROKU_API_KEY=<api-key>
HEROKU_APP_NAME=vetgenetika-api
HEROKU_EMAIL=your-email@example.com
```

Как получить:
1. Зарегистрироваться на https://heroku.com
2. Settings → API Key
3. Создать приложение: `heroku create vetgenetika-api`

#### 🔵 AWS

```
AWS_ACCESS_KEY_ID=<id>
AWS_SECRET_ACCESS_KEY=<key>
AWS_REGION=us-east-1
```

### 3. Проверить CI/CD

1. Откройте вкладку **Actions**
2. Дождитесь завершения workflow "CI - Build & Test"
3. Должны быть зелёные галочки ✅

Если workflow падает:
- Откройте failed workflow
- Посмотрите логи в нужном step
- Проверьте что нет синтаксических ошибок

### 4. Настроить Notifications (опционально)

Для уведомлений в Slack:

```
Settings → Secrets and variables → Actions
→ New repository secret

SLACK_WEBHOOK_URL=<ваш-вебхук>
```

Как получить:
1. Создайте Slack workspace
2. Create new app → From scratch
3. Incoming Webhooks → Create New Webhook
4. Скопируйте URL

## 📊 Статус проекта

```
Backend:        ✅ Node.js + TypeScript + Express
Frontend:       ✅ Vanilla JS SPA
API:            ✅ 14 endpoints (auth, products, orders)
Database:       ✅ SQLite (dev), готов к PostgreSQL
Docker:         ✅ Dockerfile + docker-compose
CI/CD:          ✅ GitHub Actions (ci, deploy, release)
Documentation:  ✅ 15+ markdown файлов
```

## 🎯 Структура ветвления (Git Workflow)

### Main branch (`main`)
- Production-ready код
- Все PR должны быть reviewed
- Автоматический деплой на production

### Develop branch (создайте если нужна)
```bash
git checkout -b develop
git push origin develop
```

Используется для staging/pre-production.

### Feature branches
```bash
git checkout -b feature/your-feature-name
# ... разработка ...
git push origin feature/your-feature-name
# → создать Pull Request
```

### Naming convention
- `feature/` — новые фишки
- `fix/` — баги
- `docs/` — документация
- `refactor/` — переработка кода
- `perf/` — улучшение производительности

## 📝 Git Commit Messages

Используйте Conventional Commits:

```
feat: добавить поддержку email уведомлений
fix: исправить ошибку JWT токена
docs: обновить API документацию
refactor: переписать service слой
perf: оптимизировать БД запросы
test: добавить unit тесты
chore: обновить зависимости
```

## 🔄 Pull Request Process

1. **Создать branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Разработать фишку**
   ```bash
   git add .
   git commit -m "feat: description of feature"
   ```

3. **Запушить и создать PR**
   ```bash
   git push origin feature/my-feature
   # → На GitHub нажать "Create Pull Request"
   ```

4. **PR template автоматически заполнится**
   - Описание изменений
   - Тип изменения (Bug/Feature/Docs)
   - Тестирование
   - Checklist

5. **GitHub Actions автоматически запустит тесты**
   - ✅ TypeScript compilation
   - ✅ Build
   - ✅ Security audit

6. **После одобрения → merge в main**
   - Автоматический деплой
   - Release notes генерируются

## 📈 Версионирование (Semver)

Используйте semantic versioning для tags:

```bash
# Patch (fix)
git tag -a v1.0.1 -m "v1.0.1 - Bug fixes"
git push origin v1.0.1

# Minor (feature)
git tag -a v1.1.0 -m "v1.1.0 - New features"
git push origin v1.1.0

# Major (breaking change)
git tag -a v2.0.0 -m "v2.0.0 - Major rewrite"
git push origin v2.0.0
```

Автоматически:
- Создается GitHub Release
- Генерируется Changelog
- Запускается deploy workflow

## 🐛 Reporting Bugs

Используйте issue template:
1. **Issues** tab → **New Issue**
2. Выберите "Bug Report"
3. Заполните форму

## 💡 Suggesting Features

1. **Issues** tab → **New Issue**
2. Выберите "Feature Request"
3. Опишите идею

## 🔍 Code Review

При review обратите внимание:
- ✅ Код соответствует TypeScript strict mode
- ✅ Нет console.log в production коде
- ✅ Обработаны все error cases
- ✅ Тесты добавлены
- ✅ Документация обновлена
- ✅ Нет хардкодованных secrets

## 📊 GitHub Actions Secrets

**Текущие secrets:**
```
(будут добавлены вами для CI/CD)
```

**Как добавить:**
Settings → Secrets and variables → Actions → New repository secret

**Важно:** Никогда не коммитьте `.env` файлы!

## 🚢 Deployment

### Automatic deployment
Push в `main` → автоматический деплой на production

```bash
git push origin main
# → GitHub Actions запустит deploy workflow
# → Приложение обновится на production
```

### Manual deployment
Если нужно пересоздать приложение:
```bash
# 1. Создать Railway/Heroku приложение
# 2. Добавить Secrets
# 3. Запушить код в main
# 4. GitHub Actions автоматически развернет
```

## 🔐 Security

### Branch Protection Rules

Рекомендуется установить в Settings → Branches:
- ✅ Require status checks to pass
- ✅ Require code reviews (1 минимум)
- ✅ Require branches to be up to date

### Secret Management

- ✅ Хранить secrets в GitHub Secrets
- ✅ Использовать в workflow через `${{ secrets.NAME }}`
- ✅ Никогда не логировать secrets
- ✅ Регулярно rotировать keys

## 📞 Помощь

### Workflow fails?
1. Откройте **Actions** tab
2. Выберите failed run
3. Раскройте step с ошибкой
4. Смотрите логи

### Code push fails?
```bash
# Убедитесь что branch up to date
git pull origin main

# Смержите конфликты если есть
git merge origin/main

# Пушьте снова
git push origin main
```

### Deployment issues?
1. Проверьте GitHub Actions логи
2. Проверьте что Secrets добавлены
3. Проверьте что CI workflow зелёный
4. Смотрите production логи на Railway/Heroku

## 🎉 Готово!

Репозиторий полностью настроен и готов к работе!

Начните с создания feature branch и первого PR:

```bash
git checkout -b feature/your-first-feature
# ... разработка ...
git push origin feature/your-first-feature
# → Create Pull Request на GitHub
```

Удачи в разработке! 🚀
