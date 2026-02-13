<template>
  <div class="lang-switcher" ref="switcherRef">
    <button class="lang-btn" @click="open = !open" :aria-label="t('lang.' + locale)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      {{ locale.toUpperCase() }}
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="lang-dropdown">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          @click="selectLang(lang.code)" 
          :class="['lang-option', { active: locale === lang.code }]"
        >
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '../stores/language'
import { storeToRefs } from 'pinia'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const langStore = useLanguageStore()
    const { locale } = storeToRefs(langStore)
    const { t } = langStore
    const open = ref(false)
    const switcherRef = ref(null)

    const languages = [
      { code: 'es', name: 'Español', flag: 'ES' },
      { code: 'en', name: 'English', flag: 'EN' },
      { code: 'pt', name: 'Português', flag: 'PT' },
    ]

    const selectLang = (code) => {
      langStore.setLocale(code)
      open.value = false
    }

    const handleClickOutside = (e) => {
      if (switcherRef.value && !switcherRef.value.contains(e.target)) {
        open.value = false
      }
    }

    onMounted(() => document.addEventListener('click', handleClickOutside))
    onUnmounted(() => document.removeEventListener('click', handleClickOutside))

    return { locale, t, open, languages, selectLang, switcherRef }
  }
}
</script>

<style scoped>
.lang-switcher {
  position: relative;
}
.lang-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: none;
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: var(--transition);
}
.lang-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  min-width: 140px;
  z-index: 100;
}
.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: var(--font-sans);
  color: var(--color-text);
  transition: var(--transition);
  text-align: left;
}
.lang-option:hover {
  background: var(--color-bg-warm);
}
.lang-option.active {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-bg);
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
