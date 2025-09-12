<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Create Your Account</h2>

      <form @submit.prevent="registerUser" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

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

        <!-- Confirm Password -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-700 cursor-pointer hover:bg-purple-800 text-white py-2 rounded-md font-semibold transition-colors duration-200 flex justify-center items-center"
        >
          <span v-if="!loading">Register</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
          </svg>
        </button>
      </form>

      <!-- Login Link -->
      <p class="mt-4 text-center text-gray-600 text-sm">
        Already have an account?
        <RouterLink to="/admin/login" class="text-purple-700 font-semibold underline">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>



<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false) // spinner / disable button

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function registerUser() {
  // Reset frontend errors
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  let valid = true

  // ✅ Frontend validation
  if (!name.value) {
    errors.name = 'Name is required'
    valid = false
  }

  if (!email.value) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = 'Enter a valid email'
    valid = false
  }

  if (!password.value) {
    errors.password = 'Password is required'
    valid = false
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    valid = false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Confirm password is required'
    valid = false
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    valid = false
  }

  if (!valid) {
    toast.error("Please fill all required fields!")
    return 
  }

  // ✅ Call Pinia store register
  loading.value = true
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    })

    if (auth.isAuthenticated) {
      toast.success("✅ Registration successful")
      setTimeout(() => {
        router.push('/admin')
      }, 2000);
    } else {
      // Show backend validation errors from API
      Object.assign(errors, auth.errors)
      toast.error("❌ Registration failed. Check your inputs.")
    }
  } catch (err) {
    console.error('Registration Error:', err)
    toast.error(err.response?.data?.message || '❌ Registration failed')
  } finally {
    loading.value = false
  }
}
</script>