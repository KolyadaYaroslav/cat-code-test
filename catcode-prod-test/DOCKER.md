# Docker Setup для ВетГенетика

Запуск приложения в контейнерах с Docker Compose.

## Требования

- **Docker** — https://www.docker.com/products/docker-desktop
- **Docker Compose** — обычно идет с Docker Desktop

## Запуск приложения

### 1. Запустить все сервисы (Backend + Frontend)

```bash
docker-compose up
```

Это запустит:
- **Backend** на http://localhost:3000/api
- **Frontend** на http://localhost:8000
- **Nginx** как reverse proxy

### 2. В фоновом режиме

```bash
docker-compose up -d
```

### 3. Посмотреть логи

```bash
docker-compose logs -f
docker-compose logs -f backend    # только backend
docker-compose logs -f frontend   # только frontend
```

### 4. Остановить приложение

```bash
docker-compose down
```

Удалить с данными:
```bash
docker-compose down -v
```

## Команды

### Перестроить образы
```bash
docker-compose build
```

### Запустить с PostgreSQL (для production)
```bash
docker-compose --profile postgres up
```

### Выполнить команду в контейнере
```bash
docker-compose exec backend npm run build
docker-compose exec backend npm test
```

### Интерактивный shell
```bash
docker-compose exec backend sh
docker-compose exec backend npm list
```

## Переменные окружения

Создайте файл `.env` в корне:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key-super-secure
DATABASE_URL=sqlite:./database.db

# Или для PostgreSQL:
# DATABASE_URL=postgresql://vetuser:vetpass123@postgres:5432/vetgenetika
```

## Architecture

```
┌─────────────────────────────────────┐
│  Docker Compose Network             │
│  (vetgenetika)                      │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │ │
│  │   (Nginx)    │  │ (Node.js)    │ │
│  │ :8000        │  │ :3000        │ │
│  └──────────────┘  └──────────────┘ │
│         │                   │        │
│         └───────────────────┘        │
│                 │                     │
│          ┌──────▼───────┐           │
│          │  PostgreSQL  │           │
│          │  (Optional)  │           │
│          │  :5432       │           │
│          └──────────────┘           │
│                                      │
└─────────────────────────────────────┘
```

## Development режим

### Backend с hot reload

Backend уже настроен на hot reload с ts-node:

```bash
docker-compose up backend
```

При изменении файлов в `backend/src/` контейнер автоматически перезагружается.

### Frontend с live reload

Для live reload фронтенда используйте местный http-server:

```bash
# В другом терминале (без Docker)
cd catcode-prod-test
python3 -m http.server 8000
```

## Production режим

### Собрать production образы

```bash
docker build -t vetgenetika-api:latest ./backend
```

### Запустить production контейнер

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-here \
  --name vetgenetika-api \
  vetgenetika-api:latest
```

### Docker Hub (если нужен)

```bash
# Залить на Docker Hub
docker tag vetgenetika-api:latest yourname/vetgenetika-api:latest
docker push yourname/vetgenetika-api:latest
```

## Health Checks

Backend имеет встроенный health check:

```bash
curl http://localhost:3000/api/health
```

Docker автоматически перезагружает контейнер если health check падает.

## Debugging

### Посмотреть информацию контейнера

```bash
docker-compose ps
docker-compose inspect backend
```

### Посмотреть использование ресурсов

```bash
docker stats
```

### Войти в контейнер

```bash
docker-compose exec backend sh
docker-compose exec postgres psql -U vetuser -d vetgenetika
```

### Посмотреть переменные окружения

```bash
docker-compose exec backend env
```

## Troubleshooting

### "Port already in use"
```bash
# Найти процесс на порту
lsof -i :3000
lsof -i :8000

# Убить процесс
kill -9 <PID>

# Или использовать другой порт
docker-compose -p vetgenetika-alt up -d
```

### "Cannot connect to Docker daemon"
```bash
# Убедитесь что Docker запущен
docker version

# На Mac: запустите Docker Desktop
```

### "Build fails"
```bash
# Удалить образы и пересобрать
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### "Database connection error"
```bash
# Проверить что backend может достучаться до БД
docker-compose exec backend sh
curl http://localhost:3000/api/health
```

## Очистка

### Удалить все контейнеры и образы

```bash
docker-compose down -v
docker system prune -a
```

### Только удалить контейнеры

```bash
docker-compose down
```

### Удалить образ

```bash
docker rmi vetgenetika-api:latest
```

## Advanced

### Масштабирование backend

```bash
docker-compose up -d --scale backend=3
```

### Использовать другой docker-compose файл

```bash
docker-compose -f docker-compose.prod.yml up
```

### Профили (для выборочного запуска)

```bash
# Запустить только backend и postgres
docker-compose --profile postgres up backend postgres

# Посмотреть все профили
docker-compose config --profiles
```

## Полезные ссылки

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Docker Hub: https://hub.docker.com/

---

Готово! Docker контейнеры помогут с конфигурацией окружения! 🐳
