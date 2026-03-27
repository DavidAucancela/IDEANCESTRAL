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
          <div class="nav-right">
            <ul class="nav-links">
              <li><router-link to="/">{{ t('nav.catalogo') }}</router-link></li>
            </ul>
            <ThemeToggle />
            <LanguageSwitcher />
            <button class="cart-toggle" @click="toggleCarrito" :title="t('cart.miCarrito')" :class="{ 'cart-bounce': cartBouncing }">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span v-if="carritoCount > 0" class="cart-badge">{{ carritoCount }}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>{{ t('product.cargando') }}</p>
    </div>

    <!-- Producto -->
    <div v-else-if="producto" class="detalle-container">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">{{ t('nav.inicio') }}</router-link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span v-if="producto.categoria_nombre">{{ producto.categoria_nombre }}</span>
          <svg v-if="producto.categoria_nombre" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="current">{{ producto.nombre }}</span>
        </div>

        <div class="detalle-grid">
          <!-- Galería -->
          <div class="galeria">
            <!-- Imagen principal con zoom -->
            <div
              class="galeria-principal"
              ref="galeriaRef"
              @mouseenter="zoomActivo = true"
              @mouseleave="zoomActivo = false"
              @mousemove="actualizarZoom"
            >
              <img
                :src="imagenActual"
                :alt="producto.nombre"
                @error="handleImageError"
                :style="imagenZoomStyle"
              />
              <div v-if="producto.destacado" class="badge-destacado">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ t('product.destacado') }}
              </div>
              <!-- Botón lightbox -->
              <button class="lightbox-btn" @click="abrirLightbox(indexImagenActual)" title="Ampliar imagen">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </button>
              <!-- Hint zoom -->
              <div class="zoom-hint" :class="{ hidden: zoomActivo }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
                Pasa el cursor para ampliar
              </div>
            </div>

            <!-- Thumbs scrollables -->
            <div v-if="imagenes.length > 1" class="galeria-thumbs-wrap">
              <button class="thumb-nav" @click="scrollThumbs(-1)" aria-label="Anterior">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div class="galeria-thumbs" ref="thumbsRef">
                <button
                  v-for="(imagen, index) in imagenes"
                  :key="imagen.id"
                  @click="cambiarImagen(index)"
                  :class="['thumb', { active: indexImagenActual === index }]"
                >
                  <img :src="obtenerUrlImagen(imagen.url)" :alt="`Vista ${index + 1}`" />
                </button>
              </div>
              <button class="thumb-nav" @click="scrollThumbs(1)" aria-label="Siguiente">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
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

            <!-- Indicador de stock -->
            <div v-if="stockStatus" class="info-stock">
              <span :class="['stock-badge', `stock-${stockStatus.clase}`]">
                <span class="stock-dot"></span>
                {{ stockStatus.texto }}
              </span>
              <span class="stock-sub">{{ stockStatus.sub }}</span>
            </div>

            <div class="info-descripcion">
              <p>{{ producto.descripcion || t('product.descripcionDefault') }}</p>
            </div>

            <div class="info-specs">
              <div v-if="producto.material" class="spec-row">
                <span class="spec-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  {{ t('product.material') }}
                </span>
                <span class="spec-value">{{ producto.material }}</span>
              </div>
              <div v-if="producto.peso" class="spec-row">
                <span class="spec-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 00-1.905 2.596l3 9A2 2 0 009.5 21h5a2 2 0 001.905-1.404l3-9A2 2 0 0017.5 8z"/></svg>
                  {{ t('product.peso') }}
                </span>
                <span class="spec-value">{{ producto.peso }}</span>
              </div>
              <div v-if="producto.categoria_nombre" class="spec-row">
                <span class="spec-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  {{ t('product.categoria') }}
                </span>
                <span class="spec-value">{{ producto.categoria_nombre }}</span>
              </div>
              <!-- Hecho a mano badge -->
              <div class="spec-row spec-handmade">
                <span class="spec-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8M6 14v0a4 4 0 004 4h4a4 4 0 004-4v-3"/></svg>
                  Elaboración
                </span>
                <span class="spec-value handmade-tag">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Hecho a mano
                </span>
              </div>
            </div>

            <!-- Botón Agregar al carrito -->
            <div class="info-actions">
              <button class="btn btn-primary btn-full btn-agregar" @click="handleAgregarAlCarrito">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                {{ productoEnCarrito ? t('cart.agregado') : t('cart.agregar') }}
              </button>
              <router-link to="/" class="btn btn-secondary btn-full">
                {{ t('product.seguirExplorando') }}
              </router-link>
            </div>

            <!-- Compartir -->
            <div class="info-share">
              <span class="share-label">Compartir:</span>
              <button class="share-btn" @click="copiarLink" title="Copiar link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Copiar link
              </button>
              <a :href="compartirWhatsApp" target="_blank" class="share-btn share-btn-wa" title="Compartir por WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Proceso artesanal -->
        <div class="proceso-section">
          <div class="proceso-header">
            <span class="proceso-eyebrow">Nuestro proceso</span>
            <h2 class="proceso-titulo">Hecho a mano con tradición</h2>
            <p class="proceso-desc">Cada pieza es única y refleja siglos de tradición artesanal ecuatoriana</p>
          </div>
          <div class="proceso-steps">
            <div class="proceso-step">
              <div class="step-num">01</div>
              <div class="step-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h4>Selección de materiales</h4>
              <p>Elegimos los mejores materiales naturales de la región andina con criterio sostenible.</p>
            </div>
            <div class="proceso-step">
              <div class="step-num">02</div>
              <div class="step-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </div>
              <h4>Diseño tradicional</h4>
              <p>Cada diseño rescata patrones y símbolos de la cultura ecuatoriana ancestral.</p>
            </div>
            <div class="proceso-step">
              <div class="step-num">03</div>
              <div class="step-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8M6 14v0a4 4 0 004 4h4a4 4 0 004-4v-3"/></svg>
              </div>
              <h4>Elaboración artesanal</h4>
              <p>Nuestros artesanos trabajan con técnicas transmitidas por generaciones de maestros.</p>
            </div>
            <div class="proceso-step">
              <div class="step-num">04</div>
              <div class="step-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h4>Acabado y calidad</h4>
              <p>Revisamos cada detalle para garantizar que cada pieza cumpla nuestros estándares.</p>
            </div>
          </div>
        </div>

        <!-- Relacionados -->
        <div v-if="productosRelacionados.length > 0" class="relacionados">
          <div class="section-header">
            <h2>{{ t('product.relacionados') }}</h2>
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
                <span class="rel-cat">{{ prod.categoria_nombre || t('product.artesania') }}</span>
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
      <p>{{ t('product.noEncontrado') }}</p>
      <router-link to="/" class="btn btn-primary">{{ t('product.volverCatalogo') }}</router-link>
    </div>

    <!-- Lightbox -->
    <LightboxModal
      :visible="lightboxVisible"
      :images="imagenesUrls"
      :startIndex="lightboxIndex"
      @close="lightboxVisible = false"
    />

    <!-- Carrito Sidebar -->
    <div class="carrito-overlay" :class="{ visible: carritoAbierto }" @click="toggleCarrito"></div>
    <aside class="carrito-sidebar" :class="{ open: carritoAbierto }">
      <div class="carrito-header">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          {{ t('cart.miCarrito') }}
          <span v-if="carritoCount > 0" class="carrito-count">({{ carritoCount }})</span>
        </h3>
        <button class="carrito-close" @click="toggleCarrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div v-if="carrito.length === 0" class="carrito-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <p>{{ t('cart.vacio') }}</p>
        <span>{{ t('cart.agrega') }}</span>
      </div>
      <div v-else class="carrito-body">
        <div class="carrito-items">
          <div v-for="item in carrito" :key="item.id" class="carrito-item">
            <img :src="item.imagen" :alt="item.nombre" class="carrito-item-img" @error="handleImageError" />
            <div class="carrito-item-info">
              <h4>{{ item.nombre }}</h4>
              <span class="carrito-item-precio">${{ item.precio.toFixed(2) }}</span>
              <div class="carrito-item-qty">
                <button @click="actualizarCantidad(item.id, item.cantidad - 1)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span>{{ item.cantidad }}</span>
                <button @click="actualizarCantidad(item.id, item.cantidad + 1)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
            <button class="carrito-item-remove" @click="quitarDelCarrito(item.id)" :title="t('cart.quitar')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
        <div class="carrito-footer">
          <div class="carrito-total">
            <span>{{ t('cart.total') }}</span>
            <strong>${{ carritoTotal.toFixed(2) }}</strong>
          </div>
          <button class="btn btn-whatsapp carrito-btn-pedido" @click="enviarPedidoWhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ t('cart.enviarWhatsApp') }}
          </button>
          <button class="btn btn-secondary carrito-btn-vaciar" @click="vaciarCarrito">
            {{ t('cart.vaciar') }}
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCarrito } from '../composables/useCarrito'
import { useToast } from '../composables/useToast'
import { useLanguageStore } from '../stores/language'
import ThemeToggle from '../components/ThemeToggle.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import LightboxModal from '../components/LightboxModal.vue'

