<template>
  <section id="nosotros" class="nosotros">
    <div class="nosotros__contenedor">
      <SeccionEncabezado
        :etiqueta="t('about.label')"
        :titulo="t('about.title')"
        :acento="t('about.titleAcento')"
        :descripcion="t('about.subtitle')"
      />

      <div class="nosotros__rejilla">
        <!-- Ubicación: al tocar la tarjeta gira y muestra el mapa -->
        <div class="giro" :class="{ 'giro--mapa': girada }">
          <div class="giro__interior">
            <button
              ref="frente"
              type="button"
              class="giro__cara frente"
              :aria-expanded="girada"
              aria-controls="nosotros-mapa"
              :inert="girada || null"
              @click="verMapa"
            >
              <span class="frente__icono" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              <span class="frente__etiqueta">{{ t('about.ubicacion') }}</span>
              <span class="frente__lugar">{{ DIRECCION.lugar }}</span>
              <span class="frente__calle">{{ DIRECCION.calle }}</span>
              <span class="frente__ciudad">{{ DIRECCION.ciudad }}</span>
              <span class="frente__pista">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><path d="M8 2v16M16 6v16" /></svg>
                {{ t('about.verMapa') }}
              </span>
            </button>

            <div
              id="nosotros-mapa"
              class="giro__cara dorso"
              :inert="!girada || null"
              :aria-hidden="!girada"
            >
              <!-- El mapa se carga recién la primera vez que se gira -->
              <iframe
                v-if="mapaCargado"
                :src="MAPA_EMBED_URL"
                :title="t('about.mapaDe', { lugar: DIRECCION.lugar })"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              ></iframe>
              <div class="dorso__barra">
                <button ref="volver" type="button" class="dorso__boton" @click="verDireccion">
                  <span aria-hidden="true">←</span> {{ t('about.verDireccion') }}
                </button>
                <a :href="COMO_LLEGAR_URL" target="_blank" rel="noopener" class="dorso__boton dorso__boton--principal">
                  {{ t('about.comoLlegar') }} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="nosotros__lado">
          <!-- Horario de atención -->
          <div class="horario">
            <div class="horario__cabecera">
              <h3 class="horario__titulo">{{ t('about.horario') }}</h3>
              <span class="horario__estado" :class="{ 'horario__estado--abierto': abierto }">
                <span class="horario__punto" aria-hidden="true"></span>
                {{ abierto ? t('about.abierto') : t('about.cerrado') }}
              </span>
            </div>
            <dl class="horario__lista">
              <div v-for="h in HORARIO" :key="h.clave" class="horario__fila">
                <dt>{{ t(`about.dias.${h.clave}`) }}</dt>
                <dd>{{ formatoHora(h.abre, idioma.locale) }} – {{ formatoHora(h.cierra, idioma.locale) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Redes: WhatsApp e Instagram destacados -->
          <div class="redes">
            <a :href="whatsapp" target="_blank" rel="noopener" class="red red--whatsapp">
              <span class="red__icono" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path :d="WHATSAPP_ICON_PATH" /></svg>
              </span>
              <span class="red__texto">
                <span class="red__nombre">WhatsApp</span>
                <span class="red__detalle">{{ t('about.whatsappDetalle') }}</span>
              </span>
              <span class="red__flecha" aria-hidden="true">→</span>
            </a>
            <a :href="INSTAGRAM_URL" target="_blank" rel="noopener" class="red red--instagram">
              <span class="red__icono" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" /></svg>
              </span>
              <span class="red__texto">
                <span class="red__nombre">Instagram</span>
                <span class="red__detalle">{{ INSTAGRAM_USUARIO }}</span>
              </span>
              <span class="red__flecha" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sección «Nosotros» del inicio: cómo visitar el local.
// Tarjeta de ubicación que gira y muestra el mapa, horario con «abierto ahora»
// (hora de Quito) y WhatsApp e Instagram destacados.
// Teléfonos y correo quedan solo en el footer.
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import SeccionEncabezado from '../SeccionEncabezado.vue'
import { useLanguageStore } from '../../stores/language'
import { WHATSAPP_ICON_PATH } from '../layout/whatsappIcon'
import {
  DIRECCION, MAPA_EMBED_URL, COMO_LLEGAR_URL, HORARIO, ZONA_HORARIA,
  INSTAGRAM_URL, INSTAGRAM_USUARIO, whatsappLink
} from '../../config/contacto'
import { formatoHora, estaAbierto } from '../../utils/horario'

const idioma = useLanguageStore()
const { t } = idioma

const whatsapp = computed(() => whatsappLink(t('whatsapp.saludoGeneral')))

// Giro de la tarjeta de ubicación
const girada = ref(false)
const mapaCargado = ref(false)
const frente = ref(null)
const volver = ref(null)

const verMapa = async () => {
  mapaCargado.value = true
  girada.value = true
  await nextTick()
  volver.value?.focus({ preventScroll: true })
}

const verDireccion = async () => {
  girada.value = false
  await nextTick()
  frente.value?.focus({ preventScroll: true })
}

// «Abierto ahora»: se recalcula cada minuto
const abierto = ref(estaAbierto(HORARIO, ZONA_HORARIA))
let reloj = null
onMounted(() => {
  reloj = setInterval(() => { abierto.value = estaAbierto(HORARIO, ZONA_HORARIA) }, 60_000)
})
onUnmounted(() => clearInterval(reloj))
</script>

<style scoped>
.nosotros {
  --instagram: linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 80%, #515BD4 100%);
  padding: var(--space-8) 0;
  background: var(--color-bg);
}

.nosotros__contenedor {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.nosotros__rejilla {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: stretch;
}

button,
a {
  font: inherit;
}

button:focus-visible,
a:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* ===== Tarjeta que gira ===== */
.giro {
  min-height: 440px;
  perspective: 1600px;
}

.giro__interior {
  position: relative;
  height: 100%;
  min-height: inherit;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.giro--mapa .giro__interior {
  transform: rotateY(180deg);
}

.giro__cara {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Frente: dirección sobre un fondo que recuerda a un plano */
.frente {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--space-1);
  padding: var(--space-7);
  border: 1px solid var(--color-border);
  background:
    radial-gradient(circle at var(--pin-x, 78%) var(--pin-y, 30%), color-mix(in srgb, var(--color-secondary) 22%, transparent) 0 70px, transparent 71px),
    repeating-linear-gradient(0deg, transparent 0 46px, color-mix(in srgb, var(--color-text) 6%, transparent) 46px 47px),
    repeating-linear-gradient(90deg, transparent 0 46px, color-mix(in srgb, var(--color-text) 6%, transparent) 46px 47px),
    var(--color-surface);
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.frente:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.frente__icono {
  position: absolute;
  top: 30%;
  left: 78%;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50% 50% 50% 0;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  transform: translate(-50%, -100%) rotate(-45deg);
  box-shadow: var(--shadow-lg);
}

.frente__icono svg {
  transform: rotate(45deg);
}

.frente__etiqueta {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-secondary);
}

.frente__lugar {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
}

.frente__calle {
  margin-top: var(--space-1);
  font-size: var(--text-lg);
}

.frente__ciudad {
  color: var(--color-text-muted);
}

.frente__pista {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-size: var(--text-sm);
  font-weight: 600;
}

/* Dorso: el mapa */
.dorso {
  background: var(--color-gray-light);
  transform: rotateY(180deg);
  box-shadow: var(--shadow-md);
}

.dorso iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.dorso__barra {
  position: absolute;
  inset: auto var(--space-4) var(--space-4);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
}

.dorso__boton {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 1.1rem;
  border: 0;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}

.dorso__boton--principal {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* ===== Columna derecha ===== */
.nosotros__lado {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.horario {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.horario__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.horario__titulo {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-text);
}

.horario__estado {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  background: var(--color-gray-light);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.horario__punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.horario__estado--abierto {
  /* Se mezcla con el color del texto: más oscuro en tema claro, más claro en oscuro */
  background: color-mix(in srgb, var(--color-success) 16%, transparent);
  color: color-mix(in srgb, var(--color-success) 50%, var(--color-text));
}

.horario__lista {
  margin: 0;
}

.horario__fila {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border);
}

.horario__fila dt {
  color: var(--color-text);
}

.horario__fila dd {
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  white-space: nowrap;
}

/* Redes destacadas */
.redes {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: 1fr;
  gap: var(--space-4);
}

.red {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  color: var(--color-white);
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.red:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
}

.red--whatsapp {
  background: var(--color-whatsapp);
}

.red--instagram {
  background: var(--instagram);
}

.red__icono {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.red__texto {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.red__nombre {
  font-size: 1.15rem;
  font-weight: 700;
}

.red__detalle {
  overflow: hidden;
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.9;
}

.red__flecha {
  font-size: 1.2rem;
  transition: transform 0.25s ease;
}

.red:hover .red__flecha {
  transform: translateX(4px);
}

/* ===== Tablet y móvil ===== */
@media (max-width: 900px) {
  .nosotros__rejilla {
    grid-template-columns: minmax(0, 1fr);
  }

  .giro {
    min-height: 360px;
  }

  .redes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .nosotros {
    padding: var(--space-7) 0;
  }

  .frente {
    padding: var(--space-5);
    --pin-x: calc(100% - 50px);
    --pin-y: 50px;
  }

  /* El pin pasa a la esquina para no tapar el nombre */
  .frente__icono {
    top: 0;
    left: auto;
    right: var(--space-5);
    width: 52px;
    height: 52px;
    transform: translateY(var(--space-5)) rotate(-45deg);
  }

  .horario {
    padding: var(--space-5);
  }
}

@media (max-width: 520px) {
  .redes {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 420px) {
  .nosotros__contenedor {
    padding: 0 16px;
  }

  .giro {
    min-height: 340px;
  }
}

/* Sin animación: la tarjeta cambia de cara al instante */
@media (prefers-reduced-motion: reduce) {
  .giro__interior,
  .frente,
  .red,
  .red__flecha {
    transition: none;
  }
}
</style>
