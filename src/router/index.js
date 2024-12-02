import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import AnimalForm from '../components/AnimalForm.vue';
import AnimalList from '../components/AnimalList.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Hub from '../components/Hub.vue';
import NewsForm from '../components/NewsForm.vue';
import Team from '../components/Team.vue';
import News from '../components/News.vue';
import Profile from '../components/Profile.vue';
import AnimalDetail from '../components/AnimalDetail.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/animals/:id',
    name: 'AnimalDetail',
    component: AnimalDetail,
    props: true, 
  },
  {
    path: '/team',
    name: 'Team',
    component: Team,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/news',
    name: 'News',
    component: News,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/form',
    name: 'AnimalForm',
    component: AnimalForm,
    
  },
  {
    path: '/list',
    name: 'AnimalList',
    component: AnimalList,
    
  },
  {
    path: '/hub',
    name: 'Hub',
    component: Hub,
  },
  {
    path: '/newsform',
    name: 'News-Form',
    component: NewsForm,
  },
];




const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authUser = localStorage.getItem('authUser');
  if (to.matched.some(record => record.meta.requiresAuth) && !authUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
