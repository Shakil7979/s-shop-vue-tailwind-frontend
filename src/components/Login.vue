<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

      <form @submit.prevent="loginUser" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="example@mail.com"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-700 hover:bg-purple-800 cursor-pointer text-white py-2 rounded-md font-semibold transition-colors duration-200 flex justify-center items-center"
        >
          <span v-if="!loading">Login</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
          </svg>
        </button>
      </form>

      <!-- Register Link -->
      <p class="mt-4 text-center text-gray-600 text-sm">
        Don’t have an account?
        <RouterLink to="/admin/register" class="text-purple-700 font-semibold underline">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false) // ✅ loading state

// Computed for store errors
const errors = computed(() => auth.errors)
async function loginUser() {
  auth.errors = {}
  let valid = true

  if (!email.value) {
    auth.errors.email = 'Email is required.'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    auth.errors.email = 'Enter a valid email.'
    valid = false
  }

  if (!password.value) {
    auth.errors.password = 'Password is required.'
    valid = false
  } else if (password.value.length < 6) {
    auth.errors.password = 'Password must be at least 6 characters.'
    valid = false
  }

  if (!valid) {
    toast.error("Please fill all required fields!")
    return
  }

  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })

    if (auth.isAuthenticated) {
      toast.success("✅ Login successful")
      router.push('/admin') // ✅ success হলে redirect
    } else {
      // ✅ backend থেকে আসা error show
      toast.error(auth.errors.general || "❌ Invalid credentials")
    }
  } catch (err) {
    toast.error("Something went wrong!")
  } finally {
    loading.value = false
  }
}

</script>
