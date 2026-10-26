<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <img class="logo-icon" src="/imagenes/logo-96.png" alt="" width="44" height="44" loading="lazy" />
            <span class="logo-text">Ideancestral</span>
          </div>
          <p>{{ t('footer.slogan') }}</p>
          <div class="footer-social">
            <a :href="INSTAGRAM_URL" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a :href="whatsappGeneral" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="WHATSAPP_ICON_PATH"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-links-grid">
          <div>
            <h4>{{ t('footer.navegacion') }}</h4>
            <ul>
              <li v-for="s in secciones" :key="s.id">
                <a :href="`/#${s.id}`" @click.prevent="irASeccion(s.id)">{{ t(s.label) }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{{ t('footer.contacto') }}</h4>
            <ul>
              <li v-for="tel in TELEFONOS" :key="tel">
                <a :href="`tel:${tel.replace(/[^\d+]/g, '')}`">{{ tel }}</a>
              </li>
              <li><a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Idea Ancestral &copy; {{ anio }}. {{ t('footer.derechos') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useIrASeccion } from '../../composables/useSecciones'
import { useLanguageStore } from '../../stores/language'
import { TELEFONOS, EMAIL, INSTAGRAM_URL, whatsappLink } from '../../config/contacto'
import { WHATSAPP_ICON_PATH } from './whatsappIcon'

const { t } = useLanguageStore()
const irASeccion = useIrASeccion()
const anio = new Date().getFullYear()
const whatsappGeneral = computed(() => whatsappLink(t('whatsapp.saludoGeneral')))

const secciones = [
  { id: 'inicio', label: 'nav.inicio' },
  { id: 'categorias', label: 'nav.categorias' },
  { id: 'promociones', label: 'nav.promociones' },
  { id: 'nosotros', label: 'nav.nosotros' }
]
</script>

<style scoped>
.footer {
  background-color: var(--color-dark);
  color: rgba(255, 255, 255, 0.7);
  padding: var(--space-8) 0 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-8);
  padding-bottom: var(--space-7);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: #FFFFFF;
}

.footer-brand > p {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.footer-social {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.footer-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  transition: var(--transition);
}

.footer-social a:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.footer-links-grid h4 {
  color: #FFFFFF;
  margin-bottom: var(--space-4);
  font-size: var(--text-base);
}

.footer-links-grid ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-links-grid li {
  font-size: var(--text-sm);
}

.footer-links-grid a {
  color: inherit;
  transition: var(--transition);
}

.footer-links-grid a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  text-align: center;
  padding: var(--space-5) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer-top { grid-template-columns: 1fr; gap: var(--space-6); }
}

@media (max-width: 480px) {
  .footer-links-grid { grid-template-columns: 1fr; }
}
</style>
