<template>
  <div class="base-input-group">
    <label v-if="label" :for="id">
      {{ label }}<span v-if="required" class="base-input-required">*</span>
    </label>
    <component
      :is="as"
      :id="id"
      class="base-input"
      :class="{ 'base-input-invalid': error }"
      :value="modelValue"
      :required="required"
      v-bind="$attrs"
      @input="onInput"
    >
      <slot />
    </component>
    <p v-if="error" class="base-input-error-msg">{{ error }}</p>
    <p v-else-if="hint" class="base-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  as: { type: String, default: 'input' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const id = `base-input-${useId()}`

function onInput(e) {
  const isNumber = e.target.type === 'number'
  const value = isNumber
    ? (e.target.value === '' ? '' : Number(e.target.value))
    : e.target.value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.base-input-group {
  margin-bottom: var(--space-5);
}

.base-input-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.base-input-required {
  color: var(--color-error);
  margin-left: 2px;
}

.base-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: var(--color-text);
  transition: var(--transition);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.base-input-invalid {
  border-color: var(--color-error);
}

.base-input-error-msg {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-error);
}

.base-input-hint {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>
