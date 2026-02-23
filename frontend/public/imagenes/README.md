# Imágenes estáticas (frontend/public/imagenes)

## ¿Qué es esta carpeta?

Aquí van las imágenes que se sirven bajo la ruta `/imagenes/` en la aplicación.

- **En desarrollo**: El backend sirve esta carpeta en `/imagenes`
- **En producción**: Las imágenes se incluyen en el build del frontend

## Archivos incluidos

| Archivo | Uso |
|---------|-----|
| `logo-principal.jpg` | Imagen placeholder / logo por defecto. Usado cuando un producto no tiene imagen o falla la carga. |
| `logo-principal.png` | Mismo contenido (placeholder 1x1). Puedes reemplazarlo por tu logo real. |

## Cómo añadir imágenes reales

### Opción 1: Panel de administración (recomendado)

1. Inicia sesión en `/admin`
2. Edita cada producto
3. Sube las imágenes desde el panel
4. Las imágenes se guardan en `backend/uploads/` y se sirven en `/uploads/`

### Opción 2: Archivos en esta carpeta

1. Coloca tus archivos aquí (ej: `masc1.jpg`, `nac2.jpg`)
2. Actualiza las URLs en la base de datos para que apunten a `/imagenes/tu-archivo.jpg`
3. O ejecuta un seed personalizado que use tus nombres de archivo

## Reemplazar el logo

Para usar tu logo en lugar del placeholder:

1. Sustituye `logo-principal.jpg` por tu imagen (mismo nombre)
2. O sustituye `logo-principal.png` si prefieres PNG
3. Si usas otro nombre, actualiza las referencias en el código del frontend
