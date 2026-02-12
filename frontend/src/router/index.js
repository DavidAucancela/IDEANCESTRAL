import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '../views/CatalogoView.vue'
import CategoriaView from '../views/CategoriaView.vue'
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
      path: '/categoria/:id',
      name: 'categoria',
      component: CategoriaView
    },
    {
      path: '/producto/:id',
      name: 'producto',
      component: ProductoDetalleView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router
