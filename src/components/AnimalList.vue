<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

  <LoadingScreen v-if="loading" />

  <div v-else class="background-color container mt-4">
    <router-link to="/hub" class="back-arrow me-3">
      <i class="bi bi-arrow-left"></i>
    </router-link>
    <div class="d-flex justify-content-end mb-3 align-items-center">
      <i class="bi bi-info-circle info-icon me-2"></i>
      <p class="info-text mb-0">Clickea sobre el animal para acceder a los detalles.</p>
      <button @click="downloadPDF" class="btn btn-success me-2">Descargar PDF</button>
      <button @click="exportToExcel" class="btn btn-success">Exportar a Excel</button>
    </div>
    <div class="table-container">
      <div class="table-responsive" ref="tableContent">
        <table class="table custom-table">
          <thead>
            <tr class="custom-table-header">
              <th>Animal</th>
              <th>Crias</th>
              <th>Peso</th>
              <th>Código</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="animal in animals" :key="animal.id">
              <td>
                <router-link :to="{ name: 'AnimalDetail', params: { id: animal.id } }">
                  {{ animal.Animal }}
                </router-link>
              </td>
              <td>
                <span v-if="animal.Crias === 0">No tiene</span>
                <span v-else>{{ animal.Crias }}</span>
              </td>
              <td>{{ animal.Peso }}</td>
              <td>{{ animal.codigo }}</td>
              <td>{{ animal.edad }}</td>
              <td>{{ animal.sexo }}</td>
              <td>
                <span v-if="animal.created_at && animal.created_at.seconds">
                  {{ new Date(animal.created_at.seconds * 1000).toLocaleString() }}
                </span>
                <span v-else>No disponible</span>
              </td>
              <td>
                <button @click="confirmDelete(animal.id)" class="btn btn-danger">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Spinner para mostrar durante la eliminación -->
    <div v-if="isDeleting" class="spinner-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import LoadingScreen from './LoadingScreen.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default {
  name: 'AnimalList',
  components: {
    LoadingScreen,
  },
  setup() {
    const animals = ref([]);
    const loading = ref(true);
    const isDeleting = ref(false);
    const tableContent = ref(null);

    const fetchAnimals = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuario no autenticado');
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const campo = userData.campo;

        const querySnapshot = await getDocs(collection(db, 'campos', campo, 'datosAnimales'));
        animals.value = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
      } finally {
        loading.value = false;
      }
    };

    const deleteAnimal = async (id) => {
      try {
        isDeleting.value = true;
        
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuario no autenticado');
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const campo = userData.campo;

        const animalRef = doc(db, 'campos', campo, 'datosAnimales', id);

        await deleteDoc(animalRef);

        await fetchAnimals();
      } catch (error) {
        console.error('Error al eliminar el animal:', error);
      } finally {
        isDeleting.value = false;
      }
    };

    const confirmDelete = (id) => {
      if (confirm('¿Estás seguro de que deseas eliminar este animal?')) {
        deleteAnimal(id);
      }
    };

    const downloadPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Animal', 'Crias', 'Peso', 'Código', 'Edad', 'Sexo', 'Fecha de Creación']],
        body: animals.value.map(animal => [
          animal.Animal,
          animal.Crias === 0 ? 'No tiene' : animal.Crias,
          animal.Peso,
          animal.codigo,
          animal.edad,
          animal.sexo,
          animal.created_at && animal.created_at.seconds
            ? new Date(animal.created_at.seconds * 1000).toLocaleString()
            : 'No disponible'
        ]),
        theme: 'grid',
        styles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [65, 171, 52],
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
      doc.save('Lista_de_Animales.pdf');
    };

    const exportToExcel = () => {
      const wsData = [
        ['Animal', 'Crias', 'Peso', 'Código', 'Edad', 'Sexo', 'Fecha de Creación'],
        ...animals.value.map(animal => [
          animal.Animal,
          animal.Crias === 0 ? 'No tiene' : animal.Crias,
          animal.Peso,
          animal.codigo,
          animal.edad,
          animal.sexo,
          animal.created_at && animal.created_at.seconds
            ? new Date(animal.created_at.seconds * 1000).toLocaleString()
            : 'No disponible'
        ])
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Animales');
      XLSX.writeFile(wb, 'animal_list.xlsx');
    };

    onMounted(fetchAnimals);

    return {
      animals,
      loading,
      isDeleting,
      downloadPDF,
      exportToExcel,
      confirmDelete,
      tableContent,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');


.info-text {
  font-size: 1rem;
  color: black; /* Color similar al del encabezado de la tabla para mantener la consistencia */
  font-weight: 500;
  margin-right: 1rem;
}

.info-icon {
  margin-right: 0.5rem; /* Espacio entre el icono y el texto */
  font-size: 1.2rem; /* Tamaño del icono */
  color: #027B93; /* Color del icono */
}

.info-text {
  font-size: 1rem;
  color: black; /* Color similar al del encabezado de la tabla para mantener la consistencia */
  font-weight: 500;
}


.back-arrow {
  font-size: 1.5rem;
  color: #41AB34;
  transition: color 0.3s;
}

.back-arrow:hover {
  color: #388E3C;
}

.d-flex {
  display: flex;
}

.justify-content-end {
  justify-content: flex-end;
}

.table-container {
  border: 2px solid #41AB34;
  border-radius: 15px;
  overflow: hidden;
  padding: 1rem;
  background-color: #FFFFFF;
}

.table-responsive {
  border-radius: 15px;
  overflow: hidden;
}

.custom-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 15px;
}

.custom-table th,
.custom-table td {
  padding: 1rem;
  border: 1px solid #41AB34;
}

thead {
  background-color: #027B93;
  color: #FFFFFF;
}

.custom-table tr {
  border-radius: 15px;
}

.custom-table tr:first-child th:first-child {
  border-top-left-radius: 15px;
}

.custom-table tr:first-child th:last-child {
  border-top-right-radius: 15px;
}

.custom-table tr:last-child td:first-child {
  border-bottom-left-radius: 15px;
}

.custom-table tr:last-child td:last-child {
  border-bottom-right-radius: 15px;
}

.img-fluid {
  max-width: 25%;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
}
</style>
