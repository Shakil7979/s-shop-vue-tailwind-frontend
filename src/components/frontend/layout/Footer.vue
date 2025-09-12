<template>
  <footer class="bg-gray-900 text-gray-300 mt-12">
    <div class="container mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Logo & Description -->
      <div>
        <router-link to="/" class="text-2xl font-bold text-indigo-500 mb-2 block">ShopMate</router-link>
        <p class="text-sm">Your one-stop shop for everything you love. Fast delivery & premium products.</p>
      </div>

      <!-- Quick Links -->
      <div>
        <h2 class="font-semibold mb-2">Quick Links</h2>
        <ul class="space-y-1">
          <li><router-link to="/" class="hover:text-indigo-500 transition">Home</router-link></li>
          <li><router-link to="/shop" class="hover:text-indigo-500 transition">Shop</router-link></li>
          <li><router-link to="/about" class="hover:text-indigo-500 transition">About</router-link></li>
          <li><router-link to="/contact" class="hover:text-indigo-500 transition">Contact</router-link></li>
        </ul>
      </div>

      <!-- Customer Care -->
      <div>
        <h2 class="font-semibold mb-2">Customer Care</h2>
        <ul class="space-y-1">
          <li><router-link to="/faq" class="hover:text-indigo-500 transition">FAQ</router-link></li>
          <li><router-link to="/returns" class="hover:text-indigo-500 transition">Returns</router-link></li>
          <li><router-link to="/shipping" class="hover:text-indigo-500 transition">Shipping</router-link></li>
          <li><router-link to="/support" class="hover:text-indigo-500 transition">Support</router-link></li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h2 class="font-semibold mb-2">Newsletter</h2>
        <p class="text-sm mb-2">Subscribe for the latest deals & offers.</p>
        <form class="flex">
          <input type="email" placeholder="Your email" class="px-3 py-2 rounded-l bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"/>
          <button type="submit" class="bg-indigo-500 px-4 py-2 rounded-r text-white hover:bg-indigo-600 transition">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="text-center text-gray-500 py-4 border-t border-gray-800">
      &copy; 2025 ShopMate. All Rights Reserved.
    </div>
  </footer>
</template>
