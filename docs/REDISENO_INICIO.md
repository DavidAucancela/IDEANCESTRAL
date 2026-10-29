# Rediseño del inicio — bitácora y guía

Documento vivo del rediseño visual de Ideancestral. Registra lo que ya se hizo, cómo está armado y qué sigue. El inicio se va a seguir mejorando sección por sección (agregar, quitar o modificar secciones), así que la guía de la sección 4 es la receta para cada cambio.

**Última actualización:** 27 de octubre de 2026

---

## 1. Estado actual

| | |
|---|---|
| Rama de trabajo | `feat/hero-rediseno` |
| PR abierto | #7 «feat(inicio): rediseño del hero con buscador en vivo» → base `refactor/layout-compartido` |
| PRs ya fusionados | #4 cierre de git, #5 bugs de productos/stock/uploads, #6 layout compartido |
| Commits locales sin subir | 8 (desde `0bcc935` hasta el del carrito en pasos) — se suben al PR #7 cuando se decida |
| Pruebas | 30 del frontend (Vitest) y 21 del backend, todas pasan |
| Compilación | `npx vite build` funciona |

> El PR #7 apunta a `refactor/layout-compartido`, que ya está fusionada en `main`. Antes de fusionar el #7 conviene cambiar su base a `main`.

---

## 2. Lo que se hizo

### 2.1 Base (PRs #4, #5, #6, ya en `main`)
- **Git:** se cerró el trabajo pendiente del sistema de diseño (fases 1 a 3: tokens, accesibilidad, librería de componentes `Base*`).
- **Bugs:**
  - Los productos ocultos ya no se exponen.
  - La edición de productos se valida.
  - Se agregó la columna `stock`, que la tienda respeta.
  - `UPLOAD_DIR` ahora se respeta.
- **Layout compartido:** header, footer, carrito y botón de WhatsApp se montan una sola vez en `App.vue` (`components/layout/`).
- **Dependencias:** se corrigieron las vulnerabilidades señaladas por Socket/npm audit (vitest 4, vite 6).

### 2.2 Sección de inicio (hero) — `components/inicio/HeroSection.vue`
1. **Diseño inmersivo:** foto a pantalla completa con el texto a la derecha (o abajo en móvil). Se probaron 4 variantes y quedó el **buscador en vivo** como única interacción. Se quitaron los botones y la píldora de ubicación.
2. **Buscador:**
   - Título visible «Busca tu producto».
   - Resultados en vivo (`GET /productos?buscar=`) con navegación por teclado (↑ ↓ Enter Esc).
   - Si no hay resultados, enlace para preguntar por WhatsApp.
3. **Ejemplos que se escriben solos:** se resalta una categoría popular y se escribe el nombre de uno de sus productos reales, después la siguiente, y así. Usa una sola petición: `GET /productos?limit=50`. Se pausa al tocar el campo, al escribir o si el inicio no está en pantalla.
4. **Categorías populares:** las que tienen más productos publicados. El backend devuelve `total_productos` en `GET /categorias`. Se muestran 4 en escritorio y 2 en móvil, y las vacías no aparecen.
5. **Scroll automático en móvil:** al tocar el buscador, la página sube para que quede arriba y el teclado no lo tape.
6. **Fondos que rotan:** 5 fotos (Diablo Huma, máscara de diablo, máscaras del mercado, cuadros, paisaje andino), 7 s cada una.
   - Cambian con un fundido y un acercamiento suave.
   - Las barras de abajo marcan el tiempo y permiten elegir una foto.
   - Las imágenes se cargan a medida que hacen falta.
7. **Colores por foto:** cada foto trae su paleta (acento, texto, velo). Los títulos, la etiqueta, el buscador, los chips y la navbar toman esos colores.
8. **Tema claro / oscuro:** cada foto tiene **dos paletas**.
   - En modo claro: velo claro con el tono de la foto y letras oscuras.
   - En modo oscuro: velo oscuro y letras claras.
   - Todos los colores cumplen contraste AA.
