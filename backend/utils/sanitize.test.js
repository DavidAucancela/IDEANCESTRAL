import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeObject } from './sanitize.js';

describe('sanitizeString', () => {
  it('elimina scripts maliciosos', () => {
    const input = '<script>alert("xss")</script>Hola';
    expect(sanitizeString(input)).not.toContain('<script>');
    expect(sanitizeString(input)).not.toContain('alert');
  });

  it('elimina tags HTML', () => {
    expect(sanitizeString('<b>negrita</b>')).not.toContain('<b>');
    expect(sanitizeString('<img src=x onerror=alert(1)>')).not.toContain('onerror');
  });

  it('permite texto normal', () => {
    expect(sanitizeString('Producto de madera')).toBe('Producto de madera');
    expect(sanitizeString('  espacios  ')).toBe('espacios');
  });

  it('maneja null y undefined', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
  });
});

describe('sanitizeObject', () => {
  it('sanitiza los campos especificados', () => {
    const obj = { nombre: '<script>x</script>', precio: 10 };
    const result = sanitizeObject(obj, ['nombre']);
    expect(result.nombre).not.toContain('<script>');
    expect(result.precio).toBe(10);
  });

  it('no modifica campos no especificados', () => {
    const obj = { a: 'texto', b: 123 };
    const result = sanitizeObject(obj, ['a']);
    expect(result.b).toBe(123);
  });
});
