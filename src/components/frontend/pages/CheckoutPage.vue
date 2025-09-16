<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 🛒 Cart Summary -->
      <div class="md:col-span-1 bg-white p-6 rounded-xl shadow">
        <h2 class="text-2xl font-bold mb-4">🛍 Order Summary</h2>
        <ul class="divide-y">
          <li
            v-for="item in cart.items"
            :key="item.id"
            class="flex justify-between py-3"
          >
            <div>
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
            </div>
            <p class="font-semibold">
              ${{ (Number(item.price) * item.quantity).toFixed(2) }}
            </p>
          </li>
        </ul>
        <div class="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${{ cart.totalPrice.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 📝 Checkout Form -->
      <div class="md:col-span-2 bg-white p-6 rounded-xl shadow">
        <h2 class="text-2xl font-bold mb-6">💳 Checkout</h2>
        <form @submit.prevent="placeOrder" class="space-y-6">
          <!-- Customer Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full mt-1 px-4 py-2 border rounded-lg cursor-not-allowed" readonly
              />
            </div>
            <div>
              <label class="block text-sm font-medium">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full mt-1 px-4 py-2 border rounded-lg cursor-not-allowed" readonly
              />
            </div>
            <div>
              <label class="block text-sm font-medium">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full mt-1 px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium">Address</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full mt-1 px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium mb-2">Payment Method</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="form.payment"
                  value="cod"
                  required
                />
                Cash on Delivery
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="form.payment"
                  value="online"
                />
                Online Payment
              </label>
            </div>
          </div>

          <!-- Place Order Button -->
          <div class="pt-4">
            <button
              type="submit"
              class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition w-full"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue' 
import { useCartStore } from '@/stores/cart'
import { useUserAuthStore } from '@/stores/userAuth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const cart = useCartStore()
const userAuth = useUserAuthStore()

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  payment: '',
})

// 🔑 Auto-fill name/email on mounted after user loaded
onMounted(async () => {
  // Load user if token exists and user not yet loaded
  if (!userAuth.user && userAuth.token) {
    await userAuth.loadUser()
  }

  // Set name/email if user is available
  if (userAuth.user) {
    form.name = userAuth.user.name || ''
    form.email = userAuth.user.email || ''
    console.log('Form auto-filled with user:', form)
  }
})

// Handle Place Order
const placeOrder = () => {
  if (cart.items.length === 0) {
    toast.error('❌ Your cart is empty!')
    return
  }

  console.log('Order submitted:', {
    customer: form,
    items: cart.items,
    total: cart.totalPrice,
  })

  toast.success('✅ Order placed successfully!')

  cart.clearCart()
}
</script>
