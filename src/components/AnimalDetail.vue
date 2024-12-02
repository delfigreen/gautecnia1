<template>
    <div v-if="animal" class="animal-detail container mt-4">
        <router-link to="/list" class="back-arrow me-3">
      <i class="bi bi-arrow-left"></i>
    </router-link>
      <div class="d-flex justify-content-end mb-3">
        <button @click="downloadPDF" class="btn btn-success">Exportar a PDF</button>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ animal.Animal }}</h5>
          <p><strong>Crias:</strong> {{ animal.Crias === 0 ? 'No tiene' : animal.Crias }}</p>
          <p><strong>Peso:</strong> {{ animal.Peso }}</p>
          <p><strong>Código:</strong> {{ animal.codigo }}</p>
          <p><strong>Edad:</strong> {{ animal.edad }}</p>
          <p><strong>Sexo:</strong> {{ animal.sexo }}</p>
          <p><strong>Fecha de Creación:</strong> 
            {{ animal.created_at && animal.created_at.seconds
              ? new Date(animal.created_at.seconds * 1000).toLocaleString()
              : 'No disponible' }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { doc, getDoc } from 'firebase/firestore';
  import { db, auth } from '../firebase';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  
  export default {
    name: 'AnimalDetail',
    setup(props) {
      const animal = ref(null);
  
      const fetchAnimal = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error('Usuario no autenticado');
          }
  
          const id = props.id;
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const campo = userData.campo;
  
          const animalDoc = await getDoc(doc(db, 'campos', campo, 'datosAnimales', id));
          animal.value = animalDoc.data();
        } catch (error) {
          console.error('Error al obtener el animal:', error);
        }
      };
  
      const downloadPDF = () => {
        if (!animal.value) return;
  
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Detalles del Animal', 10, 10);
        doc.setFontSize(14);
  
        const data = [
          ['Animal', animal.value.Animal],
          ['Crias', animal.value.Crias === 0 ? 'No tiene' : animal.value.Crias],
          ['Peso', animal.value.Peso],
          ['Código', animal.value.codigo],
          ['Edad', animal.value.edad],
          ['Sexo', animal.value.sexo],
          ['Fecha de Creación', animal.value.created_at && animal.value.created_at.seconds
            ? new Date(animal.value.created_at.seconds * 1000).toLocaleString()
            : 'No disponible']
        ];
  
        doc.autoTable({
          startY: 20,
          head: [['Campo', 'Valor']],
          body: data,
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
  
        doc.save(`Detalles_del_Animal_${animal.value.codigo}.pdf`);
      };
  
      onMounted(fetchAnimal);
  
      return {
        animal,
        downloadPDF,
      };
    },
    props: {
      id: {
        type: String,
        required: true,
      },
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
  .animal-detail {
    margin-top: 2rem;
  }
  
  .card {
    border-radius: 15px;
    border: 1px solid #41AB34;
  }
  
  .card-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .card-body p {
    margin: 0.5rem 0;
  }
  </style>
  