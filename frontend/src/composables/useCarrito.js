import { storeToRefs } from 'pinia'
import { useCarritoStore } from '../stores/carrito'

export function useCarrito() {
  const store = useCarritoStore()
  const { carrito, carritoAbierto, carritoCount, carritoTotal } = storeToRefs(store)
  return {
    carrito,
    carritoAbierto,
    carritoCount,
    carritoTotal,
    agregarAlCarrito: store.agregarAlCarrito,
    quitarDelCarrito: store.quitarDelCarrito,
    actualizarCantidad: store.actualizarCantidad,
    vaciarCarrito: store.vaciarCarrito,
    toggleCarrito: store.toggleCarrito,
    enviarPedidoWhatsApp: store.enviarPedidoWhatsApp
  }
}
