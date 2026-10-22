<template>
  <section
    id="inicio"
    ref="seccion"
    :class="['hero', `hero--${variante}`]"
    aria-labelledby="hero-titulo"
  >
    <!-- Inmersivo: foto a pantalla completa -->
    <div v-if="variante === 'inmersivo'" class="hero__fondo">
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
        <p class="hero__ubicacion">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ t('hero.ubicacion') }}
        </p>

        <h1 id="hero-titulo" class="hero__titulo">
          <span>{{ t('hero.tituloLinea1') }}</span>{{ ' ' }}<em>{{ t('hero.tituloLinea2') }}</em>
        </h1>

        <p class="hero__descripcion">{{ t('hero.descripcion') }}</p>

        <div class="hero__acciones">
          <a href="/#categorias" class="btn btn-primary btn-lg" @click.prevent="irASeccion('categorias')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            {{ t('hero.explorar') }}
          </a>
          <a :href="whatsapp" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="WHATSAPP_ICON_PATH"/></svg>
            {{ t('hero.contactanos') }}
          </a>
        </div>

        <ul class="hero__puntos">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {{ t('hero.puntoHechoMano') }}
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {{ t('hero.puntoPiezasUnicas') }}
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            {{ t('hero.puntoWhatsApp') }}
          </li>
        </ul>
      </div>

      <!-- Editorial: collage de productos -->
      <div v-if="variante === 'editorial'" class="hero__collage">
        <figure class="hero__foto hero__foto--principal">
          <img src="/imagenes/inicio/mascaras-800.jpg" width="720" height="900" :alt="t('hero.altMascaras')" fetchpriority="high" />
        </figure>
        <figure class="hero__foto">
          <img src="/imagenes/inicio/sol-madera-600.jpg" width="600" height="600" :alt="t('hero.altSol')" />
        </figure>
        <figure class="hero__foto">
          <img src="/imagenes/inicio/tazas-600.jpg" width="640" height="480" :alt="t('hero.altTazas')" />
        </figure>
        <p class="hero__sello">
          <span aria-hidden="true">✦</span>
          {{ t('hero.sello') }}
        </p>
      </div>

      <!-- Ilustrado: la ilustración de la marca -->
      <figure v-else-if="variante === 'ilustrado'" class="hero__ilustracion">
        <img src="/imagenes/inicio/ilustracion-1200.jpg" width="1200" height="675" :alt="t('hero.altIlustracion')" fetchpriority="high" />
      </figure>
    </div>

    <!-- Minimal: tira de productos en movimiento (decorativa) -->
    <div v-if="variante === 'minimal'" class="hero__tira" aria-hidden="true">
      <ul class="hero__pista">
        <li v-for="(foto, i) in tiraDoble" :key="i" :class="{ 'hero__copia': i >= TIRA.length }">
          <img :src="`/imagenes/inicio/${foto}-400.jpg`" alt="" width="300" height="400" loading="lazy" />
        </li>
      </ul>
    </div>

    <!-- Inmersivo: indicador para seguir bajando -->
    <button v-if="variante === 'inmersivo'" type="button" class="hero__ver-mas" @click="verMas">
      {{ t('hero.verMas') }}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguageStore } from '../../stores/language'
import { useIrASeccion, HEADER_OFFSET } from '../../composables/useSecciones'
import { whatsappLink } from '../../config/contacto'
import { HERO_VARIANTES } from '../../config/inicio'
import { WHATSAPP_ICON_PATH } from '../layout/whatsappIcon'

defineProps({
  variante: {
    type: String,
    default: 'editorial',
    validator: (v) => HERO_VARIANTES.includes(v)
  }
})

const { t } = useLanguageStore()
const irASeccion = useIrASeccion()
const seccion = ref(null)

const whatsapp = computed(() => whatsappLink(t('whatsapp.saludoGeneral')))

// Fotos de la tira (minimal). Se duplican para que el desfile sea continuo.
const TIRA = ['mascaras', 'sol-madera', 'caballo', 'tazas', 'diablos', 'pulseras', 'cuadros', 'mitad-del-mundo', 'cucharas', 'nacimiento']
const tiraDoble = [...TIRA, ...TIRA]

const verMas = () => {
  const el = seccion.value
  if (!el) return
  window.scrollTo({ top: el.offsetTop + el.offsetHeight - HEADER_OFFSET, behavior: 'smooth' })
}
</script>

