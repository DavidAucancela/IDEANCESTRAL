# Proceso de carga de datos iniciales

Guía para cargar productos, categorías, promociones e imágenes en IdeAncestral.

---

## Resumen del flujo

```
1. init-db.js --seed  →  Crea tablas, aplica migraciones (incluye las 8 temporadas) + productos de ejemplo
2. create-admin.js    →  Crea usuario administrador
3. Panel admin        →  Subir imágenes reales, ajustar promociones
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
| **Limpieza** | Borra `imagenes_productos` y `productos` (las promociones **no** se tocan) |
| **Categorías** | Crea las que falten (Madera, Cerámica, Tejidos, Otros) |
| **Productos** | Inserta los productos de ejemplo |
| **Imágenes** | Asigna una imagen de `frontend/public/imagenes/` a cada producto |

Las **promociones** no salen del seed sino de la migración `005_promociones_temporadas.sql` (ver la sección 2).

### Requisitos

- PostgreSQL corriendo
- `DATABASE_URL` en `backend/.env` (producción) o variables `DB_*` (local)
- El archivo `frontend/public/imagenes/logo-principal.jpg` debe existir (ya incluido en el repo)

---

## 2. Promociones por temporada

La migración `005_promociones_temporadas.sql` corre en cada `init-db.js` (y en cada deploy) y es segura de repetir:

- Agrega a `promociones` los meses `mes_inicio` / `mes_fin` (1–12, se repiten cada año; si el fin es menor que el inicio, cruza el año) y `categoria_id` (a dónde lleva la promoción en el inicio).
- Carga **una sola vez** 8 temporadas: San Valentín, Carnaval, Día de la Madre, Día del Padre, Inti Raymi, Día de Difuntos, Fiestas de Quito y Navidad. La marca queda en la tabla `datos_iniciales`, así que si el dueño borra una desde el panel no vuelve a aparecer.
- Si ya había promociones con esos nombres, no las duplica: les deduce el mes del texto «temporada» y les asigna categoría.

Para volver a cargar las 8 temporadas en una base local:

```sql
DELETE FROM datos_iniciales WHERE clave = 'temporadas_promociones';
```

y luego `node scripts/run-migrations.js`. Desde el panel admin se cambian fotos, meses y categoría de cada una.

## 3. Catálogo real (pendiente)

El catálogo propuesto de 32 piezas, con 4 categorías nuevas (Máscaras, Nacimientos, Pinturas, Recuerdos), está en `docs/CATALOGO_PROPUESTO.csv` y se revisa visualmente en `docs/CATALOGO_PROPUESTO.html`. Cuando el dueño llene precio y stock se arma el script de carga para local y Railway. Ver `docs/PENDIENTES.md`.

## 4. Dos sistemas de imágenes

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

## 5. Añadir imágenes reales a los productos

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

## 6. Orden recomendado para nuevo despliegue

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

## 7. Problemas frecuentes

| Problema | Causa | Solución |
|----------|-------|----------|
| Productos sin imagen | Falta `logo-principal.jpg` | Verifica que exista `frontend/public/imagenes/logo-principal.jpg` |
| 404 en `/imagenes/` | Carpeta no existe o no se sirve | La carpeta debe estar en `frontend/public/imagenes/` |
| Imágenes no se ven en producción | Build no incluye `public/` | Vite incluye `public/` en el build; verifica la configuración |
| Seed falla con "relation does not exist" | Tablas no creadas | Ejecuta primero `node scripts/init-db.js` (sin `--seed`) |
| El API responde 500 en local | La base de Docker está apagada | Abre Docker Desktop y ejecuta `docker start ideancestral-db-1` (o `npm run db:start`) |
| La sección Promociones no aparece | No hay promociones activas | Revisa el panel admin o vuelve a cargar las temporadas (sección 2) |
