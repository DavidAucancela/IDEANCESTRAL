<template>
  <section v-if="cargando || promos.length" id="promociones" class="promociones">
    <div class="promociones__contenedor">
      <SeccionEncabezado
        :etiqueta="t('promos.label')"
        :titulo="t('promos.title')"
        :acento="t('promos.titleAcento')"
        :descripcion="t('promos.subtitle')"
      />

      <div v-if="!promos.length" class="esqueleto" aria-busy="true"></div>

      <!-- Banda: una foto ancha con la temporada elegida y pestañas para cambiarla -->
      <div v-else class="banda">
        <router-link :to="ruta(elegida)" class="banda__portada">
          <img :key="elegida.id" :src="imagen(elegida)" alt="" @error="alFallarImagen" />
          <span class="banda__texto" aria-live="polite">
            <span v-if="elegida.estado !== 'despues'" class="estado" :class="`estado--${elegida.estado}`">
              {{ elegida.estado === 'vigente' ? t('promos.ahora') : t('promos.proxima') }}
            </span>
            <span class="banda__meses">{{ meses(elegida) }}</span>
            <span class="banda__nombre">{{ elegida.nombre }}</span>
            <span class="banda__ver">{{ t('promos.verPiezas') }} <span aria-hidden="true">→</span></span>
          </span>
        </router-link>

        <div v-if="promos.length > 1" class="banda__pestanas" role="group" :aria-label="t('promos.label')">
          <button
            v-for="(p, i) in promos"
            :key="p.id"
            type="button"
            class="pestana"
            :class="`pestana--${p.estado}`"
            :aria-pressed="i === activa"
            @click="activa = i"
          >
            <span class="pestana__mes">{{ meses(p) }}</span>
            <span class="pestana__nombre">{{ p.nombre }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sección «Promociones por temporada» del inicio, en forma de banda:
// una foto ancha con la temporada elegida y pestañas debajo para cambiarla.
// Ordena las promociones por cercanía al mes actual; al llegar se ve la vigente o la próxima.
// Al tocar la foto lleva a su categoría (o a la sección Categorías si no tiene).
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SeccionEncabezado from '../SeccionEncabezado.vue'
import { useLanguageStore } from '../../stores/language'
import { urlImagen, IMAGEN_PLACEHOLDER } from '../../utils/imagenes'
import { ordenarPorTemporada, textoMeses } from '../../utils/temporadas'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const idioma = useLanguageStore()
const { t } = idioma

const lista = ref([])
const cargando = ref(true)

const promos = computed(() => ordenarPorTemporada(lista.value, new Date().getMonth() + 1))

// Pestaña elegida: por defecto la primera (la más cercana)
const activa = ref(0)
const elegida = computed(() => promos.value[activa.value] || promos.value[0])

const cargar = async () => {
  try {
    const res = await axios.get(`${API_URL}/promociones`)
    lista.value = res.data || []
  } catch {
    lista.value = []
  } finally {
    cargando.value = false
  }
}

const ruta = (p) => (p.categoria_id ? `/categoria/${p.categoria_id}` : { path: '/', hash: '#categorias' })
const imagen = (p) => urlImagen(p.imagen_url)
const meses = (p) => textoMeses(p, idioma.locale)

const alFallarImagen = (e) => {
  if (!e.target.src.endsWith(IMAGEN_PLACEHOLDER)) e.target.src = IMAGEN_PLACEHOLDER
}

onMounted(cargar)
</script>

<style scoped>
.promociones {
  /* Velo de la foto: sale del tono oscuro del tema.
     El texto siempre va sobre el velo, así que el enlace usa un tono claro fijo. */
  --promo-velo: color-mix(in srgb, var(--color-dark) 88%, transparent);
  --promo-velo-suave: color-mix(in srgb, var(--color-dark) 45%, transparent);
  --promo-enlace: #F5DEB3;
  padding: var(--space-8) 0;
  background: var(--color-bg-warm);
}

.promociones__contenedor {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== Foto ancha ===== */
.banda__portada {
  position: relative;
  display: block;
  height: 440px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-dark);
  color: var(--color-white);
  text-decoration: none;
  isolation: isolate;
}

.banda__portada:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.banda__portada img {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: aparecer 0.45s ease;
  transition: transform 0.6s ease;
}

.banda__portada:hover img {
  transform: scale(1.04);
}

/* En escritorio el velo oscurece desde la izquierda, donde va el texto */
.banda__portada::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, var(--promo-velo) 0%, var(--promo-velo-suave) 45%, transparent 75%);
}

.banda__texto {
  position: absolute;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
  max-width: 520px;
  padding: var(--space-7);
}

/* «Temporada actual» / «Próxima temporada» */
.estado {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.estado--vigente {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.estado--proxima {
  background: var(--color-secondary);
  color: var(--color-white);
}

.banda__meses {
  font-size: var(--text-lg);
  opacity: 0.85;
}

.banda__nombre {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  line-height: 1.05;
}

.banda__ver {
  margin-top: var(--space-2);
  font-weight: 600;
  color: var(--promo-enlace);
}

/* ===== Pestañas ===== */
.banda__pestanas {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-bottom: var(--space-1);
  overflow-x: auto;
  scrollbar-width: none;
}

.banda__pestanas::-webkit-scrollbar {
  display: none;
}

.pestana {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.pestana:hover {
  border-color: var(--color-primary);
}

.pestana:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.pestana[aria-pressed='true'] {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* Punto en la pestaña de la temporada vigente o próxima */
.pestana--vigente::after,
.pestana--proxima::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-secondary);
}

.pestana__mes {
  font-size: var(--text-xs);
  opacity: 0.75;
}

.pestana__nombre {
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
}

@keyframes aparecer {
  from { opacity: 0; transform: scale(1.03); }
  to { opacity: 1; transform: none; }
}

/* ===== Esqueleto ===== */
.esqueleto {
  height: 440px;
  border-radius: var(--radius-lg);
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg) 50%, var(--color-gray-light) 75%);
  background-size: 800px 100%;
  animation: brillo 1.4s linear infinite;
}

@keyframes brillo {
  from { background-position: -400px 0; }
  to { background-position: 400px 0; }
}

/* ===== Móvil: texto abajo y pestañas deslizables de borde a borde ===== */
@media (max-width: 768px) {
  .promociones {
    padding: var(--space-7) 0;
  }

  .banda__portada,
  .esqueleto {
    height: 360px;
  }

  .banda__portada::after {
    background: linear-gradient(180deg, transparent 20%, var(--promo-velo-suave) 50%, var(--promo-velo) 100%);
  }

  .banda__texto {
    inset: auto 0 0;
    max-width: none;
    justify-content: flex-end;
    padding: var(--space-5);
  }

  .banda__pestanas {
    margin: var(--space-4) -24px 0;
    padding: 0 24px var(--space-1);
    scroll-padding: 0 24px;
  }
}

@media (max-width: 420px) {
  .promociones__contenedor {
    padding: 0 16px;
  }

  .banda__pestanas {
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
    scroll-padding: 0 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .banda__portada img,
  .pestana {
    transition: none;
  }

  .banda__portada img,
  .esqueleto {
    animation: none;
  }
}
</style>
