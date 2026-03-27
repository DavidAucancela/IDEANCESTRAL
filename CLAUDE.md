# CLAUDE.md — Ideancestral

## Descripcion del proyecto

**Ideancestral** es una plataforma e-commerce full-stack para una tienda de artesanías ubicada en el Mercado Artesanal La Mariscal, Quito, Ecuador. Permite exhibir y vender productos artesanales (cerámica, madera, textiles, etc.) con integración de pedidos por WhatsApp.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 (Composition API) + Vite |
| Estado | Pinia |
| Routing | Vue Router 4 |
| HTTP | Axios (con interceptor para refresh de tokens) |
| i18n | vue-i18n (es, en, pt) |
| Backend | Node.js 20 + Express 4 |
| Base de datos | PostgreSQL 16 |
| Auth | JWT + bcryptjs + refresh tokens |
| Uploads | Multer + validación MIME real |
| Seguridad | Helmet, express-rate-limit, xss, Zod |
| Logging | Pino |
| Containers | Docker + Docker Compose |
| Deploy | Railway (Dockerfile en `backend/Dockerfile`) |

## Estructura de directorios

```
IDEANCESTRAL/
├── frontend/
│   ├── src/
│   │   ├── views/           # CatalogoView, CategoriaView, ProductoDetalleView, AdminView, NotFoundView
│   │   ├── components/      # ThemeToggle, LanguageSwitcher, ToastContainer, LightboxModal, BackToTop
│   │   ├── stores/          # carrito.js, language.js, theme.js
│   │   ├── composables/     # useCarrito, useToast, useScrollAnimation
│   │   ├── router/index.js  # 4 rutas + fallback 404
│   │   └── i18n/            # es.js, en.js, pt.js
│   ├── public/imagenes/     # ~40+ imágenes estáticas de productos
│   ├── nginx.conf           # Config Nginx para Docker
│   └── Dockerfile           # Multi-stage: Vite build + Nginx
│
├── backend/
│   ├── server.js            # Entry point Express + seguridad
│   ├── routes/              # productos, categorias, imagenes, auth, promociones
│   ├── middleware/          # auth.js (JWT), auditLog.js, httpsRedirect.js
│   ├── database/
│   │   ├── connection.js    # Pool PostgreSQL (soporta DATABASE_URL o vars individuales)
│   │   ├── schema.sql       # 7 tablas
│   │   ├── seed.sql         # Datos de ejemplo
│   │   └── migrations/      # 002_security.sql, 003_update_product_images.sql
│   ├── utils/               # sanitize.js, validateMime.js
│   ├── scripts/             # init-db, create-admin, check-env, run-migrations
│   ├── uploads/             # Imágenes subidas por admin (runtime)
│   └── Dockerfile           # Multi-stage: sirve frontend + backend desde un solo contenedor
│
├── docs/                    # Guías: SETUP, RAILWAY_DEPLOY, RENDER_DEPLOY, SEGURIDAD, PRUEBAS, etc.
├── docker-compose.yml       # 3 servicios: db (5435), backend (3000), frontend (5173)
├── railway.toml             # builder=DOCKERFILE, dockerfilePath=backend/Dockerfile
└── package.json             # Scripts raíz con concurrently
```

## Base de datos — tablas principales

1. `categorias` — Categorías de productos
2. `productos` — Inventario con precio, stock, descripción, flags de destacado/activo
3. `imagenes_productos` — Múltiples imágenes por producto
4. `administradores` — Usuarios admin
5. `promociones` — Promociones estacionales (Navidad, Día de la Madre, Fiestas de Quito, Inti Raymi)
6. `refresh_tokens` — Gestión de JWT refresh tokens
7. `admin_audit_log` — Historial de acciones administrativas

## API endpoints

```
GET  /api/productos              # Listado con paginación, filtros y ordenamiento
POST/PUT/DELETE /api/productos   # CRUD (requiere auth)
GET  /api/categorias             # Listado de categorías
POST/DELETE /api/categorias      # Gestión (requiere auth)
POST /api/imagenes               # Upload de imágenes (Multer, requiere auth)
POST /api/auth/login             # Login (rate-limited: 5 req/15min)
POST /api/auth/refresh           # Refresh JWT token
GET  /api/promociones            # Listado de promociones
GET  /api/health                 # Health check
GET  /uploads/*                  # Archivos estáticos (verificados contra DB)
```

## Variables de entorno requeridas

```bash
# backend/.env
DATABASE_URL=postgresql://...   # O usar DB_HOST/PORT/NAME/USER/PASSWORD
PORT=3000
NODE_ENV=development|production
JWT_SECRET=...                  # Mínimo 32 chars (openssl rand -base64 32)
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
LOG_LEVEL=info

# Validaciones al arrancar:
# - JWT_SECRET: min 32 chars, falla hard si no cumple
# - DB_PASSWORD: rechaza valores comunes (admin, postgres, password, 123456, root)
```

## Comandos de desarrollo

```bash
npm run install:all                     # Instalar todas las dependencias
cp .env.example .env && cp backend/.env.example backend/.env
npm run dev                             # Frontend (5173) + Backend (3000) en paralelo
node backend/scripts/init-db.js --seed  # Inicializar DB con datos de prueba
node backend/scripts/create-admin.js    # Crear primer admin

# Docker
docker-compose up --build               # Entorno completo en contenedores
npm run db:start                        # Solo la base de datos en Docker
```

## Funcionalidades clave del frontend

- **Catálogo** con filtros por categoría, búsqueda, ordenamiento y paginación
- **Carrito de compras** persistido en localStorage + pedido por WhatsApp
- **Tema claro/oscuro** con persistencia en localStorage
- **Multi-idioma**: Español, Inglés, Portugués
- **Panel Admin** (`/admin`) protegido con JWT: CRUD productos/categorías, upload imágenes, gestión de promociones
- **Lightbox** para visualizar imágenes ampliadas
- **Animaciones de scroll** con IntersectionObserver

## Deploy en Railway

- Usa `backend/Dockerfile` (multi-stage: compila el frontend con Vite y lo sirve junto con el backend Express)
- Configurado en `railway.toml`
- El `docker-entrypoint.sh` ejecuta migraciones de DB al arrancar en producción
- Commits recientes: correcciones de puerto, healthcheck removido para fix del deploy

## Notas de seguridad

- Rate limiting: 200 req/15min global, 5/15min en login, 20/15min en refresh
- CORS configurado para FRONTEND_URL + localhost dev ports
- Sanitización XSS en inputs con la librería `xss`
- Validación MIME real en uploads (no solo extensión)
- Archivos servidos verificados contra tabla `imagenes_productos`
- Audit log de acciones admin
- HTTPS redirect middleware en producción
