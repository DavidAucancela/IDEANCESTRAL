# Pendientes — Ideancestral

Lista única de lo que queda para después. Cuando algo se haga, se tacha aquí y se anota en la bitácora que corresponda (`docs/REDISENO_INICIO.md` para el sitio).

**Revisión general:** 29 de octubre de 2026, después de fusionar el PR #8 (rediseño completo del inicio) en `main`.

---

## Estado al 29 de octubre de 2026

| | |
|---|---|
| Rama principal | `main` (incluye el PR #8: hero, destacados, categorías, promociones, nosotros, footer y traducciones) |
| Pruebas | 67 del frontend y 30 del backend, todas pasan |
| Compilación | `npx vite build` sin errores |
| Dependencias | 0 vulnerabilidades en frontend y backend (`npm audit`) |

---

## 1. Decisiones del dueño (contenido y negocio)

| # | Pendiente | Qué hace falta | Bloquea |
|---|---|---|---|
| 1 | **Catálogo real** | Llenar precio y stock en `docs/CATALOGO_PROPUESTO.csv` (32 piezas). Revisar fotos y descripciones en `docs/CATALOGO_PROPUESTO.html`. | Cargar los productos y las 4 categorías nuevas (Máscaras, Nacimientos, Pinturas, Recuerdos). |
| 2 | **Fotos propias de los productos** | 22 de las 32 piezas no tienen foto. 7 usan fotos libres de Wikimedia solo como referencia (llevan crédito obligatorio). Lo ideal es fotografiar cada pieza en el local. | Publicar el catálogo sin fotos que no son de la tienda. |
| 3 | **Fotos de 2 promociones** | Día de Difuntos y San Valentín usan la foto más parecida que había. Cambiarlas desde el panel admin. | — |
| 4 | **Derechos de la foto del Diablo Huma** (hero) | Confirmar que se puede usar. | — |
| 5 | **Pasarela de pago** | Elegir proveedor (PayPhone, PayPal, Kushki o Datafast) y abrir la cuenta de comercio. Pasos técnicos en `docs/REDISENO_INICIO.md` § 5. | Activar `PAGO_EN_LINEA_ACTIVO`. Hoy el pedido se cierra por WhatsApp. |
| 6 | **Scroll automático del buscador en móvil** | Confirmar si se mantiene (al tocar el buscador, la página sube para que quede arriba y el teclado no lo tape). | — |
| 7 | **Teléfonos y correo en el footer** | Se quitaron de Nosotros. Confirmar si se quedan en el footer o se dejan solo WhatsApp e Instagram. | — |

## 2. Repositorio y despliegue

| # | Pendiente | Detalle |
|---|---|---|
| 1 | **Verificar el despliegue de `main` en Railway** | Al desplegar corre la migración 005: deben aparecer las 8 temporadas (o, si ya había promociones, recibir sus meses sin duplicarse). Revisar el inicio en el celular. |
| 2 | **Cerrar el PR #7** | Quedó abierto con base `refactor/layout-compartido`; todo su contenido ya entró a `main` con el PR #8. |
| 3 | **Borrar ramas fusionadas** | Locales y remotas: `feat/hero-rediseno`, `feat/inicio-secciones`, `refactor/layout-compartido`, `fix/bugs-productos-stock-uploads`, `chore/cierre-git`, `design-system/fase-1-tokens-accesibilidad`. |
| 4 | **Archivos sin seguimiento en git** | `media/`, `frontend/public/imagenes/categorias/` (incluye `imanes_general.jpeg`, 3.2 MB, origen de la foto «máscaras del mercado») y `docs/CATALOGO_PROPUESTO.*` (la página apunta a fotos en la carpeta Descargas). Decidir si se agregan o se ignoran. |
| 5 | **Integración continua** | No hay GitHub Actions. Correr pruebas y compilación en cada PR evitaría fusionar algo roto. |

## 3. Trabajo técnico sugerido

### Prioridad alta
1. **Cargar el catálogo real** cuando el CSV tenga precios: script SQL para local y para Railway, con las categorías nuevas y los productos movidos a ellas.
2. **Contenido de la base solo en español:** nombres y descripciones de productos, categorías y promociones no se traducen. Si importa para turistas, agregar campos por idioma (por ejemplo `nombre_en`, `nombre_pt`) o una tabla de traducciones.
3. **Peso de las imágenes** (`frontend/public/imagenes` pesa 17 MB): convertir a WebP/AVIF y generar tamaños. Las más pesadas:
   - `mascara diablo huma - corregida.jpg` (1.8 MB)
   - `header.png` (1.6 MB, **no se usa en ningún lado**, se puede borrar)
   - Varias de 400–460 KB, incluidas dos del hero.

### Prioridad media
4. **Estilo nuevo en las páginas de categoría y de producto:** encabezados, tarjetas y botones del inicio; «agregar al carrito» desde la tarjeta.
5. **Mapa fijo de imágenes por nombre en `CategoriaView.vue`** (`'Mascaras': '/imagenes/diablo PRINCIPAL.jpg'`, …): el inicio ya usa solo `imagen_url` de la categoría. Quitarlo para que la portada de la categoría salga de la base.
6. **`AdminView.vue` tiene 1316 líneas** y usa `alert`/`confirm` del navegador: dividir en componentes por pestaña y usar `BaseModal` y avisos.
7. **Lighthouse** (rendimiento, accesibilidad, SEO) del inicio en móvil.
8. **Pruebas de extremo a extremo** (Playwright): buscar → agregar al carrito → pedir por WhatsApp; panel admin.

### Limpieza menor
9. Textos sin uso: `nav.catalogo`, `categoryView.cargando`, `admin.urlImagen`.
10. Componentes de la librería sin uso por ahora: `BaseBadge`, `BasePagination`, `SkeletonLoader`. Usarlos en categoría y producto (punto 4) o borrarlos.

---

## 4. Avisos para el desarrollo local

- **Docker Desktop tiene que estar abierto.** La base local (`ideancestral-db-1`, puerto 5435) vive en Docker; si se cierra, el API responde «Error al obtener productos». Arrancarla con `docker start ideancestral-db-1` o `npm run db:start`.
- El backend local usa el puerto **3002** (el 3000 lo ocupa otra app). El frontend lo toma de `VITE_API_URL` en `frontend/.env`.
- En desarrollo el límite es de 2000 peticiones cada 15 minutos; en producción, 200.
