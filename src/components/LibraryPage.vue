<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import libraryService from '../services/libraryService';
import bookService from '../services/bookService';

const router = useRouter();
const user = ref(null);
const myLibrary = ref([]);
const selectedStatus = ref(null);

const statusOptions = [
  { value: null, label: 'All Books' },
  { value: 'WantToRead', label: 'Want to Read' },
  { value: 'CurrentlyReading', label: 'Currently Reading' },
  { value: 'Read', label: 'Read' }
];

onMounted(async () => {
  user.value = authService.getUser();
  await loadLibrary();
});

const loadLibrary = async () => {
  const libraryItems = await libraryService.getLibrary(0, 100, selectedStatus.value);
  const books = await bookService.getAllBooks();

  myLibrary.value = libraryItems.map(item => ({
    ...item,
    book: books.find(b => b.id === item.bookId)
  }));
};

const removeFromLibrary = async (bookId) => {
  await libraryService.removeFromLibrary(bookId);
  await loadLibrary();
};

const goToBrowse = () => {
  router.push({ name: 'Books' });
};

const handleLogout = () => {
  authService.logout();
  router.push({ name: 'Login' });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'WantToRead':
      return 'btn-info';        // blue
    case 'CurrentlyReading':
      return 'btn-warning';     // yellow
    case 'Read':
      return 'btn-success';     // green
    default:
      return 'bg-light';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'WantToRead':
      return 'Want to Read';
    case 'CurrentlyReading':
      return 'Currently Reading';
    case 'Read':
      return 'Read';
    default:
      return status;
  }
};
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar navbar-dark bg-primary mb-4">
      <div class="container-fluid pb-1">
        <span class="navbar-brand">📚 My Library</span>
        <div>
          <span class="text-white me-3">Welcome, {{ user?.username }}</span>
          <button @click="goToBrowse" class="btn btn-outline-light btn-sm me-2">
            Browse Books
          </button>
          <button @click="handleLogout" class="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container">
      <select v-model="selectedStatus" @change="loadLibrary" class="form-select mb-4">
        <option v-for="s in statusOptions" :key="s.value" :value="s.value">
          {{ s.label }}
        </option>
      </select>

      <div class="row">
        <div v-for="item in myLibrary" :key="item.bookId" class="col-md-3 mb-4">
          <div class="card h-100 shadow-sm p-1">
            <div class="card-body">
              <h5>{{ item.book?.title }}</h5>
              <small class="text-muted">by {{ item.book?.author }}</small>
              <p class="mt-2">Genre: {{ item.book?.genre }}</p>
              <span class="badge bg-info">{{ item.status }}</span>
            </div>
            <div class="card-footer bg-transparent">
              <button @click="removeFromLibrary(item.bookId)" class="btn btn-sm btn-outline-danger w-100">Remove</button>
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
