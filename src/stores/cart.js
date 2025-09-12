import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  id: 'cart',
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    addToCart(product, qty = 1) {
      const existing = this.items.find(p => p.id === product.id)
      if (existing) {
        existing.quantity += qty
      } else {
        this.items.push({ ...product, quantity: qty })
      }
      this.saveCart()
    },
    updateQuantity(id, qty) {
      const item = this.items.find(p => p.id === id)
      if (item) {
        if (qty <= 0) {
          this.items = this.items.filter(p => p.id !== id)
        } else {
          item.quantity = qty
        }
      }
      this.saveCart()
    },
    removeFromCart(id) {
      this.items = this.items.filter(p => p.id !== id)
      this.saveCart()
    },
    clearCart() {
      this.items = []
      this.saveCart()
    }
  }
})
