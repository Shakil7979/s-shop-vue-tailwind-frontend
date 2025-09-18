<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-6">
      <h1 class="text-3xl font-bold mb-8">🛒 Your Cart</h1>

      <div v-if="cart.items.length === 0" class="text-center py-20 bg-white rounded-xl shadow">
        <p class="text-lg text-gray-600">Your cart is empty.</p>
      </div>

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
              <td class="py-3 flex items-center gap-4"> 
                <img v-if="item.image" :src="`http://127.0.0.1:8000/storage/${item.image}`" :alt="item.name" class="w-16 h-16 object-cover rounded">
                <span v-else>No Image</span>
                <span>{{ item.name }}</span>
              </td>
              <td class="py-3">${{ Number(item.price).toFixed(2) }}</td>
              <td class="py-3 flex items-center gap-2">
                <button @click="decrease(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increase(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </td>
              <td class="py-3 font-semibold">${{ (Number(item.price) * item.quantity).toFixed(2) }}</td>
              <td class="py-3">
                <button @click="remove(item.id)" class="text-red-600 hover:underline">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center mt-6">
          <h2 class="text-xl font-bold">Total: ${{ cart.totalPrice.toFixed(2) }}</h2>
          <button @click="handleCheckout" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Login/Register Popup -->
    <div v-if="showAuthPopup" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-xl w-96">
        <h2 class="text-xl font-bold mb-4">{{ isLoginMode ? 'Login' : 'Register' }}</h2>

        <form @submit.prevent="isLoginMode ? login() : register()" class="space-y-4">
          <input v-if="!isLoginMode" v-model="form.name" type="text" placeholder="Name" class="w-full px-4 py-2 border rounded" />
          <input v-model="form.email" type="email" placeholder="Email" class="w-full px-4 py-2 border rounded" />
          <input v-model="form.password" type="password" placeholder="Password" class="w-full px-4 py-2 border rounded" />

          <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            {{ isLoginMode ? 'Login' : 'Register' }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-500">
          <span v-if="isLoginMode">Don't have an account?</span>
          <span v-else>Already have an account?</span>
          <button @click="toggleMode" class="text-indigo-600 underline ml-1">
            {{ isLoginMode ? 'Register' : 'Login' }}
          </button>
        </p>

        <button @click="showAuthPopup = false" class="mt-4 text-gray-500 underline">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserAuthStore } from '@/stores/userAuth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const cart = useCartStore()
const userAuth = useUserAuthStore()
const router = useRouter()

// Popup & Mode
const showAuthPopup = ref(false)
const isLoginMode = ref(true)
const form = reactive({ name: '', email: '', password: '' })

onMounted(async () => {
  cart.hydrateCart()
  if (!userAuth.user) {
    await userAuth.loadUser() // Load user on page reload
  }
})

// Cart actions
const increase = (item) => { 
  cart.updateQuantity(item.id, item.quantity + 1)
  toast.success(`➕ Increased ${item.name}`)
}

const decrease = (item) => { 
  cart.updateQuantity(item.id, item.quantity - 1)
  toast.info(`➖ Decreased ${item.name}`)
}

const remove = (id) => { 
  const item = cart.items.find(p => p.id === id)
  if(item){
    cart.removeFromCart(id)
    toast.error(`❌ Removed ${item.name}`)
  }
}

// Checkout button
const handleCheckout = () => {
  if (!userAuth.isLoggedIn) {
    showAuthPopup.value = true
  } else {
    router.push('/checkout')
  }
}

// Toggle login/register mode
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  Object.assign(form, { name: '', email: '', password: '' })
}

// Login function
const login = async () => {
  if (!form.email || !form.password) {
    toast.error('Please fill all fields')
    return
  }

  const success = await userAuth.login({ email: form.email, password: form.password })
  if (success) {
    toast.success('✅ Login successful')
    showAuthPopup.value = false
    setTimeout(() => router.push('/checkout'), 1000)
  } else {
    // Combine all errors from backend
    const msg = Object.values(userAuth.errors).flat().join(' ') || '❌ Login failed'
    toast.error(msg)
  }
}

// Register function
const register = async () => {
  if (!form.name || !form.email || !form.password) {
    toast.error('Please fill all fields')
    return
  }

  console.log("Register called", form) // Debugging

  const success = await userAuth.register({ 
    name: form.name, 
    email: form.email, 
    password: form.password 
  })

  if (success) {
    toast.success('✅ Registration successful')
    showAuthPopup.value = false
    setTimeout(() => router.push('/checkout'), 1000)
  } else {
    const msg = Object.values(userAuth.errors).flat().join(' ') || '❌ Registration failed'
    toast.error(msg)
  }
}
</script>
