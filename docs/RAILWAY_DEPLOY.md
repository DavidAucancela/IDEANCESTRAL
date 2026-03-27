# Guía de Despliegue en Railway

## Arquitectura del despliegue

Este proyecto se despliega como **dos servicios en Railway**:

```
Railway Project
├── PostgreSQL (plugin de base de datos)
└── Web Service (Docker monolítico: Vue 3 + Express)
```

El Dockerfile en `backend/Dockerfile` compila el frontend con Vite y luego sirve todo desde Node.js en un solo contenedor.

---

## Requisitos previos

- Cuenta en [railway.app](https://railway.app)
- El repositorio subido a **GitHub** (necesario para el despliegue automático)
- Git instalado localmente

---

## Paso 1: Subir el proyecto a GitHub

Si aún no tienes el repositorio en GitHub:

```bash
# En la raíz del proyecto (C:\Users\david\Ideancestral\IDEANCESTRAL)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

> **Importante:** Asegúrate de que `.gitignore` incluye `.env`, `node_modules/`, y `uploads/` (ya está configurado).

---

## Paso 2: Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub si es la primera vez
5. Busca y selecciona tu repositorio `ideancestral` (o como lo hayas llamado)
6. Railway detectará el proyecto — haz clic en **"Deploy Now"**

> Nota: el primer deploy fallará porque aún no están configuradas las variables de entorno. Eso es normal.

---

## Paso 3: Agregar PostgreSQL

1. Dentro de tu proyecto en Railway, haz clic en **"New"** (botón `+`)
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway crea la base de datos automáticamente
4. Una vez creada, haz clic en el servicio PostgreSQL
5. Ve a la pestaña **"Variables"** y copia el valor de `DATABASE_URL`
   - Tiene el formato: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

---

## Paso 4: Configurar el Dockerfile (contexto de build)

Railway necesita saber que el Dockerfile está en `backend/` pero que el contexto de build es la raíz del proyecto.

### Opción A: Crear `railway.toml` en la raíz (recomendado)

Crea el archivo `railway.toml` en la raíz del proyecto:

```toml
[build]
dockerfilePath = "backend/Dockerfile"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

Luego sube el cambio:
```bash
git add railway.toml
git commit -m "Add Railway config"
git push
```

### Opción B: Configurar desde el panel de Railway

1. En tu servicio web, ve a **Settings** → **Build**
2. En **"Dockerfile Path"** escribe: `backend/Dockerfile`
3. Deja **"Docker Build Context"** vacío (usa la raíz por defecto)

---

## Paso 5: Configurar variables de entorno

En tu servicio web en Railway, ve a **Variables** y agrega las siguientes:

### Variables obligatorias

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | Activa modo producción |
| `DATABASE_URL` | `postgresql://...` | Copia desde el servicio PostgreSQL |
| `JWT_SECRET` | (ver abajo) | Mínimo 32 caracteres, aleatorio |
| `FRONTEND_URL` | `https://TU-APP.up.railway.app` | La URL de tu servicio en Railway |

### Generar JWT_SECRET seguro

Ejecuta en tu terminal local:
```bash
# En Linux/Mac:
openssl rand -base64 32

# En Windows (PowerShell):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Alternativa online: https://generate-secret.vercel.app/32
```

### Variables opcionales

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `PORT` | `3000` | Railway lo asigna automáticamente, no hace falta |
| `LOG_LEVEL` | `info` | Nivel de logs: `debug`, `info`, `warn`, `error` |
| `UPLOAD_DIR` | `./uploads` | Directorio de imágenes subidas |

### Cómo agregar variables en Railway

1. Haz clic en tu servicio web → pestaña **"Variables"**
2. Haz clic en **"New Variable"** o **"Raw Editor"**
3. Con Raw Editor puedes pegar todas a la vez:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway
JWT_SECRET=TU_SECRETO_SEGURO_DE_32_CARACTERES_O_MAS
FRONTEND_URL=https://TU-SERVICIO.up.railway.app
```

> **¿Cómo saber la URL de tu app?** La encuentras en **Settings → Networking → Public Networking**. Genera el dominio primero (ver Paso 7) y luego actualiza `FRONTEND_URL`.

---

## Paso 6: Configurar networking (dominio público)

1. En tu servicio web, ve a **Settings** → **Networking**
2. En **"Public Networking"**, haz clic en **"Generate Domain"**
3. Railway asigna un dominio tipo `tu-app-xxxxx.up.railway.app`
4. **Actualiza la variable `FRONTEND_URL`** con ese dominio (con `https://`)

---

## Paso 7: Ejecutar el primer deploy

1. Ve a la pestaña **"Deployments"** de tu servicio web
2. Haz clic en **"Redeploy"** (o push un nuevo commit para dispararlo)
3. Haz clic en el deploy activo para ver los logs en tiempo real

### Qué esperar en los logs

```
Building Docker image...
  [1/2] Building frontend with Vite...
  [2/2] Setting up Node.js backend...

Starting container...
Ejecutando migraciones de base de datos...
  ✓ schema.sql aplicado
  ✓ 002_security.sql aplicado
  ✓ 003_update_product_images.sql aplicado
Migraciones completadas.
Servidor corriendo en http://localhost:3000
Entorno: production
```

> El entrypoint (`docker-entrypoint.sh`) corre las migraciones automáticamente en producción antes de arrancar el servidor.

---

## Paso 8: Crear el usuario administrador

Una vez que el servicio esté corriendo, necesitas crear el primer admin. Railway permite ejecutar comandos en el contenedor:

1. En tu servicio, ve a la pestaña **"Settings"** → **"Deploy"**
2. Busca la sección **"Railway CLI"** o usa el shell integrado

### Con Railway CLI (recomendado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Conectar al proyecto
railway link

# Ejecutar el script de creación de admin
railway run --service=TU_SERVICIO node scripts/create-admin.js
```

### Variables de entorno para el script

El script `create-admin.js` usa estas variables (agrégalas temporalmente en Railway Variables o pásalas en el comando):

```bash
railway run --service=TU_SERVICIO \
  ADMIN_USER=admin \
  ADMIN_EMAIL=admin@tudominio.com \
  ADMIN_PASSWORD=TuPasswordSegura123! \
  node scripts/create-admin.js
```

---

## Paso 9: Verificar el despliegue

Una vez desplegado, verifica que todo funcione:

```bash
# Health check de la API
curl https://TU-APP.up.railway.app/api/health
# Respuesta esperada: {"status":"ok","message":"API funcionando correctamente"}

# Verificar que el frontend carga
# Abre en el navegador: https://TU-APP.up.railway.app
```

---

## Configuración de uploads (imágenes subidas)

> **Importante:** Railway usa un filesystem efímero. Los archivos subidos se pierden en cada redeploy.

### Solución: Railway Volume (persistencia)

1. En tu servicio, ve a **Settings** → **"Volumes"**
2. Haz clic en **"Add Volume"**
3. Mount path: `/app/uploads`
4. Esto persiste el directorio de uploads entre deploys

Luego agrega la variable:
```
UPLOAD_DIR=/app/uploads
```

---

## Variables de entorno: resumen final

```env
# Obligatorias
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway
JWT_SECRET=secreto_aleatorio_de_minimo_32_caracteres
FRONTEND_URL=https://TU-APP.up.railway.app

# Opcionales
LOG_LEVEL=info
UPLOAD_DIR=/app/uploads
```

---

## Configuración de despliegue automático

Railway redespliega automáticamente cada vez que haces push a la rama principal (`main`). Para cambiar la rama:

1. Servicio web → **Settings** → **Deploy**
2. En **"Branch"**, selecciona la rama que quieras usar

---

## Solución de problemas comunes

### El deploy falla: "JWT_SECRET debe ser un secreto seguro"
- Asegúrate de que `JWT_SECRET` tenga al menos 32 caracteres
- No debe contener las palabras: `secret_key`, `cambiar_esto_por`, `CONFIGURA_CON`

### El deploy falla: "DB_PASSWORD no puede ser una contraseña débil"
- Si usas `DATABASE_URL` (recomendado), este error no debería ocurrir
- Railway asigna contraseñas seguras automáticamente

### Error de CORS
- Verifica que `FRONTEND_URL` tenga exactamente la URL de tu app **sin barra final**
- Ejemplo correcto: `https://mi-app-abc123.up.railway.app`
- Ejemplo incorrecto: `https://mi-app-abc123.up.railway.app/`

### Las migraciones fallan
- Verifica que `DATABASE_URL` sea correcta
- Revisa los logs del contenedor en la pestaña Deployments
- El script `scripts/init-db.js` es idempotente: seguro de correr múltiples veces

### La app carga pero las imágenes no se ven
- Si las imágenes son archivos subidos por usuarios, revisa que el Volume esté configurado
- Si son imágenes estáticas del frontend (en `public/imagenes/`), están embebidas en el build y no necesitan configuración adicional

### Puerto no disponible
- Railway asigna el puerto automáticamente via la variable `PORT`
- `server.js` ya usa `process.env.PORT || 3000` — no hace falta configurar nada

---

## Costos en Railway

| Plan | Precio | Incluye |
|------|--------|---------|
| Hobby | $5/mes | $5 de créditos de uso, 1 proyecto |
| Pro | $20/mes | $20 de créditos, proyectos ilimitados |
| Gratis | $0 | 500 horas/mes, se suspende al dormir |

Para este proyecto (una app + PostgreSQL), el uso mensual típico está entre $3 y $8 en el plan Hobby.

---

## Comandos útiles con Railway CLI

```bash
# Instalar CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Ver proyectos
railway list

# Conectar directamente a la base de datos PostgreSQL
railway connect PostgreSQL

# Ver logs en tiempo real
railway logs --service=TU_SERVICIO

# Ejecutar comandos en producción
railway run --service=TU_SERVICIO node scripts/create-admin.js

# Abrir el proyecto en el navegador
railway open
```

---

## Flujo de trabajo post-despliegue

```
Desarrollo local  →  git push origin main  →  Railway redespliega automáticamente
                                               (build Dockerfile ~2-3 min)
                                               (migraciones automáticas)
                                               (app disponible en tu dominio)
```