<style scoped>
/* ===== Base (todas las variantes) ===== */
.hero {
  --hero-header: 72px;
  --hero-sombra-titulo: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: var(--hero-header);
  color: var(--color-text);
  background: var(--color-bg);
}

.hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(var(--space-6), 6vw, 88px) 24px;
  display: grid;
  gap: clamp(var(--space-6), 5vw, var(--space-8));
  align-items: center;
}

.hero__contenido {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
}

.hero__ubicacion {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-wrap: balance;
}

.hero__titulo {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5.4vw, 4.6rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.02em;
  text-shadow: var(--hero-sombra-titulo);
  text-wrap: balance;
}

.hero__titulo span,
.hero__titulo em {
  display: block;
}

.hero__titulo em {
  font-style: italic;
  font-weight: 500;
  color: var(--color-primary);
}

.hero__descripcion {
  max-width: 34em;
  font-size: clamp(var(--text-base), 1.4vw, var(--text-lg));
  line-height: 1.7;
  color: var(--color-text-light);
}

.hero__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.hero__acciones .btn {
  gap: var(--space-2);
}

.hero__puntos {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
  list-style: none;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.hero__puntos li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.hero__puntos svg {
  color: var(--color-secondary);
  flex-shrink: 0;
}

/* Entrada: el texto es visible aunque la animación no corra */
.hero__contenido > * {
  animation: heroEntrada 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.hero__contenido > :nth-child(2) { animation-delay: 0.08s; }
.hero__contenido > :nth-child(3) { animation-delay: 0.16s; }
.hero__contenido > :nth-child(4) { animation-delay: 0.24s; }
.hero__contenido > :nth-child(5) { animation-delay: 0.32s; }

@keyframes heroEntrada {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* ===== 1. Editorial ===== */
.hero--editorial {
  background:
    radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 50%),
    var(--color-bg-warm);
}

.hero--editorial .hero__inner {
  grid-template-columns: 1.05fr 1fr;
  min-height: min(calc(100svh - var(--hero-header)), 820px);
}

.hero__collage {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
  height: clamp(380px, 62svh, 600px);
  animation: heroEntrada 0.9s 0.15s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.hero__foto {
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-gray-light);
  box-shadow: var(--shadow-lg);
}

.hero__foto--principal {
  grid-row: 1 / 3;
}

.hero__foto img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.hero__foto:hover img {
  transform: scale(1.04);
}

.hero__sello {
  position: absolute;
  left: -20px;
  bottom: 28px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  box-shadow: var(--shadow-xl);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.hero__sello span {
  color: var(--color-secondary);
}

/* ===== 2. Inmersivo ===== */
.hero--inmersivo {
  --hero-sombra-titulo: 0 2px 24px rgba(0, 0, 0, 0.35);
  color: #FFFFFF;
  background: #1C140C;
}

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
    linear-gradient(270deg, rgba(20, 14, 8, 0.9) 0%, rgba(20, 14, 8, 0.72) 38%, rgba(20, 14, 8, 0.12) 72%, transparent 100%),
    linear-gradient(0deg, rgba(20, 14, 8, 0.55) 0%, transparent 35%);
}

@keyframes heroAcercamiento {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}

.hero--inmersivo .hero__inner {
  grid-template-columns: 1fr minmax(0, 560px);
  min-height: calc(100svh - var(--hero-header));
}

.hero--inmersivo .hero__contenido {
  grid-column: 2;
}

.hero--inmersivo .hero__ubicacion {
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
}

.hero--inmersivo .hero__titulo em {
  color: #E8C38C;
}

.hero--inmersivo .hero__descripcion {
  color: rgba(255, 255, 255, 0.88);
}

.hero--inmersivo .hero__puntos {
  color: rgba(255, 255, 255, 0.82);
}

.hero--inmersivo .hero__puntos svg {
  color: #E8C38C;
}

/* El botón principal sobre la foto siempre en dorado con texto oscuro */
.hero--inmersivo .btn-primary {
  background: #E8C38C;
  color: #1C140C;
}

.hero--inmersivo .btn-primary:hover {
  background: #F2D3A6;
}

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

/* ===== 3. Ilustrado ===== */
.hero--ilustrado {
  background:
    radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 60%),
    var(--color-bg-warm);
  text-align: center;
}

.hero--ilustrado .hero__inner {
  grid-template-columns: 1fr;
  justify-items: center;
  gap: var(--space-5);
  padding-top: var(--space-6);
}

.hero--ilustrado .hero__contenido {
  gap: var(--space-4);
}

.hero--ilustrado .hero__ilustracion {
  order: -1;
}

.hero--ilustrado .hero__contenido,
.hero--minimal .hero__contenido {
  align-items: center;
}

.hero--ilustrado .hero__acciones,
.hero--ilustrado .hero__puntos,
.hero--minimal .hero__acciones,
.hero--minimal .hero__puntos {
  justify-content: center;
}

.hero--ilustrado .hero__titulo span,
.hero--ilustrado .hero__titulo em {
  display: inline;
}

.hero--ilustrado .hero__titulo {
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
}

.hero__ilustracion {
  margin: 0;
  padding: 10px;
  max-width: 100%;
  border-radius: 28px;
  background: var(--color-surface);
  box-shadow: var(--shadow-xl);
  animation: heroEntrada 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.hero__ilustracion img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 40svh;
  border-radius: 20px;
}

/* ===== 4. Minimal ===== */
.hero--minimal {
  background:
    radial-gradient(ellipse at 50% -10%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 55%),
    var(--color-bg);
  text-align: center;
}

.hero--minimal .hero__inner {
  grid-template-columns: 1fr;
  justify-items: center;
  padding-bottom: var(--space-7);
}

.hero--minimal .hero__titulo {
  font-size: clamp(2.8rem, 7vw, 6rem);
}

.hero__tira {
  padding-bottom: var(--space-8);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.hero__pista {
  display: flex;
  width: max-content;
  list-style: none;
  animation: heroDesfile 60s linear infinite;
}

.hero__tira:hover .hero__pista {
  animation-play-state: paused;
}

.hero__pista li {
  flex: none;
  width: 180px;
  height: 230px;
  margin-right: var(--space-4);
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-gray-light);
  box-shadow: var(--shadow-md);
}

.hero__pista li:nth-child(even) {
  transform: translateY(var(--space-5));
}

.hero__pista img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes heroDesfile {
  to { transform: translateX(-50%); }
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .hero--editorial .hero__inner,
  .hero--inmersivo .hero__inner {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .hero__collage {
    height: clamp(300px, 55vw, 440px);
  }

  .hero__sello {
    left: var(--space-3);
    bottom: var(--space-3);
  }

  /* Inmersivo en móvil: texto abajo, degradado desde abajo */
  .hero--inmersivo .hero__inner {
    min-height: calc(100svh - var(--hero-header));
    align-items: end;
    padding-bottom: 96px;
  }

  .hero--inmersivo .hero__contenido {
    grid-column: 1;
  }

  /* Inmersivo en móvil: la foto arriba y el texto debajo, sobre fondo oscuro */
  .hero--inmersivo {
    padding-top: 0;
  }

  .hero__fondo {
    position: relative;
    height: 58svh;
    min-height: 320px;
  }

  .hero__fondo::after {
    background: linear-gradient(0deg, #1C140C 0%, rgba(28, 20, 12, 0.6) 30%, transparent 60%);
  }

  .hero--inmersivo .hero__inner {
    min-height: 0;
    margin-top: -110px;
    padding-top: 0;
  }

  .hero__ver-mas {
    display: none;
  }

  /* Ilustrado: título en dos líneas, como el resto */
  .hero--ilustrado .hero__titulo span,
  .hero--ilustrado .hero__titulo em {
    display: block;
  }
}

@media (max-width: 560px) {
  .hero__ubicacion {
    padding: 6px 12px;
    font-size: 11px;
    letter-spacing: 0.06em;
  }

  .hero__acciones {
    width: 100%;
    flex-direction: column;
  }

  .hero__acciones .btn {
    width: 100%;
  }

  .hero__collage {
    gap: 10px;
  }

  .hero__sello {
    font-size: var(--text-xs);
    padding: var(--space-2) var(--space-4);
  }

  .hero__pista li {
    width: 130px;
    height: 170px;
  }
}

/* Sin animaciones para quien las desactiva en su sistema */
@media (prefers-reduced-motion: reduce) {
  .hero__contenido > *,
  .hero__collage,
  .hero__ilustracion,
  .hero__fondo img,
  .hero__ver-mas svg {
    animation: none;
  }

  .hero__foto img {
    transition: none;
  }

  .hero__pista {
    animation: none;
  }

  .hero__tira {
    overflow-x: auto;
  }

  .hero__copia {
    display: none;
  }
}
</style>
