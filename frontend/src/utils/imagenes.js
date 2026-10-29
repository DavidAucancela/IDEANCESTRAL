// URLs de imágenes de productos y categorías.
// Las rutas del API (/uploads/..., /imagenes/...) se sirven desde el backend.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const BASE = API_URL.replace(/\/api$/, '')

export const IMAGEN_PLACEHOLDER = '/imagenes/logo-principal.jpg'

/** URL absoluta (o del mismo origen) para una ruta que devuelve el API. */
export const urlImagen = (url) => {
  if (!url) return IMAGEN_PLACEHOLDER
  return url.startsWith('http') ? url : `${BASE}${url}`
}

/** Imagen principal de un producto del API (o la primera, o el placeholder). */
export const imagenPrincipal = (producto) => {
  const imagenes = producto?.imagenes || []
  const img = imagenes.find((i) => i.es_principal) || imagenes[0]
  return urlImagen(img?.url)
}
