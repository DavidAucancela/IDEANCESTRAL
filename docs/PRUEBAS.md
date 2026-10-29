# Guía de Pruebas - Ideancestral

## Introducción al mundo de las pruebas

Las pruebas automatizadas verifican que tu código funciona correctamente. Hay varios tipos:

| Tipo | Qué prueba | Herramienta |
|------|------------|-------------|
| **Unitarias** | Funciones y módulos aislados | Vitest |
| **Componentes** | Componentes Vue aislados | Vitest + Vue Test Utils |
| **Integración** | Múltiples módulos juntos (ej. API + DB) | Vitest + supertest |
| **E2E** | Flujos completos en navegador | Playwright, Cypress |

## Estructura actual

```
backend/                                 # 30 pruebas
├── vitest.config.js
├── middleware/auth.test.js              # JWT y permisos
└── utils/
    ├── sanitize.test.js                 # Sanitización XSS
    ├── productoSchema.test.js           # Validación de productos (Zod)
    └── promocionSchema.test.js          # Validación de promociones: meses 1–12, ambos juntos

frontend/                                # 67 pruebas
├── vitest.config.js                     # jsdom
└── src/
    ├── App.test.js                      # La app completa montada: layout, hero, navbar, tema,
    │                                    # carrito, cada sección del inicio, páginas traducidas
    ├── stores/carrito.test.js           # Store del carrito
    ├── utils/temporadas.test.js         # Orden de promociones por cercanía al mes
    ├── utils/horario.test.js            # «Abierto ahora» con la hora de Quito
    └── i18n/i18n.test.js                # es, en y pt con las mismas claves y sin textos vacíos
```

### Cómo están armadas las pruebas de `App.test.js`
- `axios` está simulado (`vi.mock`) con productos, categorías y promociones de prueba. Las promociones se cambian por prueba con `globalThis.__promos`.
- Para probar algo que depende de la fecha (temporada vigente, abierto/cerrado) se fija la hora con `vi.useFakeTimers({ toFake: ['Date'] })` y `vi.setSystemTime(...)`; solo se simula `Date` para que los `setTimeout` sigan funcionando.
- Para probar otro idioma: `localStorage.setItem('ideancestral_lang', 'en')` antes de montar.

## Ejecutar pruebas

### Backend
```bash
cd backend
npm install   # si no has instalado vitest
npm run test
```

### Frontend
```bash
cd frontend
npm install   # instala vitest, @vue/test-utils, jsdom
npm run test
```

### Modo watch (re-ejecuta al guardar)
```bash
npm run test:watch
```

## Escribir tu primer test

### 1. Test unitario simple (backend)

Crea `backend/utils/miModulo.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { miFuncion } from './miModulo.js';

describe('miFuncion', () => {
  it('retorna el resultado esperado', () => {
    expect(miFuncion(2, 3)).toBe(5);
  });
});
```

### 2. Test de componente Vue (frontend)

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MiComponente from './MiComponente.vue';

describe('MiComponente', () => {
  it('muestra el título', () => {
    const wrapper = mount(MiComponente, {
      props: { titulo: 'Hola' }
    });
    expect(wrapper.text()).toContain('Hola');
  });
});
```

### 3. Test de store Pinia

```javascript
import { setActivePinia, createPinia } from 'pinia';
import { useMiStore } from './miStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

it('actualiza estado correctamente', () => {
  const store = useMiStore();
  store.incrementar();
  expect(store.contador).toBe(1);
});
```

## Buenas prácticas

1. **Un concepto por test**: Cada `it()` debe verificar una sola cosa
2. **Nombres descriptivos**: `it('debe rechazar contraseñas menores a 8 caracteres')`
3. **Arrange-Act-Assert**: Organiza el test en 3 partes
4. **Independencia**: Los tests no deben depender del orden de ejecución

## Próximos pasos recomendados

1. Pruebas de las rutas del backend contra una base de prueba (supertest): productos, categorías, promociones.
2. Pruebas de extremo a extremo con Playwright: buscar → agregar al carrito → pedir por WhatsApp; panel admin.
3. Correr las pruebas en GitHub Actions en cada PR (ver `docs/PENDIENTES.md`).
