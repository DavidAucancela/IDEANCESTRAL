# Funciona con contexto raíz (Render) y con contexto ./backend (docker-compose)
# docker-compose usa: context: .  dockerfile: backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Rutas relativas al contexto (raíz del repo en Render, . en docker-compose)
COPY backend/package*.json ./
RUN npm ci

COPY backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

COPY backend/ .

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
