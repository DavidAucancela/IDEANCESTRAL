# Guía de Diseño — Ideancestral

> Fuente de verdad de marca y tokens visuales. Última actualización: 2026-08-01
> Estado: Fases 1–3 completadas y mergeadas a `main` (tokens + librería de componentes + migración de vistas)

## Referencia rápida

| Elemento | Valor |
|----------|-------|
| Color primario | `#7B3F00` (marrón artesanal) |
| Color secundario | `#C4853A` |
| Acento | `#D4A76A` |
| Tipografía de títulos | Playfair Display |
| Tipografía de cuerpo | Inter |
| Voz | Cálida, artesanal, cercana (mercado de La Mariscal, Quito) |

Todos los tokens viven en `frontend/src/style.css` (`:root` y `[data-theme="dark"]`). Este documento describe qué significa cada uno y por qué tiene ese valor — el CSS es la implementación, esto es el criterio.

---

## 1. Paleta de color

### Modo claro

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | `#7B3F00` | CTAs, enlaces, elementos de marca |
| `--color-primary-dark` | `#5C2E00` | Hover de elementos primarios |
| `--color-primary-light` | `#A0522D` | Variante clara de marca |
| `--color-secondary` | `#C4853A` | Acentos secundarios |
| `--color-accent` / `--color-accent-light` | `#D4A76A` / `#F5DEB3` | Detalles decorativos, badges |
| `--color-text` | `#1A1A1A` | Texto principal |
| `--color-text-light` | `#555555` | Texto secundario |
| `--color-text-muted` | `#6B6558` | Texto terciario / captions |
| `--color-bg` / `--color-bg-warm` | `#FAF8F5` / `#F5EDE4` | Fondos |
| `--color-surface` | `#FFFFFF` | Tarjetas, paneles |
| `--color-gray-light` | `#EDEAE6` | Divisores, bordes |

### Modo oscuro (`[data-theme="dark"]`)

Los mismos tokens se redefinen — primario y acento se invierten (el dorado pasa a ser el color dominante), fondos a tonos carbón cálidos (`#1A1612`, `#120F0B`). No hay tokens nuevos en modo oscuro salvo `--focus-ring`, que se recalibra al dorado para mantener contraste sobre fondo oscuro.

### Tokens de estado (nuevos — Fase 1)

| Token | Hex | Contraste con texto blanco | Uso |
|-------|-----|------------------------------|-----|
| `--color-success` | `#2E7D32` | 5.13:1 | Toasts y badges de éxito |
| `--color-error` | `#C0392B` | 5.44:1 | Toasts y badges de error |
| `--color-info` | `#7B3F00` | 7.76:1 | Toasts y badges informativos |
| `--color-whatsapp` | `#178741` | 4.59:1 | Botón "Pedir por WhatsApp" |
| `--color-whatsapp-dark` | `#14793A` | 5.49:1 | Hover del botón WhatsApp |

Estos tokens son **estables entre temas** (no cambian en modo oscuro): son colores sólidos de badge/botón, no fondos de página, así que su contraste con texto blanco no depende del tema activo.

### Otros tokens semánticos nuevos

| Token | Valor | Propósito |
|-------|-------|-----------|
| `--color-text-on-primary` | `var(--color-white)` | Texto sobre fondos de color primario |
| `--color-border` | `var(--color-gray-light)` | Bordes/divisores, sigue el tema automáticamente |
| `--focus-ring` | sombra de 3px en marrón (claro) / dorado (oscuro) | Anillo de foco de teclado |
| `--radius-full` | `9999px` | Pills, badges, avatares (para uso en Fase 2) |

### Accesibilidad — auditoría y correcciones (2026-07-28)

Se midió el contraste real (fórmula WCAG, no estimado) de los tokens existentes y se encontraron **4 fallos** que ya están corregidos:

| Elemento | Antes | Después | Estándar |
|----------|-------|---------|----------|
| `--color-text-muted` sobre `--color-bg` | 3.34:1 ❌ | 5.46:1 ✅ | AA texto normal (4.5:1) |
| `.btn-whatsapp` (texto blanco) | 1.98:1 ❌ | 4.59:1 ✅ | AA texto normal (4.5:1) |
| `.toast.success` (texto blanco) | 2.87:1 ❌ | 5.13:1 ✅ | AA texto normal (4.5:1) |
| `.toast.info` en modo oscuro (texto blanco) | 2.20:1 ❌ | 7.76:1 ✅ | AA texto normal (4.5:1) |

