<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero Section -->
    <section class="bg-indigo-600 text-white py-20">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl font-bold mb-4">Welcome to ShopMate</h1>
        <p class="text-xl mb-8">Discover amazing products at unbeatable prices!</p>
        <router-link to="/shop" class="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Start Shopping
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold mb-10 text-gray-800">Featured Products</h2>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Loader if products not yet loaded -->
        <template v-if="loading">
          <div v-for="n in 8" :key="n" class="bg-white shadow-md rounded-lg animate-pulse h-[350px]"></div>
        </template>

        <!-- Products -->
        <template v-else>
          <div v-for="product in products" :key="product.id" class="bg-white shadow-md rounded-lg hover:shadow-xl transition overflow-hidden flex flex-col">
            <img v-if="product.image"  :src="`http://127.0.0.1:8000/storage/${product.image}`" :alt="product.name" class="w-full h-48 object-contain">
            <span v-else>No Image</span>
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ product.name }}</h3>
                <p class="text-gray-600 text-sm mb-2 truncate">{{ product.description }}</p>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-indigo-600 font-bold text-lg">${{ product.price }}</span>
                <span class="text-gray-500 text-sm">Stock: {{ product.stock }}</span>
              </div>
              <router-link :to="`/product/${product.id}`" class="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-center">
                View Product
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-indigo-700 text-white py-16 text-center">
      <h2 class="text-4xl font-bold mb-4">Don't Miss Our Special Offers!</h2>
      <p class="mb-6 text-lg">Sign up and get notified about discounts & new arrivals.</p>
      <router-link to="/shop" class="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
        Shop Now
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products')
    products.value = response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
