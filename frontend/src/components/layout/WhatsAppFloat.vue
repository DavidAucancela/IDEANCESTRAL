<template>
  <a
    :href="whatsappGeneral"
    target="_blank"
    rel="noopener"
    class="whatsapp-float"
    :aria-label="t('whatsapp.escribenos')"
    :title="t('whatsapp.escribenos')"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="WHATSAPP_ICON_PATH"/></svg>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import { whatsappLink } from '../../config/contacto'
import { WHATSAPP_ICON_PATH } from './whatsappIcon'

const { t } = useLanguageStore()
const whatsappGeneral = computed(() => whatsappLink(t('whatsapp.saludoGeneral')))
</script>

<style scoped>
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: var(--color-whatsapp);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(23, 135, 65, 0.5);
  z-index: 999;
  transition: var(--transition);
}

.whatsapp-float:hover {
  transform: scale(1.1);
  background: var(--color-whatsapp-dark);
  box-shadow: 0 6px 25px rgba(23, 135, 65, 0.6);
}

@media (max-width: 480px) {
  .whatsapp-float { width: 52px; height: 52px; bottom: 16px; right: 16px; }
}
</style>
