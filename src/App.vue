<template>
  <div id="app">
   
    <router-view v-if="!isLoading"/>
    <LoadingScreen v-if="isLoading" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
// import NavBar from './components/NavBar.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import 'animate.css';

export default {
  name: 'App',
  components: {
    LoadingScreen,
  },
  setup() {
    const isLoading = ref(true);

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false;
      }, 3000); 
    });

    return { isLoading };
  },
};
</script>

<style>
/* Estilos globales si es necesario */
</style>
