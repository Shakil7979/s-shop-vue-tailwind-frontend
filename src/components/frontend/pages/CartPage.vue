<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-6">
      <!-- Page Title -->
      <h1 class="text-3xl font-bold mb-8">🛒 Your Cart</h1>

      <!-- Empty Cart -->
      <div v-if="cart.items.length === 0" class="text-center py-20 bg-white rounded-xl shadow">
        <p class="text-lg text-gray-600">Your cart is empty.</p>
      </div>

      <!-- Cart Items -->
      <div v-else class="bg-white rounded-xl shadow p-6">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-3">Product</th>
              <th class="py-3">Price</th>
              <th class="py-3">Quantity</th>
              <th class="py-3">Total</th>
              <th class="py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart.items" :key="item.id" class="border-b">
              <!-- Product Name + Optional Thumbnail -->
              <td class="py-3 flex items-center gap-4">
                <img v-if="item.image" :src="item.image" class="w-16 h-16 object-cover rounded" />
                <span>{{ item.name }}</span>
              </td>

              <!-- Price -->
              <td class="py-3">${{ item.price.toFixed(2) }}</td>

              <!-- Quantity Controls -->
              <td class="py-3 flex items-center gap-2">
                <button @click="decrease(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increase(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </td>

              <!-- Total per Product -->
              <td class="py-3 font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</td>

              <!-- Remove Button -->
              <td class="py-3">
                <button @click="remove(item.id)" class="text-red-600 hover:underline">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Cart Footer: Total + Checkout -->
        <div class="flex justify-between items-center mt-6">
          <h2 class="text-xl font-bold">Total: ${{ cart.totalPrice.toFixed(2) }}</h2>
          <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const cart = useCartStore()

// Increase quantity
const increase = (item) => {
  cart.updateQuantity(item.id, item.quantity + 1)
  toast.success(`➕ Increased ${item.name}`)
}

// Decrease quantity
const decrease = (item) => {
  cart.updateQuantity(item.id, item.quantity - 1)
  toast.info(`➖ Decreased ${item.name}`)
}

// Remove product
const remove = (id) => {
  const item = cart.items.find(p => p.id === id)
  if (item) {
    cart.removeFromCart(id)
    toast.error(`❌ Removed ${item.name}`)
  }
}
</script>
