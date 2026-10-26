import { reactive } from 'vue'
import { HERO_FONDOS } from '../config/inicio'

// Estado que la sección de inicio comparte con la navbar:
//   montado    → el inicio está en la página
//   bajoHeader → el inicio sigue debajo de la navbar (la navbar va transparente)
//   paleta     → colores del fondo activo, para que la navbar cambie con la imagen
const { acento, texto, fondo } = HERO_FONDOS[0]

const estado = reactive({
  montado: false,
  bajoHeader: true,
  paleta: { acento, texto, fondo }
})

export function useEstadoInicio() {
  return estado
}
