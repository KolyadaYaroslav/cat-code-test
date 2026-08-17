# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY backend/package*.json ./

# Устанавливаем зависимости (включая dev)
RUN npm ci

# Копируем исходный код
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Собираем TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Копируем только необходимые файлы из builder
COPY backend/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --production

# Копируем собранный код
COPY --from=builder /app/dist ./dist

# Создаем non-root пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

CMD ["npm", "start"]
