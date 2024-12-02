<template>
  <div class="container mt-4">
    <router-link to="/hub" class="back-arrow me-3">
      <i class="bi bi-arrow-left"></i>
    </router-link>
    <div class="card hub-card mx-auto">
      <div class="card-header text-center bg-custom text-white">
        <h1 class="title">Miembros del Equipo</h1>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center mt-5">
          <div class="spinner-border text-custom" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else>
          <ul v-if="teamMembers.length" class="member-list">
            <li v-for="member in teamMembers" :key="member.id" class="member-item">
              <div class="member-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <div class="member-info">
                <h4>{{ member.nombre }}</h4>
                <button 
                  class="btn btn-success btn-sm ms-3" 
                  @click="openModal(member)"
                  data-bs-toggle="modal" 
                  :data-bs-target="'#memberModal-' + member.id">
                  Ver más
                </button>
              </div>
            </li>
          </ul>
          <div v-else class="no-members text-center">
            <p>No se encontraron miembros del equipo en tu campo.</p>
          </div>
        </div>
        <div v-if="errorMessage" class="error-message text-center">{{ errorMessage }}</div>
      </div>
    </div>

    <div v-for="member in teamMembers" :key="member.id" :id="'memberModal-' + member.id" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-custom text-white">
            <h5 class="modal-title">{{ member.nombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Email:</strong> {{ member.email }}</p>
            <p><strong>Rol:</strong> {{ member.rol }}</p>
            <p><strong>Teléfono:</strong> {{ member.telefono || 'No disponible' }}</p>
            <p><strong>DNI:</strong> {{ member.dni || 'No disponible' }}</p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const teamMembers = ref([]);
    const loading = ref(true);
    const errorMessage = ref('');

    const fetchTeamMembers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          errorMessage.value = 'No se ha encontrado el usuario.';
          return;
        }

        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
          errorMessage.value = 'No se ha encontrado la información del usuario.';
          return;
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const userCampo = userData.campo;

        const membersQuery = query(collection(db, 'users'), where('campo', '==', userCampo));
        const membersSnapshot = await getDocs(membersQuery);

        if (membersSnapshot.empty) {
          console.log("No se encontraron miembros en el campo:", userCampo);
        } else {
          teamMembers.value = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("Miembros del equipo encontrados:", teamMembers.value);
        }

      } catch (error) {
        console.error('Error al obtener los datos de los miembros del equipo:', error);
        errorMessage.value = 'Hubo un problema al cargar los miembros del equipo.';
      } finally {
        loading.value = false;
      }
    };

    const openModal = (member) => {
      const modal = new bootstrap.Modal(document.getElementById(`memberModal-${member.id}`));
      modal.show();
    };

    onMounted(() => {
      fetchTeamMembers();
    });

    return {
      teamMembers,
      loading,
      errorMessage,
      openModal,
    };
  },
};
</script>

<style scoped>
.back-arrow {
  font-size: 1.5rem;
  color: #41AB34;
  transition: color 0.3s;
}

.back-arrow:hover {
  color: #388E3C;
}

.container {
  max-width: 800px;
}

.hub-card {
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

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.loading, .no-members, .error-message {
  font-size: 18px;
  color: #555;
}

.member-list {
  list-style: none;
  padding: 0;
}

.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.member-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #41AB34;
  margin-right: 15px;
}

.member-avatar i {
  font-size: 2rem;
  color: #41AB34;
}

.member-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.member-info h4 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.no-members {
  margin-top: 20px;
}

.error-message {
  color: red;
}

.modal-header.bg-custom {
  background-color: #41AB34;
  color: white;
}

.btn-success {
  background-color: #41AB34;
  border-color: #41AB34;
}

.btn-success:hover {
  background-color: #388E3C;
  border-color: #388E3C;
}
</style>
