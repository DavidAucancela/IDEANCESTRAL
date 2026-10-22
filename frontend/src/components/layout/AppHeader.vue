<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <nav class="nav" :aria-label="t('nav.principal')">
      <div class="nav-container">
        <router-link to="/" class="logo">
          <!-- Mantener presionado 5 s abre el panel admin -->
          <span
            class="logo-icon"
            @mousedown.prevent="iniciarLongPress"
            @mouseup="cancelarLongPress"
            @mouseleave="cancelarLongPress"
            @touchstart.passive="iniciarLongPress"
            @touchend="cancelarLongPress"
            @touchcancel="cancelarLongPress"
          >IA</span>
          <span class="logo-text">Ideancestral</span>
        </router-link>

        <ul id="nav-menu" class="nav-links" :class="{ open: menuOpen }">
          <li v-for="s in secciones" :key="s.id">
            <a :href="`/#${s.id}`" @click.prevent="navegar(s.id)">{{ t(s.label) }}</a>
          </li>
          <li class="nav-utilities">
            <ThemeToggle />
            <LanguageSwitcher />
          </li>
        </ul>

        <div class="nav-actions">
          <button
            class="cart-toggle"
            :class="{ 'cart-bounce': cartBouncing }"
            :aria-label="`${t('cart.miCarrito')} (${carritoCount})`"
            :title="t('cart.miCarrito')"
            @click="toggleCarrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span v-if="carritoCount > 0" class="cart-badge">{{ carritoCount }}</span>
          </button>
          <button
            class="menu-toggle"
            :class="{ active: menuOpen }"
            :aria-label="t('nav.menu')"
            :aria-expanded="menuOpen"
            aria-controls="nav-menu"
            @click="menuOpen = !menuOpen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarrito } from '../../composables/useCarrito'
import { useIrASeccion } from '../../composables/useSecciones'
import { useLanguageStore } from '../../stores/language'
import ThemeToggle from '../ThemeToggle.vue'
import LanguageSwitcher from '../LanguageSwitcher.vue'

const { t } = useLanguageStore()
const { carritoCount, toggleCarrito } = useCarrito()
const irASeccion = useIrASeccion()
const route = useRoute()
const router = useRouter()

const secciones = [
  { id: 'inicio', label: 'nav.inicio' },
  { id: 'categorias', label: 'nav.categorias' },
  { id: 'promociones', label: 'nav.promociones' },
  { id: 'nosotros', label: 'nav.nosotros' }
]

const menuOpen = ref(false)
const isScrolled = ref(false)

const navegar = (id) => {
  menuOpen.value = false
  irASeccion(id)
}

watch(() => route.fullPath, () => { menuOpen.value = false })

// Acceso oculto al admin
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

// Animación del ícono del carrito al agregar un producto
const cartBouncing = ref(false)
const handleCartAdded = () => {
  cartBouncing.value = true
  setTimeout(() => { cartBouncing.value = false }, 600)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('cart-item-added', handleCartAdded)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('cart-item-added', handleCartAdded)
  cancelarLongPress()
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: var(--transition);
}

.header.scrolled {
  background: var(--color-header-bg-scrolled);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.8rem 24px;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 6px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: var(--text-xs);
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: var(--space-1);
  align-items: center;
}

.nav-links a {
  display: block;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--color-primary);
  background: var(--color-bg-warm);
}

.nav-utilities {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-2);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.cart-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: 1.5px solid var(--color-gray-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  transition: var(--transition);
}

.cart-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-bg-warm);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: var(--space-2);
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  transition: var(--transition);
  border-radius: 2px;
}

.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
}
.cart-bounce { animation: cartBounce 0.5s ease; }

@media (prefers-reduced-motion: reduce) {
  .cart-bounce { animation: none; }
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    max-width: 85vw;
    height: 100vh;
    background: var(--color-surface);
    flex-direction: column;
    align-items: stretch;
    padding: 5rem var(--space-6) var(--space-6);
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }

  .nav-links.open { transform: translateX(0); }
  .nav-utilities { margin: var(--space-4) 0 0; padding: 0 var(--space-4); }
  .menu-toggle { display: flex; }
}
</style>
