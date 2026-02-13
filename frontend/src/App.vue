<template>
  <div id="app">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import ToastContainer from './components/ToastContainer.vue'
export default {
  name: 'App',
  components: { ToastContainer }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