export default {
  name: 'ProductoDetalleView',
  components: { ThemeToggle, LanguageSwitcher, LightboxModal },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const producto = ref(null)
    const productosRelacionados = ref([])
    const loading = ref(true)
    const indexImagenActual = ref(0)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const { t } = useLanguageStore()

    // Carrito
    const {
      carrito, carritoAbierto, carritoCount, carritoTotal,
      agregarAlCarrito, quitarDelCarrito, actualizarCantidad,
      vaciarCarrito, toggleCarrito, enviarPedidoWhatsApp
    } = useCarrito()
    const { success: toastSuccess } = useToast()

    const productoEnCarrito = computed(() => {
      if (!producto.value) return false
      return carrito.value.some(item => item.id === producto.value.id)
    })

    const handleAgregarAlCarrito = () => {
      if (!producto.value) return
      agregarAlCarrito({
        id: producto.value.id,
        nombre: producto.value.nombre,
        precio: producto.value.precio,
        imagen: imagenActual.value
      })
      toastSuccess(t('toast.productoAgregado'))
    }

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

    // ── Zoom ──────────────────────────────────────────────
    const galeriaRef = ref(null)
    const zoomActivo = ref(false)
    const zoomPos = ref({ x: 50, y: 50 })

    const actualizarZoom = (e) => {
      if (!galeriaRef.value) return
      const rect = galeriaRef.value.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
      zoomPos.value = { x, y }
    }

    const imagenZoomStyle = computed(() => {
      if (!zoomActivo.value) return { transition: 'transform 0.3s ease' }
      return {
        transform: 'scale(2.2)',
        transformOrigin: `${zoomPos.value.x}% ${zoomPos.value.y}%`,
        transition: 'transform-origin 0.05s ease',
        cursor: 'crosshair'
      }
    })

    // ── Thumbnails scroll ─────────────────────────────────
    const thumbsRef = ref(null)

    const scrollThumbs = (dir) => {
      if (!thumbsRef.value) return
      thumbsRef.value.scrollBy({ left: dir * 180, behavior: 'smooth' })
    }

    const cambiarImagen = (index) => {
      indexImagenActual.value = index
      // auto-scroll thumb into view
      if (thumbsRef.value) {
        const thumb = thumbsRef.value.children[index]
        if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
      }
    }

    // ── Stock ─────────────────────────────────────────────
    const stockStatus = computed(() => {
      const s = producto.value?.stock
      if (s === undefined || s === null) return null
      if (s === 0) return { clase: 'agotado', texto: 'Agotado', sub: 'Este producto no está disponible' }
      if (s <= 3) return { clase: 'critico', texto: `Solo ${s} disponible${s > 1 ? 's' : ''}`, sub: '¡Date prisa!' }
      if (s <= 8) return { clase: 'bajo', texto: `Últimas ${s} unidades`, sub: 'Stock limitado' }
      return { clase: 'disponible', texto: 'En stock', sub: 'Listo para envío' }
    })

    // ── API ───────────────────────────────────────────────
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
          const prods = resp.data.productos || resp.data
          productosRelacionados.value = (Array.isArray(prods) ? prods : [])
            .filter(p => p.id !== producto.value.id)
            .slice(0, 4)
        } else {
          productosRelacionados.value = []
        }

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

    const handleImageError = (event) => {
      event.target.src = '/imagenes/logo-principal.jpg'
    }

    // ── Lightbox ──────────────────────────────────────────
    const lightboxVisible = ref(false)
    const lightboxIndex = ref(0)
    const imagenesUrls = computed(() => imagenes.value.map(img => obtenerUrlImagen(img.url)))

    const abrirLightbox = (index) => {
      lightboxIndex.value = index
      lightboxVisible.value = true
    }

    // ── Share ─────────────────────────────────────────────
    const compartirWhatsApp = computed(() => {
      if (!producto.value) return '#'
      const url = window.location.href
      const msg = `¡Mira este producto de Ideancestral! *${producto.value.nombre}* - $${Number(producto.value.precio).toFixed(2)}\n${url}`
      return `https://wa.me/?text=${encodeURIComponent(msg)}`
    })

    const copiarLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toastSuccess('¡Link copiado al portapapeles!')
      } catch {
        toastSuccess('¡Link copiado!')
      }
    }

    watch(() => route.params.id, (newId) => {
      if (newId) obtenerProducto(newId)
    })

    const cartBouncing = ref(false)
    const handleCartAdded = () => {
      cartBouncing.value = true
      setTimeout(() => { cartBouncing.value = false }, 600)
    }

    onMounted(() => {
      obtenerProducto(route.params.id)
      window.addEventListener('cart-item-added', handleCartAdded)
    })

    onUnmounted(() => {
      window.removeEventListener('cart-item-added', handleCartAdded)
    })

    return {
      t,
      producto,
      productosRelacionados,
      loading,
      imagenes,
      imagenActual,
      indexImagenActual,
      cambiarImagen,
      obtenerUrlImagen,
      obtenerImagenPrincipal,
      handleImageError,
      // Zoom
      galeriaRef,
      zoomActivo,
      actualizarZoom,
      imagenZoomStyle,
      // Thumbs
      thumbsRef,
      scrollThumbs,
      // Stock
      stockStatus,
      // Carrito
      carrito,
      carritoAbierto,
      carritoCount,
      carritoTotal,
      productoEnCarrito,
      handleAgregarAlCarrito,
      quitarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      toggleCarrito,
      enviarPedidoWhatsApp,
      // Lightbox
      lightboxVisible,
      lightboxIndex,
      imagenesUrls,
      abrirLightbox,
      // Share
      compartirWhatsApp,
      copiarLink,
      cartBouncing
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
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: var(--color-header-bg-scrolled);
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
  width: 28px; height: 28px; background: var(--color-primary);
  color: var(--color-white); border-radius: 6px;
  font-family: var(--font-serif); font-weight: 700; font-size: 12px;
}
.logo-text {
  font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--color-primary);
}
.nav-right { display: flex; align-items: center; gap: 0.75rem; }
.nav-links { display: flex; list-style: none; gap: 1rem; }
.nav-links a {
  font-size: 0.9rem; font-weight: 500; color: var(--color-text);
  padding: 0.5rem 1rem; border-radius: var(--radius-sm); transition: var(--transition);
}
.nav-links a:hover { color: var(--color-primary); background: var(--color-bg-warm); }