9. **Una sola pantalla:** la sección ocupa exactamente el alto de la pantalla (`100svh`) en móvil y escritorio. Se probó en 8 tamaños, de 360×740 a 1920×1080.
10. **Accesibilidad:**
    - Si el sistema pide reducir movimiento, no hay rotación automática ni animaciones.
    - Combobox ARIA, y los resultados se anuncian a lectores de pantalla.

### 2.3 Navbar — `components/layout/AppHeader.vue`
- **Sobre el inicio:** transparente, con los colores de la foto activa y un velo suave arriba. Al bajar o en otras páginas se vuelve sólida con los colores del tema.
- **Diseño:** logo circular real (`/imagenes/logo-96.png`) y enlaces centrados en mayúsculas con una línea de acento al pasar el mouse.
- **Pulsación larga:** mantener presionado el logo 5 s sigue abriendo `/admin`.
- **Menú móvil:** ventana flotante (no pantalla completa) bajo el botón.
  - Usa los colores del tema claro u oscuro.
  - Muestra las 4 secciones con una descripción corta y, abajo, el cambio de tema e idioma (ES/EN/PT).
  - Se cierra con Escape, con un clic fuera o al navegar.
  - Bloquea el scroll de la página y mantiene el foco dentro del menú.
- **Footer:** usa el mismo logo circular.

### 2.4 Títulos de sección — `components/SeccionEncabezado.vue`
- Un solo componente para los títulos de Destacados, Categorías, Promociones y Nosotros. Lleva la etiqueta en mayúsculas entre líneas finas, el título en serif y una parte en cursiva de acento.
- El título de Destacados estaba fijo en español; ahora se traduce (`featured.*`).

### 2.5 Carrito — `components/layout/CartDrawer.vue` (**elegido: pasos**)
Se compararon 4 diseños (ventana, panel, hoja y pasos) y el 27 de octubre de 2026 se eligió **pasos**. Se borró el código de los otros tres y el parámetro `?carrito=`.

- **Forma:** panel lateral flotante a toda la altura, con el estilo de la navbar.
- **Paso 1, Revisar:** piezas, cantidades (con tope de stock), quitar y vaciar.
- **Paso 2, Entrega:** retiro en el local o envío a domicilio, nombre y nota (opcionales).
- **Paso 3, Pago:** el cliente elige **pagar en línea** (pasarela) o **coordinar por WhatsApp**. Abajo se ve un resumen de la entrega con «Cambiar».
- **Mensaje de WhatsApp:** lleva las piezas, el total, la entrega, el nombre y la nota.
- **Pago en línea (preparado, apagado):** `PAGO_EN_LINEA_ACTIVO = false` en `config/carrito.js`. Mientras esté apagado, el paso 3 solo ofrece WhatsApp. El punto de conexión con la pasarela es `services/pagoEnLinea.js` (hoy rechaza y se muestra un aviso).
- En pantallas de 420px o menos, los pasos inactivos muestran solo el número.

---

## 3. Cómo está armado

### 3.1 Mapa de archivos

| Archivo | Para qué sirve |
|---|---|
| `frontend/src/views/CatalogoView.vue` | Página de inicio: arma todas las secciones en orden |
| `frontend/src/components/inicio/HeroSection.vue` | Primera sección (fotos, buscador, ejemplos, chips) |
| `frontend/src/config/inicio.js` | Fotos del hero, sus dos paletas, encuadre y segundos por foto |
| `frontend/src/composables/useEstadoInicio.js` | Estado compartido hero → navbar (transparencia y paleta) |
| `frontend/src/components/layout/AppHeader.vue` | Navbar y menú móvil |
| `frontend/src/components/SeccionEncabezado.vue` | Títulos de sección |
| `frontend/src/config/carrito.js` | Interruptor del pago en línea (`PAGO_EN_LINEA_ACTIVO`) |
| `frontend/src/services/pagoEnLinea.js` | Punto de conexión con la pasarela de pago (sin proveedor aún) |
| `frontend/src/composables/useSecciones.js` | Scroll a secciones por id y `HEADER_OFFSET` |
| `frontend/src/i18n/{es,en,pt}.js` | Textos (`hero.*`, `nav.*`, `featured.*`, `cart.*`, …) |
| `frontend/src/style.css` | Tokens del tema (`--color-*`) y `--header-alto` (72px / 64px en ≤900px) |
| `frontend/public/imagenes/inicio/` | Fotos del hero en 900px y 1440–1600px |
| `frontend/src/App.test.js` | Pruebas de layout, hero, navbar, tema y carrito |

