// Horario del local: horas en el formato de cada idioma y si está abierto ahora.

const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** «09:00» → «9:00» (es) o «9:00 AM» (en), según el idioma. */
export const formatoHora = (hhmm, locale = 'es') => {
  const [h, m] = hhmm.split(':').map(Number)
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(Date.UTC(2026, 0, 1, h, m))
}

/** Día de la semana (0 = domingo) y minutos del día en la zona horaria dada. */
export const ahoraEn = (zona, fecha = new Date()) => {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: zona, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(fecha)
      .map((p) => [p.type, p.value])
  )
  return { dia: DIAS[partes.weekday], minutos: Number(partes.hour) * 60 + Number(partes.minute) }
}

/** ¿El local está abierto en ese momento? */
export const estaAbierto = (horario, zona, fecha = new Date()) => {
  const { dia, minutos } = ahoraEn(zona, fecha)
  return horario.some((h) => h.dias.includes(dia) && minutos >= aMinutos(h.abre) && minutos < aMinutos(h.cierra))
}
