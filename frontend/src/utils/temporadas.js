// Meses y temporadas de las promociones.
// Cada promoción va de mes_inicio a mes_fin (1–12) y se repite cada año;
// si mes_fin < mes_inicio, cruza el año (ej. diciembre → enero).

/** Nombre del mes (1–12) en el idioma dado, con mayúscula inicial: «Diciembre», «December». */
export const nombreMes = (mes, locale = 'es') => {
  const texto = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(Date.UTC(2026, mes - 1, 1))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Los 12 meses como opciones { valor, nombre } para un <select>. */
export const listaMeses = (locale = 'es') =>
  Array.from({ length: 12 }, (_, i) => ({ valor: i + 1, nombre: nombreMes(i + 1, locale) }))

/** «Diciembre» o «Febrero – Marzo» según los meses de la promoción; si no tiene, su texto de temporada. */
export const textoMeses = (promo, locale = 'es') => {
  if (!promo.mes_inicio || !promo.mes_fin) return promo.temporada || ''
  if (promo.mes_inicio === promo.mes_fin) return nombreMes(promo.mes_inicio, locale)
  return `${nombreMes(promo.mes_inicio, locale)} – ${nombreMes(promo.mes_fin, locale)}`
}

/** ¿El mes actual cae dentro de la temporada? */
export const esVigente = (promo, mesActual) => {
  const { mes_inicio: inicio, mes_fin: fin } = promo
  if (!inicio || !fin) return false
  return inicio <= fin ? mesActual >= inicio && mesActual <= fin : mesActual >= inicio || mesActual <= fin
}

/** Meses que faltan para que empiece (0 si está vigente; 99 si no tiene meses). */
export const mesesParaEmpezar = (promo, mesActual) => {
  if (!promo.mes_inicio || !promo.mes_fin) return 99
  if (esVigente(promo, mesActual)) return 0
  return (promo.mes_inicio - mesActual + 12) % 12
}

/**
 * Ordena las promociones por cercanía: primero las vigentes, luego las próximas.
 * Marca cada una con estado 'vigente', 'proxima' (la siguiente en llegar, solo
 * si no hay vigentes o empieza el mes que viene) o 'despues'.
 */
export const ordenarPorTemporada = (promos, mesActual = new Date().getMonth() + 1) => {
  const ordenadas = promos
    .map((p, i) => ({ ...p, faltan: mesesParaEmpezar(p, mesActual), _i: i }))
    .sort((a, b) => a.faltan - b.faltan || (a.orden ?? 0) - (b.orden ?? 0) || a._i - b._i)

  const hayVigentes = ordenadas.some((p) => p.faltan === 0)
  const primeraFutura = ordenadas.find((p) => p.faltan > 0 && p.faltan < 99)?.faltan

  return ordenadas.map(({ _i, ...p }) => {
    let estado = 'despues'
    if (p.faltan === 0) estado = 'vigente'
    else if (p.faltan === primeraFutura && (!hayVigentes || p.faltan === 1)) estado = 'proxima'
    return { ...p, estado }
  })
}
