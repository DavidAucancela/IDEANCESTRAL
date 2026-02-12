<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast', t.type]"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useToast } from '../composables/useToast'
export default {
  setup() {
    const { toasts } = useToast()
    return { toasts }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background: var(--color-text);
  color: white;
}

.toast.success {
  background: #27ae60;
}

.toast.error {
  background: #c0392b;
}

.toast.info {
  background: var(--color-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
