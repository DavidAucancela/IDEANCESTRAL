import { describe, it, expect } from 'vitest';
import { productoSchema, productoUpdateSchema, sanitizarProducto } from './productoSchema.js';

describe('productoSchema (crear)', () => {
  it('acepta números como texto, como los envía el formulario', () => {
    const r = productoSchema.parse({ nombre: 'Taza', precio: '36.50', categoria_id: '2', stock: '4' });
    expect(r).toMatchObject({ precio: 36.5, categoria_id: 2, stock: 4 });
  });

  it('convierte campos vacíos en null', () => {
    const r = productoSchema.parse({ nombre: 'Taza', precio: 10, descripcion: '', categoria_id: '', stock: '' });
    expect(r).toMatchObject({ descripcion: null, categoria_id: null, stock: null });
  });

  it('rechaza precio negativo o cero', () => {
    expect(productoSchema.safeParse({ nombre: 'Taza', precio: -5 }).success).toBe(false);
    expect(productoSchema.safeParse({ nombre: 'Taza', precio: 0 }).success).toBe(false);
  });

  it('rechaza stock negativo o decimal', () => {
    expect(productoSchema.safeParse({ nombre: 'Taza', precio: 10, stock: -1 }).success).toBe(false);
    expect(productoSchema.safeParse({ nombre: 'Taza', precio: 10, stock: 1.5 }).success).toBe(false);
  });

  it('exige nombre', () => {
    expect(productoSchema.safeParse({ nombre: '   ', precio: 10 }).success).toBe(false);
  });
});

describe('productoUpdateSchema (editar)', () => {
  it('no incluye campos que no se enviaron', () => {
    const r = productoUpdateSchema.parse({ precio: '12' });
    expect(r).toEqual({ precio: 12 });
  });

  it('permite vaciar categoría y descripción', () => {
    const r = productoUpdateSchema.parse({ categoria_id: null, descripcion: '' });
    expect(r).toEqual({ categoria_id: null, descripcion: null });
  });

  it('sigue rechazando precio negativo', () => {
    expect(productoUpdateSchema.safeParse({ precio: '-3' }).success).toBe(false);
  });
});

describe('sanitizarProducto', () => {
  it('quita HTML y deja null si el texto queda vacío', () => {
    const r = sanitizarProducto({ nombre: '<b>Taza</b>', material: '<script>x</script>' });
    expect(r).toEqual({ nombre: 'Taza', material: null });
  });
});
