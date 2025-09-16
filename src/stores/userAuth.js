import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('user_token') || null, // persist token
  }),
  getters: {
    isLoggedIn: (state) => !!state.token // 🔑 depend on token, not user
  },
  actions: {
    async login(credentials) {
      try {
        const { data } = await axios.post('http://127.0.0.1:8000/api/users/login', credentials)
        if (data.success) {
          this.user = data.user
          this.token = data.token
          localStorage.setItem('user_token', data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message)
        return false
      }
    },

    async register(userData) {
      try {
        const { data } = await axios.post('http://127.0.0.1:8000/api/users/register', userData)
        if (data.success) {
          this.user = data.user
          this.token = data.token
          localStorage.setItem('user_token', data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        }
        return false
      } catch (error) {
        console.error('Register error:', error.response?.data || error.message)
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user_token')
      delete axios.defaults.headers.common['Authorization']
    },

    async loadUser() {
    const token = localStorage.getItem('user_token')
    if (!token) return // token না থাকলে আর কিছু করো না

    this.token = token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/users/me')
        this.user = data.user
    } catch (err) {
        console.error('Load user failed:', err.response?.data || err.message)
        // শুধুমাত্র invalid token হলে remove করো
        if (err.response && err.response.status === 401) {
        this.logout()
        }
    }
    }
  }
})
