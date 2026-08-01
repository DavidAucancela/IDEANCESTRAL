<template>
  <nav v-if="totalPages > 1" class="base-pagination" aria-label="Paginación">
    <button
      type="button"
      class="base-pagination-btn"
      :disabled="currentPage <= 1"
      aria-label="Página anterior"
      @click="$emit('change', currentPage - 1)"
    >
      &laquo;
    </button>

    <template v-for="page in pages" :key="page">
      <span v-if="page === '...'" class="base-pagination-ellipsis">&hellip;</span>
      <button
        v-else
        type="button"
        class="base-pagination-btn"
        :class="{ 'base-pagination-btn-active': page === currentPage }"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      class="base-pagination-btn"
      :disabled="currentPage >= totalPages"
      aria-label="Página siguiente"
      @click="$emit('change', currentPage + 1)"
    >
      &raquo;
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  maxVisible: { type: Number, default: 5 }
})
defineEmits(['change'])

const pages = computed(() => {
  const { currentPage: current, totalPages: total, maxVisible } = props
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const result = [1]
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)

  if (start > 2) result.push('...')
  for (let p = start; p <= end; p++) result.push(p)
  if (end < total - 1) result.push('...')
  result.push(total)

  return result
})
</script>

<style scoped>
.base-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.base-pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 var(--space-3);
  border: 2px solid transparent;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
}

.base-pagination-btn:hover:not(:disabled) {
  background: var(--color-gray-light);
}

.base-pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.base-pagination-btn-active {
  background: var(--color-primary);
  color: var(--color-white);
}

.base-pagination-btn-active:hover {
  background: var(--color-primary-dark);
}

.base-pagination-ellipsis {
  color: var(--color-text-muted);
  padding: 0 var(--space-1);
}
</style>
