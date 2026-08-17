# GitHub CI/CD Setup Guide

## Шаг 1: Создать GitHub репозиторий

```bash
# Инициализировать Git
cd /Users/yaroslavkolyada/Projects/cat-code-test/asdasd/catcode-prod-test
git init
git add .
git commit -m "Initial commit: Backend + Frontend integration"

# Добавить удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/catcode-prod-test.git
git branch -M main
git push -u origin main
```

## Шаг 2: Настроить GitHub Secrets

Перейдите: **Settings → Secrets and variables → Actions**

Добавьте следующие secrets:

### Для Railway (Рекомендуется)
```
RAILWAY_TOKEN=                          # https://railway.app/account/tokens
RAILWAY_PROJECT_ID=                     # Из URL Railway проекта
```

### ИЛИ для Heroku
```
HEROKU_API_KEY=                         # https://dashboard.heroku.com/account/settings
HEROKU_APP_NAME=vetgenetika-api         # Имя приложения на Heroku
HEROKU_EMAIL=your-email@example.com     # Email аккаунта Heroku
```

### ИЛИ для AWS
```
AWS_ACCESS_KEY_ID=                      # AWS IAM credentials
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
```

### Опционально: Notifications
```
SLACK_WEBHOOK_URL=                      # https://api.slack.com/messaging/webhooks
```

## Шаг 3: Проверить CI/CD

1. Откройте репозиторий на GitHub
2. Перейдите **Actions**
3. Дождитесь завершения workflow "CI - Build & Test"

Должны быть зелёные галочки ✅

## Шаг 4: Настроить деплой

### Опция 1: Railway (Самый простой способ)

1. Зарегистрироваться на https://railway.app
2. Создать новый проект
3. Выбрать "Deploy from GitHub"
4. Подключить репозиторий
5. Настроить переменные окружения:
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-very-long-random-secret-here
   DATABASE_URL=postgresql://...  # Если используете PostgreSQL
   ```
6. Railway автоматически развернёт приложение

**Копировать токен и ID проекта в GitHub Secrets**

### Опция 2: Heroku

1. Зарегистрироваться на https://heroku.com
2. Создать новое приложение: `heroku create vetgenetika-api`
3. Добавить PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Получить API KEY в Settings
5. Установить Heroku CLI и связать репозиторий

**Копировать API KEY и имя приложения в GitHub Secrets**

### Опция 3: AWS

1. Создать AWS аккаунт
2. Создать IAM пользователя с EC2, RDS, S3 доступом
3. Получить Access Key и Secret Key
4. Настроить Elastic Beanstalk или EC2 инстанс

**Копировать credentials в GitHub Secrets**

## Шаг 5: Создать Release для деплоя

```bash
# Создать tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Пушить tag на GitHub
git push origin v1.0.0
```

GitHub автоматически:
- Создаст Release с changelog
- Запустит деплой workflow
- Отправит уведомление в Slack (если настроен)

## Шаг 6: Мониторинг

### Смотреть статус CI/CD
```bash
https://github.com/YOUR_USERNAME/catcode-prod-test/actions
```

### Logspush в Railway
```bash
railway logs
```

### Logspush в Heroku
```bash
heroku logs --tail --app vetgenetika-api
```

## Структура Workflows

### `.github/workflows/ci.yml` — Тестирование
Запускается на **каждый push** и **pull request**
- Проверка TypeScript
- Сборка
- Проверка безопасности
- Валидация фронтенда

### `.github/workflows/deploy.yml` — Деплой
Запускается при **push на main ветку**
- Тестирование
- Собрание backend
- Деплой на Railway/Heroku/AWS
- Уведомление в Slack

### `.github/workflows/release.yml` — Release
Запускается при **создании тага (v*.*.*)** 
- Валидация версии
- Создание GitHub Release
- Генерация changelog

## Синтаксис commit messages

Используйте Conventional Commits для автоматического changelog:

```
feat: добавить фишку        → Features
fix: исправить баг           → Bug Fixes
docs: обновить документацию  → Documentation
style: форматирование       → Style
refactor: переписать код    → Refactoring
perf: улучшить производител → Performance
test: добавить тесты        → Tests
```

Примеры:
```
git commit -m "feat: add email notifications for orders"
git commit -m "fix: resolve JWT token expiration issue"
git commit -m "docs: update API documentation"
```

## Отладка

### Посмотреть логи workflow
1. Откройте **Actions** в GitHub
2. Выберите workflow run
3. Раскройте step, который упал

### Локально проверить ci.yml
```bash
# Установить act
brew install act  # или brew install nektos/tap/act

# Запустить локально
act -l  # посмотреть доступные actions
act     # запустить workflow
```

### Проверить синтаксис YAML
```bash
npm install -g yaml-validator
yaml-validator .github/workflows/ci.yml
```

## Production Environment Secrets

**Важно:** Никогда не коммитьте .env файлы!

Для production используйте GitHub Secrets или переменные платформы:

**Railway:**
```
Settings → Variables
```

**Heroku:**
```bash
heroku config:set KEY=value
```

**AWS:**
```bash
aws ssm put-parameter --name /vetgenetika/jwt_secret --value "..."
```

## Badges для README

Добавьте в README.md:

```markdown
[![CI Status](https://github.com/YOUR_USERNAME/catcode-prod-test/workflows/CI%20-%20Build%20%26%20Test/badge.svg)](https://github.com/YOUR_USERNAME/catcode-prod-test/actions)
[![Deploy Status](https://github.com/YOUR_USERNAME/catcode-prod-test/workflows/Deploy/badge.svg)](https://github.com/YOUR_USERNAME/catcode-prod-test/actions)
```

## Troubleshooting

### "Build failed on GitHub but works locally"
- Проверьте версию Node.js
- Убедитесь, что все зависимости в package.json
- Проверьте переменные окружения в Secrets

### "Deploy не срабатывает"
- Проверьте что branch `main` (не `master`)
- Убедитесь что CI workflow успешно прошел
- Проверьте GitHub Secrets заполнены правильно

### "TypeScript compilation fails"
- Запустите локально: `npm run build`
- Проверьте tsconfig.json
- Удалите node_modules и переустановите: `npm ci`

## Дополнительно

### Автоматические зависимости
Используйте Dependabot для автоматических обновлений:

**Settings → Code security and analysis → Dependabot**

### Branch protection rules
**Settings → Branches → Add branch protection rule**
- Require status checks to pass before merging
- Require code reviews
- Require branches to be up to date

---

Готово! Теперь у вас есть полный CI/CD pipeline! 🚀
