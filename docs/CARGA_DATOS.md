# Proceso de carga de datos iniciales

Guía para cargar productos, categorías, promociones e imágenes en IdeAncestral.

---

## Resumen del flujo

```
1. init-db.js --seed  →  Crea tablas + inserta productos/promociones
2. create-admin.js    →  Crea usuario administrador
3. Panel admin        →  Subir imágenes reales (opcional)
```

---

## 1. Cargar datos de ejemplo (seed)

### Comando

```powershell
cd backend
node scripts/init-db.js --seed
```

### Qué hace el seed

| Sección | Acción |
|---------|--------|
| **Limpieza** | Borra `imagenes_productos`, `productos`, `promociones` |
| **Productos** | Inserta 18 productos de ejemplo |
| **Imágenes** | Asigna `logo-principal.jpg` como placeholder a cada producto |
| **Promociones** | Inserta 4 promociones por temporada |

### Requisitos

- PostgreSQL corriendo
- `DATABASE_URL` en `backend/.env` (producción) o variables `DB_*` (local)
- El archivo `frontend/public/imagenes/logo-principal.jpg` debe existir (ya incluido en el repo)

---

## 2. Dos sistemas de imágenes

### `/imagenes/` – Archivos estáticos

- **Ubicación**: `frontend/public/imagenes/`
- **Uso**: Logo, placeholders, imágenes que no cambian
- **Servido por**: Backend en modo dev, incluido en build del frontend en producción
- **Incluido en el repo**: Sí (`logo-principal.jpg` como placeholder)

### `/uploads/` – Archivos subidos por admin

- **Ubicación**: `backend/uploads/`
- **Uso**: Imágenes de productos subidas desde el panel admin
- **Servido por**: Backend (solo archivos registrados en BD)
- **Incluido en el repo**: No (`.gitignore`), se crean al subir

---

## 3. Añadir imágenes reales a los productos

### Opción A: Panel de administración (recomendado)

1. Crear admin: `node scripts/create-admin.js`
2. Iniciar sesión en `/admin`
3. Editar cada producto y subir imágenes
4. Las imágenes se guardan en `backend/uploads/` y se sirven en `/uploads/`

### Opción B: Archivos en `frontend/public/imagenes/`

1. Coloca tus archivos en `frontend/public/imagenes/` (ej: `masc1.jpg`, `nac2.jpg`)
2. Edita `backend/database/seed.sql` para usar esas rutas en `imagenes_productos`
3. Vuelve a ejecutar el seed (o actualiza manualmente la BD)

### Opción C: Seed personalizado

Crea un `seed-custom.sql` con tus rutas de imagen y ejecútalo después del seed base:

```sql
-- Ejemplo: reemplazar placeholders por tus imágenes
UPDATE imagenes_productos SET url = '/imagenes/masc1.jpg' WHERE producto_id = 1;
```

---

## 4. Orden recomendado para nuevo despliegue

1. **Schema + seed**
   ```powershell
   cd backend
   node scripts/init-db.js --seed
   ```

2. **Crear admin**
   ```powershell
   node scripts/create-admin.js
   ```

3. **Subir imágenes** (opcional)  
   Desde el panel admin, editar productos y subir fotos.

---

## 5. Problemas frecuentes

| Problema | Causa | Solución |
|----------|-------|----------|
| Productos sin imagen | Falta `logo-principal.jpg` | Verifica que exista `frontend/public/imagenes/logo-principal.jpg` |
| 404 en `/imagenes/` | Carpeta no existe o no se sirve | La carpeta debe estar en `frontend/public/imagenes/` |
| Imágenes no se ven en producción | Build no incluye `public/` | Vite incluye `public/` en el build; verifica la configuración |
| Seed falla con "relation does not exist" | Tablas no creadas | Ejecuta primero `node scripts/init-db.js` (sin `--seed`) |
