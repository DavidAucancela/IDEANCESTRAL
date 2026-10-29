import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '../views/CatalogoView.vue'
import { HEADER_OFFSET } from '../composables/useSecciones'

// Espera a que exista un elemento (las vistas cargan con una transición de 250 ms)
const esperarElemento = (selector, timeout = 2000) =>
  new Promise((resolve) => {
    const inicio = performance.now()
    const buscar = () => {
      const el = document.querySelector(selector)
      if (el || performance.now() - inicio > timeout) return resolve(el)
      requestAnimationFrame(buscar)
    }
    buscar()
  })

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'catalogo', component: CatalogoView },
    { path: '/categoria/:id', name: 'categoria', component: () => import('../views/CategoriaView.vue') },
    { path: '/producto/:id', name: 'producto', component: () => import('../views/ProductoDetalleView.vue') },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { layout: false } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ],
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      const el = await esperarElemento(to.hash)
      if (el) return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' }
    }
    if (to.path !== from.path) return { top: 0 }
    return false
  }
})

export default router
