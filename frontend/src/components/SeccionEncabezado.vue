<template>
  <header class="seccion-encabezado" data-animate>
    <p class="seccion-encabezado__etiqueta">{{ etiqueta }}</p>
    <h2 class="seccion-encabezado__titulo">
      {{ titulo }}<template v-if="acento">{{ ' ' }}<em>{{ acento }}</em></template>
    </h2>
    <p v-if="descripcion" class="seccion-encabezado__descripcion">{{ descripcion }}</p>
  </header>
</template>

<script setup>
// Encabezado de sección con el estilo del inicio:
// etiqueta en mayúsculas entre líneas, título serif y una parte en cursiva de acento.
defineProps({
  etiqueta: { type: String, required: true },
  titulo: { type: String, required: true },
  acento: { type: String, default: '' },
  descripcion: { type: String, default: '' }
})
</script>

<style scoped>
.seccion-encabezado {
  max-width: 680px;
  margin: 0 auto var(--space-7, 3rem);
  text-align: center;
}

.seccion-encabezado__etiqueta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-secondary);
}

/* Líneas finas a los lados de la etiqueta */
.seccion-encabezado__etiqueta::before,
.seccion-encabezado__etiqueta::after {
  content: '';
  width: 28px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}

.seccion-encabezado__titulo {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-wrap: balance;
}

.seccion-encabezado__titulo em {
  font-style: italic;
  font-weight: 500;
  color: var(--color-secondary);
}

.seccion-encabezado__descripcion {
  margin-top: var(--space-3);
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--color-text-muted);
}

@media (max-width: 600px) {
  .seccion-encabezado__descripcion {
    font-size: var(--text-base);
  }
}
</style>
