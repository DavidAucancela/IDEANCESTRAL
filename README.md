# Catálogo Artesanal - Ideancestral

Sistema de catálogo web para exhibir artículos de artesanías desarrollado con Vue 3 y PostgreSQL.

## 🚀 Características

### Para Visitantes
- ✅ Ver catálogo completo de productos
- ✅ Filtrar productos por categorías
- ✅ Ver detalle completo de cada producto
- ✅ Galería de imágenes por producto
- ✅ **Carrito de compras** con envío de pedidos por WhatsApp
- ✅ **Promociones por temporada** (Navidad, Día de la Madre, Fiestas de Quito, Inti Raymi)
- ✅ **Internacionalización** (Español, Inglés, Portugués)
- ✅ **Modo oscuro/claro** configurable
- ✅ **Carrusel** en banner central con transiciones suaves
- ✅ Diseño responsive (móvil y desktop)
- ✅ Navegación intuitiva
- ✅ Botón flotante de WhatsApp

### Para Administradores
- ✅ Panel de administración completo
- ✅ CRUD de productos (Crear, Leer, Actualizar, Eliminar)
- ✅ Gestión de categorías
- ✅ Gestión de promociones por temporada
- ✅ Subir múltiples imágenes por producto
- ✅ Publicar/ocultar productos
- ✅ Marcar productos como destacados
- ✅ Autenticación segura (JWT)
- ✅ Script para crear administrador inicial

## 🛠️ Tecnologías

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Vite
- Pinia (estado global)
- Axios
- i18n (internacionalización)
- CSS3 (Responsive Design, variables CSS)

### Backend
- Node.js
- Express
- PostgreSQL
- Multer (gestión de archivos)
- JWT (autenticación)
- bcryptjs (hash de contraseñas)
- Helmet (headers de seguridad)
- express-rate-limit (limitación de peticiones)
- Pino (logging)
- Zod (validación)

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/DavidAucancela/IDEANCESTRAL.git
cd IdeAncestral
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar Base de Datos

#### Opción A: Script automático (recomendado)
```bash
cd backend
node scripts/init-db.js
```

Con datos de ejemplo:
```bash
node scripts/init-db.js --seed
```

#### Opción B: Manualmente
```sql
CREATE DATABASE catalogo_artesanias;
\q
psql -U postgres -d catalogo_artesanias -f backend/database/schema.sql
psql -U postgres -d catalogo_artesanias -f backend/database/seed.sql
```

### 4. Configurar Variables de Entorno

#### Backend:
```bash
cd backend
cp .env.example .env
```

Editar `backend/.env` con valores seguros:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_artesanias
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
PORT=3000
JWT_SECRET=genera_con_openssl_rand_base64_32
```

Generar JWT_SECRET:
```bash
openssl rand -base64 32
```

#### Frontend:
Crear `frontend/.env` (o copiar desde `.env.example` si existe):
```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Ejecutar migración de seguridad (bases existentes)

Si ya tenías la base de datos antes de las mejoras de seguridad:

```bash
cd backend
npm run migrate
```

Esto crea las tablas `refresh_tokens` y `admin_audit_log`. Las nuevas instalaciones con `init-db` ya las incluyen.

### 6. Crear usuario administrador

```bash
cd backend
# Configurar ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD en .env
node scripts/create-admin.js
```

Alternativa vía API (solo desarrollo):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"usuario": "admin", "email": "admin@example.com", "password": "tu_password_seguro"}'
```

## 🚀 Ejecución

### Desarrollo (Frontend + Backend simultáneamente)
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Solo Frontend
```bash
npm run dev:frontend
```

### Solo Backend
```bash
npm run dev:backend
```

### Producción
```bash
# Build del frontend
npm run build

