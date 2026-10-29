import { describe, it, expect } from 'vitest'
import { formatoHora, ahoraEn, estaAbierto } from './horario'
import { HORARIO, ZONA_HORARIA } from '../config/contacto'

// Quito es UTC−5 todo el año (sin horario de verano)
const enQuito = (iso) => new Date(`${iso}-05:00`)

describe('horario', () => {
  it('muestra la hora en el formato de cada idioma', () => {
    expect(formatoHora('09:00', 'es')).toBe('9:00')
    expect(formatoHora('18:00', 'en')).toMatch(/^6:00\s?PM$/)
  })

  it('calcula día y hora de Quito aunque el navegador esté en otra zona', () => {
    // 2026-10-28 03:00 UTC = martes 27, 22:00 en Quito
    expect(ahoraEn(ZONA_HORARIA, new Date('2026-10-28T03:00:00Z'))).toEqual({ dia: 2, minutos: 22 * 60 })
  })

  it('entre semana abre de 9:00 a 18:00', () => {
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-10-28T08:59'))).toBe(false)
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-10-28T09:00'))).toBe(true)
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-10-28T17:59'))).toBe(true)
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-10-28T18:00'))).toBe(false)
  })

  it('sábados y domingos abre de 10:00 a 17:00', () => {
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-10-31T09:30'))).toBe(false) // sábado
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-11-01T16:30'))).toBe(true) // domingo
    expect(estaAbierto(HORARIO, ZONA_HORARIA, enQuito('2026-11-01T17:00'))).toBe(false)
  })
})
