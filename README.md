# Ideancestral - Catálogo Artesanal

Sistema web para exhibir y gestionar el catálogo de productos artesanales de **Ideancestral**, una tienda ubicada en el Mercado Artesanal La Mariscal, Quito, Ecuador.

---

## Características

### Para visitantes
- **Inicio:** fotos a pantalla completa con buscador en vivo, vitrina de productos destacados, categorías en paneles, promociones por temporada y sección para visitar el local
- **Promociones por temporada** (San Valentín, Carnaval, Día de la Madre, Día del Padre, Inti Raymi, Difuntos, Fiestas de Quito, Navidad): se resalta la vigente o la próxima según el mes
- **Visítanos:** tarjeta de ubicación que gira y muestra el mapa, horario con «abierto ahora» (hora de Quito), WhatsApp e Instagram
- Catálogo por categoría con búsqueda, filtro de precio y orden
- Detalle de producto con galería, zoom (o «toca para ampliar» en pantallas táctiles) y stock
- Carrito en 3 pasos (revisar → entrega → pago) con pedido por WhatsApp; pago en línea preparado, aún sin pasarela
- Español, inglés y portugués en todo el sitio
- Modo oscuro / claro
- Diseño responsive (móvil, tablet y escritorio)

### Para administradores
- Panel de administración con acceso protegido
- CRUD completo de productos, categorías e imágenes
- Gestión de promociones por temporada: meses en que van (se repiten cada año) y categoría a la que llevan
- Subida de múltiples imágenes por producto
- Control de visibilidad y productos destacados
- Autenticación segura con JWT y refresh tokens
- Registro de auditoría de acciones administrativas

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 (Composition API), Vite, Pinia, Vue Router, Axios, i18n propio (store Pinia) |
| Backend | Node.js, Express, Multer, JWT, bcryptjs, Zod, Pino |
| Base de datos | PostgreSQL |
| Seguridad | Helmet, express-rate-limit, sanitización XSS, validación MIME |
| Pruebas | Vitest (frontend con jsdom, backend) |
| Infraestructura | Docker Compose (local), Railway (producción) |

---

## Estructura del proyecto

```
IdeAncestral/
├── frontend/
│   └── src/
│       ├── views/          # CatalogoView (inicio), CategoriaView, ProductoDetalleView, AdminView, NotFoundView
│       ├── components/
│       │   ├── inicio/     # Secciones del inicio: Hero, Destacados, Categorías, Promociones, Nosotros
│       │   ├── layout/     # Header, footer, carrito y botón de WhatsApp (montados una vez)
│       │   └── Base*.vue   # Librería de componentes (botón, modal, tarjeta, campos…)
│       ├── config/         # contacto.js (WhatsApp, dirección, horario…), inicio.js, carrito.js
│       ├── stores/         # carrito, theme, language (Pinia)
│       ├── composables/    # useCarrito, useToast, useScrollAnimation, useSecciones…
│       ├── utils/          # imágenes, temporadas, horario
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
├── docs/                   # Bitácora del rediseño, pendientes, guías de despliegue, seguridad y datos
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

## Despliegue en producción (Railway)

Railway construye con `backend/Dockerfile` (configurado en `railway.toml`): compila el frontend y lo sirve junto con el API desde un solo contenedor. Al arrancar en producción se aplican el esquema y las migraciones. Guía completa: [`docs/RAILWAY_DEPLOY.md`](docs/RAILWAY_DEPLOY.md). También hay una guía para Render: [`docs/RENDER_DEPLOY.md`](docs/RENDER_DEPLOY.md).

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
| `cd frontend && npx vitest run` | Pruebas del frontend |
| `cd backend && npx vitest run` | Pruebas del backend |

---

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [`docs/PENDIENTES.md`](docs/PENDIENTES.md) | **Lo que queda por hacer**: decisiones del dueño, despliegue y trabajo técnico |
| [`docs/REDISENO_INICIO.md`](docs/REDISENO_INICIO.md) | Bitácora del rediseño y guía para cambiar secciones del inicio |
| [`docs/CARGA_DATOS.md`](docs/CARGA_DATOS.md) | Datos de ejemplo, promociones e imágenes |
| [`docs/RAILWAY_DEPLOY.md`](docs/RAILWAY_DEPLOY.md) | Guía de despliegue en Railway |
| [`docs/RENDER_DEPLOY.md`](docs/RENDER_DEPLOY.md) | Guía de despliegue en Render |
| [`docs/SEGURIDAD-IMPLEMENTADA.md`](docs/SEGURIDAD-IMPLEMENTADA.md) | Detalle de medidas de seguridad |
| [`docs/DEVOPS_GUIA.md`](docs/DEVOPS_GUIA.md) | Guía de operaciones y Docker |
| [`docs/SETUP.md`](docs/SETUP.md) | Configuración detallada del entorno |
| [`docs/PRUEBAS.md`](docs/PRUEBAS.md) | Guía de pruebas |

---

## Contacto

- **Email:** mary_cecy_ma@hotmail.com
- **Teléfono:** (02) 2227781 / +593 987 999 136 / +593 978 752 422
- **Instagram:** [@ideancestral](https://www.instagram.com/ideancestral/)
- **Ubicación:** Jorge Washington y Juan León Mera, Mercado Artesanal La Mariscal, Quito, Ecuador

---

> Este proyecto es privado y pertenece a **Ideancestral**.
