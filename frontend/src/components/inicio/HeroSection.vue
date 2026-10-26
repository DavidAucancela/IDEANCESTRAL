<template>
  <section
    id="inicio"
    ref="seccion"
    :class="['hero', `hero--${interaccion}`]"
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

        <!-- 2. Buscador con resultados en vivo -->
        <div v-if="interaccion === 'buscador'" class="hero__buscador" role="search">
          <label for="hero-buscar" class="sr-only">{{ t('hero.buscarLabel') }}</label>
          <div class="hero__campo" :class="{ 'hero__campo--abierto': listaVisible }">
            <svg class="hero__lupa" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
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
              :placeholder="t('hero.buscarPlaceholder')"
              @keydown="onTecla"
              @focus="enfocado = true"
              @blur="enfocado = false"
            />
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
          <p class="sr-only" aria-live="polite">{{ anuncioResultados }}</p>

          <div v-if="categorias.length" class="hero__sugerencias">
            <span>{{ t('hero.populares') }}</span>
            <router-link v-for="cat in categorias.slice(0, 4)" :key="cat.id" :to="`/categoria/${cat.id}`" class="hero__chip">
              {{ cat.nombre }}
            </router-link>
          </div>
        </div>

        <!-- 3. Vitrina de piezas destacadas -->
        <div
          v-else-if="interaccion === 'destacados' && destacados.length"
          class="hero__vitrina"
          role="region"
          aria-roledescription="carrusel"
          :aria-label="t('hero.piezasDestacadas')"
          @mouseenter="pausado = true"
          @mouseleave="pausado = false"
          @focusin="pausado = true"
          @focusout="pausado = false"
        >
          <div class="hero__vitrina-cabecera">
            <p class="hero__modulo-titulo">{{ t('hero.piezasDestacadas') }}</p>
            <div class="hero__vitrina-controles">
              <button type="button" :aria-label="t('hero.anterior')" @click="moverPieza(-1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span aria-hidden="true">{{ pieza + 1 }} / {{ destacados.length }}</span>
              <button type="button" :aria-label="t('hero.siguiente')" @click="moverPieza(1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div class="hero__pieza-marco" aria-live="polite">
            <transition name="pieza" mode="out-in">
              <router-link :key="piezaActual.id" :to="`/producto/${piezaActual.id}`" class="hero__pieza">
                <img :src="piezaActual.imagen" :alt="piezaActual.nombre" width="128" height="128" />
                <span class="hero__pieza-texto">
                  <strong>{{ piezaActual.nombre }}</strong>
                  <span class="hero__pieza-precio">${{ Number(piezaActual.precio).toFixed(2) }}</span>
                  <span class="hero__pieza-ver">{{ t('hero.verPieza') }} →</span>
                </span>
              </router-link>
            </transition>
          </div>

          <div class="hero__miniaturas">
            <button
              v-for="(prod, i) in destacados"
              :key="prod.id"
              type="button"
              :class="['hero__miniatura', { 'hero__miniatura--activa': i === pieza }]"
              :aria-label="prod.nombre"
              :aria-current="i === pieza"
              @click="irAPieza(i)"
            >
              <img :src="prod.imagen" alt="" width="44" height="44" />
            </button>
          </div>

          <!-- La barra marca el tiempo; al terminar pasa a la siguiente pieza -->
          <div class="hero__progreso" aria-hidden="true">
            <span
              :key="`${pieza}-${vuelta}`"
              :class="{ 'hero__progreso--pausado': pausado }"
              @animationend="moverPieza(1, true)"
            ></span>
          </div>
        </div>

        <!-- 4. Índice de secciones -->
        <nav v-else-if="interaccion === 'indice'" class="hero__indice" :aria-label="t('hero.indiceTitulo')">
          <p class="hero__modulo-titulo">{{ t('hero.indiceTitulo') }}</p>
          <ol>
            <li v-for="(item, i) in indice" :key="item.id">
              <a :href="`/#${item.id}`" class="hero__indice-item" @click.prevent="irASeccion(item.id)">
                <span class="hero__indice-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="hero__indice-texto">
                  <strong>{{ t(item.titulo) }}</strong>
                  <small>{{ t(item.descripcion) }}</small>
                </span>
                <img class="hero__indice-vista" :src="item.imagen" alt="" width="56" height="40" loading="lazy" />
                <svg class="hero__indice-flecha" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- 1. Banda de categorías -->
    <nav v-if="interaccion === 'categorias'" class="hero__banda" :aria-label="t('hero.explorarCategorias')">
      <p class="hero__modulo-titulo">{{ t('hero.explorarCategorias') }}</p>
      <ul class="hero__categorias">
        <li v-for="cat in categorias.slice(0, 6)" :key="cat.id">
          <router-link :to="`/categoria/${cat.id}`" class="hero__categoria">
            <img :src="cat.imagen" alt="" width="56" height="56" loading="lazy" />
            <span>{{ cat.nombre }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </router-link>
        </li>
        <template v-if="!categorias.length">
          <li v-for="n in 4" :key="`esqueleto-${n}`" class="hero__categoria hero__categoria--cargando" aria-hidden="true"></li>
        </template>
      </ul>
    </nav>

    <button v-else-if="interaccion === 'buscador'" type="button" class="hero__ver-mas" @click="verMas">
      {{ t('hero.verMas') }}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </section>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLanguageStore } from '../../stores/language'
