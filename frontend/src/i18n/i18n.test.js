import { describe, it, expect } from 'vitest'
import es from './es'
import en from './en'
import pt from './pt'

// Todas las claves de un objeto de textos, como 'about.dias.lunesViernes'
const claves = (obj, prefijo = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? claves(v, `${prefijo}${k}.`) : [`${prefijo}${k}`]
  )

describe('textos en los 3 idiomas', () => {
  const base = claves(es).sort()

  it.each([['en', en], ['pt', pt]])('%s tiene los mismos textos que español', (_, idioma) => {
    const lista = claves(idioma).sort()
    expect(base.filter((k) => !lista.includes(k)), 'faltan').toEqual([])
    expect(lista.filter((k) => !base.includes(k)), 'sobran').toEqual([])
  })

  it('ningún texto está vacío', () => {
    for (const idioma of [es, en, pt]) {
      const vacios = claves(idioma).filter((k) => !k.split('.').reduce((o, p) => o[p], idioma).trim())
      expect(vacios).toEqual([])
    }
  })
})
