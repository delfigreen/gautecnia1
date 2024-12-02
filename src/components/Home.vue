<template>
  <div class="loading-screen text-center d-flex flex-column justify-content-center align-items-center">
    <img
      src="../assets/images/gautecnialogocolor.png"
      alt="Logo"
      class="img-fluid w-50 text-center"  
    />
    <h1 class="mt-4 welcome-message fw-bold">¡Bienvenido!</h1>
    <p class="mb-4 text-center desc">Gestioná tu ganado acá y ahora.</p>
    <div class="d-grid gap-2 col-6 mx-auto">
      <router-link to="/login" class="btn btn-custom mb-2" role="button">Iniciar Sesión</router-link>
      <router-link to="/register" class="btn btn-outline-custom mb-2" role="button">Registrarse</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.loading-screen {
  background-color: #FDF8E3;
  height: 100vh;
}

.desc {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;  
  color: #333;
}

.welcome-message {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;  
  color: #333;
}

.btn-custom {
  background-color: #41AB34;
  color: white;
  border: none;
  font-family: 'Roboto', sans-serif; /* Aplicar Roboto */
}

.btn-outline-custom {
  border-color: #027B93;
  color: white; /* Cambiar el color del texto */
  font-family: 'Roboto', sans-serif; /* Aplicar Roboto */
  background-color: #027B93; /* Fondo transparente */
}

.btn-outline-custom:hover {
  background-color: #027B93; /* Fondo al pasar el mouse */
  color: #333; /* Texto blanco al pasar el mouse */
}

.btn-custom:hover {
  background-color: #41AB34;
}
</style>
