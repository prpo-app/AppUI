<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/AppHeader.vue'
import Guides from '../components/AppGuides.vue'
import Footer from '../components/AppFooter.vue'
import LoginPage from '../components/LoginPage.vue'
import authService from '../services/authService'

</script>

<template>
  <router-view />
</template>
