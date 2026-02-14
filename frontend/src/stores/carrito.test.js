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
