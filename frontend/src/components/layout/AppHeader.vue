<template>
  <header
    ref="header"
    :class="['header', { 'header--transparente': transparente, 'header--scroll': isScrolled }]"
    :style="estiloPaleta"
  >
    <nav class="nav" :aria-label="t('nav.principal')">
      <div class="nav-container">
        <router-link to="/" class="logo">
          <!-- Mantener presionado 5 s abre el panel admin -->
          <img
            class="logo-icon"
            src="/imagenes/logo-96.png"
            alt=""
            width="40"
            height="40"
            draggable="false"
            @mousedown.prevent="iniciarLongPress"
            @mouseup="cancelarLongPress"
            @mouseleave="cancelarLongPress"
            @touchstart.passive="iniciarLongPress"
            @touchend="cancelarLongPress"
            @touchcancel="cancelarLongPress"
          />
          <span class="logo-text">Ideancestral</span>
        </router-link>

        <ul class="nav-links">
          <li v-for="s in secciones" :key="s.id">
            <a :href="`/#${s.id}`" @click.prevent="navegar(s.id)">{{ t(s.label) }}</a>
          </li>
        </ul>

        <div class="nav-actions">
          <div class="nav-utilities">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <button
            class="cart-toggle"
            :class="{ 'cart-bounce': cartBouncing }"
            :aria-label="`${t('cart.miCarrito')} (${carritoCount})`"
            :title="t('cart.miCarrito')"
            @click="toggleCarrito"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span v-if="carritoCount > 0" class="cart-badge">{{ carritoCount }}</span>
          </button>
          <button
            ref="botonMenu"
            class="menu-toggle"
            :class="{ 'menu-toggle--abierto': menuOpen }"
            :aria-label="menuOpen ? t('nav.cerrarMenu') : t('nav.menu')"
            :aria-expanded="menuOpen"
            aria-controls="nav-menu"
            @click="menuOpen ? cerrarMenu(true) : abrirMenu()"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  </header>

  <!-- Menú móvil: ventana flotante bajo la barra, con los colores del tema claro/oscuro -->
  <Teleport to="body">
    <transition name="fondo-menu">
      <div v-if="menuOpen" class="menu-fondo" aria-hidden="true" @click="cerrarMenu(true)"></div>
    </transition>
    <transition name="menu">
      <div
        v-if="menuOpen"
        id="nav-menu"
        ref="menu"
        class="menu-movil"
        role="dialog"
        aria-modal="true"
        :aria-label="t('nav.principal')"
        @keydown="onTeclaMenu"
      >
        <ul class="menu-movil__lista">
          <li v-for="s in secciones" :key="s.id">
            <a :href="`/#${s.id}`" class="menu-movil__enlace" @click.prevent="navegar(s.id)">
              <strong>{{ t(s.label) }}</strong>
              <small>{{ t(s.descripcion) }}</small>
            </a>
          </li>
        </ul>

        <div class="menu-movil__ajustes">
          <ThemeToggle />
          <div class="menu-movil__idiomas" role="group" :aria-label="t('nav.idioma')">
            <button
              v-for="code in ['es', 'en', 'pt']"
              :key="code"
              type="button"
              :aria-pressed="locale === code"
              :aria-label="t('lang.' + code)"
              @click="langStore.setLocale(code)"
            >{{ code.toUpperCase() }}</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCarrito } from '../../composables/useCarrito'
import { useIrASeccion } from '../../composables/useSecciones'
import { useEstadoInicio } from '../../composables/useEstadoInicio'
import { useLanguageStore } from '../../stores/language'
import { useThemeStore } from '../../stores/theme'
import { HERO_FONDOS, paletaDe } from '../../config/inicio'
import ThemeToggle from '../ThemeToggle.vue'
import LanguageSwitcher from '../LanguageSwitcher.vue'

const langStore = useLanguageStore()
const { t } = langStore
const { locale } = storeToRefs(langStore)
const { carritoCount, toggleCarrito } = useCarrito()
const irASeccion = useIrASeccion()
const route = useRoute()
const router = useRouter()
const estadoInicio = useEstadoInicio()

