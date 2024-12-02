<template>
  <div class="loading-screen d-flex flex-column justify-content-center align-items-center">
    <div class="container mt-4 position-relative">
      <form @submit.prevent="addAnimal" class="bg-light p-4 shadow rounded">
        <router-link to="/hub" class="back-arrow me-3">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div class="text-center mb-3">
          <img src="../assets/images/gautecnialogocolor.png" alt="Logo" class="img-fluid w-25" />
        </div>
        <h1 class="welcome-message">Carga tu nuevo animal.</h1>

        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div class="mb-3">
          <label for="animal" class="form-label">Animal</label>
          <select v-model="selectedAnimal" id="animal" class="form-select" required>
            <option value="" disabled>Selecciona un animal</option>
            <option v-for="animal in animals" :key="animal" :value="animal">{{ animal }}</option>
            <option value="Otro">Otro Animal</option>
          </select>
        </div>
        <div v-if="selectedAnimal === 'Otro'" class="mb-3">
          <label for="other-animal" class="form-label">Especifica el Animal</label>
          <input v-model="animal.Animal" id="other-animal" type="text" class="form-control" placeholder="Especifica el animal" required />
        </div>
        <div class="mb-3">
          <label for="crias" class="form-label">¿Tiene crías?</label>
          <select v-model="hasCrias" id="crias" class="form-select" required>
            <option value="" disabled>Selecciona una opción</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <div v-if="hasCrias === 'Sí'" class="mb-3">
          <label for="cantidad-crias" class="form-label">Cantidad de crías</label>
          <input v-model="animal.Crias" id="cantidad-crias" type="number" class="form-control" placeholder="Cantidad de crías" required />
        </div>
        <div class="mb-3">
          <label for="peso" class="form-label">Peso (Kg)</label>
          <input v-model="animal.Peso" id="peso" type="number" class="form-control" placeholder="Peso" required />
        </div>
        <div class="mb-3">
          <label for="codigo" class="form-label">Código</label>
          <input v-model="animal.codigo" id="codigo" type="text" class="form-control" placeholder="Código" required />
        </div>
        <div class="mb-3">
          <label for="edad" class="form-label">Edad (Meses)</label>
          <input v-model="animal.edad" id="edad" type="number" class="form-control" placeholder="Edad" required />
        </div>
        <div class="mb-3">
          <label for="sexo" class="form-label">Sexo</label>
          <select v-model="animal.sexo" id="sexo" class="form-select" required>
            <option value="" disabled>Selecciona el sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-custom">Agregar Animal</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Asegúrate de que la configuración de Firebase esté correcta
import { useRouter } from 'vue-router';

export default {
  name: 'AnimalForm',
  setup() {
    const animal = ref({
      Animal: '',
      Crias: 0,
      Peso: '',
      codigo: '',
      edad: '',
      sexo: ''
    });

    const hasCrias = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');
    const selectedAnimal = ref('');
    const animals = ref(['Vaca', 'Cerdo', 'Gallina', 'Oveja', 'Caballo']);

    const router = useRouter();

    const addAnimal = async () => {
      try {
        if (hasCrias.value === 'No') {
          animal.value.Crias = 0;
        }

        if (selectedAnimal.value !== 'Otro') {
          animal.value.Animal = selectedAnimal.value;
        }

        // Obtén el campo del usuario actual
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuario no autenticado');
        }

        // Obtén el nombre del campo del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const campo = userData.campo;

        await addDoc(collection(db, 'campos', campo, 'datosAnimales'), {
          ...animal.value,
          created_at: serverTimestamp()
        });

        successMessage.value = 'Animal agregado exitosamente!';
        errorMessage.value = '';
        resetForm();
      } catch (e) {
        successMessage.value = '';
        errorMessage.value = 'Error agregando el animal: ' + e.message;
      }
    };

    const resetForm = () => {
      animal.value = {
        Animal: '',
        Crias: 0,
        Peso: '',
        codigo: '',
        edad: '',
        sexo: ''
      };
      hasCrias.value = '';
      selectedAnimal.value = '';
    };

    const goHub = () => {
      router.push('/hub');
    };

    return {
      animal,
      hasCrias,
      addAnimal,
      goHub,
      successMessage,
      errorMessage,
      selectedAnimal,
      animals
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.back-arrow {
  font-size: 1.5rem;
  color: #41ab34;
  transition: color 0.3s;
}

.back-arrow:hover {
  color: #388e3c;
}

.loading-screen {
  background-color: #fdf8e3;
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
  text-align: left; /* Alinear a la izquierda */
}

.btn-custom {
  background-color: #41ab34;
  color: white;
  border: none;
  font-family: 'Roboto', sans-serif; /* Aplicar Roboto */
}

.link-custom {
  color: #41ab34;
}

.btn-custom:hover {
  background-color: #369d2a;
}

.arrow-icon {
  font-size: 2rem; /* Tamaño de la flecha */
  color: #41ab34; /* Color verde */
}

/* Alinear labels a la izquierda */
.form-label {
  text-align: left;
}

/* Cambiar color del borde en el foco */
.form-control:focus {
  border-color: #41ab34; /* Cambia el color del borde al verde */
  box-shadow: 0 0 0 0.2rem rgba(65, 171, 52, 0.25); /* Agrega un efecto de sombra */
}

.alert {
  font-family: 'Roboto', sans-serif; /* Aplicar Roboto */
  font-size: 1rem;
}
</style>
