<template>
  <section
    id="inicio"
    ref="seccion"
    class="hero"
    aria-labelledby="hero-titulo"
  >
    <div class="hero__fondo">
      <img
        src="/imagenes/inicio/diablo-huma-1600.jpg"
        srcset="/imagenes/inicio/diablo-huma-900.jpg 900w, /imagenes/inicio/diablo-huma-1600.jpg 1600w"
        sizes="100vw"
        width="1600"
        height="1068"
        :alt="t('hero.altDiablo')"
        fetchpriority="high"
      />
    </div>

    <div class="hero__inner">
      <div class="hero__contenido">
        <h1 id="hero-titulo" class="hero__titulo">
          <span>{{ t('hero.tituloLinea1') }}</span>{{ ' ' }}<em>{{ t('hero.tituloLinea2') }}</em>
        </h1>
        <p class="hero__descripcion">{{ t('hero.descripcion') }}</p>

        <div ref="buscador" class="hero__buscador" role="search">
          <label for="hero-buscar" class="hero__buscador-titulo">{{ t('hero.buscarLabel') }}</label>
          <!-- La lista de resultados se posiciona respecto al campo -->
          <div class="hero__caja">
            <div class="hero__campo" :class="{ 'hero__campo--abierto': listaVisible }">
              <svg class="hero__lupa" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              <div class="hero__entrada">
                <input
                  id="hero-buscar"
                  ref="campo"
                  v-model="consulta"
                  type="search"
                  role="combobox"
                  autocomplete="off"
                  aria-autocomplete="list"
                  aria-controls="hero-resultados"
                  :aria-expanded="listaVisible"
                  :aria-activedescendant="activo >= 0 ? `hero-resultado-${activo}` : undefined"
                  :placeholder="animando ? '' : t('hero.buscarPlaceholder')"
                  @keydown="onTecla"
                  @focus="onFoco"
                  @blur="enfocado = false"
                />
                <!-- Ejemplo que se escribe solo; desaparece al tocar el campo -->
                <span v-if="animando" class="hero__ejemplo" aria-hidden="true">{{ ejemploTexto }}<span class="hero__cursor"></span></span>
              </div>
              <span v-if="buscando" class="hero__girando" :aria-label="t('hero.buscando')"></span>
              <button v-else-if="consulta" type="button" class="hero__limpiar" :aria-label="t('hero.limpiarBusqueda')" @click="limpiar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
  
            <ul v-show="listaVisible" id="hero-resultados" class="hero__resultados" role="listbox" :aria-label="t('hero.buscarLabel')">
              <li
                v-for="(prod, i) in resultados"
                :id="`hero-resultado-${i}`"
                :key="prod.id"
                role="option"
                :aria-selected="i === activo"
                :class="['hero__resultado', { 'hero__resultado--activo': i === activo }]"
                @mousedown.prevent="abrirProducto(prod)"
                @mousemove="activo = i"
              >
                <img :src="imagenPrincipal(prod)" alt="" width="48" height="48" />
                <span class="hero__resultado-texto">
                  <strong>{{ prod.nombre }}</strong>
                  <small v-if="prod.categoria_nombre">{{ prod.categoria_nombre }}</small>
                </span>
                <span class="hero__resultado-precio">${{ Number(prod.precio).toFixed(2) }}</span>
              </li>
              <li v-if="sinResultados" class="hero__sin-resultados" role="presentation">
                {{ t('hero.sinResultados', { q: consultaLimpia }) }}
                <a :href="whatsappBusqueda" target="_blank" rel="noopener" @mousedown.prevent>{{ t('hero.preguntarWhatsApp') }} →</a>
              </li>
            </ul>
          </div>
          <p class="sr-only" aria-live="polite">{{ anuncioResultados }}</p>

          <div v-if="chips.length" class="hero__sugerencias">
            <span>{{ t('hero.populares') }}</span>
            <router-link
              v-for="(cat, i) in chips"
              :key="cat.id"
              :to="`/categoria/${cat.id}`"
              :class="['hero__chip', { 'hero__chip--ejemplo': i === ejemploChip }]"
            >
              {{ cat.nombre }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="hero__ver-mas" @click="verMas">
      {{ t('hero.verMas') }}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLanguageStore } from '../../stores/language'
import { HEADER_OFFSET } from '../../composables/useSecciones'
import { whatsappLink } from '../../config/contacto'
import { imagenPrincipal } from '../../utils/imagenes'

