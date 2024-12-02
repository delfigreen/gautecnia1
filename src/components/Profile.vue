<template>
    <div class="container mt-4">
      <router-link to="/hub" class="back-arrow me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <div v-if="loading" class="text-center mt-5">
        <div class="spinner-border text-custom" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <div v-else class="card profile-card mx-auto">
        <div class="card-header text-center bg-custom text-white">
          <h1>Perfil</h1>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 text-center">
              <div class="profile-icon">
                <i class="bi bi-person-fill" style="font-size: 6rem; color: #41AB34;"></i>
              </div>
            </div>
            <div class="col-md-8">
              <h4>{{ currentUser.nombre }}</h4>
              <p><strong>Email:</strong> {{ currentUser.email }}</p>
              <p><strong>Rol:</strong> {{ currentUser.rol }}</p>
              <p><strong>Teléfono:</strong> {{ currentUser.telefono || 'No disponible' }}</p>
              <p><strong>DNI:</strong> {{ currentUser.dni || 'No disponible' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { auth, db } from '../firebase';
  import { doc, getDoc } from 'firebase/firestore';
  
  export default {
    name: 'Perfil',
    setup() {
      const currentUser = ref({});
      const defaultAvatar = 'https://via.placeholder.com/150';
      const loading = ref(true);
  
      onMounted(async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error('Usuario no autenticado');
          }
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          currentUser.value = userDoc.data();
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          loading.value = false;
        }
      });
  
      return {
        currentUser,
        defaultAvatar,
        loading,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  
  .profile-card {
    border: 2px solid #41AB34;
    border-radius: 15px;
    overflow: hidden;
    background-color: #FFFFFF;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    background-color: #41AB34;
    color: white;
  }
  
  .profile-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 150px;
    max-height: 150px;
    border: 3px solid #41AB34;
    border-radius: 50%;
    background-color: #f0f0f0;
    margin: auto;
  }
  
  .back-arrow {
    font-size: 1.5rem;
    color: #41AB34;
    transition: color 0.3s;
  }
  
  .back-arrow:hover {
    color: #388E3C;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.4em;
  }
  
  .text-custom {
    color: #41AB34;
  }
  </style>
  