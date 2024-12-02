<template>
  <div class="container news-container animate__animated animate__fadeIn">
    <div class="header d-flex align-items-center mb-4">
      <router-link to="/hub" class="back-arrow me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h1 class="text-center w-100">Todas las Noticias</h1>
    </div>
    <div class="row">
      <div v-for="(item, index) in newsItems" :key="index" class="col-md-4 mb-3">
        <div class="card">
          <img :src="item.imageUrl" alt="news image" class="card-img-top" v-if="item.imageUrl">
          <div v-else class="card-img-top no-image">
            <span>Sin Imagen</span>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ item.description }}</p>
            <p class="card-author">Publicado por: {{ item.user }}</p>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  name: 'News',
  setup() {
    const newsItems = ref([]);

    onMounted(async () => {
      try {
        await getNews();
      } catch (error) {
        console.error('Error fetching news data:', error.message);
      }
    });

    const getNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        newsItems.value = querySnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.error('Error fetching news data:', error.message);
      }
    };

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString();
    };

    return {
      newsItems,
      formatDate
    };
  }
};
</script>

<style scoped>
/* Estilos generales */
.news-container {
  padding: 20px;
  background-color: whitesmoke;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  position: relative;
}

.back-arrow {
  font-size: 1.5rem;
  color: #41AB34;
  transition: color 0.3s;
}

.back-arrow:hover {
  color: #388E3C;
}

h1 {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Estilos de la tarjeta de noticia */
.card {
  border: none;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f8f9fa; /* Color de fondo para tarjetas sin imagen */
}

.no-image {
  width: 100%;
  height: 180px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #6c757d;
}

.card-body {
  padding: 15px;
  background-color: #fff;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.card-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.card-author, .card-date {
  font-size: 0.875rem;
  color: #999;
}

.card-author {
  margin-bottom: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .news-container {
    padding: 15px;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 10px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-text, .card-author, .card-date {
    font-size: 0.875rem;
  }
}
</style>
