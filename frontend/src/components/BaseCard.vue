<template>
  <component :is="tag" class="base-card" :class="{ 'base-card-hoverable': hoverable }">
    <div v-if="$slots.image" class="base-card-image">
      <slot name="image" />
    </div>
    <div class="base-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: true },
  tag: { type: String, default: 'div' }
})
</script>

<style scoped>
.base-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.base-card-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.base-card-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-gray-light);
}

.base-card-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.base-card-hoverable:hover .base-card-image :deep(img) {
  transform: scale(1.05);
}

.base-card-body {
  padding: var(--space-5);
}

.base-card-footer {
  padding: 0 var(--space-5) var(--space-5);
}
</style>
