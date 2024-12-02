<template>
  <div class="loading-screen d-flex flex-column justify-content-center align-items-center">
    <div class="container mt-4 position-relative">
      <router-link to="/" class="back-arrow me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <form @submit.prevent="login" class="bg-light p-4 shadow rounded">
        <div class="text-center mb-3">
          <img
            src="../assets/images/gautecnialogocolor.png"
            alt="Logo"
            class="img-fluid w-25"
          />
        </div>
        <h1 class="welcome-message">Inicia sesión para gestionar tu ganado.</h1>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" id="email" type="email" class="form-control" placeholder="Email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" id="password" type="password" class="form-control" placeholder="Contraseña" required>
        </div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div class="d-grid">
          <button type="submit" class="btn btn-custom" :disabled="loading">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          </button>
        </div>
        <p class="mt-3 text-center">
          ¿No tienes una cuenta? <router-link to="/register" class="link-custom">Regístrate</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    const login = async () => {
      loading.value = true;
      successMessage.value = '';
      errorMessage.value = '';

      try {
        // Iniciar sesión con Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Buscar al usuario en la colección "users" en Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          // Si el usuario no está activo, crear una nueva solicitud
          if (!userData.activo) {
            const solicitudesRef = collection(db, `campos/${userData.campo}/solicitudes`);
            await addDoc(solicitudesRef, {
              userId: user.uid,
              nombre: userData.nombre,
              apellido: userData.apellido,
              email: userData.email,
              rol: userData.rol,
              fecha: new Date(), // Fecha de la solicitud
            });

            throw new Error('El dueño no aprobó tu solicitud. Se ha enviado una nueva.');
          }

          // Si el usuario está activo, permitir el inicio de sesión
          successMessage.value = 'Inicio de sesión exitoso';
          setTimeout(() => {
            router.push('/hub');
          }, 1000);
        } else {
          throw new Error('El usuario no existe en la base de datos.');
        }
      } catch (error) {
        errorMessage.value = error.message;

        // Cerrar sesión si el usuario no está activo o no es válido
        if (auth.currentUser) {
          await signOut(auth);
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      successMessage,
      errorMessage,
      login,
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

.welcome-message {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;  
  color: #333;
  text-align: left; /* Alinear a la izquierda */
}

.btn-custom {
  background-color: #41AB34;
  color: white;
  border: none;
  font-family: 'Roboto', sans-serif; /* Aplicar Roboto */
}

.link-custom {
  color: #41AB34;
}

.btn-custom:hover {
  background-color: #369d2a;
}

/* Cambiar color del borde en el foco */
.form-control:focus {
  border-color: #41AB34; /* Cambia el color del borde al verde */
  box-shadow: 0 0 0 0.2rem rgba(65, 171, 52, 0.25); /* Agrega un efecto de sombra */
}

/* Alinear labels a la izquierda */
.form-label {
  text-align: left;
}

.arrow-icon {
  font-size: 2rem; /* Tamaño de la flecha */
  color: #41AB34; /* Color verde */
}
</style>
