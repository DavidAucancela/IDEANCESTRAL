# Funciona con contexto raíz (Render) y con contexto ./backend (docker-compose)
# Incluye frontend compilado para despliegue monolítico
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ENV VITE_API_URL=/api
RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

COPY backend/ .

# Frontend compilado (server.js busca en ../frontend/dist)
COPY --from=frontend-builder /frontend/dist /frontend/dist

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
