import { describe, it, expect } from 'vitest'
import { nombreMes, textoMeses, esVigente, ordenarPorTemporada } from './temporadas'

const promo = (nombre, mes_inicio, mes_fin, extra = {}) => ({ nombre, mes_inicio, mes_fin, ...extra })

describe('meses', () => {
  it('nombra los meses en cada idioma', () => {
    expect(nombreMes(12, 'es')).toBe('Diciembre')
    expect(nombreMes(12, 'en')).toBe('December')
    expect(nombreMes(2, 'pt')).toBe('Fevereiro')
  })

  it('arma el texto de la temporada', () => {
    expect(textoMeses(promo('Navidad', 12, 12))).toBe('Diciembre')
    expect(textoMeses(promo('Carnaval', 2, 3))).toBe('Febrero – Marzo')
    expect(textoMeses({ nombre: 'Vieja', temporada: 'Fin de año' })).toBe('Fin de año')
  })
})

describe('esVigente', () => {
  it('dentro del rango', () => {
    expect(esVigente(promo('Carnaval', 2, 3), 3)).toBe(true)
    expect(esVigente(promo('Carnaval', 2, 3), 4)).toBe(false)
  })

  it('cruzando el año (diciembre → enero)', () => {
    const fin = promo('Fin de año', 12, 1)
    expect(esVigente(fin, 12)).toBe(true)
    expect(esVigente(fin, 1)).toBe(true)
    expect(esVigente(fin, 2)).toBe(false)
  })
})

describe('ordenarPorTemporada', () => {
  const promos = [
    promo('San Valentín', 2, 2), promo('Madre', 5, 5), promo('Difuntos', 11, 11),
    promo('Quito', 12, 12, { orden: 7 }), promo('Navidad', 12, 12, { orden: 8 }), { nombre: 'Sin meses' }
  ]

  it('en octubre: Difuntos es la próxima y sigue el orden del año', () => {
    const r = ordenarPorTemporada(promos, 10)
    expect(r.map((p) => p.nombre)).toEqual(['Difuntos', 'Quito', 'Navidad', 'San Valentín', 'Madre', 'Sin meses'])
    expect(r.map((p) => p.estado)).toEqual(['proxima', 'despues', 'despues', 'despues', 'despues', 'despues'])
  })

  it('en diciembre: las dos de diciembre están vigentes, en su orden', () => {
    const r = ordenarPorTemporada(promos, 12)
    expect(r.slice(0, 2).map((p) => [p.nombre, p.estado])).toEqual([['Quito', 'vigente'], ['Navidad', 'vigente']])
    expect(r[2].estado).toBe('despues')
  })

  it('con una vigente, la del mes siguiente también se marca como próxima', () => {
    const r = ordenarPorTemporada(promos, 11)
    expect(r[0]).toMatchObject({ nombre: 'Difuntos', estado: 'vigente' })
    expect(r[1]).toMatchObject({ nombre: 'Quito', estado: 'proxima' })
  })
})
