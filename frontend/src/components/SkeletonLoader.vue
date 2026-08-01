<template>
  <div
    class="skeleton"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  ></div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  radius: { type: String, default: 'var(--radius-sm)' }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-light) 25%,
    var(--color-surface-hover) 50%,
    var(--color-gray-light) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--color-gray-light);
  }
}
</style>
