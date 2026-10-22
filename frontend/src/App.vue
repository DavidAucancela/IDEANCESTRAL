<template>
  <div id="app">
    <template v-if="conLayout">
      <a href="#contenido" class="skip-link">{{ t('nav.saltarContenido') }}</a>
      <AppHeader />
    </template>

    <div id="contenido" tabindex="-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <template v-if="conLayout">
      <AppFooter />
      <CartDrawer />
      <WhatsAppFloat />
    </template>
    <ToastContainer />
    <BackToTop />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from './stores/language'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import CartDrawer from './components/layout/CartDrawer.vue'
import WhatsAppFloat from './components/layout/WhatsAppFloat.vue'
import ToastContainer from './components/ToastContainer.vue'
import BackToTop from './components/BackToTop.vue'

const route = useRoute()
const { t } = useLanguageStore()

// El panel admin tiene su propio header; el resto usa el layout de la tienda
const conLayout = computed(() => route.meta.layout !== false)
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#contenido {
  flex: 1;
  outline: none;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  z-index: 2000;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-sm);
}

.skip-link:focus {
  top: var(--space-4);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
