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
backend/
├── vitest.config.js
├── utils/sanitize.test.js    # Tests de sanitización XSS
└── package.json              # npm run test

frontend/
├── vitest.config.js
├── src/stores/carrito.test.js # Tests del store de carrito
└── package.json              # npm run test
```

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

1. Añadir tests para más rutas del backend (productos, categorías)
2. Tests de componentes clave (AdminView login, CatalogoView)
3. Configurar tests E2E con Playwright para flujo completo
