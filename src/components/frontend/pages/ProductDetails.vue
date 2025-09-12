<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-6">
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <!-- Product Details -->
      <div
        v-else-if="product"
        class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-xl"
      >
        <!-- Image -->
        <div class="flex items-center justify-center">
          <div class="w-full max-w-md">
            <img
              v-if="product.image"
              :src="`http://127.0.0.1:8000/storage/${product.image}`"
              :alt="product.name"
              class="w-full h-96 object-contain rounded-xl shadow-md bg-gray-100"
            />
            <span
              v-else
              class="flex items-center justify-center w-full h-96 bg-gray-100 rounded-xl text-gray-500"
            >
              No Image
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col justify-between">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ product.name }}</h1>
          <p class="text-gray-600 text-base leading-relaxed mb-6">
            {{ product.description }}
          </p>

          <!-- Price & Stock -->
          <div class="flex items-center gap-6 mb-6">
            <span class="text-3xl font-bold text-indigo-600">${{ product.price }}</span>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
            </span>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center gap-4 mb-6">
            <button
              @click="decreaseQty"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
            >
              -
            </button>
            <span class="text-xl font-semibold">{{ quantity }}</span>
            <button
              @click="increaseQty"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
            >
              +
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <button
              class="bg-indigo-600 cursor-pointer text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              :disabled="product.stock <= 0"
              :class="{ 'opacity-50 cursor-not-allowed': product.stock <= 0 }"
              @click="addProductToCart"
            >
              Add to Cart
            </button>

            <button
              class="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-700">Product not found!</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const cart = useCartStore()

const fetchProduct = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/products/${route.params.id}`)
    product.value = response.data
  } catch (error) {
    console.error('Failed to fetch product:', error)
  } finally {
    loading.value = false
  }
}

const increaseQty = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addProductToCart = () => {
  if (product.value && product.value.stock > 0) {
    cart.addToCart({ ...product.value, quantity: quantity.value })
    toast.success(`${quantity.value} x ${product.value.name} added to cart!`)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>
