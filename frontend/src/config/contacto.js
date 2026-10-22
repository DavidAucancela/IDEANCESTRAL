// Datos de contacto de la tienda: un solo lugar para cambiarlos.

export const WHATSAPP_NUMBER = '593987999136'

export const TELEFONOS = ['(02) 2227781', '+593 987 999 136', '+593 978 752 422']

export const EMAIL = 'mary_cecy_ma@hotmail.com'

export const INSTAGRAM_URL = 'https://www.instagram.com/ideancestral/'

/** Link de WhatsApp a la tienda con un mensaje prellenado. */
export const whatsappLink = (mensaje = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`
