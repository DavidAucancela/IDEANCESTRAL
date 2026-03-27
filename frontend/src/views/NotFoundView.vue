<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o fue movida.</p>
      <router-link to="/" class="btn btn-primary">Volver al catálogo</router-link>
    </div>
  </div>
</template>

<script>
export default { name: 'NotFoundView' }
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 2rem;
}
.not-found-content {
  text-align: center;
  max-width: 480px;
}
.not-found-icon {
  color: var(--color-accent);
  margin-bottom: 1rem;
}
.not-found-content h1 {
  font-family: var(--font-serif);
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
}
.not-found-content h2 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}
.not-found-content p {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  text-decoration: none;
}
.btn-primary {
  background: var(--color-primary);
  color: #fff;
}
.btn-primary:hover { background: var(--color-primary-dark); }
</style>
