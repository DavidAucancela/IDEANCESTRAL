# Guía de Despliegue en Render

Esta guía te lleva paso a paso para desplegar Ideancestral en [Render](https://render.com).

> **Después del deploy**: Ver **[DEVOPS_GUIA.md](DEVOPS_GUIA.md)** para cargar datos, crear usuarios, dominio propio, HTTPS y rendimiento.

Puedes elegir:

- **Opción A**: Despliegue monolítico (frontend + backend en un solo servicio Node)
- **Opción B**: Servicio Docker (usar Dockerfile como en desarrollo)

---

## Opción B: Desplegar con Docker en Render

Render soporta Docker de dos formas:

### 1. Construir desde Dockerfile (en tu repo)

1. **New +** → **Web Service** → Conecta tu repositorio
2. **Environment** → **Language**: selecciona **Docker**
3. **Root Directory**: *(dejar vacío)*
4. **Dockerfile Path**: `backend/Dockerfile`
5. Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, etc.
6. Vincula tu PostgreSQL de Render (Internal Database URL)

> El `backend/Dockerfile` usa rutas `backend/...` para funcionar con el contexto raíz (Render). El backend Docker solo incluye el API; para frontend+backend en un solo servicio, usa la Opción A (monolítico).

### 2. Imagen preconstruida (Docker Hub, GHCR, etc.)

1. **New +** → **Web Service**
2. En **Source Code**, elige **Existing Image**
3. Indica la URL de la imagen (ej: `ghcr.io/tu-usuario/ideancestral:latest`)
4. Credenciales si la imagen es privada
5. Configura variables de entorno y despliega

Ver [Render Docker Docs](https://render.com/docs/docker) y [Deploy Prebuilt Image](https://render.com/docs/deploying-an-image).

---

## Requisitos previos

- Cuenta en [Render](https://render.com)
- Repositorio en GitHub (o GitLab) con el código del proyecto
- Generar un `JWT_SECRET` seguro (ver paso 2)

---

## Paso 1: Crear base de datos PostgreSQL en Render

1. Entra a [Render Dashboard](https://dashboard.render.com)
2. Clic en **New +** → **PostgreSQL**
3. Configura:
   - **Name**: `ideancestral-db` (o el nombre que prefieras)
   - **Database**: `catalogo_artesanias` (o dejar el predeterminado)
   - **User** y **Region**: según tu preferencia
4. Clic en **Create Database**
5. Espera a que esté listo y copia la **Internal Database URL** (o **External** si vas a conectar desde fuera de Render)

---

## Paso 2: Crear Web Service

1. En el Dashboard, clic en **New +** → **Web Service**
2. Conecta tu repositorio de GitHub/GitLab
3. Selecciona el repositorio **IdeAncestral**
4. Configura el servicio:

| Campo | Valor |
|-------|-------|
| **Name** | `ideancestral` (o el que prefieras) |
| **Region** | La misma que tu base de datos |
| **Root Directory** | *(dejar vacío)* |
| **Runtime** | Node |
| **Build Command** | `npm run install:all && npm run build:prod` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | Free (o plan de pago si lo necesitas) |

---

## Paso 3: Variables de entorno

En la sección **Environment** del Web Service, añade:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | Obligatorio |
| `DATABASE_URL` | *(Internal Database URL)* | Copiar desde el servicio PostgreSQL de Render |
| `JWT_SECRET` | *(tu secreto)* | Mínimo 32 caracteres. Generar con: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://tu-app.onrender.com` | Reemplazar con la URL real de tu servicio |
| `PORT` | `3000` | Render lo asigna automáticamente, pero puedes dejarlo por si acaso |

### Generar JWT_SECRET

En tu terminal local:

```bash
openssl rand -base64 32
```

Copia el resultado y pégalo como valor de `JWT_SECRET`.

### Vincular PostgreSQL

Si creaste la base de datos en el mismo proyecto de Render:

1. En el Web Service, ve a **Environment**
2. Clic en **Add Environment Variable**
3. Busca **Add from Render** o **Link Resource**
4. Selecciona tu base de datos PostgreSQL
5. Render añadirá automáticamente `DATABASE_URL`

---

## Paso 4: Inicializar la base de datos (Release Command)

Para que las tablas se creen en el primer despliegue:

1. En el Web Service, ve a **Settings**
2. Busca **Release Command** (o **Pre-Deploy Command**)
3. Añade: `cd backend && node scripts/init-db.js`

> **Nota**: El Release Command se ejecuta antes de cada deploy. Si la base de datos ya existe, el script detectará las tablas y no fallará. Si quieres datos de ejemplo, después del primer deploy puedes ejecutar localmente con `DATABASE_URL` apuntando a Render:
> ```bash
> cd backend
> DATABASE_URL="postgres://..." node scripts/init-db.js --seed
> ```

---

## Paso 5: Desplegar

1. Guarda la configuración
2. Render iniciará el build automáticamente
3. Espera a que termine (puede tardar 3–5 minutos la primera vez)
4. Cuando el estado sea **Live**, tu app estará en `https://tu-app.onrender.com`

---

## Paso 6: Crear usuario administrador

Tras el primer despliegue, crea el admin de una de estas formas:

### Opción A: Desde tu máquina local

1. Configura temporalmente en `backend/.env`:
   ```env
   DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require
   ```
   (Usa la **External Database URL** de Render)

2. Ejecuta:
   ```bash
   cd backend
   node scripts/create-admin.js
   ```

### Opción B: Vía API (solo si el registro está habilitado)

```bash
curl -X POST https://tu-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"usuario": "admin", "email": "admin@tudominio.com", "password": "TuContraseñaSegura123"}'
```

---

## Resumen de configuración

```
Build Command:  npm run install:all && npm run build:prod
Start Command:  cd backend && npm start
Release Command: cd backend && node scripts/init-db.js

Variables:
  NODE_ENV=production
  DATABASE_URL=<desde Render PostgreSQL>
  JWT_SECRET=<openssl rand -base64 32>
  FRONTEND_URL=https://tu-app.onrender.com
```

---

## Solución de problemas

### Error: "JWT_SECRET debe ser un secreto seguro"
- Asegúrate de que `JWT_SECRET` tenga al menos 32 caracteres
- Genera uno nuevo con `openssl rand -base64 32`

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` sea correcta
- Si usas External URL, asegúrate de que tu IP esté permitida (Render Free tiene restricciones)
- Usa la **Internal Database URL** si el Web Service y la BD están en el mismo proyecto

### La app muestra "Cannot GET /" o errores 404
- Verifica que el Build Command incluya `npm run build:prod` (no solo `npm run build`)
- El frontend debe compilarse con `VITE_API_URL=/api` para usar rutas relativas

### CORS o "Origen no permitido"
- Asegúrate de que `FRONTEND_URL` coincida exactamente con la URL de tu app (incluyendo `https://`)

### El servicio se duerme (plan Free)
- En el plan gratuito, el servicio se suspende tras ~15 min de inactividad
- La primera petición puede tardar 30–60 segundos en despertar
- Considera un plan de pago si necesitas que esté siempre activo
