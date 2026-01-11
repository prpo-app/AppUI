import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import authService from '../services/authService';
import BooksPage from '../components/BooksPage.vue';
import LibraryPage from '../components/LibraryPage.vue';
import AdminPage from '../components/AdminPage.vue';

const user = authService.getUser();

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/bookworm',
    name: 'Books',
    component: BooksPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/mylibrary',
    name: 'Library',
    component: LibraryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true }
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to protect private routes and redirect authenticated users from login
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  
  // If route requires auth and user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  }
  // If user is authenticated and tries to access login/register, redirect to main page
  if (to.meta.redirectIfAuth && isAuthenticated) {
    next({ name: 'Books' });
  }
  else {
    next();
  }
})

export default router;




