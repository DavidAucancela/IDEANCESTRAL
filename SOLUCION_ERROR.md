# Solución al Error de Inicialización de Base de Datos

## Error: "client password must be a string"

Este error ocurre cuando la contraseña de PostgreSQL no está configurada correctamente en el archivo `.env`.

### Solución Paso a Paso

#### 1. Verificar/Crear el archivo .env

Ejecuta el script de verificación:
```bash
cd backend
npm run check-env
```

O manualmente:
```bash
cd backend
# Si no existe, copia el ejemplo
copy .env.example .env
```

#### 2. Editar el archivo .env

Abre `backend/.env` y configura tu contraseña de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_artesanias
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_REAL_AQUI  # ⚠️ Cambia esto
PORT=3000
NODE_ENV=development
JWT_SECRET=una_clave_secreta_super_segura_12345  # ⚠️ Cambia esto también
UPLOAD_DIR=./uploads
```

**Importante:**
- Reemplaza `TU_PASSWORD_REAL_AQUI` con tu contraseña real de PostgreSQL
- Si no tienes contraseña configurada en PostgreSQL, déjala vacía: `DB_PASSWORD=`
- O configura una contraseña en PostgreSQL primero

#### 3. Verificar que PostgreSQL esté corriendo

En Windows:
```powershell
# Verificar si PostgreSQL está corriendo
Get-Service -Name postgresql*
```

O intenta conectarte manualmente:
```bash
psql -U postgres
```

#### 4. Si PostgreSQL no tiene contraseña

Si instalaste PostgreSQL sin contraseña, puedes:

**Opción A:** Dejar la contraseña vacía en `.env`:
```env
DB_PASSWORD=
```

**Opción B:** Configurar una contraseña en PostgreSQL:
```sql
-- Conectarse a PostgreSQL
psql -U postgres

-- Cambiar contraseña
ALTER USER postgres PASSWORD 'tu_nueva_password';
```

#### 5. Ejecutar nuevamente el script

```bash
cd backend
npm run init-db
```

O con datos de ejemplo:
```bash
npm run init-db:seed
```

### Verificación Rápida

Para verificar que todo está bien configurado:

```bash
cd backend
npm run check-env
npm run init-db
```

### Errores Comunes

#### Error: "ECONNREFUSED"
- PostgreSQL no está corriendo
- Verifica el servicio: `Get-Service postgresql*`
- Inicia PostgreSQL si está detenido

#### Error: "password authentication failed"
- La contraseña en `.env` es incorrecta
- Verifica que coincida con la contraseña de PostgreSQL

#### Error: "database does not exist"
- Normal, el script la creará automáticamente
- Solo asegúrate de que la contraseña sea correcta

### Comandos Útiles

```bash
# Verificar configuración
npm run check-env

# Inicializar base de datos
npm run init-db

# Inicializar con datos de ejemplo
npm run init-db:seed

# Iniciar servidor backend
npm run dev
```

### ¿Necesitas ayuda adicional?

Si sigues teniendo problemas:
1. Verifica que PostgreSQL esté instalado y corriendo
2. Verifica que el archivo `.env` existe y tiene la contraseña correcta
3. Intenta conectarte manualmente con `psql -U postgres`
4. Revisa los logs de PostgreSQL para más detalles
