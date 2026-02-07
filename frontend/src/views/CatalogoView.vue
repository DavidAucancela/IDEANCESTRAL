<template>
  <div class="catalogo-view">
    <!-- Header -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="nav">
        <div class="nav-container">
          <router-link to="/" class="logo">
            <span class="logo-icon">IA</span>
            <span class="logo-text">Ideancestral</span>
          </router-link>
          <ul class="nav-links" :class="{ open: menuOpen }">
            <li><a href="#inicio" @click.prevent="scrollTo('inicio')">Inicio</a></li>
            <li><a href="#catalogo" @click.prevent="scrollTo('catalogo')">Catálogo</a></li>
            <li><a href="#nosotros" @click.prevent="scrollTo('nosotros')">Nosotros</a></li>
            <li>
              <a :href="whatsappGeneral" target="_blank" class="nav-whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </li>
            <li><router-link to="/admin" @click="menuOpen = false" class="nav-admin">Admin</router-link></li>
          </ul>
          <button class="menu-toggle" @click="toggleMenu" :class="{ active: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="hero-title-small">Bienvenido a</span>
            Idea Ancestral
          </h1>
          <p class="hero-description">
            Un lugar donde se entrelazan la creatividad y la tradición. 
            Desde tejidos únicos hasta cerámicas delicadas, cada artículo 
            cuenta una historia única y refleja la rica herencia cultural.
          </p>
          <div class="hero-actions">
            <a href="#catalogo" @click.prevent="scrollTo('catalogo')" class="btn btn-primary btn-lg">
              Ver Catálogo
            </a>
            <a :href="whatsappGeneral" target="_blank" class="btn btn-whatsapp btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Contáctanos
            </a>
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="hero-image-frame">
            <img src="/imagenes/logo-principal.jpg" alt="Artesanías Idea Ancestral" />
          </div>
        </div>
      </div>
    </section>

    <!-- Banner Central -->
    <section class="banner-central">
      <div class="banner-bg-images">
        <div class="banner-bg-img" style="background-image: url('/imagenes/masc1.jpg')"></div>
        <div class="banner-bg-img" style="background-image: url('/imagenes/nac2.jpg')"></div>
        <div class="banner-bg-img" style="background-image: url('/imagenes/vasos.jpg')"></div>
        <div class="banner-bg-img" style="background-image: url('/imagenes/caballo.jpg')"></div>
      </div>
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <p class="banner-pre">Artesanías hechas a mano</p>
        <h1 class="banner-title-cursive">catálogo</h1>
        <h2 class="banner-title-main">ARTESANAL</h2>
        <div class="banner-divider"></div>
        <p class="banner-subtitle">-Siempre Santander-</p>
        <p class="banner-tagline">Productos 100% hechos a mano</p>
      </div>
    </section>

    <!-- Categorías -->
    <section id="categorias" class="categorias-section">
      <div class="container">
        <div class="section-header">
          <h2>Explora por Categoría</h2>
          <p>Descubre nuestras colecciones artesanales</p>
        </div>
        <div class="categorias-filters">
          <button 
            @click="filtrarPorCategoria(null)"
            :class="['filter-chip', { active: categoriaFiltro === null }]"
          >
            Todos
          </button>
          <button 
            v-for="categoria in categorias" 
            :key="categoria.id"
            @click="filtrarPorCategoria(categoria.id)"
            :class="['filter-chip', { active: categoriaFiltro === categoria.id }]"
          >
            {{ categoria.nombre }}
          </button>
        </div>
      </div>
    </section>

    <!-- Catálogo -->
    <section id="catalogo" class="catalogo-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>
        
        <div v-else-if="productos.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <p>No hay productos disponibles en esta categoría</p>
          <button @click="filtrarPorCategoria(null)" class="btn btn-secondary">Ver todos</button>
        </div>

        <div v-else class="productos-grid">
          <div 
            v-for="(producto, index) in productos" 
            :key="producto.id"
            class="producto-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="verDetalle(producto.id)"
          >
            <div class="producto-image">
              <img 
                :src="obtenerImagenPrincipal(producto)" 
                :alt="producto.nombre"
                @error="handleImageError"
                loading="lazy"
              />
              <div class="producto-image-overlay">
                <span class="ver-detalle-btn">Ver Detalle</span>
              </div>
              <div v-if="producto.destacado" class="badge-destacado">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Destacado
              </div>
            </div>
            <div class="producto-info">
              <span class="producto-categoria-tag">{{ producto.categoria_nombre || 'Artesanía' }}</span>
              <h3 class="producto-nombre">{{ producto.nombre }}</h3>
              <div class="producto-meta">
                <span v-if="producto.material" class="meta-item">{{ producto.material }}</span>
              </div>
              <div class="producto-footer">
                <span class="producto-precio">${{ Number(producto.precio).toFixed(2) }}</span>
                <span class="producto-ver">
                  Ver
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nosotros / Ubicación -->
    <section id="nosotros" class="nosotros-section">
      <div class="container">
        <div class="nosotros-grid">
          <div class="nosotros-info">
            <h2>Encuéntranos</h2>
            <p class="nosotros-desc">Visítanos en nuestro local y descubre más artesanías únicas hechas con amor y tradición.</p>
            <div class="info-cards">
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <strong>Ubicación</strong>
                  <p>Jorge Washington y Juan León Mera</p>
                  <p>"MERCADO ARTESANAL - LA MARISCAL"</p>
                  <p>Quito, Ecuador</p>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <strong>Teléfono</strong>
                  <p>(02) 2227781</p>
                  <p>+593 998 956 361</p>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>mary_cecy_ma@hotmail.com</p>
                </div>
              </div>
            </div>
            <div class="nosotros-social">
              <a href="https://www.instagram.com/ideancestral/" target="_blank" class="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a href="https://www.facebook.com/MercadoArtesanalLaMariscalOficial/" target="_blank" class="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a :href="whatsappGeneral" target="_blank" class="social-btn social-whatsapp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div class="nosotros-visual">
            <div class="image-mosaic">
              <img src="/imagenes/logo-principal.jpg" alt="Idea Ancestral" class="mosaic-main" />
              <img src="/imagenes/masc1.jpg" alt="Artesanía" class="mosaic-small mosaic-1" />
              <img src="/imagenes/sol madera.jpg" alt="Artesanía" class="mosaic-small mosaic-2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">IA</span>
              <span class="logo-text">Ideancestral</span>
            </div>
            <p>Artesanías hechas a mano con amor y tradición desde Ecuador.</p>
          </div>
          <div class="footer-links-grid">
            <div>
              <h4>Navegación</h4>
              <ul>
                <li><a href="#inicio" @click.prevent="scrollTo('inicio')">Inicio</a></li>
                <li><a href="#catalogo" @click.prevent="scrollTo('catalogo')">Catálogo</a></li>
                <li><a href="#nosotros" @click.prevent="scrollTo('nosotros')">Ubicación</a></li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul>
                <li>(02) 2227781</li>
                <li>+593 998 956 361</li>
                <li>mary_cecy_ma@hotmail.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>Idea Ancestral &copy; {{ new Date().getFullYear() }}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- WhatsApp floating button -->
    <a :href="whatsappGeneral" target="_blank" class="whatsapp-float">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const WHATSAPP_NUMBER = '593998956361'

