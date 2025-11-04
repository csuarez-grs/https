import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from './components/LoginRegister.vue';
import Home from './components/home.vue';
// import App from './App.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginRegister,
    props: { mode: 'login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: LoginRegister,
    props: { mode: 'register' }
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
