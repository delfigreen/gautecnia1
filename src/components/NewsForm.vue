<template>
  <div class="loading-screen d-flex flex-column justify-content-center align-items-center">
    <div class="container mt-4 position-relative">
      <form @submit.prevent="handleSubmit" class="bg-light p-4 shadow rounded">
        <router-link to="/hub" class="back-arrow me-3">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div class="text-center mb-3">
          <img src="../assets/images/gautecnialogocolor.png" alt="Logo" class="img-fluid w-25" />
        </div>
        <h1 class="welcome-message">Crear Aviso</h1>
        
        <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
          Aviso agregado con éxito
        </div>
        <div class="mb-3">
          <label for="title" class="form-label">Título</label>
          <input type="text" id="title" v-model="title" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción</label>
          <textarea id="description" v-model="description" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label for="file" class="form-label">Imagen (Opcional)</label>
          <input type="file" id="file" @change="handleFileChange" class="form-control" accept="image/*" />
        </div>
        <div class="d-grid">
          <button type="submit" :disabled="loading" class="btn btn-custom position-relative">
            <span v-if="loading" class="spinner-border spinner-border-sm position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { storage, db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';

export default {
  name: 'NewsForm',
  setup() {
    const title = ref('');
    const description = ref('');
    const file = ref(null);
    const loading = ref(false);
    const showSuccessMessage = ref(false);
    const router = useRouter();
    const currentUser = ref({}); // To store user info

    // Fetch user information
    const fetchUser = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          currentUser.value = doc.data();
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const handleFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const handleSubmit = async () => {
      try {
        loading.value = true;

        let imageUrl = null;
        if (file.value) {
          const fileRef = storageRef(storage, `news-images/${file.value.name}`);
          await uploadBytes(fileRef, file.value);
          imageUrl = await getDownloadURL(fileRef);
        }

        // Fetch user info before adding document
        await fetchUser();

        // Use user info to get name
        const userName = currentUser.value.nombre || 'Usuario Sin Nombre';

        await addDoc(collection(db, 'news'), {
          title: title.value,
          description: description.value,
          imageUrl,
          user: userName
        });

        showSuccessMessage.value = true;
        title.value = '';
        description.value = '';
        file.value = null;
      } catch (error) {
        console.error('Error al agregar noticia:', error);
        alert('Error al agregar noticia');
        
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push('/hub');
    };

    return {
      title,
      description,
      file,
      loading,
      showSuccessMessage,
      handleFileChange,
      handleSubmit,
      goBack,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.back-arrow {
    font-size: 1.5rem;
    color: #41AB34;
    transition: color 0.3s;
  }
  
  .back-arrow:hover {
    color: #388E3C;
  }

.loading-screen {
  background-color: #FDF8E3;
  height: 100vh;
}

.welcome-message {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  color: #333;
  text-align: left;
}

.btn-custom {
  background-color: #41AB34;
  color: white;
  border: none;
  font-family: 'Roboto', sans-serif;
  padding: 10px 20px;
  border-radius: 5px;
}

.btn-custom:hover {
  background-color: #369d2a;
}

.arrow-icon {
  font-size: 2rem;
  color: #41AB34;
}

.form-label {
  text-align: left;
}

.form-control:focus {
  border-color: #41AB34;
  box-shadow: 0 0 0 0.2rem rgba(65, 171, 52, 0.25);
}

.alert {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
}
</style>
