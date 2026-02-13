<template>
  <div class="admin-view">
    <!-- Login si no está autenticado -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-card">
        <h2>{{ t('admin.titulo') }}</h2>
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label>{{ t('admin.usuario') }}</label>
            <input v-model="loginForm.usuario" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('admin.contrasena') }}</label>
            <input v-model="loginForm.password" type="password" required />
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? t('admin.iniciandoSesion') : t('admin.iniciarSesion') }}
          </button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
        <div class="login-controls">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </div>

    <!-- Panel de administración -->
    <div v-else class="admin-panel">
      <header class="admin-header">
        <div class="container">
          <h1>{{ t('admin.titulo') }}</h1>
          <div class="admin-actions">
            <ThemeToggle />
            <LanguageSwitcher />
            <span>{{ t('admin.bienvenido') }} {{ usuario?.usuario || 'Admin' }}</span>
            <button @click="logout" class="btn btn-secondary">{{ t('admin.cerrarSesion') }}</button>
          </div>
        </div>
      </header>

      <div class="admin-content">
        <div class="container">
          <!-- Tabs -->
          <div class="admin-tabs">
            <button 
              @click="tabActual = 'productos'"
              :class="['tab-btn', { active: tabActual === 'productos' }]"
            >
              {{ t('admin.productos') }}
            </button>
            <button 
              @click="tabActual = 'categorias'"
              :class="['tab-btn', { active: tabActual === 'categorias' }]"
            >
              {{ t('admin.categorias') }}
            </button>
            <button 
              @click="tabActual = 'promociones'"
              :class="['tab-btn', { active: tabActual === 'promociones' }]"
            >
              {{ t('admin.promociones') }}
            </button>
          </div>

          <!-- Tab Productos -->
          <div v-if="tabActual === 'productos'" class="tab-content">
            <div class="section-header">
              <h2>{{ t('admin.gestionProductos') }}</h2>
              <button @click="abrirModalProducto(null)" class="btn btn-primary">
                {{ t('admin.nuevoProducto') }}
              </button>
            </div>

            <div v-if="loadingProductos" class="loading">{{ t('admin.cargandoProductos') }}</div>
            <div v-else class="productos-table">
              <table>
                <thead>
                  <tr>
                    <th>{{ t('admin.imagen') }}</th>
                    <th>{{ t('admin.nombre') }}</th>
                    <th>{{ t('admin.categorias') }}</th>
                    <th>{{ t('admin.precio') }}</th>
                    <th>{{ t('admin.estado') }}</th>
                    <th>{{ t('admin.acciones') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in productos" :key="producto.id">
                    <td>
                      <img 
                        :src="obtenerImagenPrincipal(producto)" 
                        :alt="producto.nombre"
                        class="table-image"
                      />
                    </td>
                    <td>{{ producto.nombre }}</td>
                    <td>{{ producto.categoria_nombre || t('admin.sinCategoria') }}</td>
                    <td>${{ producto.precio }}</td>
                    <td>
                      <span :class="['badge', producto.publicado ? 'badge-success' : 'badge-warning']">
                        {{ producto.publicado ? t('admin.publicado') : t('admin.oculto') }}
                      </span>
                    </td>
                    <td>
                      <button @click="abrirModalProducto(producto)" class="btn-icon">✏️</button>
                      <button @click="eliminarProducto(producto.id)" class="btn-icon btn-danger">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab Categorías -->
          <div v-if="tabActual === 'categorias'" class="tab-content">
            <div class="section-header">
              <h2>{{ t('admin.gestionCategorias') }}</h2>
              <button @click="abrirModalCategoria(null)" class="btn btn-primary">
                {{ t('admin.nuevaCategoria') }}
              </button>
            </div>

            <div v-if="loadingCategorias" class="loading">{{ t('admin.cargandoCategorias') }}</div>
            <div v-else class="categorias-grid">
              <div v-for="categoria in categorias" :key="categoria.id" class="categoria-card">
                <h3>{{ categoria.nombre }}</h3>
                <p>{{ categoria.descripcion || t('admin.sinDescripcion') }}</p>
                <div class="categoria-actions">
                  <button @click="abrirModalCategoria(categoria)" class="btn btn-secondary">{{ t('admin.editar') }}</button>
                  <button @click="eliminarCategoria(categoria.id)" class="btn btn-danger">{{ t('admin.eliminar') }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Promociones -->
          <div v-if="tabActual === 'promociones'" class="tab-content">
            <div class="section-header">
              <h2>{{ t('admin.gestionPromociones') }}</h2>
              <button @click="abrirModalPromocion(null)" class="btn btn-primary">
                {{ t('admin.nuevaPromocion') }}
              </button>
            </div>

            <div v-if="loadingPromociones" class="loading">{{ t('admin.cargandoPromociones') }}</div>
            <div v-else class="promociones-grid">
              <div v-for="promo in promociones" :key="promo.id" class="promo-card-admin">
                <img :src="obtenerUrlPromocion(promo.imagen_url)" :alt="promo.nombre" class="promo-card-img" />
                <div class="promo-card-info">
                  <h3>{{ promo.nombre }}</h3>
                  <span class="promo-badge">{{ promo.temporada }}</span>
                  <div class="promo-card-actions">
                    <button @click="abrirModalPromocion(promo)" class="btn btn-secondary">{{ t('admin.editar') }}</button>
                    <button @click="eliminarPromocion(promo.id)" class="btn btn-danger">{{ t('admin.eliminar') }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Producto -->
    <div v-if="mostrarModalProducto" class="modal-overlay" @click="cerrarModalProducto">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ productoEditar ? t('admin.editarProducto') : t('admin.nuevoProductoModal') }}</h3>
          <button @click="cerrarModalProducto" class="btn-close">×</button>
        </div>
        <form @submit.prevent="guardarProducto" class="modal-body">
          <div class="form-group">
            <label>{{ t('admin.nombre') }} *</label>
            <input v-model="formProducto.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('admin.descripcion') }}</label>
            <textarea v-model="formProducto.descripcion" rows="4"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('admin.precio') }} *</label>
              <input v-model.number="formProducto.precio" type="number" step="0.01" required />
            </div>
            <div class="form-group">
              <label>{{ t('admin.material') }}</label>
              <input v-model="formProducto.material" type="text" />
            </div>
            <div class="form-group">
              <label>{{ t('admin.peso') }}</label>
              <input v-model="formProducto.peso" type="text" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('admin.categorias') }}</label>
            <select v-model.number="formProducto.categoria_id">
              <option :value="null">{{ t('admin.sinCategoria') }}</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input v-model="formProducto.publicado" type="checkbox" />
                {{ t('admin.publicado') }}
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input v-model="formProducto.destacado" type="checkbox" />
                {{ t('admin.destacado') }}
              </label>
            </div>
          </div>
          
          <!-- Gestión de Imágenes -->
          <div v-if="productoEditar" class="imagenes-section">
            <h4>{{ t('admin.imagenesProducto') }}</h4>
            <div class="imagenes-list">
              <div v-for="imagen in imagenesProducto" :key="imagen.id" class="imagen-item">
                <img :src="obtenerUrlImagen(imagen.url)" :alt="`Imagen ${imagen.id}`" />
                <div class="imagen-actions">
                  <button type="button" @click="marcarPrincipal(imagen.id)" 
                    :class="['btn-small', imagen.es_principal ? 'btn-primary' : 'btn-secondary']">
                    {{ imagen.es_principal ? t('admin.principal') : t('admin.marcarPrincipal') }}
                  </button>
                  <button type="button" @click="eliminarImagen(imagen.id)" class="btn-small btn-danger">
                    {{ t('admin.eliminar') }}
                  </button>
                </div>
              </div>
            </div>
            <div class="upload-section">
              <label class="btn btn-secondary">
                {{ t('admin.subirImagen') }}
                <input type="file" @change="subirImagen" accept="image/*" style="display: none" />
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="cerrarModalProducto" class="btn btn-secondary">{{ t('admin.cancelar') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              {{ guardando ? t('admin.guardando') : t('admin.guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Promoción -->
    <div v-if="mostrarModalPromocion" class="modal-overlay" @click="cerrarModalPromocion">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ promocionEditar ? t('admin.editarPromocion') : t('admin.nuevaPromocionModal') }}</h3>
          <button @click="cerrarModalPromocion" class="btn-close">×</button>
        </div>
        <form @submit.prevent="guardarPromocion" class="modal-body">
          <div class="form-group">
            <label>{{ t('admin.nombre') }} *</label>
            <input v-model="formPromocion.nombre" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('admin.temporada') }} *</label>
              <input v-model="formPromocion.temporada" type="text" required placeholder="Ej: Diciembre" />
            </div>
            <div class="form-group">
              <label>{{ t('admin.tema') }}</label>
              <select v-model="formPromocion.tema">
                <option value="navidad">{{ t('admin.temaNavidad') }}</option>
                <option value="madre">{{ t('admin.temaMadre') }}</option>
                <option value="cultural">{{ t('admin.temaCultural') }}</option>
                <option value="inti">{{ t('admin.temaInti') }}</option>
                <option value="general">{{ t('admin.temaGeneral') }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('admin.urlImagen') }}</label>
            <input v-model="formPromocion.imagen_url" type="text" placeholder="/imagenes/promo1.jpg" />
          </div>
          <div class="form-group">
            <label>{{ t('admin.orden') }}</label>
            <input v-model.number="formPromocion.orden" type="number" min="0" />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input v-model="formPromocion.activa" type="checkbox" />
              {{ t('admin.activa') }}
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" @click="cerrarModalPromocion" class="btn btn-secondary">{{ t('admin.cancelar') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              {{ guardando ? t('admin.guardando') : t('admin.guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Categoría -->
    <div v-if="mostrarModalCategoria" class="modal-overlay" @click="cerrarModalCategoria">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ categoriaEditar ? t('admin.editarCategoria') : t('admin.nuevaCategoriaModal') }}</h3>
          <button @click="cerrarModalCategoria" class="btn-close">×</button>
        </div>
        <form @submit.prevent="guardarCategoria" class="modal-body">
          <div class="form-group">
            <label>{{ t('admin.nombre') }} *</label>
            <input v-model="formCategoria.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('admin.descripcion') }}</label>
            <textarea v-model="formCategoria.descripcion" rows="4"></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input v-model="formCategoria.activa" type="checkbox" />
              {{ t('admin.activa') }}
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" @click="cerrarModalCategoria" class="btn btn-secondary">{{ t('admin.cancelar') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              {{ guardando ? t('admin.guardando') : t('admin.guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useLanguageStore } from '../stores/language'
import ThemeToggle from '../components/ThemeToggle.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

