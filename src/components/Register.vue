<template>
  <div class="loading-screen d-flex flex-column justify-content-center align-items-center">
    <div class="container mt-4 position-relative">
      <router-link to="/" class="back-arrow me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <form @submit.prevent="handleSubmit" class="bg-light p-4 shadow rounded">
        <div class="text-center mb-3">
          <img src="../assets/images/gautecnialogocolor.png" alt="Logo" class="img-fluid w-25" />
        </div>
        <h1 class="welcome-message">Crea tu cuenta para comenzar a gestionar tu ganado.</h1>

        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <transition name="fade" mode="out-in">
          <div :key="step">
            <!-- Step 1 -->
            <div v-if="step === 1">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input v-model="nombre" id="nombre" type="text" class="form-control" placeholder="Nombre" required />
              </div>
              <div class="mb-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input v-model="apellido" id="apellido" type="text" class="form-control" placeholder="Apellido" required />
              </div>
              <div class="d-grid">
                <button @click="nextStep" type="button" class="btn btn-custom">Siguiente</button>
              </div>
            </div>

            <!-- Step 2 -->
            <div v-if="step === 2">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" id="email" type="email" class="form-control" placeholder="Email" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input v-model="password" id="password" type="password" class="form-control" placeholder="Contraseña" required />
              </div>
              <div class="d-grid">
                <button @click="previousStep" type="button" class="btn btn-custom">Atrás</button>
                <button @click="nextStep" type="button" class="btn btn-custom">Siguiente</button>
              </div>
            </div>

            <!-- Step 3 -->
            <div v-if="step === 3">
              <div class="mb-3">
                <label for="dni" class="form-label">DNI</label>
                <input v-model="dni" id="dni" type="text" class="form-control" placeholder="DNI" required />
              </div>
              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input v-model="telefono" id="telefono" type="text" class="form-control" placeholder="Teléfono" required />
              </div>
              <div class="d-grid">
                <button @click="previousStep" type="button" class="btn btn-custom mb-1">Atrás</button>
                <button @click="nextStep" type="button" class="btn btn-custom mt-1">Siguiente</button>
              </div>
            </div>

            <!-- Step 4 -->
            <div v-if="step === 4">
              <div class="mb-3">
                <label for="campo" class="form-label">Campo</label>
                <select v-model="campo" id="campo" class="form-control" required>
                  <option value="" disabled>Selecciona o escribe un campo</option>
                  <option v-for="c in campos" :key="c" :value="c">{{ c }}</option>
                  <option value="nuevo">Nuevo campo</option>
                </select>
                <input v-if="campo === 'nuevo'" v-model="nuevoCampo" id="nuevoCampo" type="text" class="form-control mt-2" placeholder="Ingresa el nuevo campo" />
              </div>
              <div class="mb-3">
                <label for="rol" class="form-label">Rol</label>
                <select v-model="rol" id="rol" class="form-control" required>
                  <option value="" disabled>Selecciona tu rol</option>
                  <option value="dueño">Dueño</option>
                  <option value="peón">Peón</option>
                  <option value="veterinario">Veterinario</option>
                </select>
              </div>
              <div class="d-grid">
                <button @click="previousStep" type="button" class="btn btn-custom">Atrás</button>
                <button type="submit" class="btn btn-custom" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </transition>
        <p class="mt-3 text-center">
          ¿Ya tienes una cuenta? <router-link to="/login" class="link-custom">Inicia sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const step = ref(1);
    const nombre = ref('');
    const apellido = ref('');
    const email = ref('');
    const password = ref('');
    const dni = ref('');
    const telefono = ref('');
    const campo = ref('');
    const nuevoCampo = ref('');
    const rol = ref('');
    const campos = ref([]);
    const successMessage = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();

    const fetchCampos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'campos'));
        campos.value = querySnapshot.docs.map(doc => doc.id);
      } catch (error) {
        console.error('Error fetching campos:', error);
      }
    };

    const register = async () => {
      isLoading.value = true;
      successMessage.value = '';
      errorMessage.value = '';
      try {
        if (campo.value != 'nuevo' && rol.value === 'dueño' ){
          errorMessage.value = 'No podés registrar un dueño en un campo que ya tiene uno.';
        return;
      }
        // Register user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

      
        
        // Store additional information in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          nombre: nombre.value,
          apellido: apellido.value,
          email: email.value,
          dni: dni.value,
          telefono: telefono.value,
          campo: campo.value === 'nuevo' ? nuevoCampo.value : campo.value,
          rol: rol.value,
          activo: rol.value == 'dueño',
        });

        // Create or update the campo document
        const campoToUpdate = campo.value === 'nuevo' ? nuevoCampo.value : campo.value;
        await setDoc(doc(db, 'campos', campoToUpdate), {
          nombre: campoToUpdate
        }, { merge: true });

        // // Create the datosAnimales subcollection with an initial document
        // await addDoc(collection(db, 'campos', campoToUpdate, 'datosAnimales'), {
        //   initial: true,  // Datos iniciales o placeholder
        // });
      
      if (rol.value === 'dueño'){
        successMessage.value = 'Registro exitoso. Redirigiendo al hub...';
        setTimeout(() => {
          router.push('/hub');
        }, 2000);
      } else {
        //logica de insertar solicitud y mostrar mensaje de espera de aprobacion.
        await addDoc(collection(db, 'campos', campoToUpdate, 'solicitudes'), {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        rol: rol.value,
        userId: user.uid,
        fecha: new Date().toISOString(),
      });

      successMessage.value = 'Registro exitoso. Tu solicitud ha sido enviada. Espera aprobación.';


        
        
      }

      } catch (error) {
        errorMessage.value = 'Error al registrarse: ' + error.message;
      } finally {
        isLoading.value = false;
      }
    };

    const nextStep = () => {
      if (step.value < 4) step.value++;
    };

    const previousStep = () => {
      if (step.value > 1) step.value--;
    };

    const handleSubmit = () => {
      if (step.value === 4) {
        register();
      } else {
        nextStep();
      }
    };

    onMounted(fetchCampos);

    return {
      step,
      nombre,
      apellido,
      email,
      password,
      dni,
      telefono,
      campo,
      nuevoCampo,
      rol,
      campos,
      successMessage,
      errorMessage,
      isLoading,
      nextStep,
      previousStep,
      handleSubmit,
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
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

.desc {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;  
  color: #333;
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
  margin: 10px;
}

.link-custom {
  color: #41AB34;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.alert {
  margin-bottom: 20px;
}

.spinner-border {
  vertical-align: text-bottom;
  margin-right: 5px;
}
</style>
