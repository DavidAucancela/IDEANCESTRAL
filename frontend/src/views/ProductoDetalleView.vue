<template>
  <div class="detalle-view">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <div class="nav-container">
          <router-link to="/" class="logo">
            <span class="logo-icon">IA</span>
            <span class="logo-text">Ideancestral</span>
          </router-link>
          <ul class="nav-links">
            <li><router-link to="/">Catálogo</router-link></li>
          </ul>
        </div>
      </nav>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Cargando producto...</p>
    </div>

    <!-- Producto -->
    <div v-else-if="producto" class="detalle-container">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span v-if="producto.categoria_nombre">{{ producto.categoria_nombre }}</span>
          <svg v-if="producto.categoria_nombre" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="current">{{ producto.nombre }}</span>
        </div>

        <div class="detalle-grid">
          <!-- Galería -->
          <div class="galeria">
            <div class="galeria-principal">
              <img 
                :src="imagenActual" 
                :alt="producto.nombre"
                @error="handleImageError"
              />
              <div v-if="producto.destacado" class="badge-destacado">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Destacado
              </div>
            </div>
            <div v-if="imagenes.length > 1" class="galeria-thumbs">
              <button
                v-for="(imagen, index) in imagenes"
                :key="imagen.id"
                @click="cambiarImagen(index)"
                :class="['thumb', { active: indexImagenActual === index }]"
              >
                <img :src="obtenerUrlImagen(imagen.url)" :alt="`Vista ${index + 1}`" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="info">
            <span v-if="producto.categoria_nombre" class="info-categoria">{{ producto.categoria_nombre }}</span>
            <h1 class="info-titulo">{{ producto.nombre }}</h1>
            
            <div class="info-precio">
              <span class="precio-valor">${{ Number(producto.precio).toFixed(2) }}</span>
            </div>

            <div class="info-descripcion">
              <p>{{ producto.descripcion || 'Artesanía elaborada a mano con técnicas tradicionales.' }}</p>
            </div>

            <div class="info-specs">
              <div v-if="producto.material" class="spec-row">
                <span class="spec-label">Material</span>
                <span class="spec-value">{{ producto.material }}</span>
              </div>
              <div v-if="producto.peso" class="spec-row">
                <span class="spec-label">Peso</span>
                <span class="spec-value">{{ producto.peso }}</span>
              </div>
              <div v-if="producto.categoria_nombre" class="spec-row">
                <span class="spec-label">Categoría</span>
                <span class="spec-value">{{ producto.categoria_nombre }}</span>
              </div>
            </div>

            <!-- Botón WhatsApp -->
            <div class="info-actions">
              <a :href="whatsappProducto" target="_blank" class="btn btn-whatsapp btn-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Consultar por WhatsApp
              </a>
              <router-link to="/" class="btn btn-secondary btn-full">
                Seguir Explorando
              </router-link>
            </div>
          </div>
        </div>

        <!-- Relacionados -->
        <div v-if="productosRelacionados.length > 0" class="relacionados">
          <div class="section-header">
            <h2>También te puede interesar</h2>
          </div>
          <div class="relacionados-grid">
            <router-link
              v-for="prod in productosRelacionados"
              :key="prod.id"
              :to="`/producto/${prod.id}`"
              class="rel-card"
            >
              <div class="rel-image">
                <img :src="obtenerImagenPrincipal(prod)" :alt="prod.nombre" />
              </div>
              <div class="rel-info">
                <span class="rel-cat">{{ prod.categoria_nombre || 'Artesanía' }}</span>
                <h4>{{ prod.nombre }}</h4>
                <span class="rel-precio">${{ Number(prod.precio).toFixed(2) }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="state-container">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      <p>Producto no encontrado</p>
      <router-link to="/" class="btn btn-primary">Volver al Catálogo</router-link>
    </div>

    <!-- WhatsApp floating -->
    <a :href="whatsappProducto" target="_blank" class="whatsapp-float">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const WHATSAPP_NUMBER = '593998956361'

export default {
  name: 'ProductoDetalleView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const producto = ref(null)
    const productosRelacionados = ref([])
    const loading = ref(true)
    const indexImagenActual = ref(0)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    // WhatsApp link dinámico con info del producto
    const whatsappProducto = computed(() => {
      if (!producto.value) {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me interesa conocer más sobre sus artesanías.')}`
      }
      const msg = `Hola, me interesa el producto: *${producto.value.nombre}* (Precio: $${producto.value.precio}). ¿Está disponible?`
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    })

    const imagenes = computed(() => {
      if (!producto.value || !producto.value.imagenes) return []
      return [...producto.value.imagenes].sort((a, b) => {
        if (a.es_principal) return -1
        if (b.es_principal) return 1
        return a.orden - b.orden
      })
    })

    const imagenActual = computed(() => {
      if (imagenes.value.length === 0) return '/imagenes/logo-principal.jpg'
      return obtenerUrlImagen(imagenes.value[indexImagenActual.value].url)
    })

    const obtenerProducto = async (id) => {
      try {
        loading.value = true
        indexImagenActual.value = 0
        const response = await axios.get(`${API_URL}/productos/${id}`)
        producto.value = response.data
        
        if (producto.value.categoria_id) {
          const resp = await axios.get(`${API_URL}/productos`, {
            params: { categoria_id: producto.value.categoria_id }
          })
          productosRelacionados.value = resp.data
            .filter(p => p.id !== producto.value.id)
            .slice(0, 4)
        } else {
          productosRelacionados.value = []
        }

        // Scroll al tope
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        console.error('Error obteniendo producto:', error)
        producto.value = null
      } finally {
        loading.value = false
      }
    }

    const obtenerUrlImagen = (url) => {
      if (!url) return '/imagenes/logo-principal.jpg'
      if (url.startsWith('http')) return url
      return `${API_URL.replace('/api', '')}${url}`
    }

    const obtenerImagenPrincipal = (prod) => {
      if (prod.imagenes && prod.imagenes.length > 0) {
        const principal = prod.imagenes.find(img => img.es_principal)
        return obtenerUrlImagen((principal || prod.imagenes[0]).url)
      }
      return '/imagenes/logo-principal.jpg'
    }

    const cambiarImagen = (index) => { indexImagenActual.value = index }

    const handleImageError = (event) => {
      event.target.src = '/imagenes/logo-principal.jpg'
    }

    // WATCH: Recargar cuando cambia el ID de la ruta (productos relacionados)
    watch(() => route.params.id, (newId) => {
      if (newId) obtenerProducto(newId)
    })

    onMounted(() => {
      obtenerProducto(route.params.id)
    })

    return {
      producto,
      productosRelacionados,
      loading,
      imagenes,
      imagenActual,
      indexImagenActual,
      whatsappProducto,
      cambiarImagen,
      obtenerUrlImagen,
      obtenerImagenPrincipal,
      handleImageError
    }
  }
}
</script>