**Nota de trade-off:** el verde de WhatsApp se oscureció de `#25D366` (el verde de marca reconocible) a `#178741` para cumplir contraste AA con texto blanco. Es más oscuro que el verde oficial de WhatsApp — vale la pena revisar visualmente si el reconocimiento de marca del botón importa más que la ganancia de contraste en este caso puntual.

Además se agregó un anillo de foco visible (`:focus-visible`) global, ya que no existía ninguno — antes la navegación por teclado dependía del outline por defecto del navegador (inconsistente entre navegadores y no alineado a la marca).

---

## 2. Tipografía

| Token | Fuente | Uso |
|-------|--------|-----|
| `--font-serif` | Playfair Display | H1–H6 |
| `--font-sans` | Inter | Cuerpo, UI |

### Escala tipográfica (nueva — Fase 1)

| Token | Tamaño | Uso sugerido |
|-------|--------|--------------|
| `--text-xs` | 12px | Captions, metadata |
| `--text-sm` | 14px | Texto secundario, labels |
| `--text-base` | 16px | Cuerpo de texto |
| `--text-lg` | 18px | Texto destacado |
| `--text-xl` | 22px | H4 / subtítulos |
| `--text-2xl` | 28px | H3 |
| `--text-3xl` | 36px | H2 |
| `--text-4xl` | 48px | H1 / hero |

Esta escala se agregó como capa de tokens disponible; **no se migró retroactivamente** el CSS existente de las vistas grandes (`CatalogoView.vue`, `AdminView.vue`, `ProductoDetalleView.vue`, `CategoriaView.vue`), que hoy define tamaños de fuente ad-hoc en sus bloques `<style scoped>`. Esa migración es trabajo de Fase 3 (ver más abajo).

---

## 3. Espaciado

Escala nueva (Fase 1), en `:root`:

| Token | Valor |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

Igual que la escala tipográfica: disponible para uso en componentes nuevos y en la migración futura de las vistas grandes.

---

## 4. Bordes, sombra y radio

