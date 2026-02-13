# INFORME DE MEJORAS - IdeAncestral

## Estado Actual del Sistema

El sistema es un **catálogo de artesanías** con:
- **Frontend:** Vue 3 + Vite + Vue Router (SPA)
- **Backend:** Express.js + PostgreSQL
- **Funcionalidades:** Catálogo de productos, detalle de producto, carrito de compras, panel admin, autenticación JWT, subida de imágenes

### Estructura actual (después de limpieza)

```
IdeAncestral/
├── frontend/            # App Vue 3 (SPA)
│   ├── src/
│   │   ├── views/       # CatalogoView, ProductoDetalleView, AdminView
│   │   ├── composables/ # useCarrito (estado del carrito)
│   │   ├── router/      # Rutas: /, /producto/:id, /admin
│   │   └── App.vue      # Componente raíz
│   └── public/imagenes/ # Imágenes de productos
├── backend/             # API REST Express.js
│   ├── routes/          # productos, categorias, imagenes, auth
│   ├── database/        # connection, schema, seed
│   ├── scripts/         # init-db, check-env
│   └── uploads/         # Imágenes subidas por admin
└── package.json         # Orquestador (concurrently)
```

---

## Archivos Eliminados (limpieza realizada)

| Archivo/Carpeta | Razón de eliminación |
|-----------------|---------------------|
| `index.html` (raíz) | Sitio estático antiguo, reemplazado por la app Vue |
| `style.css` (raíz) | Estilos del sitio estático antiguo |
| `css/` | Módulos CSS del sitio antiguo (8 archivos) |
| `js/` | Scripts vanilla JS del sitio antiguo (4 archivos) |
| `assets/` | Imágenes de template (lambo-*.jpg) y assets del sitio antiguo |
| `imagenes/` (raíz) | Duplicado de `frontend/public/imagenes/` |
| `CHANGELOG.md` | Histórico obsoleto |
| `SOLUCION_ERROR.md` | Documentación de errores ya resueltos |

---

## PROBLEMAS CRÍTICOS DE SEGURIDAD

### 1. Rutas de API sin protección de autenticación
**Gravedad: ALTA**

Las rutas POST, PUT y DELETE de productos, categorías e imágenes **NO tienen middleware de autenticación**. Cualquier persona puede crear, modificar o eliminar productos sin estar logueado.

**Solución:**
```javascript
// En cada ruta protegida, agregar el middleware:
import { authenticateToken } from './auth.js';

router.post('/', authenticateToken, async (req, res) => { ... });
router.put('/:id', authenticateToken, async (req, res) => { ... });
router.delete('/:id', authenticateToken, async (req, res) => { ... });
```

### 2. Endpoint de registro abierto al público
**Gravedad: ALTA**

`POST /api/auth/register` permite a cualquiera crear cuentas de administrador.

**Solución:** Proteger con `authenticateToken` o desactivar en producción:
```javascript
if (process.env.NODE_ENV !== 'production') {
  router.post('/register', async (req, res) => { ... });
}
```

### 3. JWT Secret por defecto
**Gravedad: ALTA**

El JWT usa `'secret_key'` como fallback, lo cual es predecible.

**Solución:** Requerir `JWT_SECRET` como variable de entorno obligatoria y validarla al iniciar.

### 4. Sin Rate Limiting
**Gravedad: MEDIA**

No hay limitación de intentos de login (vulnerable a fuerza bruta).

**Solución:** Agregar `express-rate-limit`:
```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: { error: 'Demasiados intentos, intente más tarde' }
});

router.post('/login', loginLimiter, async (req, res) => { ... });
```

### 5. CORS sin restricciones
**Gravedad: MEDIA**

`app.use(cors())` acepta peticiones de cualquier origen.

**Solución:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## MEJORAS DE ARQUITECTURA

### 6. Agregar validación de datos (express-validator o Zod)
**Prioridad: ALTA**

No hay validación estructurada de los datos que llegan al API.

```bash
npm install zod
```

```javascript
import { z } from 'zod';

const productoSchema = z.object({
  nombre: z.string().min(1).max(200),
  precio: z.number().positive(),
  descripcion: z.string().optional(),
  material: z.string().max(200).optional(),
  peso: z.string().max(50).optional(),
  categoria_id: z.number().int().positive().optional(),
});
```

### 7. Agregar paginación en el listado de productos
**Prioridad: ALTA**

Actualmente se devuelven TODOS los productos. Con muchos registros, esto será lento.

```javascript
// GET /api/productos?page=1&limit=12
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 12;
const offset = (page - 1) * limit;

query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
params.push(limit, offset);
```

### 8. Búsqueda de productos
**Prioridad: ALTA**

No existe funcionalidad de búsqueda. Agregar búsqueda por texto:

```javascript
// GET /api/productos?buscar=mascara
if (buscar) {
  query += ` AND (p.nombre ILIKE $${paramCount} OR p.descripcion ILIKE $${paramCount})`;
  params.push(`%${buscar}%`);
  paramCount++;
}
```

### 9. Sistema de migraciones de base de datos
**Prioridad: MEDIA**

Actualmente solo hay un archivo `schema.sql`. Usar un sistema de migraciones:

```bash
npm install knex       # ORM con migraciones
# o
npm install node-pg-migrate  # Migraciones puras SQL
```

