<template>
  <teleport to="body">
    <div v-if="visible" class="lightbox-backdrop" @click.self="close">
      <button class="lightbox-close" @click="close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button v-if="images.length > 1" class="lightbox-nav lightbox-prev" @click="prev">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="lightbox-img-wrap">
        <img :src="images[currentIndex]" :alt="`Imagen ${currentIndex + 1}`" class="lightbox-img" />
      </div>
      <button v-if="images.length > 1" class="lightbox-nav lightbox-next" @click="next">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div v-if="images.length > 1" class="lightbox-dots">
        <span v-for="(_, i) in images" :key="i" :class="['lightbox-dot', { active: i === currentIndex }]" @click="currentIndex = i"></span>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'LightboxModal',
  props: {
    visible: Boolean,
    images: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const currentIndex = ref(props.startIndex)
    watch(() => props.startIndex, v => { currentIndex.value = v })
    watch(() => props.visible, v => {
      if (v) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = ''
    })
    const close = () => emit('close')
    const prev = () => { currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length }
    const next = () => { currentIndex.value = (currentIndex.value + 1) % props.images.length }
    return { currentIndex, close, prev, next }
  }
}
</script>

<style scoped>
.lightbox-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.92);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.lightbox-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.25); }
.lightbox-img-wrap { max-width: 90vw; max-height: 85vh; display: flex; align-items: center; justify-content: center; }
.lightbox-img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 4px; box-shadow: 0 0 60px rgba(0,0,0,0.5); }
.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-nav:hover { background: rgba(255,255,255,0.25); }
.lightbox-prev { left: 1.5rem; }
.lightbox-next { right: 1.5rem; }
.lightbox-dots {
  position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  display: flex; gap: 0.5rem;
}
.lightbox-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.4); cursor: pointer; transition: background 0.2s;
}
.lightbox-dot.active { background: #fff; }
</style>