| Token | Valor |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius-md` | 12px |
| `--radius-lg` | 20px |
| `--radius-full` | 9999px (nuevo) |
| `--shadow-sm/md/lg/xl` | ver `style.css` | 

---

## 5. Componentes — estado actual

### Componentes de base (Fase 2, nuevos)

| Componente | Archivo | Descripción |
|------------|---------|------------|
| **BaseCard** | `frontend/src/components/BaseCard.vue` | Card genérica con slots para imagen, contenido y footer. Soporta `tag` prop para renderizar como `div`, `router-link`, `a` o custom. Hover elevation. |
| **BaseInput** | `frontend/src/components/BaseInput.vue` | Form field reutilizable. Soporta `input`, `textarea`, `select` vía prop `as`. Label con asterisco para `required`. Error y hint text. Manejo de `type="number"` con conversión de valor. |
| **BaseModal** | `frontend/src/components/BaseModal.vue` | Modal base generalizando `LightboxModal`. Header con título y botón de cierre (×). Footer con slot. Escape key dismissal y click-outside. Teleport a body. Restricción de scroll en body. |
| **BaseBadge** | `frontend/src/components/BaseBadge.vue` | Badge con 6 variantes: `primary`, `secondary`, `success`, `error`, `info`, `neutral`. Usa `--radius-full`. |
| **EmptyState** | `frontend/src/components/EmptyState.vue` | Empty state reutilizable con icon slot (search por defecto), title, description y action slot. |
| **SkeletonLoader** | `frontend/src/components/SkeletonLoader.vue` | Shimmer animation para loading states. Respeta `prefers-reduced-motion`. |
| **BasePagination** | `frontend/src/components/BasePagination.vue` | Componente de paginación con Previous/Next, números de página y ellipsis. Aria-current para accesibilidad. |

### Variantes de botones (Fase 2, nuevas)

En `style.css`, se agregaron:
- `.btn-sm`, `.btn-lg` — tamaños
- `.btn-icon` — icon-only circular
- `.btn:disabled` / `.btn.btn-disabled` — estado deshabilitado
- `.btn.btn-loading` — estado cargando con spinner

### Componentes existentes (refactor)

| Componente | Cambios |
|------------|---------|
| `ToastContainer.vue` | Ahora usa tokens de estado (`--color-success`, `--color-error`, `--color-info`) en vez de hex hardcodeado. |
| `LightboxModal.vue` | Sigue en uso para la galería de ProductoDetalleView; no se migró a `BaseModal` para no romper funcionamiento específico del lightbox. |

### Diagnóstico de antes de Fase 2

`style.css` global tenía ~230 líneas de CSS base, pero las 4 vistas principales sumaban más de 5,300 líneas de `<style scoped>`, en gran parte reimplementando patrones de card/badge/grid/modal por vista en vez de reutilizar componentes. Esa era la brecha entre "tengo tokens" y "tengo un sistema de diseño".

---

## 6. Roadmap — Estado de implementación

### Fase 1 — Tokens + accesibilidad ✅ COMPLETA
**Rama:** `design-system/fase-1-tokens-accesibilidad` → PR #2 → mergeado a `main` (2026-07-29)

- ✅ Capa semántica de tokens (espaciado `--space-1..8`, tipografía `--text-xs..4xl`, estado `--color-success/error/info/whatsapp`).
- ✅ 4 fallos de contraste AA corregidos (texto-muted, WhatsApp, toast.success, toast.info).
- ✅ Focus ring global (`:focus-visible`) con `--focus-ring` que respeta tema claro/oscuro.
- ✅ Esta guía como fuente de verdad.
- ✅ Documentación en `docs/GUIA_DE_DISENO.md`.

**Archivos en `main`:**
- `frontend/src/style.css` — línea 1 a 136: tokens primitivos, semánticos y dark mode overrides

---

### Fase 2 — Librería de componentes ✅ COMPLETA
**Rama:** `design-system/fase-2-3-componentes-migracion` → PR #3 → mergeado a `main` (2026-08-01)

**Componentes creados:**
- ✅ `BaseCard.vue` — Card genérica con slots, soporta `router-link`, hover lift
- ✅ `BaseInput.vue` — Form field con label/error/hint, tipo-aware (number conversion), `:focus-visible`
- ✅ `BaseModal.vue` — Modal base teleportado a body, Escape key, click-outside dismissal
- ✅ `BaseBadge.vue` — 6 variantes de badge, `--radius-full`
- ✅ `EmptyState.vue` — Empty state con icon/title/description/action slots
- ✅ `SkeletonLoader.vue` — Shimmer animation con `prefers-reduced-motion`
- ✅ `BasePagination.vue` — Pagination con Previous/Next/números, `aria-current`

**Variantes de botones:**
- ✅ `.btn-sm`, `.btn-lg` — tamaños
- ✅ `.btn-icon` — icon-only circular
- ✅ `.btn:disabled` / `.btn-disabled` — estado deshabilitado
- ✅ `.btn-loading` — estado cargando con spinner CSS

**Archivos en `main`:**
- `frontend/src/components/Base*.vue` — 7 nuevos componentes
- `frontend/src/style.css` — línea 144–248: botones, variantes y animaciones

---

### Fase 3 — Migración de vistas y verificación ✅ COMPLETA
**Rama:** `design-system/fase-2-3-componentes-migracion` → PR #3 → mergeado a `main` (2026-08-01)

**Migraciones a componentes:**
- ✅ **AdminView.vue** — 3 modales (Producto, Categoría, Promoción) → `BaseModal` + `BaseInput`
  - Reemplazado `.modal-overlay` + `.modal-content` + `.form-group` con `<BaseModal>` y `<BaseInput>`
  - Eliminadas ~50 líneas de CSS duplicado
  - Verificado en navegador: login real, PUT persistido ($36.50 guardado), select preseleccionado, checkboxes, `required` validation
  
- ✅ **CategoriaView.vue** — Grid de productos + empty state
  - Reemplazado `.producto-card` grid con `<BaseCard>` (en `<router-link>`)
  - Empty state → `<EmptyState>`
  - Verificado: 10 productos reales con datos de DB, badges "Destacado", hover overlay, navegación funcional
  
- ✅ **ProductoDetalleView.vue** — "También te puede interesar" grid
  - Reemplazado `.rel-card` + `.rel-image` + `.rel-info` con `<BaseCard>` (como `router-link`)
  - Limpieza de CSS duplicado (`.rel-info`, `.rel-image`, etc.)
  - Verificado: clic en card navega a otro producto, hover lift animation funciona

**Decisiones de arquitectura documentadas:**
- ❌ **CatalogoView.vue NO se migró** — su sección de destacados es diseño editorial hecho a mano (magazine + parallax), no patrón genérico de card. Forzarlo a `BaseCard` lo habría aplanado sin valor.

**Bugs corregidos en el camino:**
- ❌→✅ Double asterisk en labels requeridos (`BaseInput` agrega `*`, AdminView no debía agregarlo manualmente)
- ❌→✅ Redundancia de padding (`.rel-info` padding duplicado si se hubiera aplicado)

**Infraestructura de verificación:**
- Postgres 16 en Docker (puerto 5435), backend Node 20 (puerto 3002), frontend Vite (puerto 5175)
- Admin local: `admin` / `DevLocal2026!Temp` (`.env.local`, gitignorado)
- Todos los cambios probados en el navegador contra datos reales de DB (no mocks)

**Archivos en `main`:**
- `frontend/src/views/AdminView.vue` — ~367 líneas, estructura simplificada con `BaseModal`/`BaseInput`
- `frontend/src/views/CategoriaView.vue` — ~60 líneas más de template/script cleanups
- `frontend/src/views/ProductoDetalleView.vue` — ~33 líneas cleanups

---

## 7. Lo pendiente

### Corto plazo (improvement debt, no requisitos MVP)
1. **Migración tipográfica de vistas grandes** — Las vistas aún usan `font-size` ad-hoc en sus `<style scoped>`. Reemplazar por `--text-xs`, `--text-sm`, etc. (Ej: búsqueda de `font-size:` en cada vista, reemplazar con tokens correspondientes)
2. **Migración de espaciados** — Similarmente, reemplazar `margin`, `padding`, `gap` hardcodeado con `--space-*`
3. **Consistencia de CatalogoView** — Aunque no se migró su layout editorial, sus colores deberían referenciarse desde tokens (ej: `var(--color-whatsapp)` en vez de `#25D366`)
4. **Documentación de accesibilidad** — Crear `docs/ACCESIBILIDAD.md` con la auditoría completa, recomendaciones WCAG AA, y cómo verificar nuevos cambios

