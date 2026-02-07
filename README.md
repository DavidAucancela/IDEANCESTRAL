# Catálogo Artesanal - Ideancestral

Sistema de catálogo web para exhibir artículos de artesanías desarrollado con Vue 3 y PostgreSQL.

## 🚀 Características

### Para Visitantes
- ✅ Ver catálogo completo de productos
- ✅ Filtrar productos por categorías
- ✅ Ver detalle completo de cada producto
- ✅ Galería de imágenes por producto
- ✅ Diseño responsive (móvil y desktop)
- ✅ Navegación intuitiva

### Para Administradores
- ✅ Panel de administración completo
- ✅ CRUD de productos (Crear, Leer, Actualizar, Eliminar)
- ✅ Gestión de categorías
- ✅ Subir múltiples imágenes por producto
- ✅ Publicar/ocultar productos
- ✅ Marcar productos como destacados
- ✅ Autenticación segura

## 🛠️ Tecnologías

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Vite
- Axios
- CSS3 (Responsive Design)

### Backend
- Node.js
- Express
- PostgreSQL
- Multer (gestión de archivos)
- JWT (autenticación)
- bcryptjs (hash de contraseñas)

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio (si aplica)
```bash
git clone <url-del-repositorio>
cd IdeAncestral
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar Base de Datos

#### Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE catalogo_artesanias;
```

#### Ejecutar el esquema:
```bash
psql -U postgres -d catalogo_artesanias -f backend/database/schema.sql
```

#### (Opcional) Cargar datos de ejemplo:
```bash
psql -U postgres -d catalogo_artesanias -f backend/database/seed.sql
```

### 4. Configurar Variables de Entorno

#### Backend:
```bash
cd backend
cp .env.example .env
```

Editar `backend/.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_artesanias
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
PORT=3000
JWT_SECRET=tu_secret_key_super_segura
```

#### Frontend:
Crear `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Crear directorio de uploads
```bash
mkdir backend/uploads
```

### 6. Crear usuario administrador (opcional)
Puedes crear un administrador usando la API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "email": "admin@example.com",
    "password": "tu_password_seguro"
  }'
```

## 🚀 Ejecución

### Desarrollo (Frontend + Backend simultáneamente)
```bash
npm run dev
```

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

## 📁 Estructura del Proyecto

```
IdeAncestral/
├── frontend/                 # Aplicación Vue 3
│   ├── src/
│   │   ├── views/           # Vistas principales
│   │   │   ├── CatalogoView.vue
│   │   │   ├── ProductoDetalleView.vue
│   │   │   └── AdminView.vue
│   │   ├── router/         # Configuración de rutas
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── package.json
│
├── backend/                  # API Node.js/Express
│   ├── routes/              # Rutas de la API
│   │   ├── productos.js
│   │   ├── categorias.js
│   │   ├── imagenes.js
│   │   └── auth.js
│   ├── database/            # Esquemas SQL
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── uploads/             # Imágenes subidas
│   ├── server.js
│   └── package.json
│
└── package.json             # Scripts principales
```

## 🔌 API Endpoints

### Productos
- `GET /api/productos` - Listar productos (solo publicados por defecto)
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto (requiere auth)
- `PUT /api/productos/:id` - Actualizar producto (requiere auth)
- `DELETE /api/productos/:id` - Eliminar producto (requiere auth)

### Categorías
- `GET /api/categorias` - Listar categorías activas
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría (requiere auth)
- `PUT /api/categorias/:id` - Actualizar categoría (requiere auth)
- `DELETE /api/categorias/:id` - Eliminar categoría (requiere auth)

### Imágenes
- `POST /api/imagenes` - Subir imagen (requiere auth)
- `PUT /api/imagenes/:id` - Actualizar imagen (requiere auth)
- `DELETE /api/imagenes/:id` - Eliminar imagen (requiere auth)

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar administrador (solo desarrollo)

## 🎨 Diseño

El diseño está inspirado en la imagen proporcionada con:
- Banner central con título "catálogo ARTESANAL - Siempre Santander"
- Grid de productos responsive
- Paleta de colores terrosos y cálidos
- Tipografía elegante con serif para títulos

## 📱 Responsive Design

El sistema está completamente optimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Móvil (< 768px)

## 🔒 Seguridad

- Autenticación JWT para panel de administración
- Contraseñas hasheadas con bcrypt
- Validación de archivos en uploads
- CORS configurado

## 📝 Notas

- Las imágenes se almacenan en `backend/uploads/`
- El esquema de base de datos incluye triggers para `updated_at`
- Los productos pueden marcarse como destacados
- Los productos pueden publicarse u ocultarse

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a Ideancestral.

## 📧 Contacto

Para más información, contacta a:
- Email: mary_cecy_ma@hotmail.com
- Tel: (02)2227781 / +593998956361
