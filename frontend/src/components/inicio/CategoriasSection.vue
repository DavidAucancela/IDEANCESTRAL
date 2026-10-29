<template>
  <section v-if="cargando || visibles.length" id="categorias" class="categorias">
    <div class="categorias__contenedor">
      <SeccionEncabezado
        :etiqueta="t('categories.label')"
        :titulo="t('categories.title')"
        :acento="t('categories.titleAcento')"
        :descripcion="t('categories.subtitle')"
      />

      <!-- Esqueleto de carga con la misma forma -->
      <div v-if="!visibles.length" class="paneles" aria-busy="true">
        <span v-for="n in 4" :key="n" class="panel esqueleto" :class="{ 'panel--abierto': n === 1 }"></span>
      </div>

      <!-- Paneles: franjas con foto; la señalada se abre y muestra sus datos -->
      <div v-else class="paneles" @mouseleave="abierto = 0">
        <router-link
          v-for="(cat, i) in visibles"
          :key="cat.id"
          :to="`/categoria/${cat.id}`"
          class="panel"
          :class="{ 'panel--abierto': i === abierto }"
          @mouseenter="abierto = i"
          @focus="abierto = i"
        >
          <img :src="imagen(cat)" alt="" loading="lazy" @error="alFallarImagen" />
          <span v-if="i === 0" class="panel__sello">{{ t('categories.masVariedad') }}</span>
          <span class="panel__vertical" aria-hidden="true">{{ cat.nombre }}</span>
          <span class="panel__texto">
            <span class="panel__nombre">{{ cat.nombre }}</span>
            <span class="panel__cuenta">{{ cuenta(cat) }}</span>
            <span v-if="cat.descripcion" class="panel__descripcion">{{ cat.descripcion }}</span>
            <span class="panel__ver">{{ t('categories.verColeccion') }} <span aria-hidden="true">→</span></span>
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sección «Explora por categoría» del inicio, en forma de paneles.
// Recibe las categorías que ya cargó la portada (también las usa el buscador del hero).
// Solo muestra las que tienen productos, de más a menos piezas;
// la primera lleva el sello «Más variedad» y es la que está abierta al llegar.
import { ref, computed } from 'vue'
import SeccionEncabezado from '../SeccionEncabezado.vue'
import { useLanguageStore } from '../../stores/language'
import { urlImagen, IMAGEN_PLACEHOLDER } from '../../utils/imagenes'

const props = defineProps({
  categorias: { type: Array, default: () => [] },
  cargando: { type: Boolean, default: false }
})

const { t } = useLanguageStore()

const visibles = computed(() =>
  props.categorias
    .filter((c) => c.total_productos > 0)
    .sort((a, b) => b.total_productos - a.total_productos)
)

// Panel abierto: el que tiene el mouse o el foco; al salir vuelve a la principal
const abierto = ref(0)

const imagen = (cat) => urlImagen(cat.imagen_url)
const cuenta = (cat) =>
  cat.total_productos === 1 ? t('categories.pieza') : t('categories.piezas', { n: cat.total_productos })

const alFallarImagen = (e) => {
  if (!e.target.src.endsWith(IMAGEN_PLACEHOLDER)) e.target.src = IMAGEN_PLACEHOLDER
}
</script>

<style scoped>
.categorias {
  /* Velo de las fotos: sale del tono oscuro del tema */
  --cat-velo: color-mix(in srgb, var(--color-dark) 90%, transparent);
  --cat-velo-suave: color-mix(in srgb, var(--color-dark) 50%, transparent);
  /* El texto siempre va sobre el velo oscuro: el enlace no cambia con el tema
     (--color-accent-light se oscurece en modo oscuro y no se leería) */
  --cat-enlace: #F5DEB3;
  padding: var(--space-8) 0;
  background: var(--color-bg);
}

.categorias__contenedor {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== Paneles ===== */
.paneles {
  display: flex;
  gap: var(--space-3);
  height: 480px;
}

.panel {
  position: relative;
  display: block;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-dark);
  color: var(--color-white);
  text-decoration: none;
  isolation: isolate;
  transition: flex-grow 0.5s ease;
}

.panel--abierto {
  flex-grow: 4;
}

.panel:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.panel img {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.panel:hover img {
  transform: scale(1.06);
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, transparent 10%, var(--cat-velo-suave) 42%, var(--cat-velo) 88%);
}

/* Nombre de lado cuando el panel está cerrado */
.panel__vertical {
  position: absolute;
  bottom: var(--space-5);
  left: 50%;
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 700;
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: translateX(-50%) rotate(180deg);
  transition: opacity 0.3s ease;
}

.panel--abierto .panel__vertical {
  opacity: 0;
}

/* Datos que aparecen al abrirse */
.panel__texto {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 280px;
  padding: var(--space-5);
  text-shadow: 0 1px 8px color-mix(in srgb, var(--color-dark) 60%, transparent);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.panel--abierto .panel__texto {
  opacity: 1;
  transform: none;
  transition-delay: 0.15s;
}

.panel__nombre {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 700;
  line-height: 1.15;
}

.panel__cuenta {
  font-size: var(--text-sm);
  opacity: 0.85;
}

.panel__descripcion {
  max-width: 38ch;
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  line-height: 1.5;
  opacity: 0.85;
}

.panel__ver {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--cat-enlace);
}

/* Sello «Más variedad», visible con el panel abierto */
.panel__sello {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.06em;
  white-space: nowrap;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.panel--abierto .panel__sello {
  opacity: 1;
}

/* ===== Esqueleto ===== */
.esqueleto {
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg-warm) 50%, var(--color-gray-light) 75%);
  background-size: 800px 100%;
  animation: brillo 1.4s linear infinite;
}

@keyframes brillo {
  from { background-position: -400px 0; }
  to { background-position: 400px 0; }
}

/* ===== Móvil y pantallas táctiles: franjas una debajo de otra, todas con su texto =====
   Sin mouse no se puede «pasar por encima», así que no se abren ni se cierran. */
@media (max-width: 768px), (hover: none) {
  .paneles {
    flex-direction: column;
    height: auto;
  }

  .panel,
  .panel--abierto {
    flex: none;
    height: 120px;
  }

  .panel:first-child {
    height: 200px;
  }

  /* Franjas bajas: el velo oscurece desde la izquierda, donde va el texto */
  .panel::after {
    background: linear-gradient(90deg, var(--cat-velo) 0%, var(--cat-velo-suave) 50%, transparent 85%);
  }

  .panel:first-child::after {
    background: linear-gradient(180deg, transparent 10%, var(--cat-velo-suave) 42%, var(--cat-velo) 88%);
  }

  .panel__vertical,
  .panel__descripcion {
    display: none;
  }

  .panel__texto,
  .panel__sello {
    min-width: 0;
    opacity: 1;
    transform: none;
  }

  .panel__texto {
    padding: var(--space-4);
  }

  .panel__nombre {
    font-size: 1.25rem;
  }

  .panel:first-child .panel__nombre {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .categorias {
    padding: var(--space-7) 0;
  }
}

@media (max-width: 420px) {
  .categorias__contenedor {
    padding: 0 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .panel img,
  .panel__vertical,
  .panel__texto,
  .panel__sello {
    transition: none;
  }

  .esqueleto {
    animation: none;
  }
}
</style>