### 10. Manejo centralizado de errores
**Prioridad: MEDIA**

Crear un middleware de errores más robusto y clases de error personalizadas:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### 11. Logging profesional
**Prioridad: MEDIA**

Reemplazar `console.log` con un logger como `winston` o `pino`:

```bash
npm install pino pino-pretty
```

---

## MEJORAS DE FRONTEND

### 12. Estado global con Pinia
**Prioridad: ALTA**

El carrito usa un composable básico. Para escalar, usar Pinia:

```bash
npm install pinia
```

Beneficios: persistencia, devtools, compartir estado entre componentes.

### 13. Lazy loading de imágenes
**Prioridad: MEDIA**

Agregar `loading="lazy"` a las imágenes y usar IntersectionObserver para cargar productos conforme el usuario hace scroll.

### 14. Componentes reutilizables
**Prioridad: MEDIA**

Extraer componentes reutilizables:
- `ProductCard.vue` - Tarjeta de producto
- `CategoryFilter.vue` - Filtro de categorías
- `ImageGallery.vue` - Galería de imágenes
- `CartDrawer.vue` - Panel lateral del carrito
- `AppHeader.vue` - Header/navegación

### 15. Manejo de errores en el frontend
**Prioridad: MEDIA**

Agregar manejo global de errores HTTP, estados de carga (skeletons), y mensajes al usuario con toasts/notificaciones.

### 16. SEO y meta tags
**Prioridad: BAJA**

Agregar meta tags dinámicos con `@unhead/vue` o considerar SSR con Nuxt 3 para mejor SEO.

### 17. PWA (Progressive Web App)
**Prioridad: BAJA**

Convertir en PWA para que funcione offline y se pueda instalar:

```bash
npm install vite-plugin-pwa
```

---

## MEJORAS DE INFRAESTRUCTURA / DevOps

### 18. Docker y Docker Compose
**Prioridad: ALTA**

Facilita el despliegue y desarrollo:

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]

  backend:
    build: ./backend
    ports: ["3000:3000"]
    depends_on: [db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: catalogo_artesanias
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### 19. Variables de entorno de ejemplo
**Prioridad: ALTA**

Crear archivos `.env.example` para que nuevos desarrolladores sepan qué configurar:

```env
# backend/.env.example
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_artesanias
DB_USER=postgres
DB_PASSWORD=
PORT=3000
NODE_ENV=development
JWT_SECRET=cambiar_esto_por_un_secreto_seguro
```

### 20. CI/CD Pipeline
**Prioridad: MEDIA**

Configurar GitHub Actions para:
- Ejecutar linting en cada push
- Ejecutar tests automáticos
- Build y deploy automático

### 21. Tests automatizados
**Prioridad: MEDIA**

```bash
# Backend
npm install --save-dev vitest supertest

# Frontend
npm install --save-dev vitest @vue/test-utils
```

---

## NUEVAS FUNCIONALIDADES SUGERIDAS

### Corto plazo (1-2 semanas)
| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 1 | **Búsqueda** | Barra de búsqueda por nombre/descripción |
| 2 | **Filtros avanzados** | Filtrar por precio (rango), material, peso |
| 3 | **Ordenamiento** | Ordenar por precio, nombre, más reciente |
| 4 | **Proteger rutas admin** | Middleware `authenticateToken` en todas las rutas CRUD |
| 5 | **Notificaciones toast** | Feedback visual al agregar al carrito, errores, etc. |

### Mediano plazo (1-2 meses)
| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 6 | **Carrito persistente** | Guardar carrito en localStorage o en BD |
| 7 | **Lista de deseos** | Permitir guardar productos favoritos |
| 8 | **WhatsApp integration** | Botón "Consultar por WhatsApp" con mensaje pre-armado |
| 9 | **Galería de imágenes** | Zoom, slider, múltiples imágenes por producto |
| 10 | **Dashboard admin** | Estadísticas de productos, categorías más vistas |

### Largo plazo (3+ meses)
| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 11 | **Pasarela de pagos** | Integrar PayPhone, PayPal, o transferencia bancaria |
| 12 | **Gestión de pedidos** | Sistema completo de pedidos con estados |
| 13 | **Inventario** | Control de stock con alertas |
| 14 | **Multi-idioma** | Español/Inglés/Kichwa para turistas |
| 15 | **Email marketing** | Newsletter con ofertas y nuevos productos |
| 16 | **Analytics** | Google Analytics o Plausible para métricas |
| 17 | **Blog/Historia** | Sección de historias de artesanos y procesos |

---

## RESUMEN DE PRIORIDADES

```
URGENTE (hacer ahora):
  [!] Proteger rutas API con authenticateToken
  [!] Asegurar JWT_SECRET obligatorio
  [!] Cerrar endpoint /register en producción
  [!] Restringir CORS

IMPORTANTE (próxima iteración):
  [+] Paginación de productos
  [+] Búsqueda y filtros
  [+] Validación de datos (Zod)
  [+] Docker Compose
  [+] Archivos .env.example

DESEABLE (mejora continua):
  [~] Pinia para estado global
  [~] Componentes reutilizables
  [~] Tests automatizados
  [~] CI/CD Pipeline
  [~] PWA
```

---

*Informe generado el 8 de febrero de 2026*
*Proyecto: IdeAncestral - Catálogo de Artesanías*
