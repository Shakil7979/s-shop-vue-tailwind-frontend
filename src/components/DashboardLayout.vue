<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex flex-col">
      <div class="p-4 py-[13px] text-2xl font-bold text-blue-600 border-b">E-Shop Admin</div>
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          to="/admin"
          class="block px-3 py-2 rounded hover:bg-blue-100"
        >📊 Dashboard</RouterLink>

        <RouterLink
          to="/admin/products"
          class="block px-3 py-2 rounded hover:bg-blue-100"
        >🛍️ Products</RouterLink>

        <RouterLink
          to="/admin/orders"
          class="block px-3 py-2 rounded hover:bg-blue-100"
        >📦 Orders</RouterLink>

        <RouterLink
          to="/admin/customers"
          class="block px-3 py-2 rounded hover:bg-blue-100"
        >👥 Customers</RouterLink>

        <RouterLink
          to="/admin/settings"
          class="block px-3 py-2 rounded hover:bg-blue-100"
        >⚙️ Settings</RouterLink>
      </nav>
    </aside>

    <!-- Main Section -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow flex items-center justify-between px-6 py-3">
        <!-- Left -->
        <div class="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            class="border rounded px-3 py-1"
          />
        </div>

        <!-- Right -->
        <div class="flex items-center space-x-4">
          <span class="text-gray-700 font-medium">
            Hello, {{ auth.user?.name || 'Admin' }}
            </span>
          <button
            @click="logoutUser"
            class="bg-red-500 text-white px-3 py-1 cursor-pointer rounded"
          >Logout</button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' 
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()


async function logoutUser() {
  try {
    await auth.logout() // Pinia store er logout method API call handle korbe
    router.push('/admin/login') // logout er por login page e redirect
  } catch (err) {
    console.error('Logout Error:', err)
    alert('Failed to logout')
  }
}
</script>