import { useIrASeccion, HEADER_OFFSET } from '../../composables/useSecciones'
import { whatsappLink } from '../../config/contacto'
import { HERO_INTERACCIONES } from '../../config/inicio'
import { imagenPrincipal } from '../../utils/imagenes'

const props = defineProps({
  interaccion: {
    type: String,
    default: 'categorias',
    validator: (v) => HERO_INTERACCIONES.includes(v)
  },
  // [{ id, nombre, imagen }]
  categorias: { type: Array, default: () => [] },
  // [{ id, nombre, precio, imagen }]
  destacados: { type: Array, default: () => [] }
})

const { t } = useLanguageStore()
const router = useRouter()
const irASeccion = useIrASeccion()
const seccion = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const verMas = () => {
  const el = seccion.value
  if (!el) return
  window.scrollTo({ top: el.offsetTop + el.offsetHeight - HEADER_OFFSET, behavior: 'smooth' })
}

/* ===== Buscador ===== */
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

/* ===== Vitrina de destacados ===== */
const pieza = ref(0)
const vuelta = ref(0) // reinicia la barra aunque se repita el mismo índice
const pausado = ref(false)

const piezaActual = computed(() => props.destacados[pieza.value] || props.destacados[0])

const irAPieza = (i) => {
  pieza.value = i
  vuelta.value++
}

const moverPieza = (paso, automatico = false) => {
  const total = props.destacados.length
  if (!total) return
  if (automatico && pausado.value) return
  irAPieza((pieza.value + paso + total) % total)
}

watch(() => props.destacados.length, () => { pieza.value = 0 })

/* ===== Índice ===== */
const indice = computed(() => [
  ...(props.destacados.length
    ? [{ id: 'destacados', titulo: 'hero.indiceDestacados', descripcion: 'hero.indiceDestacadosDesc', imagen: props.destacados[0].imagen }]
    : []),
  { id: 'categorias', titulo: 'hero.indiceCategorias', descripcion: 'hero.indiceCategoriasDesc', imagen: '/imagenes/inicio/sol-madera-400.jpg' },
  { id: 'promociones', titulo: 'hero.indiceTemporadas', descripcion: 'hero.indiceTemporadasDesc', imagen: '/imagenes/inicio/cuadros-400.jpg' },
  { id: 'nosotros', titulo: 'hero.indiceNosotros', descripcion: 'hero.indiceNosotrosDesc', imagen: '/imagenes/inicio/mitad-del-mundo-400.jpg' }
])

onUnmounted(() => clearTimeout(temporizador))
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
  padding-top: var(--hero-header);
  overflow: hidden;
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

.hero__modulo-titulo {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--hero-oro);
}

