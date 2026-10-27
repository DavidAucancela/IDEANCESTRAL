<template>
  <div :class="['carrito-overlay', { visible: carritoAbierto }]" aria-hidden="true" @click="cerrar"></div>
  <aside
    :class="['carrito-sidebar', { open: carritoAbierto }]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="carrito-titulo"
    :inert="carritoAbierto ? undefined : true"
  >
    <header class="carrito-header">
      <div>
        <p class="carrito-etiqueta">{{ t('cart.tuPedido') }}</p>
        <h3 id="carrito-titulo">
          {{ t('cart.titulo') }} <em>{{ t('cart.tituloAcento') }}</em>
          <span v-if="carritoCount > 0" class="carrito-count">{{ textoPiezas }}</span>
        </h3>
      </div>
      <button ref="botonCerrar" class="carrito-close" :aria-label="t('cart.cerrar')" @click="cerrar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </header>

    <!-- Pasos: revisar → entrega → pago -->
    <ol v-if="carrito.length" class="carrito-pasos">
      <li v-for="n in PASOS" :key="n">
        <button
          type="button"
          :class="{ activo: paso === n }"
          :aria-current="paso === n ? 'step' : undefined"
          @click="paso = n"
        >
          <span>{{ n }}</span><b class="carrito-paso-texto">{{ t(`cart.paso${n}`) }}</b>
        </button>
      </li>
    </ol>

    <!-- Vacío -->
    <div v-if="carrito.length === 0" class="carrito-empty">
      <span class="carrito-empty-icono">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
      </span>
      <p>{{ t('cart.vacio') }}</p>
      <span>{{ t('cart.vacioTexto') }}</span>
      <button class="carrito-btn carrito-btn--principal" @click="explorar">{{ t('cart.explorar') }}</button>
    </div>

    <template v-else>
      <!-- 1. Revisar piezas -->
      <ul v-if="paso === 1" class="carrito-items">
        <li v-for="item in carrito" :key="item.id" class="carrito-item">
          <router-link :to="`/producto/${item.id}`" class="carrito-item-link" tabindex="-1" @click="cerrar">
            <img :src="item.imagen" :alt="item.nombre" class="carrito-item-img" @error="imagenFallback" />
          </router-link>
          <div class="carrito-item-info">
            <h4>
              <router-link :to="`/producto/${item.id}`" @click="cerrar">{{ item.nombre }}</router-link>
            </h4>
            <span class="carrito-item-unidad">{{ t('cart.porUnidad', { p: `$${item.precio.toFixed(2)}` }) }}</span>
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
          <div class="carrito-item-lado">
            <strong>${{ (item.precio * item.cantidad).toFixed(2) }}</strong>
            <button class="carrito-item-remove" :aria-label="`${t('cart.quitar')}: ${item.nombre}`" @click="quitarDelCarrito(item.id)">
              {{ t('cart.quitar') }}
            </button>
          </div>
        </li>
      </ul>

      <!-- 2. Entrega -->
      <form v-else-if="paso === 2" class="carrito-formulario" @submit.prevent="paso = 3">
        <fieldset>
          <legend>{{ t('cart.entregaTitulo') }}</legend>
          <label v-for="op in ['retiro', 'envio']" :key="op" :class="['carrito-opcion', { elegida: entrega === op }]">
            <input v-model="entrega" type="radio" name="entrega" :value="op" />
            <span>
              <strong>{{ t(`cart.${op}`) }}</strong>
              <small>{{ t(`cart.${op}Desc`) }}</small>
            </span>
          </label>
        </fieldset>
        <label class="carrito-campo">
          <span>{{ t('cart.nombre') }}</span>
          <input v-model="nombre" type="text" autocomplete="name" maxlength="80" />
        </label>
        <label class="carrito-campo">
          <span>{{ t('cart.nota') }}</span>
          <textarea v-model="nota" rows="2" maxlength="300" :placeholder="t('cart.notaPlaceholder')"></textarea>
        </label>
      </form>

      <!-- 3. Pago -->
      <form v-else class="carrito-formulario" @submit.prevent="confirmar">
        <fieldset>
          <legend>{{ t('cart.pagoTitulo') }}</legend>
          <label v-for="op in METODOS_PAGO" :key="op" :class="['carrito-opcion', { elegida: pago === op }]">
            <input v-model="pago" type="radio" name="pago" :value="op" />
            <span>
              <strong>{{ t(`cart.${op}`) }}</strong>
              <small>{{ t(`cart.${op}Desc`) }}</small>
            </span>
            <span class="carrito-opcion-icono" aria-hidden="true">
              <svg v-if="op === 'pagoWhatsApp'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path :d="WHATSAPP_ICON_PATH"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>
            </span>
          </label>
        </fieldset>
        <p class="carrito-resumen-entrega">
          <span>{{ t('cart.paso2') }}</span>
          <strong>{{ t(`cart.${entrega}`) }}</strong>
          <span v-if="nombre.trim()">· {{ nombre.trim() }}</span>
          <button type="button" class="carrito-enlace" @click="paso = 2">{{ t('cart.cambiar') }}</button>
        </p>
      </form>

      <!-- Resumen -->
      <div class="carrito-footer">
        <div class="carrito-total">
          <span>{{ t('cart.total') }} <small>· {{ textoPiezas }}</small></span>
          <strong>${{ carritoTotal.toFixed(2) }}</strong>
        </div>
        <p v-if="!(paso === 3 && pago === 'pagoEnLinea')" class="carrito-nota">{{ t('cart.notaEnvio') }}</p>

        <button v-if="paso < 3" class="carrito-btn carrito-btn--principal" @click="paso++">
          {{ t('cart.continuar') }} →
        </button>
        <button v-else-if="pago === 'pagoEnLinea'" class="carrito-btn carrito-btn--principal" @click="confirmar">
          {{ t('cart.pagar', { p: `$${carritoTotal.toFixed(2)}` }) }}
        </button>
        <button v-else class="carrito-btn carrito-btn--whatsapp" @click="confirmar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="WHATSAPP_ICON_PATH"/></svg>
          {{ t('cart.enviarWhatsApp') }}
        </button>

        <button v-if="paso > 1" class="carrito-enlace" @click="paso--">← {{ t('cart.volver') }}</button>
        <button v-else class="carrito-enlace" @click="vaciarCarrito">{{ t('cart.vaciar') }}</button>
      </div>
    </template>
  </aside>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCarrito } from '../../composables/useCarrito'
