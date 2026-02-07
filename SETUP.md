# Guía de Configuración Rápida

## Pasos Rápidos para Iniciar el Proyecto

### 1. Instalar Dependencias
```bash
npm run install:all
```

### 2. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y corriendo. Luego:

#### Opción A: Usar el script automático
```bash
cd backend
node scripts/init-db.js
```

Para incluir datos de ejemplo:
```bash
node scripts/init-db.js --seed
```

#### Opción B: Manualmente
```sql
-- Conectarse a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE catalogo_artesanias;

-- Salir y ejecutar el esquema
\q
psql -U postgres -d catalogo_artesanias -f backend/database/schema.sql

-- (Opcional) Cargar datos de ejemplo
psql -U postgres -d catalogo_artesanias -f backend/database/seed.sql
```

### 3. Configurar Variables de Entorno

#### Backend
```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_artesanias
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
PORT=3000
JWT_SECRET=mi_secret_key_super_segura_12345
```

#### Frontend
```bash
cd frontend
cp .env.example .env
```

El archivo `.env` del frontend ya está configurado por defecto.

### 4. Crear Usuario Administrador

Una vez que el backend esté corriendo, puedes crear un administrador:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "email": "admin@ideancestral.com",
    "password": "tu_password_seguro"
  }'
```

O desde el navegador usando Postman/Thunder Client.

### 5. Iniciar el Proyecto

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- Frontend en: http://localhost:5173
- Backend en: http://localhost:3000

### 6. Acceder al Sistema

- **Catálogo público**: http://localhost:5173
- **Panel de administración**: http://localhost:5173/admin

## Solución de Problemas Comunes

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica las credenciales en `backend/.env`
- Asegúrate de que la base de datos existe

### Error al subir imágenes
- Verifica que el directorio `backend/uploads` existe
- Verifica permisos de escritura en el directorio

### CORS errors
- Asegúrate de que el backend esté corriendo en el puerto 3000
- Verifica que `VITE_API_URL` en `frontend/.env` apunte al backend correcto

### El frontend no carga productos
- Verifica que el backend esté corriendo
- Abre la consola del navegador para ver errores
- Verifica que la URL de la API sea correcta

## Estructura de Archivos Importantes

```
backend/
├── .env                    # Configuración (crear desde .env.example)
├── uploads/                # Imágenes subidas (se crea automáticamente)
└── database/
    ├── schema.sql          # Esquema de base de datos
    └── seed.sql            # Datos de ejemplo

frontend/
└── .env                    # Configuración (crear desde .env.example)
```

## Próximos Pasos

1. Sube imágenes de productos desde el panel de administración
2. Crea categorías personalizadas
3. Personaliza los estilos según tu marca
4. Configura el dominio y despliega en producción