/* Entrada suave; el contenido es visible aunque la animación no corra */
.hero__contenido > *,
.hero__banda {
  animation: heroEntrada 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.hero__contenido > :nth-child(2) { animation-delay: 0.08s; }
.hero__contenido > :nth-child(3) { animation-delay: 0.18s; }
.hero__banda { animation-delay: 0.28s; }

@keyframes heroEntrada {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* ===== 1. Banda de categorías ===== */
.hero__banda {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hero__categorias {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: var(--space-3);
  min-height: 78px;
  list-style: none;
}

.hero__categoria {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 100%;
  padding: 10px 16px 10px 10px;
  border: 1px solid var(--hero-borde);
  border-radius: var(--radius-md);
  background: var(--hero-vidrio);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #FFFFFF;
  font-weight: 600;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.hero__categoria img {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.hero__categoria span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero__categoria svg {
  flex-shrink: 0;
  color: var(--hero-oro);
  transition: transform 0.25s ease;
}

.hero__categoria:hover,
.hero__categoria:focus-visible {
  transform: translateY(-3px);
  background: var(--hero-vidrio-hover);
  border-color: var(--hero-oro);
}

.hero__categoria:hover img { transform: scale(1.08); }
.hero__categoria:hover svg { transform: translateX(4px); }

.hero__categoria--cargando {
  min-height: 78px;
  background: linear-gradient(90deg, var(--hero-vidrio) 25%, var(--hero-vidrio-hover) 50%, var(--hero-vidrio) 75%);
  background-size: 400px 100%;
  animation: heroBrillo 1.4s linear infinite;
}

@keyframes heroBrillo {
  from { background-position: -400px 0; }
  to { background-position: 400px 0; }
}

/* ===== 2. Buscador ===== */
.hero__buscador {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
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

.hero__campo input {
  flex: 1;
  min-width: 0;
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
  transition: background 0.2s ease, border-color 0.2s ease;
}

.hero__chip:hover,
.hero__chip:focus-visible {
  border-color: var(--hero-oro);
  background: var(--hero-vidrio-hover);
}

/* ===== 3. Vitrina de destacados ===== */
.hero__vitrina {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-2);
  padding: var(--space-5);
  border: 1px solid var(--hero-borde);
  border-radius: var(--radius-lg);
  background: var(--hero-vidrio);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.hero__vitrina-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero__vitrina-controles {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
}

.hero__vitrina-controles button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--hero-borde);
  border-radius: 50%;
  background: transparent;
  color: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.hero__vitrina-controles button:hover {
  border-color: var(--hero-oro);
  background: var(--hero-vidrio-hover);
}

.hero__pieza-marco {
  min-height: 128px;
}

.hero__pieza {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  color: #FFFFFF;
}

.hero__pieza img {
  width: 128px;
  height: 128px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.hero__pieza-texto {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.hero__pieza-texto strong {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  line-height: 1.25;
}

.hero__pieza-precio {
  color: var(--hero-oro);
  font-weight: 700;
}

.hero__pieza-ver {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s ease, transform 0.2s ease;
}

.hero__pieza:hover .hero__pieza-ver {
  color: var(--hero-oro);
  transform: translateX(4px);
}

.pieza-enter-active,
.pieza-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.pieza-enter-from { opacity: 0; transform: translateX(16px); }
.pieza-leave-to { opacity: 0; transform: translateX(-16px); }

.hero__miniaturas {
  display: flex;
  gap: var(--space-2);
}

.hero__miniatura {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  background: none;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.hero__miniatura img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__miniatura:hover,
.hero__miniatura--activa {
  opacity: 1;
}

.hero__miniatura--activa {
  border-color: var(--hero-oro);
}

.hero__progreso {
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.hero__progreso span {
  display: block;
  height: 100%;
  background: var(--hero-oro);
  transform-origin: left;
  animation: heroProgreso 6s linear forwards;
}

.hero__progreso--pausado {
  animation-play-state: paused !important;
}

@keyframes heroProgreso {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ===== 4. Índice ===== */
.hero__indice {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.hero__indice ol {
  list-style: none;
  border-top: 1px solid var(--hero-borde);
}

.hero__indice li {
  border-bottom: 1px solid var(--hero-borde);
}

.hero__indice-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-2);
  color: #FFFFFF;
}

/* Línea dorada que crece al pasar el mouse */
.hero__indice-item::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--hero-oro);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.hero__indice-num {
  flex: 0 0 28px;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.25s ease;
}

.hero__indice-texto {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.hero__indice-texto strong {
  font-size: var(--text-base);
}

.hero__indice-texto small {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.6);
}

.hero__indice-vista {
  width: 56px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  opacity: 0;
  transform: translateX(8px) scale(0.9);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.hero__indice-flecha {
  color: var(--hero-oro);
  transition: transform 0.25s ease;
}

.hero__indice-item:hover::after,
.hero__indice-item:focus-visible::after { transform: scaleX(1); }

.hero__indice-item:hover .hero__indice-num,
.hero__indice-item:focus-visible .hero__indice-num { color: var(--hero-oro); }

.hero__indice-item:hover .hero__indice-vista,
.hero__indice-item:focus-visible .hero__indice-vista {
  opacity: 1;
  transform: none;
}

.hero__indice-item:hover .hero__indice-flecha,
.hero__indice-item:focus-visible .hero__indice-flecha { transform: translateX(4px); }

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

  /* Categorías: carrusel horizontal con imán */
  .hero__categorias {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 24px;
    padding-bottom: var(--space-2);
    margin: 0 -24px;
    padding-inline: 24px;
    scrollbar-width: none;
  }

  .hero__categorias::-webkit-scrollbar { display: none; }

  .hero__categorias li,
  .hero__categoria--cargando {
    flex: 0 0 210px;
    scroll-snap-align: start;
  }

  .hero__indice-vista {
    display: none;
  }
}

@media (max-width: 560px) {
  .hero__pieza {
    gap: var(--space-4);
  }

  .hero__pieza img {
    width: 96px;
    height: 96px;
  }

  .hero__pieza-marco {
    min-height: 96px;
  }

  .hero__pieza-texto strong {
    font-size: var(--text-lg);
  }

  .hero__vitrina {
    padding: var(--space-4);
  }

  .hero__campo input {
    font-size: var(--text-base);
  }
}

/* Sin animaciones para quien las desactiva en su sistema */
@media (prefers-reduced-motion: reduce) {
  .hero__contenido > *,
  .hero__banda,
  .hero__fondo img,
  .hero__ver-mas svg,
  .hero__categoria--cargando {
    animation: none;
  }

  /* Sin rotación automática: la barra no avanza y no cambia de pieza sola */
  .hero__progreso {
    display: none;
  }

  .hero__categoria,
  .hero__categoria img,
  .hero__indice-item::after,
  .hero__indice-vista {
    transition: none;
  }

  .pieza-enter-active,
  .pieza-leave-active {
    transition: none;
  }
}
</style>