export default {
  name: 'CatalogoView',
  setup() {
    const router = useRouter()
    const productos = ref([])
    const categorias = ref([])
    const loading = ref(true)
    const categoriaFiltro = ref(null)
    const menuOpen = ref(false)
    const isScrolled = ref(false)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    const whatsappGeneral = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me interesa conocer más sobre sus artesanías.')}`

    const productosFiltrados = computed(() => {
      if (!categoriaFiltro.value) return productos.value
      return productos.value.filter(p => p.categoria_id === categoriaFiltro.value)
    })

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const obtenerProductos = async () => {
      try {
        loading.value = true
        const params = categoriaFiltro.value ? { categoria_id: categoriaFiltro.value } : {}
        const response = await axios.get(`${API_URL}/productos`, { params })
        productos.value = response.data
      } catch (error) {
        console.error('Error obteniendo productos:', error)
      } finally {
        loading.value = false
      }
    }

    const obtenerCategorias = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorias`)
        categorias.value = response.data
      } catch (error) {
        console.error('Error obteniendo categorías:', error)
      }
    }

    const filtrarPorCategoria = (categoriaId) => {
      categoriaFiltro.value = categoriaId
      obtenerProductos()
    }

    const obtenerImagenPrincipal = (producto) => {
      if (producto.imagenes && producto.imagenes.length > 0) {
        const principal = producto.imagenes.find(img => img.es_principal)
        const img = principal || producto.imagenes[0]
        return `${API_URL.replace('/api', '')}${img.url}`
      }
      return '/imagenes/logo-principal.jpg'
    }

    const handleImageError = (event) => {
      event.target.src = '/imagenes/logo-principal.jpg'
    }

    const verDetalle = (productoId) => {
      router.push(`/producto/${productoId}`)
    }

    const scrollTo = (elementId) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      menuOpen.value = false
    }

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    onMounted(() => {
      obtenerCategorias()
      obtenerProductos()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      productos: productosFiltrados,
      categorias,
      loading,
      categoriaFiltro,
      menuOpen,
      isScrolled,
      whatsappGeneral,
      filtrarPorCategoria,
      obtenerImagenPrincipal,
      handleImageError,
      verDetalle,
      scrollTo,
      toggleMenu
    }
  }
}
</script>

<style scoped>
.catalogo-view {
  min-height: 100vh;
  overflow-x: hidden;
}

/* ===== HEADER ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: var(--transition);
}

.header.scrolled {
  background: rgba(255,255,255,0.95);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.8rem 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 8px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 14px;
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
  gap: 0.5rem;
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

.nav-links a:hover {
  color: var(--color-primary);
  background: var(--color-bg-warm);
}

.nav-whatsapp {
  display: flex !important;
  align-items: center;
  gap: 6px;
  color: #25D366 !important;
}

.nav-admin {
  color: var(--color-text-muted) !important;
  font-size: 0.85rem !important;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 4px;
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

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 80px;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-warm) 50%, #EDE0D4 100%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(123, 63, 0, 0.05) 0%, transparent 60%);
}

.hero-content {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  line-height: 1.15;
}

.hero-title-small {
  display: block;
  font-size: 1rem;
  font-family: var(--font-sans);
  font-weight: 500;
  color: var(--color-text-light);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.9;
  color: var(--color-text-light);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.hero-image-wrapper {
  display: flex;
  justify-content: center;
}

.hero-image-frame {
  position: relative;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 6px solid rgba(255,255,255,0.8);
}

.hero-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== BANNER ===== */
.banner-central {
  position: relative;
  padding: 6rem 24px;
  text-align: center;
  overflow: hidden;
}

.banner-bg-images {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.banner-bg-img {
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(90, 40, 0, 0.85) 0%, rgba(139, 69, 19, 0.8) 50%, rgba(90, 40, 0, 0.85) 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
}

.banner-pre {
  font-size: 0.85rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.banner-title-cursive {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 4rem;
  color: var(--color-accent-light);
  margin-bottom: 0.25rem;
  font-weight: 400;
}

.banner-title-main {
  font-family: var(--font-serif);
  font-size: 4.5rem;
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 6px;
  margin-bottom: 1rem;
}

.banner-divider {
  width: 60px;
  height: 2px;
  background: var(--color-accent);
  margin: 1.5rem auto;
}

.banner-subtitle {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-accent-light);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.banner-tagline {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 1rem;
}

/* ===== CATEGORÍAS ===== */
.categorias-section {
  padding: 3rem 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.categorias-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.filter-chip {
  padding: 0.6rem 1.4rem;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text);
  border-radius: 100px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--font-sans);
  transition: var(--transition);
}

.filter-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-chip.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

/* ===== CATÁLOGO ===== */
.catalogo-section {
  padding: 2rem 0 5rem;
  min-height: 60vh;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
}

.producto-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: pointer;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.producto-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.producto-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background-color: var(--color-gray-light);
}

.producto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.producto-card:hover .producto-image img {
  transform: scale(1.08);
}

.producto-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.producto-card:hover .producto-image-overlay {
  opacity: 1;
}

.ver-detalle-btn {
  padding: 0.6rem 1.5rem;
  background: var(--color-white);
  color: var(--color-text);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-destacado {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #D4A76A, #C4853A);
  color: var(--color-white);
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.producto-info {
  padding: 1.25rem 1.5rem 1.5rem;
}

.producto-categoria-tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-secondary);
}

.producto-nombre {
  font-size: 1.15rem;
  margin: 0.4rem 0 0.6rem;
  color: var(--color-text);
  font-weight: 600;
  line-height: 1.4;
}

.producto-meta {
  margin-bottom: 1rem;
}

.meta-item {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.producto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light);
}

.producto-precio {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.producto-ver {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: var(--transition);
}

.producto-card:hover .producto-ver {
  gap: 8px;
}

/* Loading / Empty */
.loading-state {
  text-align: center;
  padding: 5rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p, .empty-state p {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: var(--color-text-muted);
}

.empty-state svg {
  margin: 0 auto 1rem;
}

.empty-state .btn {
  margin-top: 1rem;
}

/* ===== NOSOTROS ===== */
.nosotros-section {
  padding: 6rem 0;
  background: var(--color-white);
}

.nosotros-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.nosotros-info h2 {
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.nosotros-desc {
  color: var(--color-text-light);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.info-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.info-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 10px;
}

.info-card strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

.info-card p {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}

.nosotros-social {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  background: var(--color-bg);
  color: var(--color-text);
  transition: var(--transition);
}

.social-btn:hover {
  background: var(--color-gray-light);
  transform: translateY(-2px);
}

.social-whatsapp {
  background: #E8FAF0;
  color: #25D366;
}

.social-whatsapp:hover {
  background: #D1F5E0;
}

.nosotros-visual {
  position: relative;
}

.image-mosaic {
  position: relative;
  height: 500px;
}

.mosaic-main {
  width: 85%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.mosaic-small {
  position: absolute;
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 4px solid var(--color-white);
  box-shadow: var(--shadow-md);
}

.mosaic-1 {
  bottom: 0;
  right: 0;
}

.mosaic-2 {
  bottom: 80px;
  right: 120px;
}

/* ===== FOOTER ===== */
.footer {
  background-color: var(--color-dark);
  color: rgba(255,255,255,0.7);
  padding: 4rem 0 0;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  padding-bottom: 3rem;
}

.footer-brand .logo-icon {
  background: var(--color-accent);
}

.footer-brand .logo-text {
  color: var(--color-white);
}

.footer-brand > p {
  margin-top: 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.footer-links-grid h4 {
  color: var(--color-white);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.footer-links-grid ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links-grid li {
  font-size: 0.9rem;
}

.footer-links-grid a {
  transition: var(--transition);
}

.footer-links-grid a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.85rem;
}

/* ===== WHATSAPP FLOATING ===== */
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.5);
  z-index: 999;
  transition: var(--transition);
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .hero-title { font-size: 2.8rem; }
  .hero-image-frame { width: 350px; height: 350px; }
  .banner-title-main { font-size: 3.5rem; }
  .banner-title-cursive { font-size: 3rem; }
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--color-white);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    gap: 0.25rem;
  }

  .nav-links.open { transform: translateX(0); }
  .menu-toggle { display: flex; }

  .hero {
    min-height: auto;
    padding: 100px 20px 60px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }

  .hero-title { font-size: 2.2rem; }
  .hero-description { margin: 0 auto 2rem; }
  .hero-actions { justify-content: center; }

  .hero-image-frame { width: 260px; height: 260px; margin: 0 auto; }

  .banner-title-cursive { font-size: 2.5rem; }
  .banner-title-main { font-size: 2.5rem; letter-spacing: 3px; }
  .banner-subtitle { font-size: 1.2rem; }
  .banner-central { padding: 4rem 20px; }

  .nosotros-grid { grid-template-columns: 1fr; }
  .image-mosaic { height: 350px; }
  .mosaic-main { width: 100%; height: 300px; }
  .mosaic-small { width: 120px; height: 120px; }
  .mosaic-2 { right: 60px; bottom: 30px; }

  .footer-top { grid-template-columns: 1fr; gap: 2rem; }

  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.8rem; }
  .hero-actions { flex-direction: column; }
  .hero-actions .btn { width: 100%; }
  .banner-title-main { font-size: 2rem; }
  .productos-grid { grid-template-columns: 1fr; }
  .nosotros-social { flex-direction: column; }
  .footer-links-grid { grid-template-columns: 1fr; }
}
</style>
