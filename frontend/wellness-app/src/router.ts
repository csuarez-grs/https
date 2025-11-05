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
    path: '/home',
    name: 'Home',
    component: Home,
    props: true,
    default: true
  },
  {
    path: '/admin-dashboard/:username?',
    name: 'AdminDashboard',
    component: () => import('./components/Dashboard.vue'),
    props: true
  },
  {
    path: '/dashboard/:username?',
    name: 'UserDashboard',
    component: () => import('./components/UserDashboard.vue'),
    props: true
  },
  {
    path: '/',
    redirect: '/home'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for dashboard routes
router.beforeEach((to, _, next) => {
  if (to.name === 'AdminDashboard') {
    // Require username and admin role for admin dashboard
    const username = to.params.username;
    // Try to get role from query or localStorage (simulate session)
    const role = to.query.role || localStorage.getItem('role');
    if (!username || role !== 'admin') {
      return next({ name: 'Login' });
    }
  }
  if (to.name === 'UserDashboard') {
    if (!to.params.username) {
      return next({ name: 'Login' });
    }
  }
  next();
});

export default router;
