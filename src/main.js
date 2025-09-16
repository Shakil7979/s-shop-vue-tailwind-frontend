import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toasity from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useUserAuthStore } from './stores/userAuth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Vue3Toasity, { autoClose: 3000, position: "top-right" })

// 🔑 Load user from token before mount
const userAuth = useUserAuthStore()
await userAuth.loadUser() // ensures token persists and user is loaded

app.mount('#app')
