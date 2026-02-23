# Guía DevOps - Ideancestral

Siguientes pasos después del despliegue: cargar datos, usuarios, dominio propio, HTTPS y optimización.

---

## 1. Cargar datos y usuarios

### Crear usuario administrador

El registro por API está **deshabilitado en producción** por seguridad. Usa el script local:

#### Paso 1: Obtener la URL de la base de datos

1. Entra a [Render Dashboard](https://dashboard.render.com)
2. Clic en tu base de datos **PostgreSQL**
3. En **Connect** → copia la **External Database URL** completa  
   (formato: `postgresql://usuario:contraseña@host.region-postgres.render.com/nombre_db`)

#### Paso 2: Definir credenciales del admin

- **ADMIN_USER** = usuario con el que iniciarás sesión en el panel (ej: `admin`)
- **ADMIN_EMAIL** = email del administrador
- **ADMIN_PASSWORD** = contraseña que elegirás para el panel (mín. 8 caracteres, no usar: admin123, password, etc.)

> No confundir: la contraseña de la BD (en la URL) es distinta de `ADMIN_PASSWORD` (la del panel admin).

#### Paso 3: Ejecutar el script

**Opción A – Usar `backend/.env` (recomendado, evita errores con la URL)**

1. Edita `backend/.env` y añade o reemplaza estas líneas (usa la URL real de Render):

```env
DATABASE_URL=postgresql://usuario:contraseña@dpg-xxxxx.oregon-postgres.render.com/nombre_db?sslmode=require
ADMIN_USER=admin
ADMIN_EMAIL=admin@ideancestral.com
ADMIN_PASSWORD=Local114117
```

2. Ejecuta:

```powershell
cd backend
node scripts/create-admin.js
```

El script carga las variables desde `.env` automáticamente.

> **Nota**: Si usas BD local para desarrollo, después de crear el admin comenta o elimina `DATABASE_URL` en `.env` para volver a usar la BD local.

**Opción B – Variables en PowerShell**

Reemplaza la URL por la External Database URL de Render. Si la contraseña de la BD tiene caracteres especiales (`@`, `#`, `%`), usa la Opción A.

```powershell
cd backend
$env:DATABASE_URL="postgresql://usuario:contraseña@host.region-postgres.render.com/nombre_db?sslmode=require"
$env:ADMIN_USER="admin"
$env:ADMIN_EMAIL="admin@ideancestral.com"
$env:ADMIN_PASSWORD="Local114117"
node scripts/create-admin.js
```

#### Paso 4: Iniciar sesión

Entra en `https://ideancestral.onrender.com/admin` con `ADMIN_USER` y `ADMIN_PASSWORD`.

#### Solución de problemas

| Error | Causa | Solución |
|-------|-------|----------|
| `Invalid URL` | URL mal formada o incompleta | Usa la Opción A (archivo .env) y copia la URL exacta de Render. Asegúrate de que termine en `?sslmode=require` |
| `password authentication failed` | Contraseña incorrecta | Verifica que copiaste la URL completa desde Render (incluye la contraseña) |
| `connect ECONNREFUSED` | No puede conectar al host | Usa la **External** Database URL, no la Internal (la Internal solo funciona desde servicios de Render) |

### Cargar datos de ejemplo (productos, categorías, promociones)

Desde tu máquina local, con la base de datos de Render:

```bash
cd backend
$env:DATABASE_URL="postgres://usuario:contraseña@host:puerto/catalogo_artesanias?sslmode=require"
node scripts/init-db.js --seed
```

> **Nota**: El seed usa `logo-principal.jpg` como placeholder (ya existe en `frontend/public/imagenes/`). Para imágenes reales, súbelas desde el panel admin; van a `backend/uploads/`. Ver `docs/CARGA_DATOS.md` para más detalles.

### Alternativa: Release Command en Render

Para ejecutar scripts en cada deploy (por ejemplo, migraciones):

1. En Render → tu servicio → **Settings** → **Release Command**
2. Ejemplo: `node scripts/init-db.js` (crea tablas si no existen)
3. Para seed solo la primera vez, usa el comando local anterior.

---

## 2. Dominio propio

### En Render

1. **Settings** → **Custom Domains** → **Add Custom Domain**
2. Añade tu dominio (ej: `ideancestral.com` o `www.ideancestral.com`)
3. Render te indicará los registros DNS a configurar

### Configurar DNS (ejemplo genérico)

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | www | `ideancestral.onrender.com` |
| A | @ | *(IP que Render te indique)* |

O si usas solo subdominio:
| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | tienda | `ideancestral.onrender.com` |

### Actualizar FRONTEND_URL

En Render → **Environment** → añade o edita:

```
FRONTEND_URL=https://tudominio.com
```

(o `https://www.tudominio.com` si usas www)

---

## 3. HTTPS

Render ya proporciona HTTPS automático para `*.onrender.com` y para dominios personalizados. No necesitas configuración adicional.

- Certificados Let's Encrypt gestionados por Render
- Redirección HTTP → HTTPS automática
- No hace falta configurar nada extra

---

## 4. Rendimiento

### Plan Free de Render

- El servicio se **suspende** tras ~15 min sin tráfico
- La primera petición tras suspensión puede tardar **30–60 s** en responder
- Considera un plan de pago si necesitas disponibilidad continua

### Optimizaciones recomendadas

| Área | Acción |
|------|--------|
| **Imágenes** | Comprimir antes de subir; usar formatos WebP cuando sea posible |
| **Base de datos** | Índices en columnas usadas en filtros (categoría, publicado, etc.) |
| **Caché** | Headers `Cache-Control` para assets estáticos (el backend ya usa `express.static`) |
| **CDN** | Para mucho tráfico, considerar Cloudflare delante de Render |

### Variables de entorno útiles

```
NODE_ENV=production
```

Ya está en la imagen Docker. No es necesario cambiarlo.

---

## 5. Próximos pasos DevOps

### Corto plazo

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 1 | Crear admin | Ejecutar `create-admin.js` con `DATABASE_URL` de Render |
| 2 | Cargar datos | Ejecutar `init-db.js --seed` si quieres datos de ejemplo |
| 3 | Dominio propio | Comprar dominio y configurarlo en Render |
| 4 | Monitoreo | Revisar logs en Render Dashboard |

### Medio plazo

| Prioridad | Tarea | Herramientas |
|-----------|-------|---------------|
| 1 | Backups de BD | Render hace backups automáticos en planes de pago; en Free, exportar manualmente con `pg_dump` |
| 2 | Alertas | Configurar notificaciones en Render (errores, deploys) |
| 3 | CI/CD | GitHub Actions para tests antes de deploy (opcional) |
| 4 | Variables secretas | Usar Render Secrets para datos sensibles |

### Largo plazo

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 1 | Plan de pago | Si el tráfico crece, evitar suspensiones del plan Free |
| 2 | Escalado | Render permite más instancias en planes superiores |
| 3 | Logs centralizados | Integrar con Datadog, Logtail, etc. |
| 4 | Health checks | Endpoint `/api/health` ya existe; Render puede usarlo |

---

## Resumen rápido

```bash
# 1. Crear admin (una vez)
cd backend
$env:DATABASE_URL="postgres://..."
$env:ADMIN_USER="admin"
$env:ADMIN_EMAIL="admin@ideancestral.com"
$env:ADMIN_PASSWORD="ClaveSegura123"
node scripts/create-admin.js

# 2. Cargar datos de ejemplo (opcional)
$env:DATABASE_URL="postgres://..."
node scripts/init-db.js --seed
```

Después: configurar dominio en Render, actualizar `FRONTEND_URL` y seguir con monitoreo y backups según necesidad.
