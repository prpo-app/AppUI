<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import bookService from '../services/bookService';

const router = useRouter();
const user = ref(null);
const books = ref([]);
const loading = ref(true);
const error = ref('');
const success = ref('');

// New book form
const newBook = ref({
  title: '',
  author: '',
  genre: '',
});

onMounted(async () => {
  user.value = authService.getUser();
  await loadBooks();
});

const loadBooks = async () => {
  try {
    loading.value = true;
    books.value = await bookService.getAllBooks();
  } catch (err) {
    error.value = 'Failed to load books';
  } finally {
    loading.value = false;
  }
};

const addBook = async () => {
  try {
    await bookService.createBook(newBook.value);
    success.value = 'Book added successfully!';
    error.value = '';

    newBook.value = { title: '', author: '', genre: '' };
    await loadBooks();

    setTimeout(() => (success.value = ''), 3000);
  } catch (err) {
    error.value = err.message || 'Failed to add book';
    setTimeout(() => (error.value = ''), 3000);
  }
};

const deleteBook = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return;

  try {
    await bookService.deleteBook(id);
    success.value = 'Book removed successfully!';
    await loadBooks();

    setTimeout(() => (success.value = ''), 3000);
  } catch (err) {
    error.value = err.message || 'Failed to delete book';
    setTimeout(() => (error.value = ''), 3000);
  }
};

const handleLogout = () => {
  authService.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="dashboard-container">
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-danger mb-4">
      <div class="container-fluid">
        <span class="navbar-brand">🛠 Admin</span>
        <div>
          <button @click="handleLogout" class="btn btn-outline-light btn-sm">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Alerts -->
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <!-- Add Book Form -->
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="mb-3">Add New Book</h5>

          <div class="row g-3">
            <div class="col-md-4">
              <input
                v-model="newBook.title"
                class="form-control"
                placeholder="Title"
              />
            </div>
            <div class="col-md-4">
              <input
                v-model="newBook.author"
                class="form-control"
                placeholder="Author"
              />
            </div>
            <div class="col-md-4">
              <input
                v-model="newBook.genre"
                class="form-control"
                placeholder="Genre"
              />
            </div>
          </div>

          <button @click="addBook" class="btn btn-danger mt-3">
            Add Book
          </button>
        </div>
      </div>

      <!-- Books Grid -->
      <div v-if="loading" class="text-center">Loading...</div>

      <div class="row">
        <div v-for="book in books" :key="book.id" class="col-md-3 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5>{{ book.title }}</h5>
              <small class="text-muted">by {{ book.author }}</small>
              <p class="mt-2">Genre: {{ book.genre }}</p>
            </div>

            <div class="card-footer bg-transparent">
              <button
                @click="deleteBook(book.id)"
                class="btn btn-sm btn-outline-danger w-100"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.card:hover {
  transform: translateY(-5px);
  transition: 0.2s;
}
</style>