# Iniciar backend
cd backend
npm start
```

## 🐳 Docker

```bash
cp .env.example .env
# Editar .env con DB_PASSWORD, JWT_SECRET
docker-compose up --build
```

Accede en http://localhost:5173

## ☁️ Despliegue en Render

Consulta **[RENDER_DEPLOY.md](RENDER_DEPLOY.md)** para la guía completa paso a paso.

### Configuración recomendada

| Campo | Valor |
|-------|-------|
| **Root Directory** | *(vacío)* |
| **Build Command** | `npm run install:all && npm run build:prod` |
| **Start Command** | `cd backend && npm start` |
| **Release Command** | `cd backend && node scripts/init-db.js` *(opcional, solo primer deploy)* |

### Variables de entorno en Render
- `NODE_ENV` = `production`
- `DATABASE_URL` *(si usas PostgreSQL de Render)* o `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (mínimo 32 caracteres)
- `FRONTEND_URL` = URL de tu app (ej. `https://ideancestral.onrender.com`) Consulta `SETUP.md` para más detalles.

## 📁 Estructura del Proyecto

```
IdeAncestral/
├── frontend/
│   ├── src/
│   │   ├── views/           # CatalogoView, CategoriaView, ProductoDetalleView, AdminView
│   │   ├── components/      # ThemeToggle, LanguageSwitcher, ToastContainer
│   │   ├── stores/          # carrito, theme, language
│   │   ├── composables/     # useCarrito, useToast
│   │   ├── i18n/            # es, en, pt
│   │   ├── router/
│   │   └── App.vue
│   └── public/imagenes/
│
├── backend/
│   ├── routes/              # productos, categorias, imagenes, auth, promociones
│   ├── middleware/          # auth
│   ├── database/            # schema.sql, seed.sql, connection.js
│   ├── scripts/             # init-db, create-admin
│   ├── uploads/
│   └── server.js
│
└── package.json
```
## 🔒 Seguridad

### Implementado
- ✅ JWT con expiración (24h)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de JWT_SECRET y DB_PASSWORD al iniciar
- ✅ Helmet (headers de seguridad)
- ✅ Rate limiting global (200 req/15 min)
- ✅ Rate limiting en login (5 intentos/15 min)
- ✅ CORS configurado por origen
- ✅ Validación de Origin para operaciones de escritura (protección CSRF básica)
- ✅ `/uploads` protegido: solo archivos registrados en BD
- ✅ Logging con Pino

### Implementado (nivel alto)
- ✅ HTTPS obligatorio en producción (redirect si X-Forwarded-Proto: http)
- ✅ Sanitización de inputs (XSS) con librería `xss`
- ✅ Validación de tipos MIME en uploads (magic bytes con `file-type`)
- ✅ Refresh tokens (7 días, tabla `refresh_tokens`)
- ✅ Auditoría de acciones (tabla `admin_audit_log`)


### Checklist para llegar al 100%

1. **Pruebas** (prioridad alta)
   - [x] Tests unitarios backend (sanitize)
   - [x] Tests unitarios frontend (carrito store)
   - [ ] Ampliar cobertura y test E2E

2. **Seguridad** (prioridad media)
   - [x] Sanitización XSS en productos, categorías, promociones, auth
   - [x] Validación MIME real en uploads
   - [ ] Revisar Content-Security-Policy (actualmente deshabilitada)

## 📱 Responsive Design

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Móvil (< 768px)

## 📝 Notas

- Las imágenes se almacenan en `backend/uploads/`
- El esquema incluye triggers para `updated_at`
- Los productos pueden marcarse como destacados y publicarse/ocultarse
- Acceso oculto al admin: mantener pulsado el logo "IA" durante 5 segundos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a Ideancestral.

## 📧 Contacto

- Email: mary_cecy_ma@hotmail.com
- Tel: (02) 2227781 / +593 998 956 361
- Instagram: [@ideancestral](https://www.instagram.com/ideancestral/)
- Ubicación: Jorge Washington y Juan Leon Mera, Mercado Artesanal La Mariscal, Quito, Ecuador
