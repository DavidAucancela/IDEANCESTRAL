<template>
  <div class="carrito-overlay" :class="{ visible: carritoAbierto }" @click="cerrar"></div>
  <aside
    class="carrito-sidebar"
    :class="{ open: carritoAbierto }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="carrito-titulo"
    :inert="carritoAbierto ? undefined : true"
  >
    <div class="carrito-header">
      <h3 id="carrito-titulo">
        {{ t('cart.miCarrito') }}
        <span v-if="carritoCount > 0" class="carrito-count">({{ carritoCount }})</span>
      </h3>
      <button ref="botonCerrar" class="carrito-close" :aria-label="t('cart.cerrar')" @click="cerrar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div v-if="carrito.length === 0" class="carrito-empty">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
      <p>{{ t('cart.vacio') }}</p>
      <span>{{ t('cart.agrega') }}</span>
      <button class="btn btn-primary" @click="explorar">{{ t('cart.explorar') }}</button>
    </div>

    <div v-else class="carrito-body">
      <ul class="carrito-items">
        <li v-for="item in carrito" :key="item.id" class="carrito-item">
          <router-link :to="`/producto/${item.id}`" class="carrito-item-link" @click="cerrar">
            <img :src="item.imagen" :alt="item.nombre" class="carrito-item-img" @error="imagenFallback" />
          </router-link>
          <div class="carrito-item-info">
            <h4>
              <router-link :to="`/producto/${item.id}`" @click="cerrar">{{ item.nombre }}</router-link>
            </h4>
            <span class="carrito-item-precio">${{ item.precio.toFixed(2) }}</span>
            <div class="carrito-item-qty">
              <button :aria-label="t('cart.disminuir')" @click="actualizarCantidad(item.id, item.cantidad - 1)">−</button>
              <span aria-live="polite">{{ item.cantidad }}</span>
              <button
                :aria-label="t('cart.aumentar')"
                :disabled="sinMasStock(item)"
                :title="sinMasStock(item) ? t('cart.sinMasStock') : undefined"
                @click="actualizarCantidad(item.id, item.cantidad + 1)"
              >+</button>
            </div>
          </div>
          <button class="carrito-item-remove" :aria-label="`${t('cart.quitar')}: ${item.nombre}`" @click="quitarDelCarrito(item.id)">×</button>
        </li>
      </ul>
      <div class="carrito-footer">
        <div class="carrito-total">
          <span>{{ t('cart.total') }}</span>
          <strong>${{ carritoTotal.toFixed(2) }}</strong>
        </div>
        <button class="btn btn-whatsapp carrito-btn-pedido" @click="enviarPedidoWhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="WHATSAPP_ICON_PATH"/></svg>
          {{ t('cart.enviarWhatsApp') }}
        </button>
        <button class="btn btn-secondary carrito-btn-vaciar" @click="vaciarCarrito">{{ t('cart.vaciar') }}</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCarrito } from '../../composables/useCarrito'
import { useIrASeccion } from '../../composables/useSecciones'
import { useLanguageStore } from '../../stores/language'
import { WHATSAPP_ICON_PATH } from './whatsappIcon'

const { t } = useLanguageStore()
const {
  carrito, carritoAbierto, carritoCount, carritoTotal,
  toggleCarrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito, enviarPedidoWhatsApp
} = useCarrito()
const irASeccion = useIrASeccion()

const botonCerrar = ref(null)

const cerrar = () => {
  if (carritoAbierto.value) toggleCarrito()
}

const explorar = () => {
  cerrar()
  irASeccion('categorias')
}

const sinMasStock = (item) => item.stock != null && item.cantidad >= item.stock

const imagenFallback = (e) => {
  e.target.src = '/imagenes/logo-principal.jpg'
}

// Bloquea el scroll de la página y enfoca el botón cerrar al abrir
watch(carritoAbierto, async (abierto) => {
  document.body.style.overflow = abierto ? 'hidden' : ''
  if (abierto) {
    await nextTick()
    botonCerrar.value?.focus()
  }
})

const onKeydown = (e) => {
  if (e.key === 'Escape') cerrar()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.carrito-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.carrito-overlay.visible { opacity: 1; visibility: visible; }

.carrito-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  height: 100dvh;
  background: var(--color-surface);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 30px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  visibility: hidden;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.35s;
}
.carrito-sidebar.open { transform: translateX(0); visibility: visible; }

.carrito-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-header h3 { font-size: var(--text-lg); color: var(--color-text); margin: 0; }
.carrito-count { font-weight: 400; color: var(--color-text-muted); font-size: var(--text-sm); }

.carrito-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: var(--transition);
}
.carrito-close:hover { background: var(--color-bg); color: var(--color-text); }

.carrito-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6);
  color: var(--color-text-muted);
  text-align: center;
}
.carrito-empty svg { opacity: 0.4; }
.carrito-empty p { font-size: var(--text-lg); font-weight: 600; color: var(--color-text-light); margin: 0; }
.carrito-empty span { font-size: var(--text-sm); margin-bottom: var(--space-2); }

.carrito-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.carrito-items { flex: 1; overflow-y: auto; padding: var(--space-4) var(--space-6); list-style: none; margin: 0; }

.carrito-item {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-item:last-child { border-bottom: none; }
.carrito-item-link { flex-shrink: 0; }
.carrito-item-img {
  display: block;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.carrito-item-info { flex: 1; min-width: 0; }
.carrito-item-info h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  margin: 0 0 var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.carrito-item-info h4 a { color: var(--color-text); }
.carrito-item-info h4 a:hover { color: var(--color-primary); }
.carrito-item-precio { font-size: var(--text-sm); color: var(--color-primary); font-weight: 600; }

.carrito-item-qty {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
.carrito-item-qty button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-surface);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  transition: var(--transition);
}
.carrito-item-qty button:hover { border-color: var(--color-primary); color: var(--color-primary); }
.carrito-item-qty button:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
.carrito-item-qty span { font-weight: 600; font-size: var(--text-sm); min-width: 20px; text-align: center; }

.carrito-item-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  transition: var(--transition);
  font-size: 1.2rem;
}
.carrito-item-remove:hover { background: var(--color-bg-warm); color: var(--color-error); }

.carrito-footer {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}
.carrito-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  font-size: var(--text-lg);
}
.carrito-total span { color: var(--color-text-light); }
.carrito-total strong { font-size: var(--text-2xl); color: var(--color-primary); }
.carrito-btn-pedido {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.85rem;
  font-size: var(--text-base);
}
.carrito-btn-vaciar { width: 100%; margin-top: var(--space-2); padding: 0.6rem; font-size: var(--text-sm); }

@media (max-width: 768px) {
  .carrito-sidebar { width: 100%; max-width: 100vw; }
}
</style>