.cart-toggle {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; background: none;
  border: 1.5px solid var(--color-gray-light); border-radius: 50%;
  cursor: pointer; color: var(--color-text); transition: var(--transition);
}
.cart-toggle:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-bg-warm); }
.cart-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px; background: var(--color-secondary);
  color: var(--color-white); font-size: 0.7rem; font-weight: 700;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}

/* States */
.state-container { text-align: center; padding: 6rem 20px; color: var(--color-text-muted); }
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
  padding: 1.5rem 0; font-size: 0.9rem; color: var(--color-text-muted); flex-wrap: wrap;
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

/* ── Galería ──────────────────────────────────────────── */
.galeria { position: sticky; top: 85px; height: fit-content; }

.galeria-principal {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background-color: var(--color-gray-light);
  margin-bottom: 1rem;
  cursor: crosshair;
}

.galeria-principal img {
  width: 100%; height: 100%; object-fit: cover;
  transform-origin: center center;
  will-change: transform;
  pointer-events: none;
  user-select: none;
}

/* Botón lightbox */
.lightbox-btn {
  position: absolute; bottom: 14px; right: 14px;
  width: 38px; height: 38px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0;
  transition: opacity 0.25s ease, background 0.2s;
  z-index: 2;
}
.galeria-principal:hover .lightbox-btn { opacity: 1; }
.lightbox-btn:hover { background: rgba(0, 0, 0, 0.8); }

