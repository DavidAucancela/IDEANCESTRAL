<template>
  <div class="categoria-view">
    <!-- Header -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="nav">
        <div class="nav-container">
          <router-link to="/" class="logo">
            <span class="logo-icon">IA</span>
            <span class="logo-text">Ideancestral</span>
          </router-link>
          <ul class="nav-links" :class="{ open: menuOpen }">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/#categorias">Categorías</router-link></li>
            <li><router-link to="/#promociones">Promociones</router-link></li>
            <li><router-link to="/#nosotros">Nosotros</router-link></li>
            <li>
              <button class="cart-toggle" @click="toggleCarrito" title="Carrito">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                <span v-if="carritoCount > 0" class="cart-badge">{{ carritoCount }}</span>
              </button>
            </li>
          </ul>
          <button class="menu-toggle" @click="toggleMenu" :class="{ active: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="current">{{ categoria?.nombre || 'Categoría' }}</span>
        </div>

        <!-- Categoria header -->
        <div v-if="categoria" class="categoria-header">
          <div class="categoria-portada" v-if="imagenCategoria">
            <img :src="imagenCategoria" :alt="categoria.nombre" @error="handleImageError" />
          </div>
          <div class="categoria-info">
            <h1>{{ categoria.nombre }}</h1>
            <p v-if="categoria.descripcion">{{ categoria.descripcion }}</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <!-- Productos grid -->
        <div v-else class="productos-section">
          <div class="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input 
              v-model="busquedaTexto" 
              type="search" 
              placeholder="Buscar en esta categoría..." 
              class="search-input"
              aria-label="Buscar productos"
            />
          </div>

          <div class="productos-grid">
            <div 
              v-for="(producto, index) in productosFiltrados" 
              :key="producto.id"
              class="producto-card"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <router-link v-if="producto.id" :to="`/producto/${producto.id}`" class="producto-image">
                <img 
                  :src="obtenerImagenProducto(producto)" 
                  :alt="producto.nombre"
                  @error="handleImageError"
                  loading="lazy"
                />
              </router-link>
              <div class="producto-info">
                <router-link v-if="producto.id" :to="`/producto/${producto.id}`" class="producto-nombre-link">
                  <h3 class="producto-nombre">{{ producto.nombre }}</h3>
                </router-link>
                <h3 v-else class="producto-nombre">{{ producto.nombre }}</h3>
                <p v-if="producto.material" class="producto-material">{{ producto.material }}</p>
                <p v-if="producto.precio != null" class="producto-precio">${{ Number(producto.precio).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div v-if="!loading && productosFiltrados.length === 0" class="empty-state">
            <p>No hay productos en esta categoría.</p>
            <router-link to="/" class="btn btn-primary">Volver al catálogo</router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Carrito Sidebar -->
    <div class="carrito-overlay" :class="{ visible: carritoAbierto }" @click="toggleCarrito"></div>
    <aside class="carrito-sidebar" :class="{ open: carritoAbierto }">
      <div class="carrito-header">
        <h3>Mi Carrito <span v-if="carritoCount > 0" class="carrito-count">({{ carritoCount }})</span></h3>
        <button class="carrito-close" @click="toggleCarrito">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div v-if="carrito.length === 0" class="carrito-empty">
        <p>Tu carrito está vacío</p>
        <router-link to="/#categorias" @click="toggleCarrito" class="btn btn-primary">Explorar productos</router-link>
      </div>
      <div v-else class="carrito-body">
        <div class="carrito-items">
          <div v-for="item in carrito" :key="item.id" class="carrito-item">
            <img :src="item.imagen" :alt="item.nombre" class="carrito-item-img" @error="handleImageError" />
            <div class="carrito-item-info">
              <h4>{{ item.nombre }}</h4>
              <span class="carrito-item-precio">${{ item.precio.toFixed(2) }}</span>
              <div class="carrito-item-qty">
                <button @click="actualizarCantidad(item.id, item.cantidad - 1)">−</button>
                <span>{{ item.cantidad }}</span>
                <button @click="actualizarCantidad(item.id, item.cantidad + 1)">+</button>
              </div>
            </div>
            <button class="carrito-item-remove" @click="quitarDelCarrito(item.id)">×</button>
          </div>
        </div>
        <div class="carrito-footer">
          <div class="carrito-total">
            <span>Total</span>
            <strong>${{ carritoTotal.toFixed(2) }}</strong>
          </div>
          <button class="btn btn-whatsapp carrito-btn-pedido" @click="enviarPedidoWhatsApp">
            Enviar pedido por WhatsApp
          </button>
          <button class="btn btn-secondary carrito-btn-vaciar" @click="vaciarCarrito">Vaciar carrito</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCarrito } from '../composables/useCarrito'

const DEFAULT_IMAGENES = {
  'Madera': '/imagenes/sol madera.jpg',
  'Cerámica': '/imagenes/vasos.jpg',
  'Ceramica': '/imagenes/vasos.jpg',
  'Mascaras': '/imagenes/diablo PRINCIPAL.jpg',
  'Nacimientos': '/imagenes/nac1.jpg',
  'Otros': '/imagenes/pulseras_varias.jpg',
  'Tejidos': '/imagenes/logo-principal.jpg'
}

export default {
  name: 'CategoriaView',
  setup() {
    const route = useRoute()
    const { carrito, carritoAbierto, carritoCount, carritoTotal, toggleCarrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito, enviarPedidoWhatsApp } = useCarrito()
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const categoria = ref(null)
    const productos = ref([])
    const loading = ref(true)
    const menuOpen = ref(false)
    const isScrolled = ref(false)
    const busquedaTexto = ref('')

    const imagenCategoria = computed(() => {
      if (!categoria.value) return null
      const img = categoria.value.imagen_url
      if (img) {
        return img.startsWith('http') ? img : `${API_URL.replace('/api', '')}${img}`
      }
      return DEFAULT_IMAGENES[categoria.value.nombre] || '/imagenes/logo-principal.jpg'
    })

    const productosFiltrados = computed(() => {
      const txt = (busquedaTexto.value || '').trim().toLowerCase()
      if (!txt) return productos.value
      return productos.value.filter(p =>
        (p.nombre || '').toLowerCase().includes(txt) ||
        (p.material || '').toLowerCase().includes(txt)
      )
    })

    const obtenerImagenProducto = (producto) => {
      if (producto.imagenes && producto.imagenes.length > 0) {
        const principal = producto.imagenes.find(img => img.es_principal)
        const img = principal || producto.imagenes[0]
        const url = img.url
        return url?.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`
      }
      return '/imagenes/logo-principal.jpg'
    }

    const handleImageError = (e) => {
      e.target.src = '/imagenes/logo-principal.jpg'
    }

    const cargarDatos = async () => {
      const id = route.params.id
      if (!id) return
      try {
        loading.value = true
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/categorias/${id}`),
          axios.get(`${API_URL}/productos`, { params: { categoria_id: id } })
        ])
        categoria.value = catRes.data
        const data = prodRes.data
        productos.value = data.productos || data || []
      } catch (err) {
        console.error('Error cargando categoría:', err)
        categoria.value = null
        productos.value = []
      } finally {
        loading.value = false
      }
    }

    const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
    const toggleMenu = () => { menuOpen.value = !menuOpen.value }

    watch(() => route.params.id, cargarDatos)
    onMounted(() => {
      cargarDatos()
      window.addEventListener('scroll', handleScroll)
    })
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))

    return {
      categoria,
      productos,
      loading,
      menuOpen,
      isScrolled,
      busquedaTexto,
      productosFiltrados,
      imagenCategoria,
      obtenerImagenProducto,
      handleImageError,
      toggleCarrito,
      carrito,
      carritoAbierto,
      carritoCount,
      carritoTotal,
      actualizarCantidad,
      quitarDelCarrito,
      vaciarCarrito,
      enviarPedidoWhatsApp,
      toggleMenu
    }
  }
}
</script>

