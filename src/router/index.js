import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import DashboardLayout from '@/components/DashboardLayout.vue'
import MainLayout from '@/components/frontend/layout/MainLayout.vue'
import CartPage from '@/components/frontend/pages/CartPage.vue'

// Frontend Pages 
import HomePage from '@/components/frontend/pages/HomePage.vue'
import ProductDetails from '@/components/frontend/pages/ProductDetails.vue'
import CheckoutPage from '@/components/frontend/pages/CheckoutPage.vue'

// Admin Pages
import AdminLogin from '@/components/Login.vue'
import AdminRegister from '@/components/Register.vue'
import Dashboard from '@/components/Dashboard.vue'
import Products from '@/components/Products.vue'

const routes = [
  // Admin auth pages (guest)
  {
    path: '/admin/login',
    component: AdminLogin,
    meta: { title: 'Admin Login', guest: true }
  },
  {
    path: '/admin/register',
    component: AdminRegister,
    meta: { title: 'Admin Register', guest: true }
  },

  // Admin dashboard routes (requires auth)
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: Dashboard, meta: { title: 'Dashboard Home' } },       // /admin
      { path: 'products', component: Products, meta: { title: 'Products' } },      // /admin/products
      // { path: 'orders', component: () => import('../components/Orders.vue'), meta: { title: 'Orders' } },
      // { path: 'customers', component: () => import('../components/Customers.vue'), meta: { title: 'Customers' } },
      // { path: 'settings', component: () => import('../components/Settings.vue'), meta: { title: 'Settings' } },
    ]
  },

  // Frontend routes (requires auth)
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: false },
    children: [
      { path: '', component: HomePage, meta: { title: 'Home' } },     
      { path: '/product/:id', component: ProductDetails, props: true,meta: { title: 'Product Details' } }, 
      { path: '/cart', component: CartPage, meta: { title: 'Cart' }  },
      { path: '/checkout', component: CheckoutPage, meta: { title: 'Checkout' }  },
      // { path: 'products', component: Products, meta: { title: 'Products' } },       
      // { path: 'orders', component: () => import('../components/Orders.vue'), meta: { title: 'Orders' } },
      // { path: 'customers', component: () => import('../components/Customers.vue'), meta: { title: 'Customers' } },
      // { path: 'settings', component: () => import('../components/Settings.vue'), meta: { title: 'Settings' } },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Redirect to login if route requires auth and user not logged in
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/admin/login' }
  }

  // Redirect authenticated user away from guest pages
  if (to.meta.guest && auth.isAuthenticated) {
    return { path: '/admin' }
  }
})

// Set page title
router.afterEach((to) => {
  document.title = to.meta.title || 'Vue App'
})

export default router