import { useIrASeccion } from '../../composables/useSecciones'
import { useToast } from '../../composables/useToast'
import { useLanguageStore } from '../../stores/language'
import { PAGO_EN_LINEA_ACTIVO } from '../../config/carrito'
import { iniciarPagoEnLinea } from '../../services/pagoEnLinea'
import { WHATSAPP_ICON_PATH } from './whatsappIcon'

const PASOS = [1, 2, 3]
// Formas de pago que ve el cliente en el paso 3
const METODOS_PAGO = PAGO_EN_LINEA_ACTIVO ? ['pagoEnLinea', 'pagoWhatsApp'] : ['pagoWhatsApp']

const { t } = useLanguageStore()
const { error: toastError } = useToast()
const {
  carrito, carritoAbierto, carritoCount, carritoTotal,
  toggleCarrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito, enviarPedidoWhatsApp
} = useCarrito()
const irASeccion = useIrASeccion()

const botonCerrar = ref(null)

const textoPiezas = computed(() =>
  carritoCount.value === 1 ? t('cart.pieza') : t('cart.piezas', { n: carritoCount.value })
)

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

/* ===== Pedido en pasos ===== */
const paso = ref(1)
const entrega = ref('retiro')
const nombre = ref('')
const nota = ref('')
const pago = ref(METODOS_PAGO[0])

const confirmar = async () => {
  const detalles = { entrega: t(`cart.${entrega.value}`), nombre: nombre.value, nota: nota.value }
  if (pago.value === 'pagoEnLinea') {
    try {
      await iniciarPagoEnLinea({ items: carrito.value, total: carritoTotal.value, ...detalles })
    } catch {
      toastError(t('cart.pagoNoDisponible'))
    }
    return
  }
  enviarPedidoWhatsApp(detalles)
}

watch(() => carrito.value.length, (n) => { if (!n) paso.value = 1 })

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
/* ===== Fondo ===== */
.carrito-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s;
}

.carrito-overlay.visible {
  opacity: 1;
  visibility: visible;
}

/* ===== Panel lateral flotante ===== */
.carrito-sidebar {
  position: fixed;
  z-index: 1200;
  top: 12px;
  right: 12px;
  bottom: 12px;
  width: min(440px, calc(100vw - 24px));
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-light);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  visibility: hidden;
  transform: translateX(calc(100% + 24px));
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, visibility 0.35s;
}

.carrito-sidebar.open {
  visibility: visible;
  transform: none;
}

/* ===== Cabecera ===== */
.carrito-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--color-gray-light);
}

.carrito-etiqueta {
  margin-bottom: 2px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-secondary);
}

.carrito-header h3 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text);
}

.carrito-header h3 em {
  font-style: italic;
  font-weight: 500;
  color: var(--color-secondary);
}

.carrito-count {
  margin-left: var(--space-1);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
}

.carrito-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-gray-light);
  border-radius: 50%;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.carrito-close:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

