# Rediseño del inicio — bitácora y guía

Bitácora del rediseño visual de Ideancestral: qué se hizo, cómo está armado y cómo seguir. **El rediseño del inicio está terminado** y fusionado en `main` (PR #8). Para cambios futuros, la guía de la sección 4 es la receta; lo que queda pendiente está en [`docs/PENDIENTES.md`](PENDIENTES.md).

**Última actualización:** 29 de octubre de 2026

---

## 1. Estado actual

| | |
|---|---|
| Rama | `main` — todo el rediseño entró con el **PR #8** «Feat/inicio secciones» (29 oct 2026) |
| PRs fusionados | #4 cierre de git, #5 bugs de productos/stock/uploads, #6 layout compartido, #8 rediseño del inicio |
| PR por cerrar | #7 (hero): quedó abierto, pero su contenido ya está en `main` por el #8 |
| Pruebas | 67 del frontend (Vitest) y 30 del backend, todas pasan |
| Compilación | `npx vite build` funciona |
| Dependencias | 0 vulnerabilidades (`npm audit`, 29 oct 2026) |

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

### 2.5.1 Ajuste del tema claro en el hero (27 oct 2026)
- En escritorio y tema claro se quitó el velo de abajo. Queda el del lado del texto y el de arriba para la navbar.
- El velo de arriba es más suave en tema claro (`--nav-velo`: 0.4; en oscuro sigue 0.6).
- Los indicadores de fotos y «Ver más» llevan un fondo de vidrio para leerse sin el velo.

### 2.6 Banner central — **quitado**
- Se borró el carrusel con «ARTESANÍAS»: repetía la rotación de fotos del hero y tenía colores fijos. También su CSS y los textos `banner.*`. Sus fotos se quedan porque son de productos.

### 2.7 Destacados — `components/inicio/DestacadosSection.vue` (**elegido: vitrina**)
Se compararon 4 diseños (mosaico, galería, carrusel y vitrina) y el 27 de octubre de 2026 se eligió **vitrina**. Se borró el código de los otros tres y el parámetro `?destacados=`.

- Sale de `CatalogoView.vue` a su propio componente con `<script setup>`. Una sola petición: `GET /productos?destacado=true&limit=5`.
- **Forma:** una pieza en grande con su foto, categoría, nombre, descripción y los botones «Agregar al carrito» y «Ver más». Las miniaturas permiten cambiar de pieza.
  - **Sin precio** (28 oct 2026): se ve en el carrito y en el detalle.
  - **Una sola pantalla** en móvil y escritorio: la sección mide `100svh`, deja arriba el alto de la navbar (`--header-alto`) y la foto llena el espacio libre (va con `position: absolute` para no estirar la sección). En pantallas muy bajas, la foto tiene un alto mínimo y la sección crece un poco.
  - En escritorio: foto a la izquierda; ficha y miniaturas a la derecha.
  - En móvil (≤900px): foto, ficha (descripción en 2 líneas y sin el subtítulo del encabezado) y miniaturas, una debajo de otra. Las miniaturas van abajo, a la izquierda de los botones flotantes (WhatsApp y volver arriba), y los botones de la ficha quedan por encima de ellos, así que nada queda tapado.
- **Agotado** (`stock = 0`): etiqueta en la foto, foto apagada y, en lugar del botón, «Agotado».
- Textos traducidos (`featured.*`, `cart.agregar`, `product.agotado`, `product.artesania`). Esqueleto de carga con la misma forma.
- Se quitaron el efecto de la foto que seguía al mouse y la etiqueta «✦ Destacado».
- La ficha no lleva `data-animate`: carga después de montar la página y el observador ya no la vería.

### 2.8 Categorías — `components/inicio/CategoriasSection.vue` (**elegido: paneles**)
Se compararon 4 diseños (mosaico, paneles, lista y arcos) y el 28 de octubre de 2026 se eligió **paneles**. Se borró el código de los otros tres y el parámetro `?categorias=`.

- Sale de `CatalogoView.vue` a su propio componente. Recibe las categorías por props (`categorias`, `cargando`): la portada las carga una sola vez porque también las usa el buscador del hero.
- **Solo las que tienen productos**, ordenadas de más a menos piezas. La primera lleva el sello «Más variedad» y es la que está abierta al llegar.
- **Escritorio:** franjas verticales con foto, una al lado de otra. Cerradas muestran el nombre de lado. La que tiene el mouse o el foco del teclado se abre y muestra nombre, número de piezas, descripción y «Ver colección →». Al sacar el mouse vuelve a abrirse la principal.
- **Móvil y pantallas táctiles** (`max-width: 768px` o `hover: none`): franjas horizontales una debajo de otra, todas con nombre, piezas y «Ver colección». La primera es más alta. El velo oscurece desde la izquierda, donde va el texto.
- Velo con tokens: `--cat-velo` y `--cat-velo-suave` salen de `--color-dark`. El enlace usa `--cat-enlace` fijo, porque siempre va sobre el velo oscuro.
- Textos nuevos en los 3 idiomas: `categories.verColeccion`, `piezas` / `pieza`, `masVariedad`. Subtítulo nuevo: «Elige una colección y descubre sus piezas».
- Se quitó el mapa fijo de imágenes por nombre: la foto sale de `imagen_url` de la categoría (o el logo si falta).

### 2.9 Promociones — `components/inicio/PromocionesSection.vue` (**elegido: banda**)
Se compararon 4 diseños (destacada, calendario, carrusel y banda) y el 28 de octubre de 2026 se eligió **banda**. Se borró el código de los otros tres y el parámetro `?promociones=`.

- **Forma:** una foto ancha con la temporada elegida (etiqueta de estado, meses, nombre y «Ver piezas →») y debajo pestañas con todas las temporadas para cambiarla. En escritorio el texto va a la izquierda con velo lateral; en móvil va abajo y las pestañas se deslizan de borde a borde.
- **Orden por cercanía** (`utils/temporadas.js`, `ordenarPorTemporada`): primero las vigentes y luego las que vienen. Al llegar se ve la primera. Etiquetas: «Temporada actual» si el mes cae en su rango y «Próxima temporada» para la siguiente (si no hay vigentes, o si empieza el mes que viene). Una temporada puede cruzar el año (ej. diciembre → enero).
- **Al tocar la foto** lleva a la categoría de la promoción, o a la sección Categorías si no tiene.
- **Sin promociones activas la sección no aparece.** Se quitaron las 4 promociones de ejemplo fijas del código y el enlace a WhatsApp de cada tarjeta.
- Los meses salen en el idioma elegido con `Intl` («Noviembre», «November», «Novembro»). El nombre de la promoción viene de la base y queda en español.
- **Base de datos** (migración `005_promociones_temporadas.sql`): columnas `mes_inicio`, `mes_fin` (1–12) y `categoria_id`.
  - Carga una sola vez 8 temporadas: San Valentín, Carnaval, Día de la Madre, Día del Padre, Inti Raymi, Día de Difuntos, Fiestas de Quito y Navidad.
  - Lleva una marca en la tabla nueva `datos_iniciales`, así que si el dueño borra una, no vuelve en el siguiente deploy.
  - A las promociones que ya existían les deduce el mes del texto «temporada» y les asigna categoría por nombre, sin duplicarlas.
- **API:** crear y editar validan con Zod (`utils/promocionSchema.js`): meses 1–12 y los dos juntos. `GET /promociones` devuelve también `categoria_nombre`.
- **Panel admin:** el formulario de promoción tiene «Mes de inicio», «Mes de fin» y «Al tocarla lleva a la categoría».
- **Pendiente del dueño:** reemplazar las fotos de Día de Difuntos y San Valentín (se usaron las más parecidas que había).

### 2.10 Nosotros — `components/inicio/NosotrosSection.vue`
Diseño pedido directamente (28 de octubre de 2026), sin comparar opciones.

- **Se quitaron teléfonos y correo** de la sección. Siguen en el footer.
- **Ubicación y mapa en una sola tarjeta que gira.**
  - El frente tiene la dirección sobre un fondo de plano, el pin y «Toca para ver el mapa».
  - Al tocarla gira (`rotateY`) y muestra el mapa, con «← Ver dirección» para volver y «Cómo llegar ↗» (ruta en Google Maps).
  - El mapa se carga recién la primera vez que se gira.
  - El foco pasa al botón de la otra cara, y la cara oculta queda `inert`.
  - Con «reducir movimiento» cambia al instante.
- **Horario de atención** con el indicador «Abierto ahora / Cerrado ahora», calculado con la hora de Quito (`ZONA_HORARIA`) y actualizado cada minuto. Las horas salen en el formato de cada idioma (`utils/horario.js`).
- **WhatsApp e Instagram destacados:** tarjetas grandes con los colores de cada marca, un ícono en círculo y «Pedidos y consultas» / `@ideancestral`. En escritorio van una debajo de otra; en tablet, lado a lado; en teléfono, apiladas.
- **Datos en `config/contacto.js`:** `DIRECCION`, `MAPA_EMBED_URL`, `COMO_LLEGAR_URL`, `ZONA_HORARIA`, `INSTAGRAM_USUARIO` y `HORARIO` (cada franja con su clave de texto y sus días, 0 = domingo).
- Con esto `CatalogoView.vue` solo arma las secciones y carga las categorías (`<script setup>`, ~50 líneas).

### 2.11 Footer en móvil — `components/layout/AppFooter.vue`
Ocupaba mucho alto en móvil (740px en 390px de ancho) y ahora mide 478px. Escritorio sin cambios.

- Logo y redes (Instagram, WhatsApp) en una misma fila; el lema va debajo.
- **Navegación | Contacto en 2 columnas**, con títulos en mayúsculas más chicos y una línea que las separa del logo.
- El correo se parte después de la @ si no cabe (`<wbr>`).
- El texto de derechos va a la izquierda y deja libre la esquina de los botones flotantes.

### 2.12 Últimos cambios antes de las pruebas (29 oct 2026)
- **Textos traducidos en todo el sitio** (es, en, pt):
  - Página de categoría: filtros, orden, contador con singular/plural, «Destacado», «Ver más».
  - Página de producto: ficha, compartir, mensaje de WhatsApp, sección «Hecho a mano con tradición», avisos de copiar enlace.
  - Página 404.
  - Etiquetas de accesibilidad: volver arriba, cerrar, paginación, visor de imágenes.
  - Textos nuevos en los bloques `proceso`, `notFound` y `comun`.
- **Prueba de textos completos** (`i18n/i18n.test.js`): falla si a un idioma le falta o le sobra una clave, o si hay un texto vacío.
- **Zoom en pantallas táctiles:** antes decía «Pasa el cursor para ampliar» y el zoom se quedaba pegado al tocar. Ahora, sin mouse (`hover: none`), dice «Toca para ampliar» y tocar abre la imagen en grande.
- **Tarjetas de la categoría:** ya no dependen de la animación para verse (`animation-fill-mode: both`, sin `data-animate`).
- Copiar enlace: si falla, ahora avisa «No se pudo copiar el link» (antes decía que se copió).
- Lo que viene de la base (nombres de categorías y productos, descripciones) sigue en español.

## 3. Cómo está armado

### 3.1 Mapa de archivos

| Archivo | Para qué sirve |
|---|---|
| `frontend/src/views/CatalogoView.vue` | Página de inicio: arma todas las secciones en orden |
| `frontend/src/components/inicio/HeroSection.vue` | Primera sección (fotos, buscador, ejemplos, chips) |
| `frontend/src/components/inicio/DestacadosSection.vue` | Productos destacados (vitrina) |
| `frontend/src/components/inicio/CategoriasSection.vue` | Explora por categoría (paneles) |
| `frontend/src/components/inicio/PromocionesSection.vue` | Promociones por temporada (banda) |
| `frontend/src/components/inicio/NosotrosSection.vue` | Ubicación que gira al mapa, horario y redes |
| `frontend/src/utils/horario.js` | Horas en cada idioma y «abierto ahora» con la hora de Quito |
| `frontend/src/utils/temporadas.js` | Meses en cada idioma y orden de temporadas por cercanía |
| `backend/database/migrations/005_promociones_temporadas.sql` | Meses y categoría de las promociones; carga las 8 temporadas una vez |
| `frontend/src/config/inicio.js` | Fotos del hero, sus dos paletas, encuadre y segundos por foto |
| `frontend/src/config/contacto.js` | Teléfonos, correo, Instagram, WhatsApp, dirección, mapa, zona horaria y horario de atención (`HORARIO`) |
| `frontend/src/composables/useEstadoInicio.js` | Estado compartido hero → navbar (transparencia y paleta) |
| `frontend/src/components/layout/AppHeader.vue` | Navbar y menú móvil |
| `frontend/src/components/SeccionEncabezado.vue` | Títulos de sección |
| `frontend/src/config/carrito.js` | Interruptor del pago en línea (`PAGO_EN_LINEA_ACTIVO`) |
| `frontend/src/services/pagoEnLinea.js` | Punto de conexión con la pasarela de pago (sin proveedor aún) |
| `frontend/src/composables/useSecciones.js` | Scroll a secciones por id y `HEADER_OFFSET` |
| `frontend/src/i18n/{es,en,pt}.js` | Textos (`hero.*`, `nav.*`, `featured.*`, `cart.*`, …) |
| `frontend/src/style.css` | Tokens del tema (`--color-*`) y `--header-alto` (72px / 64px en ≤900px) |
| `frontend/public/imagenes/inicio/` | Fotos del hero en 900px y 1440–1600px |
| `frontend/src/App.test.js` | Pruebas de layout, hero, navbar, tema, carrito, cada sección del inicio y páginas traducidas |
| `frontend/src/i18n/i18n.test.js` | Falla si los 3 idiomas no tienen las mismas claves o si hay textos vacíos |

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
| 2 | Destacados (`DestacadosSection`) | `destacados` | No | Rediseñada ✅ (vitrina) |
| 3 | Categorías (`CategoriasSection`) | `categorias` | Sí | Rediseñada ✅ (paneles) |
| 4 | Promociones (`PromocionesSection`) | `promociones` | No (se oculta si no hay promociones) | Rediseñada ✅ (banda) |
| 5 | Nosotros (`NosotrosSection`) | `nosotros` | Sí | Rediseñada ✅ (tarjeta que gira) |

### 4.1 Lista de control para cada cambio
- [ ] **Componente propio:** cada sección va en `components/inicio/NombreSeccion.vue` con `<script setup>`. `CatalogoView.vue` solo las ordena y carga las categorías (~60 líneas).
- [ ] **Título:** usar `<SeccionEncabezado etiqueta titulo acento descripcion />`.
- [ ] **Textos:** nada fijo en el template; claves nuevas en `es.js`, `en.js` y `pt.js`.
- [ ] **Tema:** solo tokens `--color-*`, sin colores fijos. Revisar en claro y en oscuro.
- [ ] **Móvil:** probar a 360px y 390px de ancho, sin scroll horizontal.
- [ ] **Animación de entrada:** `data-animate` solo en lo que existe al montar la página (el observador no ve lo que llega después del API: quedaría invisible). Respetar «reducir movimiento».
- [ ] **Navegación:** si la sección debe aparecer en el menú, darle `id` y agregarla a `secciones` en `AppHeader.vue`, con `label` y `descripcion` en i18n. Si se quita una sección del menú, quitarla de ahí también.
- [ ] **Datos:** si consulta el API, una sola petición si es posible (límite de 200 peticiones / 15 min por IP en producción), con estado de carga y estado vacío (si no hay datos, la sección no se muestra).
- [ ] **Pruebas:** agregar o ajustar casos en `App.test.js`; correr `npx vitest run` y `npx vite build`.
- [ ] **Limpieza:** al quitar una sección, borrar también su CSS, sus textos i18n, sus imágenes y la lógica de `CatalogoView.vue` que ya no se use.

### 4.2 Ideas por sección (histórico: ya se decidieron, ver 4.3)
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

### 4.3 Decisiones tomadas (27 de octubre de 2026)

Orden final: **Hero → Destacados → Categorías → Promociones → Nosotros**. Cada sección pasa a su componente en `components/inicio/`.

| Sección | Decisión | Qué cambia |
|---|---|---|
| Destacados | Conservar y arreglar | Traducir «✦ Destacado», «Ver producto →», «Artesanía». Botón «agregar al carrito» en la tarjeta; si `stock = 0`, etiqueta «Agotado» y sin botón. Esqueleto de carga igual al mosaico. Mosaico sin huecos con menos de 5 productos. Quitar el parallax del mouse. |
| Banner central | **Quitar** (hecho) | Borrar plantilla, carrusel (`bannerIndex`, intervalo), su CSS, textos `banner.*` en los 3 idiomas e imágenes que solo use él. |
| Categorías | Conservar y arreglar (**hecho**, paneles) | Ocultar categorías vacías. Traducir «Ver colección →» y mostrarlo también en móvil. Mostrar número de productos. Destacar la que tiene más productos. Revisar el mapa fijo de imágenes por nombre. Colores del velo con tokens. |
| Promociones | Resaltar la temporada vigente (**hecho**, banda) | Ordenar por cercanía al mes actual y marcar la vigente/próxima. Quitar las 4 promociones de ejemplo fijas (si no hay promociones, la sección no se muestra). Colores de etiqueta con tokens. |
| Nosotros | Enfocar en visitar el local (**hecho**) | Dirección y mapa en una tarjeta que gira, **horario de atención** (lunes a viernes 9:00–18:00, sábados y domingos 10:00–17:00) y WhatsApp e Instagram destacados. Teléfonos y correo quedan solo en el footer. |

---

## 5. Siguientes pasos

La lista completa y priorizada está en [`docs/PENDIENTES.md`](PENDIENTES.md). Resumen de lo que ya se cerró en este rediseño:

- ~~Límite de peticiones~~: el global ahora se aplica solo a `/api` (2000 en desarrollo, 200 en producción).
- ~~Rediseñar las secciones 2 a 6 y pasarlas a componentes~~: hecho (§ 2.6–2.10).
- ~~Traducir los textos fijos~~: hecho en todo el sitio (§ 2.12).
- ~~Subir los commits y fusionar~~: PR #8 en `main`.

### Cómo conectar la pasarela de pago (cuando el dueño elija proveedor)
1. El backend crea el pedido y la transacción con la pasarela (el token del comercio nunca va al navegador).
2. Completar `frontend/src/services/pagoEnLinea.js` para redirigir o abrir el formulario de pago.
3. Confirmar el pago con el aviso (webhook) de la pasarela, no con la vuelta del navegador.
4. Activar `PAGO_EN_LINEA_ACTIVO` en `frontend/src/config/carrito.js`.

---

## 6. Cómo verificar

```bash
docker start ideancestral-db-1   # la base local vive en Docker (Docker Desktop abierto)
cd frontend && npx vitest run    # pruebas del frontend
cd frontend && npx vite build    # compilación
cd backend && npx vitest run     # pruebas del backend
npm run dev                      # desde la raíz: frontend 5173 + backend (3002 en local)
```
- Revisar cada cambio en escritorio (1440×900) y móvil (390×844 y 360px), en tema claro y oscuro, y en los 3 idiomas.
- **Capturas automáticas** con Chrome sin pantalla (protocolo CDP):
  - Para móvil, `Emulation.setDeviceMetricsOverride` con `mobile: true`, y `Emulation.setTouchEmulationEnabled` para simular pantalla táctil (`hover: none`).
  - Las transiciones, el scroll suave y el IntersectionObserver no avanzan solos: marcar `[data-animate]` con `.animate-in` antes de capturar.
  - Si se apagan las animaciones con CSS, algo que dependa de una animación para verse saldrá invisible en la captura aunque en el navegador se vea bien. Confirmar con las animaciones encendidas antes de darlo por error.
  - Correr un Chrome a la vez: varios en paralelo pierden la conexión.
