<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import bookService from '../services/bookService';
import libraryService from '../services/libraryService';

const router = useRouter();
const user = ref(null);
const availableBooks = ref([]);
const searchAuthor = ref('');
const searchGenre = ref('');
const error = ref('');
const loading = ref(true);
const success = ref('');
const libraryBookIds = ref(new Set());

onMounted(async () => {
    user.value = authService.getUser();
    await Promise.all([loadBooks(), loadLibraryIds()]);
});

const loadLibraryIds = async () => {
  const library = await libraryService.getLibrary(0, 100);
  libraryBookIds.value = new Set(library.map(item => item.bookId));
};

const isInLibrary = (bookId) => {
  return libraryBookIds.value.has(bookId);
};

const loadBooks = async () => {
    try {
        loading.value = true;
        availableBooks.value = await bookService.getBooks(
        0, 
        100, 
        searchAuthor.value || null, 
        searchGenre.value || null);
        loading.value = false;
  } catch (err) {
    console.error('Failed to load books:', err);
    throw err;
  }
};

const addToLibrary = async (bookId, status) => {
    try {
        await libraryService.addToLibrary(bookId, status);
        libraryBookIds.value.add(bookId);

        error.value = '';
        success.value = 'Book added to your library!';

        // auto-hide after 3 seconds
        setTimeout(() => {
        success.value = '';
        }, 3000);

    } catch (err) {
        error.value = err.message || 'Failed to add book';
        // auto-hide after 3 seconds
        setTimeout(() => {
        error.value = '';
        }, 3000);
    }
};

const goToLibrary = () => {
    router.push({ name: 'Library' });
};

const handleLogout = () => {
    authService.logout();
    router.push({ name: 'Login' });
};
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar navbar-dark bg-primary mb-4">
      <div class="container-fluid">
        <span class="navbar-brand">📚 BookWorm 📚</span>
        <div>
          <button @click="goToLibrary" class="btn btn-outline-light btn-sm me-2">
            Library
          </button>
          <button @click="handleLogout" class="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container">
    <!-- Error Message -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = ''"></button>
      </div>
      <!-- Success Message -->
        <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ success }}
        <button type="button" class="btn-close" @click="success = ''"></button>
        </div>
      <div class="row mb-4">
        <div class="col-md-4">
          <input v-model="searchAuthor" class="form-control" placeholder="Search by author" />
        </div>
        <div class="col-md-4">
          <input v-model="searchGenre" class="form-control" placeholder="Search by Genre" />
        </div>
        <div class="col-md-4">
          <button @click="loadBooks" class="btn btn-primary w-100">Search</button>
        </div>
      </div>

      <div v-if="loading" class="text-center">Loading...</div>

      <div class="row">
        <div v-for="book in availableBooks" :key="book.id" class="col-md-3 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5>{{ book.title }}</h5>
              <small class="text-muted">by {{ book.author }}</small>
              <p class="mt-2">Genre: {{ book.genre }}</p>
            </div>
            <div class="card-footer bg-transparent btn-group">
                <div v-if="isInLibrary(book.id)">
                    <span class="badge bg-success">In Library</span>
                </div>
                <div v-else class="btn-group w-100">
                    <button @click="addToLibrary(book.id, 'WantToRead')" class="btn btn-sm btn-outline-info">Want</button>
                    <button @click="addToLibrary(book.id, 'CurrentlyReading')" class="btn btn-sm btn-outline-warning">Reading</button>
                    <button @click="addToLibrary(book.id, 'Read')" class="btn btn-sm btn-outline-success">Read</button>
                </div>
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
