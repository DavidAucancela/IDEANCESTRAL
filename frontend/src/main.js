import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Apply saved theme immediately to prevent flash of unstyled content
const savedTheme = localStorage.getItem('ideancestral_theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

// Apply saved language
const savedLang = localStorage.getItem('ideancestral_lang') || 'es'
document.documentElement.lang = savedLang

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