<style scoped>
.detalle-view {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding-top: 65px;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
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

.logo { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; background: var(--color-primary);
  color: var(--color-white); border-radius: 8px;
  font-family: var(--font-serif); font-weight: 700; font-size: 14px;
}
.logo-text {
  font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--color-primary);
}
.nav-links {
  display: flex; list-style: none; gap: 1rem;
}
.nav-links a {
  font-size: 0.9rem; font-weight: 500; color: var(--color-text);
  padding: 0.5rem 1rem; border-radius: var(--radius-sm); transition: var(--transition);
}
.nav-links a:hover { color: var(--color-primary); background: var(--color-bg-warm); }

/* States */
.state-container {
  text-align: center;
  padding: 6rem 20px;
  color: var(--color-text-muted);
}

.state-container p { font-size: 1.1rem; margin: 1rem 0; }
.state-container .btn { margin-top: 1rem; }

.spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--color-gray-light);
  border-top-color: var(--color-primary);
  border-radius: 50%; margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Breadcrumb */
.breadcrumb {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 1.5rem 0; font-size: 0.9rem; color: var(--color-text-muted);
  flex-wrap: wrap;
}
.breadcrumb a { color: var(--color-primary); transition: var(--transition); }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb .current { color: var(--color-text); font-weight: 500; }

