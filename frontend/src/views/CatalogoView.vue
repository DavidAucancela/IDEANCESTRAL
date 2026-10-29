<template>
  <div class="catalogo-view">
    <HeroSection :categorias="heroCategorias" />
    <DestacadosSection />
    <CategoriasSection :categorias="categorias" :cargando="cargandoCategorias" />
    <PromocionesSection />
    <NosotrosSection />
  </div>
</template>

<script setup>
// Portada: cada sección vive en components/inicio/ (ver docs/REDISENO_INICIO.md).
// Aquí solo se cargan las categorías, que usan el buscador del hero y la sección Categorías.
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import HeroSection from '../components/inicio/HeroSection.vue'
import DestacadosSection from '../components/inicio/DestacadosSection.vue'
import CategoriasSection from '../components/inicio/CategoriasSection.vue'
import PromocionesSection from '../components/inicio/PromocionesSection.vue'
import NosotrosSection from '../components/inicio/NosotrosSection.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const categorias = ref([])
const cargandoCategorias = ref(true)

const cargarCategorias = async () => {
  try {
    const res = await axios.get(`${API_URL}/categorias`)
    categorias.value = res.data || []
  } catch {
    categorias.value = []
  } finally {
    cargandoCategorias.value = false
  }
}

// Categorías sugeridas bajo el buscador del inicio: las que tienen más productos
const heroCategorias = computed(() =>
  categorias.value
    .filter((c) => c.total_productos > 0)
    .sort((a, b) => b.total_productos - a.total_productos)
    .slice(0, 4)
    .map((c) => ({ id: c.id, nombre: c.nombre }))
)

// Animación de entrada de los títulos de sección (data-animate)
useScrollAnimation()

onMounted(cargarCategorias)
</script>

<style scoped>
.catalogo-view {
  min-height: 100vh;
  overflow-x: clip;
}
</style>
