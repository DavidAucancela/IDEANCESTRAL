import { defineStore } from 'pinia'
import { ref } from 'vue'
import es from '../i18n/es'
import en from '../i18n/en'
import pt from '../i18n/pt'

const messages = { es, en, pt }
const STORAGE_KEY = 'ideancestral_lang'

export const useLanguageStore = defineStore('language', () => {
  const locale = ref(localStorage.getItem(STORAGE_KEY) || 'es')

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = messages[locale.value]
    for (const k of keys) {
      if (value == null) return key
      value = value[k]
    }
    if (typeof value !== 'string') return key
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v),
      value
    )
  }

  const setLocale = (lang) => {
    if (messages[lang]) {
      locale.value = lang
      localStorage.setItem(STORAGE_KEY, lang)
      document.documentElement.lang = lang
    }
  }

  // Initialize lang attribute
  document.documentElement.lang = locale.value

  return { locale, t, setLocale }
})
