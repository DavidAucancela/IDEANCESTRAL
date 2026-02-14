#!/bin/sh
set -e
# Sincronizar dependencias con package.json (necesario cuando el volumen node_modules está desactualizado)
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  npm ci
else
  npm install --no-audit --no-fund
fi
exec "$@"