/* Zoom hint */
.zoom-hint {
  position: absolute; bottom: 14px; left: 14px;
  display: flex; align-items: center; gap: 6px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff; font-size: 0.72rem; padding: 5px 10px;
  border-radius: 20px; pointer-events: none;
  transition: opacity 0.3s; z-index: 2;
}
.zoom-hint.hidden { opacity: 0; }

.badge-destacado {
  position: absolute; top: 16px; left: 16px;
  background: linear-gradient(135deg, #D4A76A, #C4853A);
  color: white; padding: 0.4rem 1rem; border-radius: 100px;
  font-size: 0.8rem; font-weight: 600;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 2;
}

/* ── Thumbs scrollables ───────────────────────────────── */
.galeria-thumbs-wrap {
  display: flex; align-items: center; gap: 0.5rem;
}

.thumb-nav {
  flex-shrink: 0;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-surface);
  border: 1.5px solid var(--color-gray-light);
  border-radius: 50%; cursor: pointer; color: var(--color-text);
  transition: var(--transition);
}
.thumb-nav:hover { border-color: var(--color-primary); color: var(--color-primary); }

.galeria-thumbs {
  display: flex; gap: 0.5rem;
  overflow-x: auto; flex: 1;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0;
}
.galeria-thumbs::-webkit-scrollbar { display: none; }

