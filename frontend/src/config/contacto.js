// Datos de contacto de la tienda: un solo lugar para cambiarlos.

export const WHATSAPP_NUMBER = '593987999136'

export const TELEFONOS = ['(02) 2227781', '+593 987 999 136', '+593 978 752 422']

export const EMAIL = 'mary_cecy_ma@hotmail.com'

export const INSTAGRAM_URL = 'https://www.instagram.com/ideancestral/'

export const INSTAGRAM_USUARIO = '@ideancestral'

/** Dirección del local (la sección Nosotros y el mapa). */
export const DIRECCION = {
  lugar: 'Mercado Artesanal La Mariscal',
  calle: 'Jorge Washington y Juan León Mera',
  ciudad: 'Quito, Ecuador'
}

const BUSQUEDA_MAPA = encodeURIComponent('Mercado Artesanal La Mariscal, Jorge Washington y Juan Leon Mera, Quito, Ecuador')

/** Mapa incrustado (Google Maps sin clave de API). */
export const MAPA_EMBED_URL = `https://maps.google.com/maps?q=${BUSQUEDA_MAPA}&z=16&ie=UTF8&iwloc=&output=embed`

/** Abre Google Maps con la ruta hasta el local. */
export const COMO_LLEGAR_URL = `https://www.google.com/maps/dir/?api=1&destination=${BUSQUEDA_MAPA}`

/** Zona horaria del local: el «abierto ahora» se calcula con la hora de Quito. */
export const ZONA_HORARIA = 'America/Guayaquil'

/**
 * Horario de atención del local.
 * `clave` es el texto i18n (`about.dias.*`); `dias` son los días de la semana
 * (0 = domingo … 6 = sábado); las horas van en formato 24 h.
 */
export const HORARIO = [
  { clave: 'lunesViernes', dias: [1, 2, 3, 4, 5], abre: '09:00', cierra: '18:00' },
  { clave: 'sabadoDomingo', dias: [6, 0], abre: '10:00', cierra: '17:00' }
]

/** Link de WhatsApp a la tienda con un mensaje prellenado. */
export const whatsappLink = (mensaje = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`
