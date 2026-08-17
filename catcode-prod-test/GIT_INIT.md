# Инициализация GitHub репозитория

Пошаговая инструкция для загрузки проекта на GitHub.

## Шаг 1: Подготовить локальный репозиторий

```bash
# Перейти в папку проекта
cd /Users/yaroslavkolyada/Projects/cat-code-test/asdasd/catcode-prod-test

# Проверить что .gitignore существует
ls -la .gitignore
# → должен быть файл .gitignore

# Инициализировать Git (если еще не сделано)
git init

# Проверить статус
git status

# Добавить все файлы (кроме .gitignore)
git add .

# Первый коммит
git commit -m "Initial commit: Backend + Frontend integration"
```

## Шаг 2: Создать репозиторий на GitHub

1. Перейти на https://github.com/new
2. Заполнить информацию:
   - **Repository name:** `catcode-prod-test` (или другое имя)
   - **Description:** `Online store for cattle insemination products with REST API backend`
   - **Visibility:** Public (или Private)
   - **Initialize repository:** НЕ ОТМЕЧАТЬ (уже есть код)
3. Нажать "Create repository"

## Шаг 3: Подключить локальный репозиторий к GitHub

```bash
# Добавить remote (замените USERNAME и REPO на ваши)
git remote add origin https://github.com/YOUR_USERNAME/catcode-prod-test.git

# Проверить remote
git remote -v

# Переименовать ветку на main (если нужно)
git branch -M main

# Запушить код
git push -u origin main
```

## Шаг 4: Проверить на GitHub

1. Откройте https://github.com/YOUR_USERNAME/catcode-prod-test
2. Убедитесь что все файлы есть
3. Проверьте что README.md отображается

## Шаг 5: Настроить GitHub Actions

GitHub Actions должны автоматически запуститься!

1. Откройте вкладку **Actions**
2. Вы должны увидеть workflow "CI - Build & Test"
3. Дождитесь завершения

## Шаг 6: Добавить Secrets для деплоя

**Settings → Secrets and variables → Actions**

Выберите способ деплоя:

### Вариант 1: Railway (Рекомендуется)

```bash
# 1. Зарегистрироваться на https://railway.app
# 2. Создать новый проект
# 3. Подключить GitHub репозиторий
# 4. Railway автоматически создаст приложение

# Получить токен:
# Account Settings → API Tokens

# Получить Project ID из URL:
# https://railway.app/project/[PROJECT_ID]

# Добавить в GitHub Secrets:
RAILWAY_TOKEN=<ваш-токен>
RAILWAY_PROJECT_ID=<id-проекта>
```

### Вариант 2: Heroku

```bash
# 1. Зарегистрироваться на https://heroku.com
# 2. Создать приложение: heroku create vetgenetika-api
# 3. Добавить БД: heroku addons:create heroku-postgresql:hobby-dev

# Получить API KEY:
# https://dashboard.heroku.com/account/settings

# Добавить в GitHub Secrets:
HEROKU_API_KEY=<ваш-api-key>
HEROKU_APP_NAME=vetgenetika-api
HEROKU_EMAIL=your-email@example.com
```

## Шаг 7: Создать первый Release

```bash
# Создать tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Запушить tag
git push origin v1.0.0
```

Посмотрите **Releases** вкладку - там автоматически создастся Release!

## Шаг 8: Настроить Branch Protection (опционально)

**Settings → Branches → Add rule**

- Branch name: `main`
- Require status checks to pass before merging ✓
- Require branches to be up to date before merging ✓
- Require pull request reviews before merging ✓

## Шаг 9: Добавить Badges в README

Откройте `README.md` и добавьте в начало:

```markdown
[![CI Status](https://github.com/YOUR_USERNAME/catcode-prod-test/workflows/CI%20-%20Build%20%26%20Test/badge.svg)](https://github.com/YOUR_USERNAME/catcode-prod-test/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
```

## Шаг 10: Настроить CHANGELOG автоматически

```bash
# Инициализировать conventional-changelog
npm install -g conventional-changelog-cli

# Создать CHANGELOG
conventional-changelog -p angular -i CHANGELOG.md -s

# Добавить в Git
git add CHANGELOG.md
git commit -m "docs: generate initial CHANGELOG"
git push
```

## Полезные команды Git

### Работа с ветками

```bash
# Создать новую ветку
git checkout -b feature/new-feature

# Опубликовать ветку
git push -u origin feature/new-feature

# Слить ветку в main
git checkout main
git pull
git merge feature/new-feature
git push
```

### Просмотр истории

```bash
# Логи коммитов
git log --oneline

# Сравнить с origin
git status

# Разница между ветками
git diff main origin/main
```

### Откат изменений

```bash
# Отменить неопубликованные изменения
git checkout -- файл

# Откатить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Откатить последний коммит полностью
git revert HEAD
```

## CI/CD Workflow

```
commit на main
     ↓
GitHub Actions запускает CI
     ↓
Проверка TypeScript, тесты
     ↓
Если успешно → автоматический деплой
     ↓
Приложение доступно в production
```

## Смотреть логи CI/CD

1. Откройте **Actions** в GitHub
2. Выберите последний workflow run
3. Раскройте нужный step для просмотра логов

## Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/repo.git
```

### "fatal: not a git repository"
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/repo.git
git fetch origin
git reset --hard origin/main
```

### "Your branch is ahead of 'origin/main'"
```bash
git push origin main
```

### "Updates were rejected because the remote contains work"
```bash
git pull origin main
git merge
git push
```

## Следующие шаги

1. ✅ GitHub репозиторий создан
2. ✅ CI/CD настроен
3. ⏳ Добавить тесты (Jest, Cypress)
4. ⏳ Настроить pre-commit hooks
5. ⏳ Документировать API (Swagger/OpenAPI)
6. ⏳ Настроить SonarQube для качества кода
7. ⏳ Добавить зависимости для production

## Дополнительные ресурсы

- GitHub Docs: https://docs.github.com
- Git Book: https://git-scm.com/book
- Conventional Commits: https://www.conventionalcommits.org/

---

Готово! Ваш проект на GitHub с CI/CD! 🚀