const props = defineProps({
  // Categorías sugeridas, de la que tiene más productos a la que menos: [{ id, nombre }]
  categorias: { type: Array, default: () => [] }
})

const { t } = useLanguageStore()
const router = useRouter()
const seccion = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const verMas = () => {
  const el = seccion.value
  if (!el) return
  window.scrollTo({ top: el.offsetTop + el.offsetHeight - HEADER_OFFSET, behavior: 'smooth' })
}

const media = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null)
const mqChips = media('(max-width: 600px)')
const mqMovil = media('(max-width: 900px)')
const reducirMovimiento = !!media('(prefers-reduced-motion: reduce)')?.matches

const buscador = ref(null)
const campo = ref(null)
const consulta = ref('')
const resultados = ref([])
const buscando = ref(false)
const buscado = ref(false)
const enfocado = ref(false)
const activo = ref(-1)
let temporizador = null
let ultimaBusqueda = 0

const consultaLimpia = computed(() => consulta.value.trim())
const sinResultados = computed(() => buscado.value && !buscando.value && resultados.value.length === 0)
const listaVisible = computed(() => enfocado.value && consultaLimpia.value.length >= 2 && (resultados.value.length > 0 || sinResultados.value))
const anuncioResultados = computed(() =>
  buscado.value && !buscando.value ? t('hero.resultados', { n: resultados.value.length }) : ''
)
const whatsappBusqueda = computed(() =>
  whatsappLink(t('whatsapp.saludoProducto', { nombre: consultaLimpia.value }))
)

const buscar = async (q) => {
  const id = ++ultimaBusqueda
  buscando.value = true
  try {
    const res = await axios.get(`${API_URL}/productos`, { params: { buscar: q, limit: 6 } })
    if (id !== ultimaBusqueda) return // llegó una búsqueda más nueva
    resultados.value = res.data?.productos || []
  } catch {
    if (id === ultimaBusqueda) resultados.value = []
  } finally {
    if (id === ultimaBusqueda) {
      buscando.value = false
      buscado.value = true
      activo.value = -1
    }
  }
}

watch(consultaLimpia, (q) => {
  clearTimeout(temporizador)
  buscado.value = false
  if (q.length < 2) {
    resultados.value = []
    buscando.value = false
    return
  }
  temporizador = setTimeout(() => buscar(q), 250)
})

const abrirProducto = (prod) => {
  router.push(`/producto/${prod.id}`)
}

// En móvil el teclado tapa media pantalla: subimos el buscador hasta el encabezado
const onFoco = () => {
  enfocado.value = true
  if (!mqMovil?.matches) return
  setTimeout(() => {
    const el = buscador.value
    if (!el || !enfocado.value) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 8
    window.scrollTo({ top, behavior: reducirMovimiento ? 'instant' : 'smooth' })
  }, 300)
}

const limpiar = () => {
  consulta.value = ''
  campo.value?.focus()
}

const onTecla = (e) => {
  const total = resultados.value.length
  if (e.key === 'ArrowDown' && total) {
    e.preventDefault()
    activo.value = (activo.value + 1) % total
  } else if (e.key === 'ArrowUp' && total) {
    e.preventDefault()
    activo.value = (activo.value - 1 + total) % total
  } else if (e.key === 'Enter' && total) {
    e.preventDefault()
    abrirProducto(resultados.value[Math.max(activo.value, 0)])
  } else if (e.key === 'Escape') {
    consulta.value = ''
  }
}

/* ===== Categorías populares: 4 en escritorio, 2 en móvil ===== */
const limiteChips = ref(mqChips?.matches ? 2 : 4)
const onCambioChips = (e) => { limiteChips.value = e.matches ? 2 : 4 }
const chips = computed(() => props.categorias.slice(0, limiteChips.value))

/* ===== Ejemplos: se resalta una categoría y se escribe uno de sus productos ===== */
const ejemplos = ref({}) // { categoriaId: [nombres] }
const ejemploTexto = ref('')
const ejemploChip = ref(-1)
const heroVisible = ref(true)
let ciclo = 0

