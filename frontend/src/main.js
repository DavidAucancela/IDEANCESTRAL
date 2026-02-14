import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './style.css'

// Interceptor: renovar token cuando expire (403) y reintentar la petición
axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')
    const hasRefreshToken = localStorage.getItem('admin_refresh_token')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    if (err.response?.status === 403 && !originalRequest._retry && !isRefreshRequest && hasRefreshToken) {
      originalRequest._retry = true
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem('admin_refresh_token')
        })
        const newToken = res.data.token
        localStorage.setItem('admin_token', newToken)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return axios(originalRequest)
      } catch {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_refresh_token')
        if (window.location.pathname === '/admin') window.location.reload()
      }
    }
    return Promise.reject(err)
  }
)

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
