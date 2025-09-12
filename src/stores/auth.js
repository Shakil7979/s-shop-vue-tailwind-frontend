// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // user info memory তে থাকবে
    token: localStorage.getItem('token') || null, // token localStorage থেকে load হবে
    isAuthenticated: !!localStorage.getItem('token'),
    errors: {}, // backend/frontend errors
    loading: false
  }),
  actions: {
    // =========================
    // REGISTER
    // =========================
    async register(payload) {
      this.loading = true
      this.errors = {}

      try {
        const res = await axios.post('http://127.0.0.1:8000/api/register', payload)

        // Save token (localStorage) & user (memory only)
        this.token = res.data.token
        this.user = res.data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token) // token save
        // ✅ user localStorage এ save হবে না

      } catch (err) {
        if (err.response?.data?.errors) {
          this.errors = err.response.data.errors
        } else {
          this.errors.general = err.response?.data?.message || 'Registration failed'
        }
        this.isAuthenticated = false
      } finally {
        this.loading = false
      }
    },

    // =========================
    // LOGIN
    // =========================
    async login(payload) {
      this.loading = true
      this.errors = {}

      try {
        const res = await axios.post('http://127.0.0.1:8000/api/login', payload)

        // Save token (localStorage) & user (memory only)
        this.token = res.data.token
        this.user = res.data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token) // token save
        // ✅ user localStorage এ save হবে না

      } catch (err) {
        // Backend থেকে আসা message handle
        if (err.response?.data?.message) {
          this.errors.general = err.response.data.message
        } else {
          this.errors.general = 'Login failed'
        }
        this.isAuthenticated = false
        this.user = null
      } finally {
        this.loading = false
      }
    },

    // =========================
    // LOGOUT
    // =========================
    async logout() {
      if (!this.token) return

      this.loading = true
      try {
        await axios.post(
          'http://127.0.0.1:8000/api/logout',
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        )

        // Clear state & remove token
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.errors = {}

        localStorage.removeItem('token') // token remove
      } catch (err) {
        console.error('Logout Error:', err)
        this.errors.general = 'Failed to logout'
      } finally {
        this.loading = false
      }
    }
  }
})
