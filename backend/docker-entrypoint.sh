#!/bin/sh
set -e

# Sincronizar dependencias con package.json
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  npm ci
else
  npm install --no-audit --no-fund
fi

# En producción: ejecutar migraciones antes de arrancar el servidor
# Aplica schema.sql + todas las migraciones en database/migrations/
# Es idempotente: seguro de correr en cada deploy
if [ "$NODE_ENV" = "production" ]; then
  echo "Ejecutando migraciones de base de datos..."
  node scripts/init-db.js
  echo "Migraciones completadas."
fi

exec "$@"