const cargarEjemplos = async (categorias) => {
  if (reducirMovimiento || !categorias.length) return
  const pares = await Promise.all(
    categorias.map((c) =>
      axios
        .get(`${API_URL}/productos`, { params: { categoria_id: c.id, limit: 4 } })
        .then((res) => [c.id, (res.data?.productos || []).map((p) => p.nombre)])
        .catch(() => [c.id, []])
    )
  )
  ejemplos.value = Object.fromEntries(pares.filter(([, nombres]) => nombres.length))
}

watch(() => props.categorias.map((c) => c.id).join(','), () => cargarEjemplos(props.categorias), { immediate: true })

const animando = computed(() =>
  !reducirMovimiento &&
  heroVisible.value &&
  !enfocado.value &&
  !consulta.value &&
  chips.value.some((c) => ejemplos.value[c.id])
)

const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

const animar = async () => {
  const id = ++ciclo
  const sigue = () => id === ciclo
  for (let paso = 0; sigue(); paso++) {
    const conEjemplos = chips.value
      .map((c, indice) => ({ indice, nombres: ejemplos.value[c.id] }))
      .filter((c) => c.nombres)
    if (!conEjemplos.length) return
    const { indice, nombres } = conEjemplos[paso % conEjemplos.length]
    const nombre = nombres[Math.floor(paso / conEjemplos.length) % nombres.length]

    ejemploChip.value = indice
    await pausa(450)
    for (let k = 1; k <= nombre.length && sigue(); k++) {
      ejemploTexto.value = nombre.slice(0, k)
      await pausa(60)
    }
    if (!sigue()) return
    await pausa(1700)
    for (let k = nombre.length - 1; k >= 0 && sigue(); k--) {
      ejemploTexto.value = nombre.slice(0, k)
      await pausa(25)
    }
  }
}

const detener = () => {
  ciclo++
  ejemploTexto.value = ''
  ejemploChip.value = -1
}

watch(animando, (si) => (si ? animar() : detener()), { immediate: true })

// Pausa la animación cuando el inicio no está en pantalla
let observador = null
onMounted(() => {
  mqChips?.addEventListener?.('change', onCambioChips)
  if (typeof IntersectionObserver !== 'undefined' && seccion.value) {
    observador = new IntersectionObserver(([e]) => { heroVisible.value = e.isIntersecting })
    observador.observe(seccion.value)
  }
})

onUnmounted(() => {
  clearTimeout(temporizador)
  detener()
  observador?.disconnect()
  mqChips?.removeEventListener?.('change', onCambioChips)
})
</script>

<style scoped>
/* ===== Base ===== */
.hero {
  --hero-header: 72px;
  --hero-oro: #E8C38C;
  --hero-fondo: #1C140C;
  --hero-vidrio: rgba(255, 255, 255, 0.08);
  --hero-vidrio-hover: rgba(255, 255, 255, 0.16);
  --hero-borde: rgba(255, 255, 255, 0.18);
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  z-index: 1; /* la lista de resultados queda sobre la sección siguiente */
  padding-top: var(--hero-header);
  color: #FFFFFF;
  background: var(--hero-fondo);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ===== Foto de fondo ===== */
.hero__fondo {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.hero__fondo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 28% 40%;
  animation: heroAcercamiento 18s ease-out both;
}

/* Oscurece el lado del texto para asegurar el contraste */
.hero__fondo::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(270deg, rgba(20, 14, 8, 0.92) 0%, rgba(20, 14, 8, 0.75) 40%, rgba(20, 14, 8, 0.12) 72%, transparent 100%),
    linear-gradient(0deg, rgba(20, 14, 8, 0.7) 0%, transparent 38%);
}

@keyframes heroAcercamiento {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}

/* ===== Texto ===== */
.hero__inner {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(var(--space-6), 5vw, 72px) 24px;
  display: grid;
  grid-template-columns: 1fr minmax(0, 540px);
  align-items: center;
}

