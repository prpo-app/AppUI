<script setup>
import { ref } from 'vue';
import authService from '../services/authService';
import { useRouter } from 'vue-router';
//import { B } from 'vue-router/dist/router-CWoNjPRp.mjs';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const emit = defineEmits(['login-success']);
const router = useRouter();



const handleSubmit = async () => {
  error.value = '';
  
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password';
    return;
  }

  loading.value = true;

  try {
    const data = await authService.login(username.value, password.value);
    
    const user = authService.getUser();

    if(user.username == 'admin') {
      router.push({ name: 'Admin' });
    } else {
      router.push({ name: 'Books' });
    }

    username.value = '';
    password.value = '';
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Login</h2>
            
            <form @submit.prevent="handleSubmit">
              <!-- Username Input -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="username"
                  class="form-control"
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- Password Input -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <!-- Submit Button -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </form>

            <!-- Additional Links -->
            <div class="text-center mt-3">
              <RouterLink to="/register" class="text-decoration-none">New user?</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 1rem;
}

.card-title {
  font-weight: 600;
  color: #333;
}
</style>