export default {
  name: 'AdminView',
  components: { ThemeToggle, LanguageSwitcher },
  setup() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const { t } = useLanguageStore()
    
    const isAuthenticated = ref(false)
    const usuario = ref(null)
    const token = ref(localStorage.getItem('admin_token'))
    const refreshToken = ref(localStorage.getItem('admin_refresh_token'))
    const loading = ref(false)
    const error = ref('')
    
    const tabActual = ref('productos')
    const productos = ref([])
    const categorias = ref([])
    const promociones = ref([])
    const loadingProductos = ref(false)
    const loadingCategorias = ref(false)
    const loadingPromociones = ref(false)
    
    const mostrarModalProducto = ref(false)
    const mostrarModalCategoria = ref(false)
    const mostrarModalPromocion = ref(false)
    const productoEditar = ref(null)
    const categoriaEditar = ref(null)
    const promocionEditar = ref(null)
    const imagenesProducto = ref([])
    const guardando = ref(false)
    
    const loginForm = reactive({
      usuario: '',
      password: ''
    })
    
    const formProducto = reactive({
      nombre: '',
      descripcion: '',
      precio: 0,
      material: '',
      peso: '',
      categoria_id: null,
      publicado: true,
      destacado: false
    })
    
    const formCategoria = reactive({
      nombre: '',
      descripcion: '',
      activa: true
    })

    const formPromocion = reactive({
      nombre: '',
      temporada: '',
      tema: 'general',
      imagen_url: '',
      orden: 0,
      activa: true
    })

    // Renovar token con refresh token
    const tryRefreshToken = async () => {
      if (!refreshToken.value) return false
      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refreshToken.value })
        token.value = response.data.token
        localStorage.setItem('admin_token', token.value)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        return true
      } catch {
        return false
      }
    }

    // Configurar axios con token y verificar sesión
    const configurarAxios = async () => {
      if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        try {
          const response = await axios.get(`${API_URL}/auth/me`)
          usuario.value = response.data.usuario
          isAuthenticated.value = true
          cargarDatos()
        } catch (err) {
          if (err.response?.status === 403 && await tryRefreshToken()) {
            try {
              const retry = await axios.get(`${API_URL}/auth/me`)
              usuario.value = retry.data.usuario
              isAuthenticated.value = true
              cargarDatos()
            } catch {
              logout()
            }
          } else {
            logout()
          }
        }
      }
    }

    const login = async () => {
      try {
        loading.value = true
        error.value = ''
        const response = await axios.post(`${API_URL}/auth/login`, loginForm)
        token.value = response.data.token
        usuario.value = response.data.usuario
        if (response.data.refreshToken) {
          refreshToken.value = response.data.refreshToken
          localStorage.setItem('admin_refresh_token', response.data.refreshToken)
        }
        localStorage.setItem('admin_token', token.value)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        isAuthenticated.value = true
        cargarDatos()
      } catch (err) {
        error.value = err.response?.data?.error || 'Error al iniciar sesión'
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      token.value = null
      refreshToken.value = null
      usuario.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
      delete axios.defaults.headers.common['Authorization']
      isAuthenticated.value = false
    }

    const cargarProductos = async () => {
      try {
        loadingProductos.value = true
        const response = await axios.get(`${API_URL}/productos`, {
          params: { incluir_ocultos: true }
        })
        productos.value = response.data
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        loadingProductos.value = false
      }
    }

    const cargarCategorias = async () => {
      try {
        loadingCategorias.value = true
        const response = await axios.get(`${API_URL}/categorias`, {
          params: { incluir_inactivas: true }
        })
        categorias.value = response.data
      } catch (error) {
        console.error('Error cargando categorías:', error)
      } finally {
        loadingCategorias.value = false
      }
    }

    const cargarPromociones = async () => {
      try {
        loadingPromociones.value = true
        const response = await axios.get(`${API_URL}/promociones`, {
          params: { incluir_inactivas: true }
        })
        promociones.value = response.data || []
      } catch (error) {
        console.error('Error cargando promociones:', error)
        promociones.value = []
      } finally {
        loadingPromociones.value = false
      }
    }

    const cargarDatos = () => {
      cargarProductos()
      cargarCategorias()
      cargarPromociones()
    }

    const abrirModalProducto = (producto) => {
      productoEditar.value = producto
      if (producto) {
        Object.assign(formProducto, {
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          precio: producto.precio,
          material: producto.material || '',
          peso: producto.peso || '',
          categoria_id: producto.categoria_id,
          publicado: producto.publicado,
          destacado: producto.destacado || false
        })
        imagenesProducto.value = producto.imagenes || []
      } else {
        Object.assign(formProducto, {
          nombre: '',
          descripcion: '',
          precio: 0,
          material: '',
          peso: '',
          categoria_id: null,
          publicado: true,
          destacado: false
        })
        imagenesProducto.value = []
      }
      mostrarModalProducto.value = true
    }

    const cerrarModalProducto = () => {
      mostrarModalProducto.value = false
      productoEditar.value = null
    }

    const guardarProducto = async () => {
      try {
        guardando.value = true
        if (productoEditar.value) {
          await axios.put(`${API_URL}/productos/${productoEditar.value.id}`, formProducto)
        } else {
          await axios.post(`${API_URL}/productos`, formProducto)
        }
        await cargarProductos()
        cerrarModalProducto()
      } catch (error) {
        console.error('Error guardando producto:', error)
        alert(t('admin.errorGuardarProducto'))
      } finally {
        guardando.value = false
      }
    }

    const eliminarProducto = async (id) => {
      if (!confirm(t('admin.confirmarEliminarProducto'))) return
      try {
        await axios.delete(`${API_URL}/productos/${id}`)
        await cargarProductos()
      } catch (error) {
        console.error('Error eliminando producto:', error)
        alert(t('admin.errorEliminarProducto'))
      }
    }

    const subirImagen = async (event) => {
      const file = event.target.files[0]
      if (!file || !productoEditar.value) return

      const formData = new FormData()
      formData.append('imagen', file)
      formData.append('producto_id', productoEditar.value.id)
      formData.append('es_principal', imagenesProducto.value.length === 0 ? 'true' : 'false')

      try {
        const response = await axios.post(`${API_URL}/imagenes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        imagenesProducto.value.push(response.data)
        await cargarProductos()
      } catch (error) {
        console.error('Error subiendo imagen:', error)
        alert(t('admin.errorSubirImagen'))
      }
    }

    const eliminarImagen = async (id) => {
      if (!confirm(t('admin.confirmarEliminarImagen'))) return
      try {
        await axios.delete(`${API_URL}/imagenes/${id}`)
        imagenesProducto.value = imagenesProducto.value.filter(img => img.id !== id)
        await cargarProductos()
      } catch (error) {
        console.error('Error eliminando imagen:', error)
        alert(t('admin.errorEliminarImagen'))
      }
    }

    const marcarPrincipal = async (id) => {
      try {
        await axios.put(`${API_URL}/imagenes/${id}`, { es_principal: true })
        await cargarProductos()
        const producto = productos.value.find(p => p.id === productoEditar.value.id)
        if (producto) {
          imagenesProducto.value = producto.imagenes || []
        }
      } catch (error) {
        console.error('Error marcando imagen principal:', error)
        alert(t('admin.errorMarcarPrincipal'))
      }
    }

    const abrirModalCategoria = (categoria) => {
      categoriaEditar.value = categoria
      if (categoria) {
        Object.assign(formCategoria, {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          activa: categoria.activa
        })
      } else {
        Object.assign(formCategoria, {
          nombre: '',
          descripcion: '',
          activa: true
        })
      }
      mostrarModalCategoria.value = true
    }

    const cerrarModalCategoria = () => {
      mostrarModalCategoria.value = false
      categoriaEditar.value = null
    }

    const guardarCategoria = async () => {
      try {
        guardando.value = true
        if (categoriaEditar.value) {
          await axios.put(`${API_URL}/categorias/${categoriaEditar.value.id}`, formCategoria)
        } else {
          await axios.post(`${API_URL}/categorias`, formCategoria)
        }
        await cargarCategorias()
        cerrarModalCategoria()
      } catch (error) {
        console.error('Error guardando categoría:', error)
        alert(t('admin.errorGuardarCategoria'))
      } finally {
        guardando.value = false
      }
    }

    const eliminarCategoria = async (id) => {
      if (!confirm(t('admin.confirmarEliminarCategoria'))) return
      try {
        await axios.delete(`${API_URL}/categorias/${id}`)
        await cargarCategorias()
      } catch (error) {
        console.error('Error eliminando categoría:', error)
        alert(t('admin.errorEliminarCategoria'))
      }
    }

    const abrirModalPromocion = (promo) => {
      promocionEditar.value = promo
      if (promo) {
        Object.assign(formPromocion, {
          nombre: promo.nombre,
          temporada: promo.temporada,
          tema: promo.tema || 'general',
          imagen_url: promo.imagen_url || '',
          orden: promo.orden ?? 0,
          activa: promo.activa ?? true
        })
      } else {
        Object.assign(formPromocion, {
          nombre: '',
          temporada: '',
          tema: 'general',
          imagen_url: '',
          orden: 0,
          activa: true
        })
      }
      mostrarModalPromocion.value = true
    }

    const cerrarModalPromocion = () => {
      mostrarModalPromocion.value = false
      promocionEditar.value = null
    }

    const guardarPromocion = async () => {
      try {
        guardando.value = true
        if (promocionEditar.value) {
          await axios.put(`${API_URL}/promociones/${promocionEditar.value.id}`, formPromocion)
        } else {
          await axios.post(`${API_URL}/promociones`, formPromocion)
        }
        await cargarPromociones()
        cerrarModalPromocion()
      } catch (error) {
        console.error('Error guardando promoción:', error)
        alert(t('admin.errorGuardarPromocion'))
      } finally {
        guardando.value = false
      }
    }

    const eliminarPromocion = async (id) => {
      if (!confirm(t('admin.confirmarEliminarPromocion'))) return
      try {
        await axios.delete(`${API_URL}/promociones/${id}`)
        await cargarPromociones()
      } catch (error) {
        console.error('Error eliminando promoción:', error)
        alert(t('admin.errorEliminarPromocion'))
      }
    }

    const obtenerUrlPromocion = (url) => {
      if (!url) return '/imagenes/logo-principal.jpg'
      if (url.startsWith('http')) return url
      return `${API_URL.replace('/api', '')}${url}`
    }

    const obtenerImagenPrincipal = (producto) => {
      if (producto.imagenes && producto.imagenes.length > 0) {
        const principal = producto.imagenes.find(img => img.es_principal)
        if (principal) {
          return `${API_URL.replace('/api', '')}${principal.url}`
        }
        return `${API_URL.replace('/api', '')}${producto.imagenes[0].url}`
      }
      return '/imagenes/logo-principal.jpg'
    }

    const obtenerUrlImagen = (url) => {
      if (url.startsWith('http')) return url
      return `${API_URL.replace('/api', '')}${url}`
    }

    onMounted(() => {
      configurarAxios()
    })

    return {
      t,
      isAuthenticated,
      usuario,
      loading,
      error,
      loginForm,
      login,
      logout,
      tabActual,
      productos,
      categorias,
      loadingProductos,
      loadingCategorias,
      mostrarModalProducto,
      mostrarModalCategoria,
      productoEditar,
      categoriaEditar,
      imagenesProducto,
      guardando,
      formProducto,
      formCategoria,
      abrirModalProducto,
      cerrarModalProducto,
      guardarProducto,
      eliminarProducto,
      subirImagen,
      eliminarImagen,
      marcarPrincipal,
      abrirModalCategoria,
      cerrarModalCategoria,
      guardarCategoria,
      eliminarCategoria,
      promociones,
      loadingPromociones,
      mostrarModalPromocion,
      promocionEditar,
      formPromocion,
      abrirModalPromocion,
      cerrarModalPromocion,
      guardarPromocion,
      eliminarPromocion,
      obtenerUrlPromocion,
      obtenerImagenPrincipal,
      obtenerUrlImagen
    }
  }
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
}

/* Login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-warm) 100%);
}

.login-card {
  background: var(--color-surface);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light);
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
}

/* Admin Panel */
.admin-header {
  background: var(--color-primary);
  color: white;
  padding: 1.5rem 0;
}

.admin-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  color: white;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.admin-content {
  padding: 2rem 0;
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-gray-light);
}

.tab-btn {
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-light);
  transition: all 0.3s;
}

.tab-btn:hover,
.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: var(--color-text);
}

/* Tablas */
.productos-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: var(--color-primary);
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid var(--color-gray-light);
}

tbody tr:hover {
  background: var(--color-surface-hover);
}

.table-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  margin: 0 0.25rem;
}

.btn-icon:hover {
  opacity: 0.7;
}

.btn-danger {
  color: #dc3545;
}

/* Categorías Grid */
.categorias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.categoria-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.categoria-card h3 {
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.categoria-card p {
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.categoria-actions {
  display: flex;
  gap: 0.5rem;
}

/* Promociones Grid */
.promociones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.promo-card-admin {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.promo-card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.promo-card-info {
  padding: 1rem;
}

.promo-card-info h3 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
  color: var(--color-text);
}

.promo-card-info .promo-badge {
  display: inline-block;
  background: var(--color-secondary);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}

.promo-card-actions {
  display: flex;
  gap: 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--color-surface);
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.modal-header h3 {
  color: var(--color-text);
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.imagenes-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-light);
}

.imagenes-section h4 {
  color: var(--color-text);
}

.imagenes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.imagen-item {
  position: relative;
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
  overflow: hidden;
}

.imagen-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.imagen-actions {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.upload-section {
  margin-top: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .admin-header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .admin-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
