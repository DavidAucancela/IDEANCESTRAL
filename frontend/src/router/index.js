import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '../views/CatalogoView.vue'
import ProductoDetalleView from '../views/ProductoDetalleView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'catalogo',
      component: CatalogoView
    },
    {
      path: '/producto/:id',
      name: 'producto-detalle',
      component: ProductoDetalleView,
      props: true
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router