.hero__contenido {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.hero__titulo {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5vw, 4.4rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
  text-wrap: balance;
}

.hero__titulo span,
.hero__titulo em {
  display: block;
}

.hero__titulo em {
  font-style: italic;
  font-weight: 500;
  color: var(--hero-oro);
}

.hero__descripcion {
  max-width: 34em;
  font-size: clamp(var(--text-base), 1.3vw, var(--text-lg));
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
}

/* Entrada suave; el contenido es visible aunque la animación no corra */
.hero__contenido > * {
  animation: heroEntrada 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.hero__contenido > :nth-child(2) { animation-delay: 0.08s; }
.hero__contenido > :nth-child(3) { animation-delay: 0.18s; }

@keyframes heroEntrada {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* ===== Buscador ===== */
.hero__buscador-titulo {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--hero-oro);
}

.hero__buscador {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.hero__caja {
  position: relative;
}

.hero__campo {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-4) 0 var(--space-5);
  height: 60px;
  border: 1px solid var(--hero-borde);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.hero__campo:focus-within {
  border-color: var(--hero-oro);
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 0 0 4px rgba(232, 195, 140, 0.18);
}

.hero__campo--abierto {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.hero__lupa {
  flex-shrink: 0;
  color: var(--hero-oro);
}

.hero__entrada {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.hero__campo input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #FFFFFF;
  font: inherit;
  font-size: var(--text-lg);
}

.hero__campo input:focus,
.hero__campo input:focus-visible {
  outline: none;
  box-shadow: none; /* el foco se marca en todo el campo */
}

.hero__campo input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.hero__campo input::-webkit-search-cancel-button {
  display: none;
}

.hero__ejemplo {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.75);
}

.hero__cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.18em;
  background: var(--hero-oro);
  animation: heroCursor 1s steps(1) infinite;
}

@keyframes heroCursor {
  50% { opacity: 0; }
}

.hero__limpiar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  cursor: pointer;
}

.hero__girando {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: var(--hero-oro);
  border-radius: 50%;
  animation: heroGiro 0.7s linear infinite;
}

@keyframes heroGiro {
  to { transform: rotate(360deg); }
}

.hero__resultados {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 340px;
  overflow-y: auto;
  padding: var(--space-2);
  list-style: none;
  border: 1px solid var(--hero-oro);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  background: var(--hero-fondo);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
}

.hero__resultado {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  border-radius: 10px;
  cursor: pointer;
}

.hero__resultado--activo {
  background: rgba(232, 195, 140, 0.14);
}

.hero__resultado img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
}

.hero__resultado-texto {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.hero__resultado-texto strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
}

.hero__resultado-texto small {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-xs);
}

.hero__resultado-precio {
  color: var(--hero-oro);
  font-weight: 700;
  font-size: var(--text-sm);
}

.hero__sin-resultados {
  padding: var(--space-3);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
}

.hero__sin-resultados a {
  display: inline-block;
  margin-top: var(--space-1);
  color: var(--hero-oro);
  font-weight: 600;
}

.hero__sugerencias {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
}

.hero__chip {
  padding: 6px 14px;
  border: 1px solid var(--hero-borde);
  border-radius: var(--radius-full);
  background: var(--hero-vidrio);
  color: #FFFFFF;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.hero__chip--ejemplo {
  border-color: var(--hero-oro);
  background: rgba(232, 195, 140, 0.18);
  color: var(--hero-oro);
}

.hero__chip:hover,
.hero__chip:focus-visible {
  border-color: var(--hero-oro);
  background: var(--hero-vidrio-hover);
}

/* ===== Ver más ===== */
.hero__ver-mas {
  position: absolute;
  left: 50%;
  bottom: var(--space-5);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.85);
  font: inherit;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
}

.hero__ver-mas svg {
  animation: heroRebote 1.8s ease-in-out infinite;
}

@keyframes heroRebote {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  /* En móvil: la foto arriba y el contenido debajo, sobre fondo oscuro */
  .hero {
    min-height: 0;
    padding-top: 0;
  }

  .hero__fondo {
    position: relative;
    height: 52svh;
    min-height: 300px;
  }

  .hero__fondo::after {
    background: linear-gradient(0deg, var(--hero-fondo) 0%, rgba(28, 20, 12, 0.6) 30%, transparent 60%);
  }

  .hero__inner {
    grid-template-columns: 1fr;
    margin-top: -110px;
    padding-top: 0;
    padding-bottom: var(--space-6);
  }

  .hero__contenido {
    grid-column: 1;
  }

  .hero__ver-mas {
    display: none;
  }
}

@media (max-width: 560px) {
  .hero__campo input,
  .hero__ejemplo {
    font-size: var(--text-base);
  }
}

/* Sin animaciones para quien las desactiva en su sistema */
@media (prefers-reduced-motion: reduce) {
  .hero__contenido > *,
  .hero__fondo img,
  .hero__ver-mas svg {
    animation: none;
  }
}
</style>
