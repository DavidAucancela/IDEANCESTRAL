import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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

  const agregarAlCarrito = (producto) => {
    const existente = items.value.find(item => item.id === producto.id)
    if (existente) {
      existente.cantidad++
    } else {
      items.value.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen || '/imagenes/logo-principal.jpg',
        cantidad: 1
      })
    }
    abierto.value = true
  }

  const quitarDelCarrito = (productoId) => {
    items.value = items.value.filter(item => item.id !== productoId)
  }

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) {
      quitarDelCarrito(productoId)
    } else {
      const item = items.value.find(i => i.id === productoId)
      if (item) item.cantidad = cantidad
    }
  }

  const vaciarCarrito = () => {
    items.value = []
  }

  const toggleCarrito = () => {
    abierto.value = !abierto.value
  }

  const WHATSAPP_NUMBER = '593998956361'
  const enviarPedidoWhatsApp = () => {
    let mensaje = 'Hola, me gustaría hacer el siguiente pedido:\n\n'
    items.value.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`
    })
    mensaje += `\nTotal: $${carritoTotal.value.toFixed(2)}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
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
