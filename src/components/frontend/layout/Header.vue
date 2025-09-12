<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto flex items-center justify-between py-4 px-6">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-bold text-indigo-600">
        ShopMate
      </router-link>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-6 font-medium text-gray-700">
        <router-link to="/" class="hover:text-indigo-600 transition">Home</router-link>
        <router-link to="/shop" class="hover:text-indigo-600 transition">Shop</router-link>
        <router-link to="/about" class="hover:text-indigo-600 transition">About</router-link>
        <router-link to="/contact" class="hover:text-indigo-600 transition">Contact</router-link>
      </nav>

      <!-- Icons -->
      <div class="flex items-center space-x-4">
        <router-link to="/cart" class="relative">
        <svg xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-700 hover:text-indigo-600"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 4h14M16 17a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>

        <!-- Dynamic Cart Count -->
        <span v-if="cart.totalItems > 0"
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {{ cart.totalItems }}
        </span>
      </router-link>

        <router-link to="/profile">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z"/>
          </svg>
        </router-link>
      </div>

      <!-- Mobile Menu -->
      <button class="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </header>
</template>


<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>