<style scoped>
.categoria-view { min-height: 100vh; }

.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  transition: var(--transition);
}
.header.scrolled { background: rgba(255,255,255,0.95); box-shadow: var(--shadow-sm); }

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.8rem 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { display: flex; align-items: center; gap: 8px; }
.logo-icon {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 6px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 12px;
}
.logo-text { font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: var(--color-primary); }

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  align-items: center;
}
.nav-links a {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}
.nav-links a:hover { color: var(--color-primary); background: var(--color-bg-warm); }

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.menu-toggle span { width: 24px; height: 2px; background: var(--color-text); border-radius: 2px; transition: var(--transition); }
.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.cart-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1.5px solid var(--color-gray-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  transition: var(--transition);
}
.cart-toggle:hover { border-color: var(--color-primary); color: var(--color-primary); }
.cart-badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content { padding: 100px 0 4rem; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.breadcrumb a { color: var(--color-primary); }
.breadcrumb .current { color: var(--color-text); font-weight: 500; }

.categoria-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.categoria-portada {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}
.categoria-portada img { width: 100%; height: 100%; object-fit: cover; }

.categoria-info h1 { font-size: 2rem; color: var(--color-text); margin-bottom: 0.5rem; }
.categoria-info p { color: var(--color-text-light); line-height: 1.7; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  margin-bottom: 1.5rem;
  padding: 0.6rem 1rem;
  background: var(--color-white);
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-md);
}
.search-bar:focus-within { border-color: var(--color-primary); }
.search-bar svg { color: var(--color-text-muted); flex-shrink: 0; }
.search-input { flex: 1; border: none; outline: none; font-size: 0.95rem; background: transparent; }

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}
.producto-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

