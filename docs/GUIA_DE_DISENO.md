# Guía de Diseño — Ideancestral

> Fuente de verdad de marca y tokens visuales. Última actualización: 2026-07-28
> Estado: Fase 1 completa (tokens semánticos + accesibilidad)

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

## 5. Componentes actuales

| Componente | Archivo | Notas |
|------------|---------|-------|
| Botones | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp` (en `style.css`) | Sin variantes de tamaño ni estado `disabled`/`loading` todavía |
| Toast | `ToastContainer.vue` | Ahora usa tokens de estado en vez de hex hardcodeado |
| Lightbox | `LightboxModal.vue` | Único modal existente; no generalizado como modal base |
| Theme/Language toggles | `ThemeToggle.vue`, `LanguageSwitcher.vue` | — |

**Diagnóstico:** `style.css` global tiene ~230 líneas, pero las 4 vistas principales suman más de 5,300 líneas de `<style scoped>`, en gran parte reimplementando patrones de card/badge/grid/modal por vista en vez de reutilizar componentes. Esa es la brecha entre "tengo tokens" y "tengo un sistema de diseño".

---

## 6. Roadmap

### Fase 1 — Tokens + accesibilidad ✅ (este documento)
- Capa semántica de tokens (espaciado, tipografía, estado, foco).
- 4 fallos de contraste AA corregidos.
- Esta guía como fuente de verdad.

### Fase 2 — Librería de componentes (pendiente)
- Extraer patrones repetidos a componentes Vue: `Card`, `Badge`, `Input`/`FormField`, `Modal` base (generalizar `LightboxModal`), `Skeleton`, `EmptyState`, `Pagination`, `Tabs`.
- Expandir sistema de botones: tamaños (`sm`/`md`/`lg`), estados `disabled`/`loading`, variante icon-only.

### Fase 3 — Migración y gobernanza (pendiente)
- Reemplazar el CSS scoped duplicado de `CatalogoView.vue`, `AdminView.vue`, `ProductoDetalleView.vue` y `CategoriaView.vue` por los componentes de Fase 2.
- Migrar tamaños de fuente y espaciados ad-hoc a `--text-*` / `--space-*`.
- Aplicar el checklist de consistencia de marca por vista.

---

*Documento vivo — actualizar junto con `frontend/src/style.css` cada vez que cambien los tokens.*
