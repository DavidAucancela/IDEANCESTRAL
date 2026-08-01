<template>
  <teleport to="body">
    <div v-if="visible" class="base-modal-overlay" @click.self="onBackdropClick">
      <div class="base-modal-content" :style="{ maxWidth }" role="dialog" aria-modal="true">
        <div class="base-modal-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button type="button" class="base-modal-close" aria-label="Cerrar" @click="close">
            &times;
          </button>
        </div>
        <div class="base-modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="base-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxWidth: { type: String, default: '700px' },
  closeOnBackdrop: { type: Boolean, default: true }
})
const emit = defineEmits(['close'])

const close = () => emit('close')
const onBackdropClick = () => { if (props.closeOnBackdrop) close() }

const onKeydown = (e) => { if (e.key === 'Escape') close() }

watch(() => props.visible, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.base-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--space-6);
  animation: fadeIn 0.2s ease;
}

.base-modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.base-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.base-modal-header h3 {
  color: var(--color-text);
  margin: 0;
}

.base-modal-close {
  background: none;
  border: none;
  font-size: var(--text-2xl);
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-light);
  padding: var(--space-1);
}

.base-modal-close:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-radius: var(--radius-sm);
}

.base-modal-body {
  padding: var(--space-5);
}

.base-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  padding: 0 var(--space-5) var(--space-5);
}

@media (max-width: 768px) {
  .base-modal-overlay {
    padding: var(--space-4);
  }
}
</style>
