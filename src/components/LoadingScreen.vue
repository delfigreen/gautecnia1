<template>
    <div class="loading-screen text-center d-flex flex-column justify-content-center align-items-center">
      <img
        src="../assets/images/gautecnialogocolor.png"
        alt="Logo"
        class="img-fluid w-50 logo-pulse" 
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingScreen',
  };
  </script>
  
  <style scoped>
  .loading-screen {
    background-color: #FDF8E3;
    height: 100vh;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .logo-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }
  </style>
  