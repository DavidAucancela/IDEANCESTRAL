# Ideancestral - Catálogo Artesanal

Sistema web para exhibir y gestionar el catálogo de productos artesanales de **Ideancestral**, una tienda ubicada en el Mercado Artesanal La Mariscal, Quito, Ecuador.

---

## Características

### Para visitantes
- Catálogo completo de productos con filtros por categoría
- Vista de detalle con galería de imágenes por producto
- Carrito de compras con envío de pedidos por WhatsApp
- Promociones por temporada (Navidad, Día de la Madre, Fiestas de Quito, Inti Raymi)
- Internacionalización: Español, Inglés y Portugués
- Modo oscuro / claro
- Carrusel animado en el banner principal
- Diseño responsive (móvil, tablet y escritorio)
- Botón flotante de contacto por WhatsApp

### Para administradores
- Panel de administración con acceso protegido
- CRUD completo de productos, categorías e imágenes
- Gestión de promociones por temporada
- Subida de múltiples imágenes por producto
- Control de visibilidad y productos destacados
- Autenticación segura con JWT y refresh tokens
- Registro de auditoría de acciones administrativas

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 (Composition API), Vite, Pinia, Vue Router, Axios, vue-i18n |
| Backend | Node.js, Express, Multer, JWT, bcryptjs, Zod, Pino |
| Base de datos | PostgreSQL |
| Seguridad | Helmet, express-rate-limit, sanitización XSS, validación MIME |
| Infraestructura | Docker Compose, Render |

---

## Estructura del proyecto

```
IdeAncestral/
├── frontend/
│   └── src/
│       ├── views/          # CatalogoView, CategoriaView, ProductoDetalleView, AdminView
│       ├── components/     # ThemeToggle, LanguageSwitcher, ToastContainer
│       ├── stores/         # carrito, theme, language (Pinia)
│       ├── composables/    # useCarrito, useToast
│       ├── i18n/           # Traducciones: es, en, pt
│       └── router/
│
├── backend/
│   ├── routes/             # productos, categorias, imagenes, auth, promociones
│   ├── middleware/         # Autenticación JWT
│   ├── database/           # schema.sql, seed.sql, migraciones, conexión
│   ├── scripts/            # Inicialización de BD y creación de admin
│   ├── utils/              # Sanitización, validaciones
│   └── server.js
│
├── docs/                   # Guías de despliegue, seguridad y devops
├── docker-compose.yml
└── package.json
```

---

## Instalación y puesta en marcha

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL v12 o superior (o Docker)

### 1. Clonar el repositorio
```bash
git clone https://github.com/DavidAucancela/IDEANCESTRAL.git
cd IdeAncestral
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar variables de entorno
```bash
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env con los valores del entorno
```

```bash
# Frontend
# Crear frontend/.env con la URL de la API
VITE_API_URL=<URL del backend>/api
```

### 4. Inicializar la base de datos
```bash
cd backend
node scripts/init-db.js          # Solo esquema
node scripts/init-db.js --seed   # Con datos de ejemplo
```

### 5. Crear usuario administrador
```bash
cd backend
# Configurar ADMIN_USER, ADMIN_EMAIL y ADMIN_PASSWORD en .env
node scripts/create-admin.js
```

### 6. Ejecutar en desarrollo
```bash
npm run dev       # Frontend + Backend simultáneamente
```

---

## Ejecución con Docker

```bash
cp .env.example .env   # Completar DB_PASSWORD y JWT_SECRET
docker-compose up --build
```

Acceso local tras levantar los contenedores: `http://localhost:5173`

---

## Despliegue en producción (Render)

Consulta [`docs/RENDER_DEPLOY.md`](docs/RENDER_DEPLOY.md) para la guía completa.

**Variables de entorno requeridas en producción:**
- `NODE_ENV`
- `DATABASE_URL` (o variables individuales de BD)
- `JWT_SECRET` (mínimo 32 caracteres — generar con `openssl rand -base64 32`)
- `FRONTEND_URL`

---

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con expiración corta y refresh tokens de larga duración
- Rate limiting global y en endpoints de autenticación
- Headers de seguridad HTTP con Helmet
- CORS restringido por origen
- Sanitización de inputs contra XSS
- Validación de tipo MIME real en archivos subidos
- Acceso a archivos estáticos protegido (solo archivos registrados en BD)
- HTTPS obligatorio en producción
- Auditoría de acciones del administrador

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia frontend y backend en modo desarrollo |
| `npm run dev:frontend` | Solo el frontend |
| `npm run dev:backend` | Solo el backend |
| `npm run build` | Compila el frontend para producción |
| `npm run install:all` | Instala dependencias de todos los módulos |
| `npm run db:start` | Inicia solo la base de datos con Docker |
| `npm run db:stop` | Detiene el contenedor de la base de datos |

---

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [`docs/RENDER_DEPLOY.md`](docs/RENDER_DEPLOY.md) | Guía de despliegue en Render |
| [`docs/SEGURIDAD-IMPLEMENTADA.md`](docs/SEGURIDAD-IMPLEMENTADA.md) | Detalle de medidas de seguridad |
| [`docs/DEVOPS_GUIA.md`](docs/DEVOPS_GUIA.md) | Guía de operaciones y Docker |
| [`docs/SETUP.md`](docs/SETUP.md) | Configuración detallada del entorno |
| [`docs/PRUEBAS.md`](docs/PRUEBAS.md) | Guía de pruebas |

---

## Contacto

- **Email:** mary_cecy_ma@hotmail.com
- **Teléfono:** (02) 2227781 / +593 998 956 361
- **Instagram:** [@ideancestral](https://www.instagram.com/ideancestral/)
- **Ubicación:** Jorge Washington y Juan León Mera, Mercado Artesanal La Mariscal, Quito, Ecuador

---

> Este proyecto es privado y pertenece a **Ideancestral**.
