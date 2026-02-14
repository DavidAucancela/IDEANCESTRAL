FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Entrypoint fuera de /app para que el volumen montado no lo sobrescriba (evita CRLF en Windows)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

COPY . .

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
