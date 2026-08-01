# Estado del Sistema de Diseño — Ideancestral

**Resumen ejecutivo:** El sistema de diseño pasó de "tokens básicos" (Fase 1) a "librería de componentes + migraciones de vistas" (Fases 2-3). Todo está mergeado a `main` en dos PRs. Pendiente: deuda técnica de tipografía/espaciado en vistas grandes, y gobernanza de cambios.

---

## Logros completados (2026-07-26 a 2026-08-01)

### Fase 1: Tokens + Accesibilidad ✅
**Mergeado:** PR #2 (2026-07-29)

- ✅ Capa semántica de tokens en `:root` de `style.css`
  - Espaciado: `--space-1` (4px) a `--space-8` (64px)
  - Tipografía: `--text-xs` (12px) a `--text-4xl` (48px)
  - Estado: `--color-success`, `--color-error`, `--color-info`, `--color-whatsapp`
  - Focus: `--focus-ring` visible en claro y oscuro

- ✅ Auditoría de accesibilidad WCAG AA — 4 bugs corregidos
  - `--color-text-muted` (3.34:1 → 5.46:1) ❌→✅
  - `.btn-whatsapp` (1.98:1 → 4.59:1) ❌→✅
  - `.toast.success` (2.87:1 → 5.13:1) ❌→✅
  - `.toast.info` dark (2.20:1 → 7.76:1) ❌→✅

- ✅ Dark mode overrides completos (fondos, textos, focus ring)
- ✅ Documentación: `docs/GUIA_DE_DISENO.md` v1

**Archivos modificados:** 
- `frontend/src/style.css` (+55 líneas de tokens)
- `frontend/src/components/ToastContainer.vue` (refactor a tokens)
- Varias vistas (reemplazar hex hardcodeado con `var(--color-*)`)

---

### Fase 2: Librería de Componentes ✅
**Mergeado:** PR #3 (2026-08-01)

**7 componentes nuevos creados y verificados:**

| Componente | Propósito | Slots | Variantes |
|-----------|-----------|-------|-----------|
| `BaseCard` | Card genérica | `image`, default, `footer` | `router-link`, `div`, `a` vía prop `tag` |
| `BaseInput` | Form field | default (para `<option>`) | `input`, `textarea`, `select` vía `as` |
| `BaseModal` | Modal base | `header`, `footer` | Teleport, Escape key, click-outside |
| `BaseBadge` | Badge | — | 6 variantes: primary/secondary/success/error/info/neutral |
| `EmptyState` | Estado vacío | `icon`, `action` | — |
| `SkeletonLoader` | Loading shimmer | — | Respeta `prefers-reduced-motion` |
| `BasePagination` | Paginación | — | Aria-current, Previous/Next, ellipsis |

**Variantes de botones en `style.css`:**
- `.btn-sm`, `.btn-lg` (tamaños)
- `.btn-icon` (circular, icon-only)
- `.btn:disabled`, `.btn.btn-disabled` (deshabilitado)
- `.btn-loading` (spinner CSS)

**Verificación en navegador:**
- ✅ Temas claro y oscuro (todos los componentes respetan `[data-theme="dark"]`)
- ✅ Focus keyboard (`:focus-visible` visible)
- ✅ Responsive (flexbox, responsive padding)

**Archivos nuevos:**
- `frontend/src/components/BaseBadge.vue`
- `frontend/src/components/BaseCard.vue`
- `frontend/src/components/BaseInput.vue`
- `frontend/src/components/BaseModal.vue`
- `frontend/src/components/BasePagination.vue`
- `frontend/src/components/EmptyState.vue`
- `frontend/src/components/SkeletonLoader.vue`

---

### Fase 3: Migración de Vistas ✅
**Mergeado:** PR #3 (2026-08-01)

**3 vistas migradas a componentes:**

#### AdminView.vue
- 3 modales (Producto/Categoría/Promoción): `.modal-overlay` + `.modal-content` → `<BaseModal>`
- Form groups: `.form-group` → `<BaseInput>` (quitar asteriscos manuales)
- **Resultado:** -50 líneas CSS scoped, código más legible
- **Verificado:** Login real, PUT persistido ($36.50 guardado), selects preseleccionados, checkboxes funcionales

#### CategoriaView.vue
- Grid de productos: `.producto-card` → `<BaseCard>` en `<router-link>`
- Empty state: `.empty-state` → `<EmptyState>`
- **Resultado:** CSS scoped simplificado, estructura más clara
- **Verificado:** 10 productos reales con badges "Destacado", hover overlay, navegación funcional