### Mediano plazo (nuevas características del sistema de diseño)
1. **Sistema de colores para temas personalizados** — Actualmente solo hay light/dark. Explorar si hay casos de uso para "sepia", "high-contrast", etc.
2. **Componentes faltantes** — Tabs, Dropdown/Select mejorado (el `<select>` nativo en `BaseInput` es funcional pero básico), Accordion, Tooltip
3. **Documentación interactiva** — Storybook o similar para mostrar todos los componentes y tokens en un solo lugar
4. **Testing de a11y** — Integrar `axe-core` o `vitest-axe` para auditorías automáticas en CI

### Largo plazo (sostenibilidad)
1. **Gobernanza de cambios** — Crear un proceso de PR review específico para cambios en tokens o componentes
2. **Versionado del sistema de diseño** — Separar versión de la librería de componentes (ej: `@ideancestral/ui@1.0.0`) si escala
3. **Monorepo** — Si la librería crece, considerar estructura monorepo para frontend + librería separada

---

---

## 8. Cómo trabajar con este sistema

### Agregar un token nuevo

1. Define la variable en `:root` de `frontend/src/style.css` (línea 9–71)
2. Si aplica, redefine el token en `[data-theme="dark"]` (línea 74–100)
3. Documenta el token en esta guía con su valor hex, uso, y si cambia entre temas
4. Referencia el token en componentes/vistas usando `var(--token-name)`, nunca hardcodees hex

### Crear un componente nuevo

1. Crea el archivo en `frontend/src/components/Base*.vue`
2. Usa tokens de `style.css` para colores, spacing, tipografía, bordes y sombras
3. Expón props para variación (ej: `variant`, `size`, `disabled`), no hardcodees
4. Prueba con tema claro y oscuro (`data-theme="dark"` en `<html>`)
5. Prueba con teclado — `:focus-visible` debe ser visible, Escape en modales, Enter en botones
6. Documenta en esta guía bajo sección "Componentes"

### Migrar una vista a componentes

1. Identifica patrones repetidos (cards, modales, form groups, badges)
2. Reemplaza con componentes de Fase 2 o crea uno nuevo si el patrón es único
3. Elimina CSS scoped duplicado una vez que los componentes lo manejan
4. **Prueba en el navegador** contra datos reales de la DB, no mocks
5. Verifica que no se rompió nada: busca errores en la consola, prueba interacción
6. Documenta cambios y decisiones en esta guía

### Auditar accesibilidad

```bash
# En la consola del navegador, copia/pega:
(async() => {
  const { default: axe } = await import('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js');
  const results = await axe.run();
  console.table(results.violations);
})();
```

O usa Chrome DevTools → Lighthouse → Accesibilidad.

---

*Documento vivo — actualizar junto con `frontend/src/style.css` cada vez que cambien los tokens. Última actualización: 2026-08-01 (Fases 1–3 completas).*