.producto-image {
  display: block;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: var(--color-gray-light);
}
.producto-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.producto-card:hover .producto-image img { transform: scale(1.05); }

.producto-info { padding: 1.25rem; }
.producto-nombre-link { text-decoration: none; color: inherit; }
.producto-nombre-link:hover .producto-nombre { color: var(--color-primary); }
.producto-nombre { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.4rem; }
.producto-material { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem; }
.producto-precio { font-size: 1rem; font-weight: 700; color: var(--color-primary); }

.loading-state { text-align: center; padding: 4rem 0; color: var(--color-text-muted); }
.spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--color-gray-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-state { text-align: center; padding: 3rem 0; }
.empty-state p { margin-bottom: 1rem; color: var(--color-text-light); }

/* Carrito (copiado de CatalogoView) */
.carrito-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.carrito-overlay.visible { opacity: 1; visibility: visible; }

.carrito-sidebar {
  position: fixed;
  top: 0; right: 0;
  width: 380px;
  max-width: 90vw;
  height: 100vh;
  background: var(--color-white);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 30px rgba(0,0,0,0.15);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.carrito-sidebar.open { transform: translateX(0); }

.carrito-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-header h3 { font-size: 1rem; margin: 0; }
.carrito-close {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
}
.carrito-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 2rem; }
.carrito-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.carrito-items { flex: 1; overflow-y: auto; padding: 1rem; }
.carrito-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-item-img { width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.carrito-item-info { flex: 1; min-width: 0; }
.carrito-item-info h4 { font-size: 0.85rem; margin: 0 0 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.carrito-item-precio { font-size: 0.8rem; color: var(--color-primary); font-weight: 600; }
.carrito-item-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; }
.carrito-item-qty button {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-white);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
}
.carrito-item-remove {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: var(--transition);
}
.carrito-item-remove:hover { background: #FEE; color: #C0392B; }

.carrito-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}
.carrito-total { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 1rem; }
.carrito-total strong { color: var(--color-primary); }
.carrito-btn-pedido { width: 100%; padding: 0.75rem; font-size: 0.9rem; }
.carrito-btn-vaciar { width: 100%; margin-top: 0.5rem; padding: 0.5rem; font-size: 0.85rem; }

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 0; right: 0;
    width: 280px;
    height: 100vh;
    background: var(--color-white);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform 0.35s ease;
    z-index: 1000;
  }
  .nav-links.open { transform: translateX(0); }
  .menu-toggle { display: flex; }
  .categoria-header { flex-direction: column; }
  .categoria-portada { width: 100%; max-width: 280px; height: 200px; margin: 0 auto; }
  .productos-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .producto-image { height: 180px; }
  .carrito-sidebar { width: 100%; }
}
</style>