### 3.2 Cómo viajan los colores
```
config/inicio.js  ── foto activa + tema (useThemeStore().isDark) ──▶  paletaDe(foto, oscuro)
        │
        ├─▶ HeroSection: --hero-acento, --hero-texto, --hero-fondo-rgb (+ clase hero--claro / hero--oscuro)
        └─▶ useEstadoInicio.paleta ─▶ AppHeader: --nav-acento, --nav-texto, --nav-fondo
```
- Dentro del hero no hay blancos fijos: superficies, bordes y textos secundarios salen de `--hero-texto` con `color-mix`, y la clase `.hero--claro` ajusta vidrio, campo y sombras.
- Fuera del hero, todo usa los tokens del tema (`--color-text`, `--color-surface`, `--color-secondary`…), que cambian solos con `[data-theme="dark"]`.

### 3.3 Agregar o cambiar una foto del hero
1. Exportar la foto en dos tamaños (`-900.jpg` y `-1600.jpg`, calidad ~80) en `public/imagenes/inicio/`.
2. Agregar una entrada en `HERO_FONDOS` (`config/inicio.js`) con `imagenes`, `ancho`, `alto`, `alt` (clave i18n), `posicion` y `posicionMovil`. Agregar también **las dos paletas**:
   - `oscuro`: acento claro y saturado, texto casi blanco teñido, velo muy oscuro.
   - `claro`: acento oscuro e intenso, texto casi negro teñido, velo muy claro.
3. Comprobar el contraste: texto/velo ≥ 7 y acento/velo ≥ 4.5.
4. Agregar el texto `alt` en los 3 idiomas (`hero.alt…`).
5. Revisar el encuadre en móvil (`posicionMovil`), en ambos temas.

---

## 4. Guía para agregar, quitar o modificar secciones del inicio

Orden actual de `CatalogoView.vue`:

| # | Sección | id | En el menú | Estado del diseño |
|---|---|---|---|---|
| 1 | Hero (buscador + fotos) | `inicio` | Sí | Rediseñada ✅ |
| 2 | Destacados (5 productos, mosaico) | `destacados` | No | Solo el título nuevo |
| 3 | Banner central (carrusel con frase) | — | No | Sin rediseñar |
| 4 | Categorías (tarjetas con foto) | `categorias` | Sí | Solo el título nuevo |
| 5 | Promociones por temporada | `promociones` | Sí | Solo el título nuevo |
| 6 | Nosotros (datos de contacto + mapa) | `nosotros` | Sí | Solo el título nuevo |

### 4.1 Lista de control para cada cambio
- [ ] **Componente propio:** nuevas secciones (o las que se rediseñen) van en `components/inicio/NombreSeccion.vue` con `<script setup>`, para ir vaciando `CatalogoView.vue` (hoy tiene 980 líneas y usa la Options API).
- [ ] **Título:** usar `<SeccionEncabezado etiqueta titulo acento descripcion />`.
- [ ] **Textos:** nada fijo en el template; claves nuevas en `es.js`, `en.js` y `pt.js`.
- [ ] **Tema:** solo tokens `--color-*`, sin colores fijos. Revisar en claro y en oscuro.
- [ ] **Móvil:** probar a 360px y 390px de ancho, sin scroll horizontal.
- [ ] **Animación de entrada:** `data-animate` en los bloques (la usa `useScrollAnimation`) y respeto a «reducir movimiento».
- [ ] **Navegación:** si la sección debe aparecer en el menú, darle `id` y agregarla a `secciones` en `AppHeader.vue`, con `label` y `descripcion` en i18n. Si se quita una sección del menú, quitarla de ahí también.
- [ ] **Datos:** si consulta el API, una sola petición si es posible (hay límite de 200 peticiones / 15 min por IP), con estado de carga y estado vacío.
- [ ] **Pruebas:** agregar o ajustar casos en `App.test.js`; correr `npx vitest run` y `npx vite build`.
- [ ] **Limpieza:** al quitar una sección, borrar también su CSS, sus textos i18n, sus imágenes y la lógica de `CatalogoView.vue` que ya no se use.

