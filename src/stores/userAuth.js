import { defineStore } from 'pinia'
import axios from 'axios'

// 🔑 Sanctum setup
axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.withCredentials = true // Required for Sanctum cookies

export const useUserAuthStore = defineStore('userAuth', {
  id: 'userAuth',
  state: () => ({
    user: null,        // Logged-in user
    errors: {},        // Validation errors from backend
  }),
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    // 🔹 Load authenticated user
    async loadUser() {
      try {
        const { data } = await axios.get('/api/user') // Ensure route is /api/user
        this.user = data.user || null
        this.errors = {}
      } catch (err) {
        console.error('Load user failed:', err.response?.data || err.message)
        this.user = null
      }
    },

    // 🔹 Login
    async login(credentials) {
      this.errors = {}
      try {
        await axios.get('/sanctum/csrf-cookie') // Get CSRF cookie first
        await axios.post('/login', credentials)  // Laravel login API

        await this.loadUser() // Load user after login
        return true
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {}
        } else if (err.response?.data?.message) {
          this.errors.general = err.response.data.message
        }
        console.error('Login failed:', err.response?.data || err.message)
        return false
      }
    },

    // 🔹 Register
    async register(userData) {
      this.errors = {}
      try {
        await axios.get('/sanctum/csrf-cookie')
        await axios.post('/register', userData)

        // Auto-login after registration
        const success = await this.login({ email: userData.email, password: userData.password })
        return success
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {}
        } else if (err.response?.data?.message) {
          this.errors.general = err.response.data.message
        }
        console.error('Register failed:', err.response?.data || err.message)
        return false
      }
    },

    // 🔹 Logout
    async logout() {
      try {
        await axios.post('/logout')
        this.user = null
        this.errors = {}
      } catch (err) {
        console.error('Logout failed:', err.response?.data || err.message)
      }
    }
  }
})