.thumb {
  flex-shrink: 0;
  width: 72px; height: 72px; border-radius: var(--radius-sm);
  overflow: hidden; cursor: pointer; padding: 0;
  border: 2.5px solid transparent; transition: var(--transition);
  background: var(--color-gray-light);
}
.thumb:hover, .thumb.active { border-color: var(--color-primary); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }

/* ── Info ─────────────────────────────────────────────── */
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
  margin-bottom: 1rem; padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.precio-valor {
  font-size: 2.25rem; font-weight: 700; color: var(--color-primary);
}

/* ── Stock badge ──────────────────────────────────────── */
.info-stock {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.stock-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0.35rem 0.85rem; border-radius: 100px;
  font-size: 0.82rem; font-weight: 600; letter-spacing: 0.3px;
}

.stock-dot {
  width: 8px; height: 8px; border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.stock-disponible {
  background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0;
}
.stock-disponible .stock-dot { background: #10B981; }

.stock-bajo {
  background: #FFFBEB; color: #92400E; border: 1px solid #FCD34D;
}
.stock-bajo .stock-dot { background: #F59E0B; }

.stock-critico {
  background: #FFF7ED; color: #9A3412; border: 1px solid #FDBA74;
}
.stock-critico .stock-dot { background: #F97316; }

.stock-agotado {
  background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA;
}
.stock-agotado .stock-dot { background: #EF4444; animation: none; }

.stock-sub {
  font-size: 0.8rem; color: var(--color-text-muted);
}

/* ── Descripcion y specs ──────────────────────────────── */
.info-descripcion { margin-bottom: 2rem; }
.info-descripcion p { font-size: 1.05rem; line-height: 1.9; color: var(--color-text-light); }

.info-specs {
  margin-bottom: 2.5rem;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.spec-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-light);
}
.spec-row:last-child { border-bottom: none; }

.spec-label {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.9rem; color: var(--color-text-muted); font-weight: 500;
}

.spec-value {
  font-size: 0.95rem; color: var(--color-text); font-weight: 600;
}

.spec-handmade { background: var(--color-bg-warm); }

.handmade-tag {
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--color-secondary);
  font-size: 0.88rem;
}

.info-actions { display: flex; flex-direction: column; gap: 0.75rem; }
.btn-full { width: 100%; justify-content: center; }

.btn-agregar {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 1rem; font-size: 1rem; font-weight: 600;
  transition: var(--transition);
}

/* ── Share ────────────────────────────────────────────── */
.info-share {
  display: flex; align-items: center; gap: 0.75rem;
  margin-top: 1.5rem; padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light); flex-wrap: wrap;
}
.share-label { font-size: 0.85rem; color: var(--color-text-muted); }
.share-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.9rem; border-radius: 50px;
  font-size: 0.8rem; font-weight: 500;
  background: var(--color-surface); border: 1.5px solid var(--color-gray-light);
  color: var(--color-text); cursor: pointer; transition: var(--transition); text-decoration: none;
}
.share-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.share-btn-wa { background: #25D366; border-color: #25D366; color: #fff; }
.share-btn-wa:hover { background: #1DA851; border-color: #1DA851; color: #fff; }

/* ── Proceso artesanal ────────────────────────────────── */
.proceso-section {
  margin-top: 5rem; padding: 4rem 0;
  border-top: 1px solid var(--color-gray-light);
  border-bottom: 1px solid var(--color-gray-light);
}

.proceso-header { text-align: center; margin-bottom: 3.5rem; }

.proceso-eyebrow {
  display: inline-block;
  font-size: 0.78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2.5px;
  color: var(--color-secondary); margin-bottom: 0.75rem;
}

.proceso-titulo {
  font-size: 2rem; color: var(--color-text); margin-bottom: 0.75rem;
}

.proceso-desc {
  font-size: 1rem; color: var(--color-text-muted); max-width: 520px; margin: 0 auto;
  line-height: 1.7;
}

.proceso-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
}

/* Línea conectora entre pasos */
.proceso-steps::before {
  content: '';
  position: absolute;
  top: 44px;
  left: calc(12.5% + 20px);
  right: calc(12.5% + 20px);
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-secondary), var(--color-accent));
  opacity: 0.4;
  pointer-events: none;
}

