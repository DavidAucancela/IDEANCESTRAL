<template>
  <div class="categoria-view">
    <main class="main-content">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">{{ t('nav.inicio') }}</router-link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="current">{{ categoria?.nombre || t('categories.categoria') }}</span>
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

        <!-- Skeleton loading -->
        <div v-if="loading" class="skeleton-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line skeleton-line-lg"></div>
              <div class="skeleton-line skeleton-line-sm"></div>
              <div class="skeleton-line skeleton-line-md"></div>
            </div>
          </div>
        </div>

        <!-- Productos grid -->
        <div v-if="!loading" class="productos-section">
          <div class="filtros-bar">
            <div class="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                v-model="busquedaTexto"
                type="search"
                :placeholder="t('categoryView.buscar')"
                class="search-input"
                :aria-label="t('categoryView.buscar')"
              />
            </div>
            <div class="filtros-right">
              <div class="filtro-precio">
                <span class="filtro-label">{{ t('categoryView.precio') }}</span>
                <input v-model.number="precioMin" type="number" :placeholder="t('categoryView.min')" :aria-label="t('categoryView.precioMin')" class="precio-input" min="0" />
                <span aria-hidden="true">—</span>
                <input v-model.number="precioMax" type="number" :placeholder="t('categoryView.max')" :aria-label="t('categoryView.precioMax')" class="precio-input" min="0" />
              </div>
              <select v-model="ordenamiento" class="sort-select" :aria-label="t('categoryView.ordenar')">
                <option value="">{{ t('categoryView.ordenar') }}</option>
                <option value="precio_asc">{{ t('categoryView.ordenPrecioAsc') }}</option>
                <option value="precio_desc">{{ t('categoryView.ordenPrecioDesc') }}</option>
                <option value="nombre_asc">{{ t('categoryView.ordenNombre') }}</option>
                <option value="destacados">{{ t('categoryView.ordenDestacados') }}</option>
              </select>
            </div>
          </div>

          <p class="resultados-contador">
            {{ productosFiltrados.length === 1 ? t('categoryView.encontradoUno') : t('categoryView.encontrados', { n: productosFiltrados.length }) }}
          </p>
          <div class="productos-grid">
            <BaseCard
              v-for="(producto, index) in productosFiltrados"
              :key="producto.id"
              class="producto-card"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <template #image>
                <router-link v-if="producto.id" :to="`/producto/${producto.id}`" class="producto-image">
                  <img
                    :src="obtenerImagenProducto(producto)"
                    :alt="producto.nombre"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <span v-if="producto.stock === 0" class="badge-card badge-agotado-card">{{ t('product.agotado') }}</span>
                  <span v-else-if="producto.destacado" class="badge-card badge-destacado-card">✦ {{ t('product.destacado') }}</span>
                  <div class="producto-overlay">
                    <span class="producto-overlay-btn">{{ t('featured.verMas') }}</span>
                  </div>
                </router-link>
              </template>
              <router-link v-if="producto.id" :to="`/producto/${producto.id}`" class="producto-nombre-link">
                <h3 class="producto-nombre">{{ producto.nombre }}</h3>
              </router-link>
              <h3 v-else class="producto-nombre">{{ producto.nombre }}</h3>
              <p v-if="producto.material" class="producto-material">{{ producto.material }}</p>
              <p v-if="producto.precio != null" class="producto-precio">${{ Number(producto.precio).toFixed(2) }}</p>
            </BaseCard>
          </div>

          <EmptyState
            v-if="!loading && productosFiltrados.length === 0"
            :description="t('categoryView.noProductos')"
          >
            <template #action>
              <router-link to="/" class="btn btn-primary">{{ t('categoryView.volverCatalogo') }}</router-link>
            </template>
          </EmptyState>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useLanguageStore } from '../stores/language'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import BaseCard from '../components/BaseCard.vue'
