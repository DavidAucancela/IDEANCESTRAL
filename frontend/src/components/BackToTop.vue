<template>
  <button
    v-show="visible"
    class="back-to-top"
    @click="scrollToTop"
    aria-label="Volver arriba"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
  </button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
export default {
  name: 'BackToTop',
  setup() {
    const visible = ref(false)
    const handleScroll = () => { visible.value = window.scrollY > 400 }
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    onMounted(() => window.addEventListener('scroll', handleScroll))
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))
    return { visible, scrollToTop }
  }
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  z-index: 900;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.3s ease;
}
.back-to-top:hover { background: var(--color-primary-dark); transform: translateY(-3px); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