.proceso-step {
  text-align: center; padding: 0 0.5rem;
  position: relative;
}

.step-num {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px;
  color: var(--color-secondary); margin-bottom: 0.5rem;
  font-family: var(--font-sans);
}

.step-icon-wrap {
  width: 72px; height: 72px; margin: 0 auto 1.25rem;
  background: var(--color-bg-warm);
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary);
  transition: var(--transition);
  position: relative; z-index: 1;
}

.proceso-step:hover .step-icon-wrap {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(123, 63, 0, 0.25);
}

.proceso-step h4 {
  font-size: 1rem; font-weight: 700; color: var(--color-text);
  margin-bottom: 0.6rem;
}

.proceso-step p {
  font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.65;
}

/* ── Relacionados ─────────────────────────────────────── */
.relacionados { margin-top: 4rem; padding-top: 3rem; }

.section-header { text-align: center; margin-bottom: 2.5rem; }
.section-header h2 { font-size: 1.8rem; color: var(--color-text); }

.relacionados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.rel-card {
  background: var(--color-surface); border-radius: var(--radius-md);
  overflow: hidden; box-shadow: var(--shadow-sm); transition: var(--transition);
}
.rel-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.rel-image { width: 100%; height: 200px; overflow: hidden; background-color: var(--color-gray-light); }
.rel-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.rel-card:hover .rel-image img { transform: scale(1.06); }