/* ===== Pasos ===== */
.carrito-pasos {
  display: flex;
  gap: var(--space-5);
  padding: var(--space-3) var(--space-5) 0;
  list-style: none;
}

.carrito-pasos button {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  border: none;
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
}

.carrito-pasos button span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid currentColor;
  border-radius: 50%;
  letter-spacing: 0;
}

.carrito-paso-texto {
  font-weight: inherit;
}

.carrito-pasos button::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.5px;
  background: var(--color-secondary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.carrito-pasos button.activo {
  color: var(--color-text);
}

.carrito-pasos button.activo span {
  border-color: var(--color-secondary);
  background: var(--color-secondary);
  color: var(--color-surface);
}

.carrito-pasos button.activo::after {
  transform: scaleX(1);
}

/* ===== Vacío ===== */
.carrito-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-8) var(--space-6);
  text-align: center;
}

.carrito-empty-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  background: var(--color-bg-warm);
  color: var(--color-secondary);
}

.carrito-empty p {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 600;
}

.carrito-empty > span:not(.carrito-empty-icono) {
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* ===== Piezas ===== */
.carrito-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-2) var(--space-5);
  list-style: none;
}

.carrito-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-gray-light);
}

.carrito-item:last-child {
  border-bottom: none;
}

.carrito-item-link {
  flex-shrink: 0;
}

.carrito-item-img {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: var(--color-bg-warm);
}

.carrito-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.carrito-item-info h4 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1.3;
}

.carrito-item-info h4 a {
  color: inherit;
}

.carrito-item-info h4 a:hover {
  color: var(--color-primary);
}

.carrito-item-unidad {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.carrito-item-qty {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  margin-top: var(--space-2);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-full);
}

.carrito-item-qty button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--color-text);
  font-size: var(--text-base);
  cursor: pointer;
}

.carrito-item-qty button:hover:not(:disabled) {
  color: var(--color-secondary);
}

.carrito-item-qty button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carrito-item-qty span {
  min-width: 24px;
  text-align: center;
  font-size: var(--text-sm);
  font-weight: 600;
}

.carrito-item-lado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.carrito-item-lado strong {
  font-size: var(--text-base);
  color: var(--color-primary);
}

.carrito-item-remove {
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: var(--text-xs);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.carrito-item-remove:hover {
  color: var(--color-text);
}

/* ===== Formularios: entrega y pago ===== */
.carrito-formulario {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
}

.carrito-formulario fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border: none;
}

.carrito-formulario legend {
  margin-bottom: var(--space-2);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 600;
}

.carrito-opcion {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.carrito-opcion.elegida {
  border-color: var(--color-secondary);
  background: var(--color-bg-warm);
}

.carrito-opcion input {
  margin-top: 4px;
  accent-color: var(--color-secondary);
}

.carrito-opcion span {
  display: flex;
  flex-direction: column;
}

.carrito-opcion-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-left: auto;
  border-radius: 50%;
  background: var(--color-bg-warm);
  color: var(--color-secondary);
}

.carrito-opcion.elegida .carrito-opcion-icono {
  background: var(--color-surface);
}

.carrito-opcion small {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.carrito-resumen-entrega {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-warm);
  font-size: var(--text-sm);
}

.carrito-resumen-entrega > span:first-child {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.carrito-resumen-entrega .carrito-enlace {
  margin-left: auto;
  padding: 0;
  font-size: var(--text-xs);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.carrito-campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.carrito-campo input,
.carrito-campo textarea {
  padding: var(--space-3);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
  resize: vertical;
}

.carrito-campo input:focus,
.carrito-campo textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
}

/* ===== Resumen ===== */
.carrito-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5) var(--space-5);
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-surface);
}

.carrito-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.carrito-total small {
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-text-muted);
}

.carrito-total strong {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  letter-spacing: 0;
  color: var(--color-text);
}

.carrito-nota {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.carrito-btn {
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 50px;
  padding: 0 var(--space-5);
  border: none;
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.carrito-btn:hover {
  transform: translateY(-1px);
}

.carrito-btn--principal {
  background: var(--color-primary);
  color: var(--color-surface);
}

.carrito-btn--whatsapp {
  background: var(--color-whatsapp);
  color: #FFFFFF;
}

.carrito-btn--whatsapp:hover {
  background: var(--color-whatsapp-dark);
}

.carrito-enlace {
  align-self: center;
  padding: var(--space-1);
  border: none;
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
}

.carrito-enlace:hover {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Pantallas angostas: los pasos inactivos muestran solo el número */
@media (max-width: 420px) {
  .carrito-pasos {
    gap: var(--space-3);
  }

  .carrito-pasos button:not(.activo) .carrito-paso-texto {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carrito-sidebar,
  .carrito-overlay,
  .carrito-pasos button::after {
    transition: none;
  }
}
</style>
