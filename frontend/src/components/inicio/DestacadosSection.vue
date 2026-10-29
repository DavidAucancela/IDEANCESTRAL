<template>
  <section v-if="cargando || productos.length" id="destacados" class="destacados">
    <div class="destacados__contenedor">
      <SeccionEncabezado
        :etiqueta="t('featured.label')"
        :titulo="t('featured.title')"
        :acento="t('featured.titleAcento')"
        :descripcion="t('featured.subtitle')"
      />

      <!-- Vitrina: una pieza en grande con su ficha y miniaturas para cambiarla -->
      <div class="vitrina" :aria-busy="cargando">
        <template v-if="pieza">
          <router-link
            :to="`/producto/${pieza.id}`"
            class="vitrina__foto"
            :class="{ 'es-agotado': agotado(pieza) }"
            tabindex="-1"
            aria-hidden="true"
          >
            <img :key="pieza.id" :src="imagenPrincipal(pieza)" alt="" @error="alFallarImagen" />
            <span v-if="agotado(pieza)" class="etiqueta-agotado">{{ t('product.agotado') }}</span>
          </router-link>

          <div class="vitrina__ficha" aria-live="polite">
            <p class="vitrina__categoria">{{ pieza.categoria_nombre || t('product.artesania') }}</p>
            <h3 class="vitrina__nombre">{{ pieza.nombre }}</h3>
            <p v-if="pieza.descripcion" class="vitrina__descripcion">{{ pieza.descripcion }}</p>
            <div class="vitrina__acciones">
              <button v-if="!agotado(pieza)" type="button" class="boton boton--principal" @click="agregar(pieza)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {{ t('cart.agregar') }}
              </button>
              <span v-else class="boton boton--apagado">{{ t('product.agotado') }}</span>
              <router-link :to="`/producto/${pieza.id}`" class="boton boton--secundario">
                {{ t('featured.verMas') }} <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>

          <div v-if="productos.length > 1" class="vitrina__miniaturas" role="group" :aria-label="t('featured.label')">
            <button
              v-for="(prod, i) in productos"
              :key="prod.id"
              type="button"
              class="vitrina__miniatura"
              :aria-pressed="i === activo"
              :aria-label="t('featured.mostrar', { nombre: prod.nombre })"
              @click="activo = i"
            >
              <img :src="imagenPrincipal(prod)" alt="" loading="lazy" @error="alFallarImagen" />
            </button>
          </div>
        </template>

        <template v-else>
          <div class="vitrina__foto esqueleto"></div>
          <div class="vitrina__ficha">
            <span class="esqueleto esqueleto-linea" style="width: 30%"></span>
            <span class="esqueleto esqueleto-linea esqueleto-linea--alta" style="width: 75%"></span>
            <span class="esqueleto esqueleto-linea" style="width: 90%"></span>
            <span class="esqueleto esqueleto-linea" style="width: 60%"></span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sección «Productos destacados» del inicio, en forma de vitrina:
// una pieza en grande (foto, descripción, agregar al carrito, ver más)
// y miniaturas para cambiarla. Ocupa una sola pantalla en móvil y escritorio.
// El precio no se muestra aquí: se ve en el carrito y en el detalle.
// Una sola petición al API.
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SeccionEncabezado from '../SeccionEncabezado.vue'
import { useLanguageStore } from '../../stores/language'
import { useCarrito } from '../../composables/useCarrito'
import { useToast } from '../../composables/useToast'
import { imagenPrincipal, IMAGEN_PLACEHOLDER } from '../../utils/imagenes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const LIMITE = 5

const { t } = useLanguageStore()
const { agregarAlCarrito } = useCarrito()
const { success: avisoExito, info: avisoInfo } = useToast()

const productos = ref([])
const cargando = ref(true)
const activo = ref(0)
const pieza = computed(() => productos.value[activo.value] || productos.value[0] || null)

const cargar = async () => {
  try {
    const res = await axios.get(`${API_URL}/productos`, { params: { destacado: true, limit: LIMITE } })
    productos.value = (res.data?.productos || res.data || []).slice(0, LIMITE)
  } catch {
    productos.value = []
  } finally {
    cargando.value = false
  }
}

const agotado = (prod) => prod.stock === 0

const agregar = (prod) => {
  const agregado = agregarAlCarrito({
    id: prod.id,
    nombre: prod.nombre,
    precio: prod.precio,
    imagen: imagenPrincipal(prod),
    stock: prod.stock
  })
  if (agregado) avisoExito(t('toast.productoAgregado'))
  else avisoInfo(t('cart.sinMasStock'))
}

const alFallarImagen = (e) => {
  if (!e.target.src.endsWith(IMAGEN_PLACEHOLDER)) e.target.src = IMAGEN_PLACEHOLDER
}

onMounted(cargar)
</script>

