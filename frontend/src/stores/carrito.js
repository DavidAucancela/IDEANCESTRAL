import { defineStore } from 'pinia'
import { useLanguageStore } from './language'
import { ref, computed, watch } from 'vue'
import { whatsappLink } from '../config/contacto'

const STORAGE_KEY = 'ideancestral_carrito'

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref(loadFromStorage())
  const abierto = ref(false)

  const carritoCount = computed(() => 
    items.value.reduce((total, item) => total + item.cantidad, 0)
  )

  const carritoTotal = computed(() => 
    items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  )

  // stock null/undefined = sin control de stock
  const hayStockPara = (stock, cantidad) => stock == null || cantidad <= stock

  /**
   * Agrega una unidad. Devuelve false si el producto está agotado
   * o ya no quedan más unidades para agregar.
   */
  const agregarAlCarrito = (producto) => {
    const stock = producto.stock ?? null
    const existente = items.value.find(item => item.id === producto.id)
    const cantidadNueva = (existente?.cantidad ?? 0) + 1
    if (!hayStockPara(stock, cantidadNueva)) return false

    if (existente) {
      existente.cantidad = cantidadNueva
      existente.stock = stock
    } else {
      items.value.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen || '/imagenes/logo-principal.jpg',
        cantidad: 1,
        stock
      })
    }
    abierto.value = true
    window.dispatchEvent(new CustomEvent('cart-item-added'))
    return true
  }

  const quitarDelCarrito = (productoId) => {
    items.value = items.value.filter(item => item.id !== productoId)
  }

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) {
      quitarDelCarrito(productoId)
      return true
    }
    const item = items.value.find(i => i.id === productoId)
    if (!item) return false
    if (!hayStockPara(item.stock, cantidad)) return false
    item.cantidad = cantidad
    return true
  }

  const vaciarCarrito = () => {
    items.value = []
  }

  const toggleCarrito = () => {
    abierto.value = !abierto.value
  }

  /**
   * Abre WhatsApp con el pedido. `detalles` es opcional:
   * { nombre, entrega, nota } (textos ya traducidos) se agregan al final.
   */
  const enviarPedidoWhatsApp = (detalles = {}) => {
    const { t } = useLanguageStore()
    let mensaje = t('whatsapp.pedido') + '\n\n'
    items.value.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`
    })
    mensaje += `\n${t('whatsapp.total')} $${carritoTotal.value.toFixed(2)}`
    const { nombre, entrega, nota } = detalles
    if (entrega) mensaje += `\n${t('whatsapp.entrega')} ${entrega}`
    if (nombre?.trim()) mensaje += `\n${t('whatsapp.nombre')} ${nombre.trim()}`
    if (nota?.trim()) mensaje += `\n${t('whatsapp.nota')} ${nota.trim()}`
    window.open(whatsappLink(mensaje), '_blank')
  }

  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  return {
    carrito: items,
    carritoAbierto: abierto,
    carritoCount,
    carritoTotal,
    agregarAlCarrito,
    quitarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    toggleCarrito,
    enviarPedidoWhatsApp
  }
})
