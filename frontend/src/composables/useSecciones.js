import { useRoute, useRouter } from 'vue-router'

// Alto aproximado del header fijo, para que la sección no quede tapada
export const HEADER_OFFSET = 80

/** Hace scroll hasta una sección por id. Devuelve false si no existe. */
export function scrollASeccion(id, behavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return false
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: y, behavior })
  return true
}

/**
 * Navega a una sección de la portada (inicio, categorias, promociones, nosotros).
 * En la portada hace scroll directo; desde otra página navega a /#seccion
 * y el scrollBehavior del router hace el resto.
 */
export function useIrASeccion() {
  const route = useRoute()
  const router = useRouter()

  return (id) => {
    if (route.path === '/') {
      scrollASeccion(id)
    } else {
      router.push({ path: '/', hash: `#${id}` })
    }
  }
}