<style scoped>
.destacados {
  /* Una sola pantalla: la navbar fija ocupa el alto de --header-alto */
  display: flex;
  min-height: 100vh;
  min-height: 100svh;
  padding: calc(var(--header-alto) + var(--space-5)) 0 var(--space-6);
  box-sizing: border-box;
  background: var(--color-bg-warm);
}

.destacados__contenedor {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.destacados :deep(.seccion-encabezado) {
  margin-bottom: var(--space-5);
}

/* ===== Vitrina ===== */
.vitrina {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  grid-template-areas:
    'foto ficha'
    'foto miniaturas';
  grid-template-rows: minmax(0, 1fr) auto;
  flex: 1;
  min-height: 0;
  gap: var(--space-5) var(--space-7);
}

.vitrina__foto {
  grid-area: foto;
  position: relative;
  display: block;
  min-height: 260px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-dark);
  box-shadow: var(--shadow-lg);
}

.vitrina__foto img {
  /* Absoluta: la foto llena el espacio libre sin estirar la sección */
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: vitrina-aparecer 0.5s ease;
}

@keyframes vitrina-aparecer {
  from { opacity: 0; transform: scale(1.03); }
  to { opacity: 1; transform: scale(1); }
}

.etiqueta-agotado {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: var(--shadow-sm);
}

.es-agotado img {
  filter: grayscale(0.7);
  opacity: 0.85;
}

.vitrina__ficha {
  grid-area: ficha;
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.vitrina__categoria {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.vitrina__nombre {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.15;
  color: var(--color-text);
}

.vitrina__descripcion {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  color: var(--color-text-light);
  line-height: 1.6;
}

.vitrina__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.boton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 1.4rem;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.boton:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.boton--principal {
  background: var(--color-primary);
  color: var(--color-bg);
}

.boton--principal:hover {
  background: var(--color-primary-dark);
}

.boton--secundario {
  border-color: color-mix(in srgb, var(--color-text) 28%, transparent);
  color: var(--color-text);
}

.boton--secundario:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.boton--apagado {
  background: var(--color-gray-light);
  color: var(--color-text-muted);
  cursor: default;
}

.vitrina__miniaturas {
  grid-area: miniaturas;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.vitrina__miniatura {
  width: 72px;
  height: 72px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.vitrina__miniatura img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vitrina__miniatura:hover,
.vitrina__miniatura[aria-pressed='true'] {
  opacity: 1;
}

.vitrina__miniatura[aria-pressed='true'] {
  border-color: var(--color-primary);
}

.vitrina__miniatura:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* ===== Esqueleto de carga ===== */
.esqueleto {
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg) 50%, var(--color-gray-light) 75%);
  background-size: 800px 100%;
  animation: esqueleto-brillo 1.4s linear infinite;
}

.esqueleto-linea {
  display: block;
  height: 12px;
  border-radius: 6px;
}

.esqueleto-linea--alta {
  height: 28px;
}

@keyframes esqueleto-brillo {
  from { background-position: -400px 0; }
  to { background-position: 400px 0; }
}

/* ===== Móvil: foto, ficha y miniaturas una debajo de otra, en una pantalla =====
   Los botones flotantes (WhatsApp y volver arriba) ocupan la esquina inferior
   derecha: las miniaturas van abajo a su izquierda y los botones de la ficha
   quedan por encima de ellos. */
@media (max-width: 900px) {
  .destacados {
    padding: calc(var(--header-alto) + var(--space-4)) 0 84px;
  }

  /* Sin subtítulo para dejarle espacio a la foto */
  .destacados :deep(.seccion-encabezado) {
    margin-bottom: var(--space-4);
  }

  .destacados :deep(.seccion-encabezado__descripcion) {
    display: none;
  }

  .vitrina {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'foto'
      'ficha'
      'miniaturas';
    grid-template-rows: minmax(0, 1fr) auto auto;
    gap: var(--space-3);
  }

  .vitrina__foto {
    min-height: 150px;
  }

  .vitrina__ficha {
    gap: var(--space-2);
  }

  .vitrina__nombre {
    font-size: 1.5rem;
  }

  .vitrina__descripcion {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .vitrina__acciones {
    flex-wrap: nowrap;
  }

  .vitrina__acciones .boton {
    flex: 1 1 auto;
    justify-content: center;
    padding: 0 1rem;
  }

  .vitrina__acciones .boton--secundario {
    flex: 0 0 auto;
  }

  .vitrina__miniaturas {
    flex-wrap: nowrap;
    gap: var(--space-2);
    margin-right: 72px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .vitrina__miniatura {
    flex: 0 0 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  /* Flotantes más chicos en teléfono: WhatsApp 52px y volver arriba a 80px del borde */
  .destacados {
    padding-bottom: 68px;
  }

  .vitrina__miniaturas {
    margin-right: 60px;
  }
}

@media (max-width: 420px) {
  .destacados__contenedor {
    padding: 0 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .boton,
  .vitrina__miniatura {
    transition: none;
  }

  .vitrina__foto img,
  .esqueleto {
    animation: none;
  }
}
</style>
