<template>
  <span class="base-badge" :class="`base-badge-${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (v) => ['primary', 'secondary', 'success', 'error', 'info', 'neutral'].includes(v)
  }
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--color-white);
  white-space: nowrap;
}

.base-badge-primary { background: var(--color-primary); }
.base-badge-secondary { background: var(--color-secondary); }
.base-badge-success { background: var(--color-success); }
.base-badge-error { background: var(--color-error); }
.base-badge-info { background: var(--color-info); }

.base-badge-neutral {
  background: var(--color-gray-light);
  color: var(--color-text-light);
}
</style>