### 4.2 Ideas por sección (para decidir)
- **Destacados:**
  - Textos fijos por traducir («✦ Destacado», «Ver producto →», «Artesanía»).
  - Botón «agregar al carrito» directo en la tarjeta.
  - Mostrar «agotado» cuando `stock = 0`.
- **Banner central:**
  - Usa un carrusel aparte, con fotos que no tienen la paleta del hero.
  - Opciones: quitarlo (el hero ya rota fotos), convertirlo en una franja con una frase y una foto fija, o en una sección «Cómo trabajamos / artesanos».
- **Categorías:**
  - El texto «Ver colección →» está fijo en español.
  - Se podría mostrar el número de productos (ya llega `total_productos`).
- **Promociones:**
  - Hoy cada tarjeta abre WhatsApp.
  - Se podría mostrar la fecha de la temporada y resaltar la vigente.
- **Nosotros:**
  - Datos y mapa en dos columnas.
  - Se podría agregar horario de atención, una foto del local y una historia corta.
- **Nuevas posibles:** testimonios reales, «cómo comprar» (3 pasos: elegir → carrito → WhatsApp), Instagram.

---

## 5. Siguientes pasos

### Decisiones pendientes del dueño
1. **Pasarela de pago:** elegir proveedor (PayPhone, PayPal, Kushki o Datafast) y abrir la cuenta de comercio. Para conectarla: el backend crea el pedido y la transacción (el token nunca va al navegador), se completa `services/pagoEnLinea.js`, se confirma el pago con el aviso (webhook) de la pasarela y se activa `PAGO_EN_LINEA_ACTIVO`.
2. **Subir los commits locales** al PR #7 y cambiar su base a `main`.
3. **Límite de peticiones:** hoy el límite global (200 / 15 min) cuenta también imágenes y archivos estáticos. Se recomienda aplicarlo solo a `/api`.
4. **Scroll automático del buscador en móvil:** confirmar si se mantiene.
5. **Derechos de la foto del Diablo Huma:** confirmar que se puede usar.
6. **Archivos sin seguimiento en git:** `media/` y `frontend/public/imagenes/categorias/`. Decidir si se agregan o se ignoran (`imanes_general.jpeg` es el origen de la foto «máscaras del mercado»).

### Trabajo técnico sugerido
1. Rediseñar las secciones 2 a 6 una por una con la guía de la sección 4, empezando por **Destacados** y el **Banner central**.
2. Pasar cada sección de `CatalogoView.vue` a su propio componente en `components/inicio/`.
3. Traducir los textos que siguen fijos en español en el inicio.
4. Llevar el mismo estilo a las páginas de categoría y de producto.
5. Revisar rendimiento (peso de imágenes, Lighthouse) cuando el inicio esté completo.

---

## 6. Cómo verificar

```bash
cd frontend
npx vitest run      # pruebas
npx vite build      # compilación
npm run dev         # desde la raíz: frontend 5173 + backend
```
- Revisar cada cambio en escritorio (1440×900) y móvil (390×844), en tema claro y oscuro.
- En capturas automáticas con Chrome sin pantalla, las transiciones, el scroll suave y el IntersectionObserver no avanzan, y el ancho mínimo de la ventana ronda los 500px. Para móvil, usar un iframe de 390px.
