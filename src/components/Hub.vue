<template>
  <div>
    <div v-if="loading" class="loading-screen text-center d-flex flex-column justify-content-center align-items-center">
      <img src="../assets/images/gautecnialogocolor.png" alt="Logo" class="img-fluid w-50 text-center" />
    </div>
    <div v-else class="container-fluid animate__animated animate__fadeIn">
      <div class="row flex-nowrap position-relative">
        <!-- Sidebar -->
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-custom">
          <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <!-- Logo -->
            <router-link to="/" class="logo-link">
              <div class="logo">
                <img src="../assets/images/gautecnialogo.png" alt="logo icono de Gautecnia" class="img-fluid logo-image">
              </div>
            </router-link>

            <!-- Menu items -->
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li class="nav-item">
                <router-link to="#" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-house"></i> <span class="ms-1 d-none d-sm-inline">Home</span>
                </router-link>
              </li>
              <li v-bind:class="{ 'd-none': isPeon }">
                <router-link to="/form" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-upload"></i> <span class="ms-1 d-none d-sm-inline">Carga de animales</span>
                </router-link>
              </li>
              <li>
                <router-link to="/List" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-table"></i> <span class="ms-1 d-none d-sm-inline">Mis animales</span>
                </router-link>
              </li>
              <li>
                <router-link to="/newsform" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-plus-square"></i> <span class="ms-1 d-none d-sm-inline">Cargar aviso</span>
                </router-link>
              </li>
              <li>
                <router-link to="/team" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-people"></i> <span class="ms-1 d-none d-sm-inline">Compañeros</span>
                </router-link>
              </li>
              <li>
                <router-link to="/news" class="nav-link align-middle px-0 text-white link-hover">
                  <i class="fs-4 bi-newspaper"></i> <span class="ms-1 d-none d-sm-inline">Avisos</span>
                </router-link>
              </li>
            </ul>

            <!-- Dropdown menu -->
            <hr>
            <div class="dropdown pb-4">
              <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person" width="30" height="30"></i>
                <span class="d-none d-sm-inline mx-1">{{ currentUser.nombre }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-light text-small shadow" aria-labelledby="dropdownUser1">
                <router-link to="/Profile" class="nav-link align-middle px-0 text-white link-hover">
                <li><a class="dropdown-item">Perfil</a></li>
              </router-link>
                <li><hr class="dropdown-divider"></li>
                <router-link to="/" class="nav-link align-middle px-0 text-white link-hover">
                  <li><a class="dropdown-item" href="#" @click="signOut">Cerrar Sesión</a></li>
                </router-link>
              </ul>
            </div>
          </div>
        </div>

        <!-- Content area -->
        <div class="col py-3 page position-relative">
          <!-- Saludo -->
          <div class="greeting-section mb-4">
            <div class="animate__animated animate__fadeIn animate__delay-2s animate__faster">
              <h1 class="fade-in-text">Hola {{ currentUser.nombre }},</h1>
              <h3>espero tengas un lindo día en {{currentUser.campo}}!</h3>
            </div>
          </div>

          <!-- Weather Widget -->
          <div class="weather-widget">
            <h2>Clima Actual</h2>
            <div v-if="weather">
              <p>{{ weather.name }}</p>
              <p>{{ (weather.main.temp - 273.15).toFixed(2) }} °C</p>
              <p>Humedad {{ weather.main.humidity }}%</p>
              <p>{{ weather.weather[0].description }}</p>
              <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" alt="Weather Icon" class="weather-icon">
            </div>
            <div v-else>
              <p>Cargando...</p>
            </div>
          </div>
          
          <!--Boton de solicitudes-->
          <button v-if="currentUser.rol === 'dueño'" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#solicitudesModal">Solicitudes</button>

          <!-- News Cards -->
          <div class="news-cards mt-4 animate__animated animate__fadeIn animate__delay-2s animate__faster">
            <h2 class="fs-2">Últimos Avisos</h2>
            <div class="row">
              <div v-for="(item, index) in newsItems.slice(0, 3)" :key="index" class="col-md-4 mb-3">
                <div class="card">
                  <img :src="item.imageUrl" alt="news image" class="card-img-top" v-if="item.imageUrl">
                  <div class="card-body">
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text">{{ item.description }}</p>
                    <p class="card-author">Publicado por: {{ item.user }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="mt-3 text-center"><router-link to="/news" class="link-custom">Ver más</router-link></p>
          </div>

          <!-- Contact Information -->
          <div class="contact-info mt-4 text-center">
            <p>Para contactarte con soporte de <b>Gautecnia</b> llamá al siguiente número</p>
            <p><i class="bi bi-telephone-fill"></i> 123-456-7890</p>
          </div>

        </div>
      </div>
    </div>
    <!-- Solicitudes Modal -->
<div class="modal fade" id="solicitudesModal" tabindex="-1" aria-labelledby="solicitudesModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="solicitudesModalLabel">Solicitudes Pendientes</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div v-if="loadingSolicitudes">Cargando solicitudes...</div>
        <div v-else>
          <div v-if="solicitudes.length === 0">No hay solicitudes pendientes.</div>
          <div v-else>
            <ul class="list-group">
              <li v-for="solicitud in solicitudes" :key="solicitud.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ solicitud.nombre }}</strong> ({{ solicitud.email }}) - Rol: {{ solicitud.rol }}
                </div>
                <div>
                  <button class="btn btn-success btn-sm me-2" @click="approveSolicitud(solicitud)" >
                    <span v-if="!loadingApprove">Aceptar</span>
                    <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="rejectSolicitud(solicitud)" >
                    <span v-if="!loadingReject">Rechazar</span>
                    <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



  </div>

  
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import axios from 'axios';


export default {
  name: 'Hub',
  setup() {
    const currentUser = ref({});
    const loading = ref(true);
    const weather = ref(null);
    const newsItems = ref([]);
    const apiKey = 'a41d830a88ba91f31f5566f27323d195';
    const language = 'es';
    const typingDone = ref(false);
    const solicitudes = ref([]);
    const showSolicitudesModal = ref(false);
    const loadingApprove = ref(false);
    const loadingReject = ref(false);

    // Fetch user information and news data on component mount
    onMounted(async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          currentUser.value = doc.data();
        });

        // Fetch weather data based on user's location
        await getUserLocation();
        await getNews();

        // Fetch pending requests (solicitudes) for the current user's field
        if (currentUser.value.rol === 'dueño') {
          await getSolicitudes();
        }
      } catch (error) {
        console.error('Error fetching user or weather:', error.message);
      } finally {
        loading.value = false;
        nextTick(() => {
          setTimeout(() => {
            typingDone.value = true;
          }, 2000); // Tiempo en milisegundos
        });
      }
    });

    // Fetch weather information based on location
    const getWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=${language}`
        );
        weather.value = response.data;
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Get user's location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback location if user denies location access
            getWeather(-34.6132, -58.3772); // Buenos Aires
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Fallback location if geolocation is not supported
        getWeather(-34.6132, -58.3772);
      }
    };

    // Fetch news information
    const getNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        newsItems.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error('Error fetching news data:', error.message);
      }
    };

    // Fetch pending requests (solicitudes)
    const getSolicitudes = async () => {
      try {
        const solicitudesRef = collection(db, `campos/${currentUser.value.campo}/solicitudes`);
        const querySnapshot = await getDocs(solicitudesRef);
        solicitudes.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error('Error fetching solicitudes:', error.message);
      }
    };


    // Approve a solicitud
    const approveSolicitud = async (solicitud) => {
      loadingApprove.value = true;
      try {
        // Update the user's status to active
        const userRef = doc(db, 'users', solicitud.userId);
        await updateDoc(userRef, { activo: true });

        // Remove the solicitud from the collection
        const solicitudRef = doc(db, `campos/${currentUser.value.campo}/solicitudes`, solicitud.id);
        await deleteDoc(solicitudRef);

        // Refresh the solicitudes list
        await getSolicitudes();
      } catch (error) {
        console.error('Error aprobando solicitud:', error.message);
      } 
        finally{
          loadingApprove.value = false;
        }
    };

    // Reject a solicitud
    const rejectSolicitud = async (solicitud) => {
      loadingReject.value = true;
      try {
        // Delete the user from the 'users' collection
        const userRef = doc(db, 'users', solicitud.userId);
        await updateDoc(userRef, { activo: false });

        // Remove the solicitud from the collection
        const solicitudRef = doc(db, `campos/${currentUser.value.campo}/solicitudes`, solicitud.id);
        await deleteDoc(solicitudRef);

        // Refresh the solicitudes list
        await getSolicitudes();
      } catch (error) {
        console.error('Error rechazando solicitud:', error.message);
      } 
      finally{
          loadingReject.value = false;
        }
    };

    // Computed property to check if user is peon
    const isPeon = computed(() => currentUser.value.rol === 'peón');

    return {
      currentUser,
      loading,
      weather,
      typingDone,
      newsItems,
      isPeon,
      solicitudes,
      showSolicitudesModal,
      getSolicitudes,
      approveSolicitud,
      rejectSolicitud,
      loadingApprove,
      loadingReject,
    };
  },
};
</script>


<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');


.d-none {
  display: none;
}

.link-custom {
  color: #41AB34;
  text-decoration: none;
}

/* Estilos generales */
.img-fluid {
  max-width: 100%;
}

.page {
  background-color: whitesmoke;
  position: relative;
}

.bg-custom {
  background-color: #41AB34;
}

/* Animación de aparición de contenido */
.container-fluid.animate__animated.animate__fadeIn {
  animation-duration: 1s;
}

/* Estilos para los íconos y textos del menú en color blanco */
.nav-link {
  color: white !important;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link i {
  color: white !important;
}

.link-hover {
  position: relative;
}

.link-hover::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: #f5f5f5;
  transition: width 0.3s ease;
}

.link-hover:hover::after {
  width: 100%;
}

/* Estilos para el logo en la barra lateral */
.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  height: 60px;
}

.logo {
  width: 80%;
}

.logo-image {
  max-width: 100%;
  height: auto;
}

/* Loading screen styles */
.loading-screen {
  background-color: #FDF8E3;
  height: 100vh;
}

/* Estilos para el saludo */
.greeting-section {
  margin-bottom: 30px;
}

.fade-in-text {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  color: black;
  animation: fadeInScale 2s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Weather widget styles */
.weather-widget {
  background-color: #41AB34;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: #f5f5f5;
  width: 250px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.weather-widget h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  color: #f5f5f5;
}

.weather-widget p {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #e0e0e0;
}

.weather-widget img.weather-icon {
  width: 50px;
  height: 50px;
}

/* Asegura que el contenedor principal ocupe toda la altura de la pantalla */
.d-flex.flex-column.min-vh-100 {
  min-height: 100vh;
}

/* Ajusta el área de contenido para que ocupe el espacio disponible */
.flex-fill {
  flex: 1;
}

/* Tarjetas de noticias */
.news-cards {
  margin-top: 20px;
  background-color: whitesmoke;
  padding-left: 1rem;
  padding-top: 200px;
  position: relative;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card-img-top {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-body {
  padding: 10px;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 10px;
}

.card-text {
  font-size: 0.875rem;
  color: #666;
}

.card-author {
  font-size: 0.75rem;
  color: #999;
}

/* Animación de las tarjetas al pasar el mouse */
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

/* Contact Info Styles */
.contact-info {
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.contact-info p {
  margin-bottom: 5px;
}

.contact-info i {
  margin-right: 5px;
}
</style>
