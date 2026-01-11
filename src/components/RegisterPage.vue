<script setup>
import { ref } from 'vue';
import authService from '../services/authService';
import router from '../router';

const username = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  // Reset error
  error.value = '';
  
  // Validate inputs
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;

  try {
    await authService.register(username.value, password.value);
    
    // Show success message
    success.value = 'Registration successful! Please login to confirm.';
    error.value = '';
    
    // Clear form
    const registeredUsername = username.value;
    username.value = '';
    password.value = '';
    
    // Switch to login after 2 seconds
    setTimeout(() => {
      router.push({name : 'Login'});
    }, 2000);
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <div class="row justify-content-center w-100">
      <div class="col-md-6 col-lg-4 col-xl-3">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Register</h2>
            
            <form @submit.prevent="handleSubmit" class="text-center">
              <!-- Username Input -->
              <div class="mb-3">
                <label for="username" class="form-label pe-2">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  placeholder="Choose a username"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- Password Input -->
              <div class="mb-3">
                <label for="password" class="form-label pe-2">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Choose a password"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- Success Message -->
              <div v-if="success" class="alert alert-success" role="alert">
                {{ success }}
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
                  {{ loading ? 'Registering...' : 'Register' }}
                </button>
              </div>
            </form>

            <!-- Switch to Login -->
            <div class="text-center mt-3">
              <router-link to="/" class="text-decoration-none">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
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