.rel-info { padding: 1rem 1.25rem; }
.rel-cat { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--color-secondary); }
.rel-info h4 { font-size: 1rem; margin: 0.3rem 0 0.5rem; color: var(--color-text); font-weight: 600; }
.rel-precio { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); }

/* ── Carrito Sidebar ──────────────────────────────────── */
.carrito-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  z-index: 1100; opacity: 0; visibility: hidden; transition: all 0.3s ease;
}
.carrito-overlay.visible { opacity: 1; visibility: visible; }

.carrito-sidebar {
  position: fixed; top: 0; right: 0; width: 400px; max-width: 90vw;
  height: 100vh; background: var(--color-surface); z-index: 1200;
  display: flex; flex-direction: column;
  box-shadow: -4px 0 30px rgba(0,0,0,0.15);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.carrito-sidebar.open { transform: translateX(0); }

.carrito-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-gray-light);
}
.carrito-header h3 { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; color: var(--color-text); margin: 0; }
.carrito-count { font-weight: 400; color: var(--color-text-muted); font-size: 0.9rem; }

.carrito-close {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; background: none; border: none;
  color: var(--color-text-muted); cursor: pointer; border-radius: 50%; transition: var(--transition);
}
.carrito-close:hover { background: var(--color-bg); color: var(--color-text); }

.carrito-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 0.75rem;
  color: var(--color-text-muted); padding: 2rem;
}
.carrito-empty p { font-size: 1.05rem; font-weight: 600; color: var(--color-text-light); margin: 0; }
.carrito-empty span { font-size: 0.9rem; }

.carrito-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.carrito-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }

.carrito-item {
  display: flex; gap: 1rem; align-items: center;
  padding: 1rem 0; border-bottom: 1px solid var(--color-gray-light);
}
.carrito-item:last-child { border-bottom: none; }

.carrito-item-img { width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.carrito-item-info { flex: 1; min-width: 0; }
.carrito-item-info h4 { font-size: 0.9rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.carrito-item-precio { font-size: 0.85rem; color: var(--color-primary); font-weight: 600; }

.carrito-item-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; }
.carrito-item-qty button {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: 1.5px solid var(--color-gray-light);
  background: var(--color-surface); border-radius: 50%; cursor: pointer;
  color: var(--color-text); transition: var(--transition);
}
.carrito-item-qty button:hover { border-color: var(--color-primary); color: var(--color-primary); }
.carrito-item-qty span { font-weight: 600; font-size: 0.9rem; min-width: 20px; text-align: center; }

.carrito-item-remove {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; background: none; border: none;
  color: var(--color-text-muted); cursor: pointer; border-radius: 50%;
  flex-shrink: 0; transition: var(--transition);
}
.carrito-item-remove:hover { background: #FEE; color: #C0392B; }

.carrito-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--color-gray-light); background: var(--color-bg); }
.carrito-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 1.1rem; }
.carrito-total span { color: var(--color-text-light); }
.carrito-total strong { font-size: 1.4rem; color: var(--color-primary); }

.carrito-btn-pedido { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0.85rem; font-size: 0.95rem; }
.carrito-btn-vaciar { width: 100%; margin-top: 0.5rem; padding: 0.6rem; font-size: 0.85rem; }

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1024px) {
  .proceso-steps { grid-template-columns: repeat(2, 1fr); }
  .proceso-steps::before { display: none; }
}

@media (max-width: 968px) {
  .detalle-grid { grid-template-columns: 1fr; }
  .galeria { position: static; }
  .info-titulo { font-size: 2rem; }
}

@media (max-width: 768px) {
  .relacionados-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .carrito-sidebar { width: 100%; max-width: 100vw; }
  .nav-right { gap: 0.5rem; }
  .proceso-titulo { font-size: 1.6rem; }
}

@media (max-width: 480px) {
  .info-titulo { font-size: 1.6rem; }
  .precio-valor { font-size: 1.8rem; }
  .relacionados-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .proceso-steps { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
}

/* ── Cart bounce ──────────────────────────────────────── */
@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
}
.cart-bounce { animation: cartBounce 0.5s ease; }
</style>