#### ProductoDetalleView.vue
- "También te puede interesar" grid: `.rel-card` + `.rel-image` + `.rel-info` → `<BaseCard>` (como `router-link`)
- **Resultado:** Patrón de card consolidado
- **Verificado:** Clic en card navega, hover lift animation

**Decisión: CatalogoView.vue NO se migró**
- Su sección destacados usa diseño editorial (magazine + parallax) único, no patrón genérico
- Migrar a `BaseCard` lo habría aplanado sin valor
- Colores de WhatsApp referenciados con tokens como corresponde

**Bugs encontrados y corregidos:**
- ❌→✅ Double asterisk: `BaseInput` agrega `*`, AdminView NO debe agregarlo manualmente
- ❌→✅ CSS padding redundante en templates migrados

---

## Infraestructura de desarrollo usada para verificación

```bash
# Backend
Node.js 20 (vía /opt/homebrew/opt/node@20/bin/node)
Port 3002
Postgres 16 en Docker (port 5435)
Admin: admin / DevLocal2026!Temp

# Frontend
Vite dev server
Port 5175

# Base de datos
Schema + seed data (~15 productos, 7 categorías, 5 promociones)
Todos los cambios probados contra datos reales (no mocks)
```

---

## Deuda técnica — Lo que queda pendiente

### Corto plazo (1-2 días de trabajo)
1. **Tipografía en vistas grandes** — Reemplazar `font-size:` hardcodeado con `--text-*`
   - Buscar: grep "font-size:" frontend/src/views/*.vue
   - Acción: Reemplazar valores específicos (ej: "16px" → `var(--text-base)`)
   - Archivos: CatalogoView, AdminView, ProductoDetalleView, CategoriaView

2. **Espaciados en vistas grandes** — Reemplazar `margin`/`padding`/`gap` hardcodeado con `--space-*`
   - Proceso igual al anterior
   - Beneficio: escalabilidad, tema uniforme si se cambia la escala

3. **Accesibilidad doc** — Crear `docs/ACCESIBILIDAD.md`
   - Auditoría completa (WCAG AA, contrastes verificados)
   - Cómo testear nuevos componentes
   - Checklist de review

### Mediano plazo (1-2 semanas)
4. **Componentes faltantes**
   - Tabs (si se necesitan en las vistas)
   - Select mejorado (el nativo en `BaseInput` es funcional pero podría ser custom)
   - Tooltip, Accordion

5. **Documentación interactiva** — Storybook o similar
   - Galería de todos los tokens
   - Galería de componentes con props
   - Ejemplos de uso

### Largo plazo (después de MVP)
6. **Testing a11y** — Integrar `axe-core` en CI
7. **Gobernanza** — Checklist de review para cambios en tokens/componentes
8. **Versionado** — Si escala, considerar publicar librería separada

---

## Cómo contribuir

### Para agregar un token nuevo:
```
1. Edit `frontend/src/style.css` (`:root` section)
2. Add dark-mode override if needed (`[data-theme="dark"]`)
3. Document in `docs/GUIA_DE_DISENO.md`
4. Use en componentes: `var(--token-name)` nunca hex hardcodeado
```

### Para crear un componente nuevo:
```
1. Create `frontend/src/components/Base*.vue`
2. Use tokens para styling
3. Test en claro y oscuro
4. Test teclado (`:focus-visible`, Escape en modales)
5. Document en `docs/GUIA_DE_DISENO.md` sección "Componentes"
```

### Para migrar una vista:
```
1. Identifica patrones repetidos (cards, modals, etc.)
2. Reemplaza con componentes existentes
3. Prueba en navegador contra datos reales
4. Elimina CSS scoped duplicado
5. Document changes y decisiones
```

**Importante:** Siempre prueba en el navegador contra datos reales de la DB, no mocks o "lorem ipsum". El CSS puede compilar bien pero romper en runtime.

---

## Links útiles

- **Design Guide (fuente de verdad):** `docs/GUIA_DE_DISENO.md`
- **Accesibilidad:** `docs/ACCESIBILIDAD.md` (TODO — crear)
- **PR #2:** https://github.com/DavidAucancela/IDEANCESTRAL/pull/2 (Fase 1)
- **PR #3:** https://github.com/DavidAucancela/IDEANCESTRAL/pull/3 (Fases 2-3)
- **Branch principal:** `main` (ambas fases mergeadas)

---

**Actualizado:** 2026-08-01  
**Estado:** ✅ Fases 1–3 completadas, mergeadas, verificadas en navegador