const secciones = [
  { id: 'inicio', label: 'nav.inicio', descripcion: 'nav.inicioDesc' },
  { id: 'categorias', label: 'nav.categorias', descripcion: 'nav.categoriasDesc' },
  { id: 'promociones', label: 'nav.promociones', descripcion: 'nav.promocionesDesc' },
  { id: 'nosotros', label: 'nav.nosotros', descripcion: 'nav.nosotrosDesc' }
]

/* ===== Modo transparente sobre el inicio ===== */
const themeStore = useThemeStore()
const transparente = computed(() => estadoInicio.montado && estadoInicio.bajoHeader)

// Fuera del inicio se usa la paleta del primer fondo, según el tema
const estiloPaleta = computed(() => {
  const { acento, texto, fondo } = estadoInicio.montado ? estadoInicio.paleta : paletaDe(HERO_FONDOS[0], themeStore.isDark)
  // En tema claro el velo de arriba es más suave: si no, la foto se ve lavada
  return { '--nav-acento': acento, '--nav-texto': texto, '--nav-fondo': fondo, '--nav-velo': themeStore.isDark ? 0.6 : 0.4 }
})

/* ===== Menú móvil ===== */
const menuOpen = ref(false)
const menu = ref(null)
const botonMenu = ref(null)

const abrirMenu = async () => {
  menuOpen.value = true
  await nextTick()
  menu.value?.querySelector('.menu-movil__enlace')?.focus()
}

const cerrarMenu = (devolverFoco = false) => {
  menuOpen.value = false
  if (devolverFoco) nextTick(() => botonMenu.value?.focus())
}

const navegar = (id) => {
  cerrarMenu()
  irASeccion(id)
}

// Escape cierra; Tab no sale del menú mientras está abierto
const onTeclaMenu = (e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    cerrarMenu(true)
    return
  }
  if (e.key !== 'Tab' || !menu.value) return
  const enfocables = [...menu.value.querySelectorAll('a[href], button')]
  const primero = enfocables[0]
  const ultimo = enfocables[enfocables.length - 1]
  if (e.shiftKey && document.activeElement === primero) {
    e.preventDefault()
    ultimo.focus()
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault()
    primero.focus()
  }
}

// Sin scroll de la página detrás del menú
watch(menuOpen, (abierto) => {
  document.documentElement.style.overflow = abierto ? 'hidden' : ''
})

watch(() => route.fullPath, () => { menuOpen.value = false })

/* ===== Acceso oculto al admin ===== */
let longPressTimer = null
const iniciarLongPress = () => {
  cancelarLongPress()
  longPressTimer = setTimeout(() => router.push('/admin'), 5000)
}
const cancelarLongPress = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

/* ===== Carrito ===== */
const cartBouncing = ref(false)
const handleCartAdded = () => {
  cartBouncing.value = true
  setTimeout(() => { cartBouncing.value = false }, 600)
}

const header = ref(null)
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  // Transparente mientras el inicio siga debajo de la barra
  const hero = estadoInicio.montado && document.getElementById('inicio')
  if (hero) {
    estadoInicio.bajoHeader = hero.getBoundingClientRect().bottom > (header.value?.offsetHeight || 72)
  }
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('cart-item-added', handleCartAdded)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('cart-item-added', handleCartAdded)
  document.documentElement.style.overflow = ''
  cancelarLongPress()
})
</script>

<style scoped>
/* ===== Barra ===== */
.header {
  /* Colores de la barra sólida (tema claro/oscuro) */
  --nav-color: var(--color-text);
  --nav-marca: var(--color-primary);
  --nav-linea: var(--color-secondary);
  --nav-cambio: 1.2s ease;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  color: var(--nav-color);
  background: var(--color-header-bg-scrolled);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-gray-light);
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, color var(--nav-cambio);
}

.header--scroll {
  box-shadow: var(--shadow-sm);
}

/* Sobre la foto del inicio: sin fondo y con los colores de la imagen activa */
.header--transparente {
  --nav-color: var(--nav-texto);
  --nav-marca: var(--nav-texto);
  --nav-linea: var(--nav-acento);
  background: transparent;
  border-bottom-color: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Velo suave para que el texto se lea sobre cualquier foto */
.header::before {
  content: '';
  position: absolute;
  inset: 0 0 -32px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(var(--nav-fondo), var(--nav-velo, 0.6)) 0%, rgba(var(--nav-fondo), 0) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.header--transparente::before {
  opacity: 1;
}

.nav-container {
  max-width: 1280px;
  height: var(--header-alto);
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-4);
}

/* ===== Logo ===== */
.logo {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--nav-marca);
  transition: color var(--nav-cambio);
}

.logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 18%, transparent);
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  cursor: pointer;
  transition: transform 0.4s ease;
}

/* Más grande sobre la portada; compacto en la barra sólida */
.header--transparente .logo-icon {
  transform: scale(1.12);
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ===== Enlaces ===== */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  list-style: none;
}

.nav-links a {
  position: relative;
  display: block;
  padding: var(--space-2) 0;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: inherit;
  transition: color 0.25s ease;
}

/* Línea de acento que crece desde la izquierda */
.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 1.5px;
  background: var(--nav-linea);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease, background-color var(--nav-cambio);
}

.nav-links a:hover,
.nav-links a:focus-visible {
  color: var(--nav-linea);
}

.nav-links a:hover::after,
.nav-links a:focus-visible::after {
  transform: scaleX(1);
}

/* ===== Acciones ===== */
.nav-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav-utilities {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Tema e idioma heredan el color de la barra (sobre foto o sobre fondo claro) */
.header :deep(.theme-toggle),
.header :deep(.lang-btn),
.cart-toggle {
  color: inherit;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}

.header :deep(.theme-toggle:hover),
.header :deep(.lang-btn:hover),
.cart-toggle:hover {
  color: var(--nav-linea);
  border-color: var(--nav-linea);
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.cart-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--nav-linea);
  color: #1C140C;
  font-size: 0.7rem;
  font-weight: 700;
  transition: background-color var(--nav-cambio);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 40px;
  height: 40px;
  padding: 0 9px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
}

.menu-toggle span:last-child {
  width: 65%;
  margin-left: auto;
}

@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
}
.cart-bounce { animation: cartBounce 0.5s ease; }

/* La X del botón cuando el menú está abierto */
.menu-toggle span {
  transition: transform 0.3s ease, width 0.3s ease;
}

.menu-toggle--abierto span:first-child {
  transform: translateY(4px) rotate(45deg);
}

.menu-toggle--abierto span:last-child {
  width: 100%;
  transform: translateY(-4px) rotate(-45deg);
}

/* ===== Menú móvil: ventana flotante ===== */
.menu-fondo {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.3);
}

.menu-movil {
  position: fixed;
  z-index: 1001;
  top: calc(var(--header-alto) + var(--space-2));
  right: 12px;
  width: min(320px, calc(100vw - 24px));
  max-height: calc(100svh - var(--header-alto) - var(--space-6));
  overflow-y: auto;
  padding: var(--space-2);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-xl);
  transform-origin: top right;
}

.menu-movil__lista {
  list-style: none;
}

.menu-movil__enlace {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: inherit;
  transition: background-color 0.2s ease;
}

.menu-movil__enlace strong {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.2;
  transition: color 0.2s ease;
}

.menu-movil__enlace small {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.menu-movil__enlace:hover,
.menu-movil__enlace:focus-visible {
  background: var(--color-bg-warm);
}

.menu-movil__enlace:hover strong,
.menu-movil__enlace:focus-visible strong {
  color: var(--color-primary);
}

.menu-movil__ajustes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-4) var(--space-2);
  border-top: 1px solid var(--color-gray-light);
}

.menu-movil__idiomas {
  display: flex;
  padding: 3px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-full);
}

.menu-movil__idiomas button {
  min-width: 44px;
  height: 32px;
  padding: 0 var(--space-3);
  border: none;
  border-radius: var(--radius-full);
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-movil__idiomas button[aria-pressed="true"] {
  background: var(--color-primary);
  color: var(--color-surface);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.fondo-menu-enter-active,
.fondo-menu-leave-active {
  transition: opacity 0.2s ease;
}

.fondo-menu-enter-from,
.fondo-menu-leave-to {
  opacity: 0;
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .nav-container {
    grid-template-columns: 1fr auto;
    padding: 0 20px;
  }

  .nav-links,
  .nav-utilities {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-actions {
    gap: var(--space-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-bounce {
    animation: none;
  }

  .menu-enter-active,
  .menu-leave-active,
  .fondo-menu-enter-active,
  .fondo-menu-leave-active,
  .menu-toggle span,
  .header--transparente .logo-icon {
    transition: none;
  }
}
</style>