import EmptyState from '../components/EmptyState.vue'

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
  components: { BaseCard, EmptyState },
  setup() {
    const route = useRoute()
    const { t } = useLanguageStore()
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const categoria = ref(null)
    const productos = ref([])
    const loading = ref(true)
    const busquedaTexto = ref('')
    const precioMin = ref('')
    const precioMax = ref('')
    const ordenamiento = ref('')

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
      let lista = productos.value.filter(p => {
        const matchTxt = !txt || (p.nombre || '').toLowerCase().includes(txt) || (p.material || '').toLowerCase().includes(txt)
        const precio = Number(p.precio) || 0
        const matchMin = precioMin.value === '' || precio >= precioMin.value
        const matchMax = precioMax.value === '' || precio <= precioMax.value
        return matchTxt && matchMin && matchMax
      })
      if (ordenamiento.value === 'precio_asc') lista = [...lista].sort((a,b) => Number(a.precio) - Number(b.precio))
      else if (ordenamiento.value === 'precio_desc') lista = [...lista].sort((a,b) => Number(b.precio) - Number(a.precio))
      else if (ordenamiento.value === 'nombre_asc') lista = [...lista].sort((a,b) => (a.nombre||'').localeCompare(b.nombre||''))
      else if (ordenamiento.value === 'destacados') lista = [...lista].sort((a,b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
      return lista
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
          axios.get(`${API_URL}/productos`, { params: { categoria_id: id, limit: 50 } })
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

    useScrollAnimation()

    watch(() => route.params.id, cargarDatos)
    onMounted(cargarDatos)

    return {
      t,
      categoria,
      productos,
      loading,
      busquedaTexto,
      precioMin,
      precioMax,
      ordenamiento,
      productosFiltrados,
      imagenCategoria,
      obtenerImagenProducto,
      handleImageError
    }
  }
}
</script>

<style scoped>
.categoria-view { min-height: 100vh; }

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
  background: var(--color-surface);
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-md);
}
.search-bar:focus-within { border-color: var(--color-primary); }
.search-bar svg { color: var(--color-text-muted); flex-shrink: 0; }
.search-input { flex: 1; border: none; outline: none; font-size: 0.95rem; background: transparent; color: var(--color-text); }

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  /* «both»: arranca invisible durante su retraso, pero si las animaciones
     están apagadas la tarjeta se ve igual (no depende de la animación) */
  animation: fadeInUp 0.5s ease both;
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

/* Overlay hover */
.producto-image { position: relative; }
.producto-overlay {
  position: absolute;
  inset: 0;
  background: rgba(44, 34, 24, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.producto-card:hover .producto-overlay { opacity: 1; }
.producto-overlay-btn {
  background: #fff;
  color: var(--color-dark);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  letter-spacing: 0.05em;
  transform: translateY(8px);
  transition: transform 0.3s ease;
}
.producto-card:hover .producto-overlay-btn { transform: translateY(0); }

/* Filters bar */
.filtros-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filtros-bar .search-bar { margin-bottom: 0; flex: 1; min-width: 200px; }
.filtros-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.filtro-label { font-size: 0.85rem; color: var(--color-text-muted); white-space: nowrap; }
.filtro-precio { display: flex; align-items: center; gap: 0.4rem; }
.precio-input {
  width: 70px;
  padding: 0.45rem 0.6rem;
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
}
.precio-input:focus { border-color: var(--color-primary); }
.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  outline: none;
}
.sort-select:focus { border-color: var(--color-primary); }

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.skeleton-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.skeleton-img {
  height: 260px;
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg-warm) 50%, var(--color-gray-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-body { padding: 1.25rem; }
.skeleton-line {
  height: 12px;
  border-radius: 6px;
  margin-bottom: 0.6rem;
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg-warm) 50%, var(--color-gray-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line-lg { width: 75%; }
.skeleton-line-sm { width: 45%; }
.skeleton-line-md { width: 30%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.empty-state { text-align: center; padding: 3rem 0; }
.empty-state p { margin-bottom: 1rem; color: var(--color-text-light); }

.badge-card {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 2;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 50px;
  letter-spacing: 0.04em;
  pointer-events: none;
}
.badge-destacado-card {
  background: linear-gradient(135deg, #C4853A, #D4A76A);
  color: #fff;
}
.badge-agotado-card {
  background: var(--color-dark);
  color: var(--color-white);
}
.producto-card:has(.badge-agotado-card) .producto-image img { filter: grayscale(0.6); opacity: 0.85; }
.resultados-contador {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .categoria-header { flex-direction: column; }
  .categoria-portada { width: 100%; max-width: 280px; height: 200px; margin: 0 auto; }
  .productos-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .producto-image { height: 180px; }
  .filtros-bar { flex-direction: column; align-items: stretch; }
  .filtros-right { justify-content: flex-start; }
  .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
