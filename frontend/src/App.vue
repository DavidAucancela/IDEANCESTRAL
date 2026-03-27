<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ToastContainer />
    <BackToTop />
  </div>
</template>

<script>
import ToastContainer from './components/ToastContainer.vue'
import BackToTop from './components/BackToTop.vue'
export default {
  name: 'App',
  components: { ToastContainer, BackToTop }
}
</script>

<style>
#app {
  min-height: 100vh;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
