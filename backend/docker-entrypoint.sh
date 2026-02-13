#!/bin/sh
set -e
# Instalar dependencias si node_modules no existe o está vacío (evita conflicto con volumen montado)
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  npm ci
fi
exec "$@"
