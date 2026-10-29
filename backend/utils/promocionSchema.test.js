import { describe, it, expect } from 'vitest';
import { promocionSchema, promocionUpdateSchema, sanitizarPromocion } from './promocionSchema.js';

describe('promocionSchema (crear)', () => {
  it('acepta meses y categoría como texto, como los envía el formulario', () => {
    const r = promocionSchema.parse({ nombre: 'Navidad', temporada: 'Diciembre', mes_inicio: '12', mes_fin: '1', categoria_id: '2' });
    expect(r).toMatchObject({ mes_inicio: 12, mes_fin: 1, categoria_id: 2 });
  });

  it('convierte campos vacíos en null', () => {
    const r = promocionSchema.parse({ nombre: 'Navidad', temporada: 'Diciembre', mes_inicio: '', mes_fin: '', categoria_id: '' });
    expect(r).toMatchObject({ mes_inicio: null, mes_fin: null, categoria_id: null });
  });

  it('rechaza meses fuera de 1–12', () => {
    expect(promocionSchema.safeParse({ nombre: 'X', temporada: 'Y', mes_inicio: 0, mes_fin: 5 }).success).toBe(false);
    expect(promocionSchema.safeParse({ nombre: 'X', temporada: 'Y', mes_inicio: 3, mes_fin: 13 }).success).toBe(false);
  });

  it('exige los dos meses juntos', () => {
    expect(promocionSchema.safeParse({ nombre: 'X', temporada: 'Y', mes_inicio: 3 }).success).toBe(false);
    expect(promocionSchema.safeParse({ nombre: 'X', temporada: 'Y' }).success).toBe(true);
  });

  it('exige nombre y temporada', () => {
    expect(promocionSchema.safeParse({ nombre: ' ', temporada: 'Mayo' }).success).toBe(false);
    expect(promocionSchema.safeParse({ nombre: 'Madre', temporada: '' }).success).toBe(false);
  });
});

describe('promocionUpdateSchema (editar)', () => {
  it('permite cambiar solo un campo', () => {
    expect(promocionUpdateSchema.parse({ activa: false })).toEqual({ activa: false });
  });

  it('permite quitar la categoría', () => {
    expect(promocionUpdateSchema.parse({ categoria_id: '' })).toEqual({ categoria_id: null });
  });

  it('si cambia un mes, pide el otro', () => {
    expect(promocionUpdateSchema.safeParse({ mes_inicio: 4 }).success).toBe(false);
    expect(promocionUpdateSchema.safeParse({ mes_inicio: 4, mes_fin: 5 }).success).toBe(true);
  });
});

describe('sanitizarPromocion', () => {
  it('limpia HTML de los textos', () => {
    const r = sanitizarPromocion({ nombre: '<b>Navidad</b><script>x</script>', temporada: 'Diciembre' });
    expect(r.nombre).not.toContain('<script>');
  });
});
