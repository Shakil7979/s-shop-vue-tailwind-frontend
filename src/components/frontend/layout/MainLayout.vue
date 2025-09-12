<template>
  <div>
    <Header />
    <main class="min-h-[70vh]">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>