/* Detalle Grid */
.detalle-container { padding: 0 0 4rem; }

.detalle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
}

/* Galería */
.galeria { position: sticky; top: 85px; height: fit-content; }

.galeria-principal {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background-color: var(--color-gray-light);
  margin-bottom: 1rem;
}

.galeria-principal img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s;
}

.galeria-principal:hover img { transform: scale(1.03); }

.badge-destacado {
  position: absolute; top: 16px; left: 16px;
  background: linear-gradient(135deg, #D4A76A, #C4853A);
  color: white; padding: 0.4rem 1rem; border-radius: 100px;
  font-size: 0.8rem; font-weight: 600;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.galeria-thumbs {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
}

.thumb {
  width: 72px; height: 72px; border-radius: var(--radius-sm);
  overflow: hidden; cursor: pointer; padding: 0;
  border: 2.5px solid transparent; transition: var(--transition);
  background: var(--color-gray-light);
}

.thumb:hover, .thumb.active { border-color: var(--color-primary); }

.thumb img { width: 100%; height: 100%; object-fit: cover; }

/* Info */
.info { padding-top: 0.5rem; }

.info-categoria {
  display: inline-block;
  font-size: 0.8rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--color-secondary); margin-bottom: 0.75rem;
}

.info-titulo {
  font-size: 2.5rem; line-height: 1.2;
  color: var(--color-text); margin-bottom: 1.5rem;
}

.info-precio {
  margin-bottom: 2rem; padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.precio-valor {
  font-size: 2.25rem; font-weight: 700; color: var(--color-primary);
}

.info-descripcion {
  margin-bottom: 2rem;
}

.info-descripcion p {
  font-size: 1.05rem; line-height: 1.9; color: var(--color-text-light);
}

.info-specs {
  margin-bottom: 2.5rem;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.spec-row {
  display: flex; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.spec-row:last-child { border-bottom: none; }

.spec-label {
  font-size: 0.9rem; color: var(--color-text-muted); font-weight: 500;
}

.spec-value {
  font-size: 0.95rem; color: var(--color-text); font-weight: 600;
}

.info-actions {
  display: flex; flex-direction: column; gap: 0.75rem;
}

.btn-full { width: 100%; justify-content: center; }

/* Relacionados */
.relacionados {
  margin-top: 5rem; padding-top: 3rem;
  border-top: 1px solid var(--color-gray-light);
}

.section-header {
  text-align: center; margin-bottom: 2.5rem;
}

.section-header h2 {
  font-size: 1.8rem; color: var(--color-text);
}

.relacionados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.rel-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.rel-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.rel-image {
  width: 100%; height: 200px; overflow: hidden;
  background-color: var(--color-gray-light);
}

.rel-image img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s;
}

.rel-card:hover .rel-image img { transform: scale(1.06); }

.rel-info { padding: 1rem 1.25rem; }

.rel-cat {
  font-size: 0.7rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--color-secondary);
}

.rel-info h4 {
  font-size: 1rem; margin: 0.3rem 0 0.5rem;
  color: var(--color-text); font-weight: 600;
}

.rel-precio {
  font-size: 1.1rem; font-weight: 700; color: var(--color-primary);
}

/* WhatsApp Float */
.whatsapp-float {
  position: fixed; bottom: 24px; right: 24px;
  width: 60px; height: 60px; background: #25D366;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: white; box-shadow: 0 4px 20px rgba(37, 211, 102, 0.5);
  z-index: 999; transition: var(--transition);
}
.whatsapp-float:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6); }

/* Responsive */
@media (max-width: 968px) {
  .detalle-grid { grid-template-columns: 1fr; }
  .galeria { position: static; }
  .info-titulo { font-size: 2rem; }
}

@media (max-width: 768px) {
  .relacionados-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

@media (max-width: 480px) {
  .info-titulo { font-size: 1.6rem; }
  .precio-valor { font-size: 1.8rem; }
  .relacionados-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
}
</style>
