import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCarritoStore } from './carrito';

describe('Carrito Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('carrito inicia vacío', () => {
    const store = useCarritoStore();
    expect(store.carrito).toEqual([]);
  });

  it('agregar producto al carrito', () => {
    const store = useCarritoStore();
    const producto = { id: 1, nombre: 'Test', precio: 10, imagen: '/test.jpg' };

    store.agregarAlCarrito(producto);

    expect(store.carrito).toHaveLength(1);
    expect(store.carrito[0].nombre).toBe('Test');
    expect(store.carrito[0].cantidad).toBe(1);
  });

  it('agregar mismo producto incrementa cantidad', () => {
    const store = useCarritoStore();
    const producto = { id: 1, nombre: 'Test', precio: 10, imagen: '/test.jpg' };

    store.agregarAlCarrito(producto);
    store.agregarAlCarrito(producto);

    expect(store.carrito).toHaveLength(1);
    expect(store.carrito[0].cantidad).toBe(2);
  });

  it('vaciar carrito', () => {
    const store = useCarritoStore();
    store.agregarAlCarrito({ id: 1, nombre: 'Test', precio: 10, imagen: '/test.jpg' });

    store.vaciarCarrito();

    expect(store.carrito).toEqual([]);
  });
});

describe('Carrito Store - stock', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('no agrega un producto agotado', () => {
    const store = useCarritoStore();
    const ok = store.agregarAlCarrito({ id: 1, nombre: 'Taza', precio: 10, stock: 0 });
    expect(ok).toBe(false);
    expect(store.carrito).toHaveLength(0);
  });

  it('no pasa del stock disponible al agregar', () => {
    const store = useCarritoStore();
    const producto = { id: 1, nombre: 'Taza', precio: 10, stock: 2 };
    store.agregarAlCarrito(producto);
    store.agregarAlCarrito(producto);
    expect(store.agregarAlCarrito(producto)).toBe(false);
    expect(store.carrito[0].cantidad).toBe(2);
  });

  it('no pasa del stock al cambiar la cantidad', () => {
    const store = useCarritoStore();
    store.agregarAlCarrito({ id: 1, nombre: 'Taza', precio: 10, stock: 3 });
    expect(store.actualizarCantidad(1, 4)).toBe(false);
    expect(store.carrito[0].cantidad).toBe(1);
    expect(store.actualizarCantidad(1, 3)).toBe(true);
    expect(store.carrito[0].cantidad).toBe(3);
  });

  it('sin stock definido no hay límite', () => {
    const store = useCarritoStore();
    store.agregarAlCarrito({ id: 1, nombre: 'Taza', precio: 10 });
    expect(store.actualizarCantidad(1, 50)).toBe(true);
  });
});
