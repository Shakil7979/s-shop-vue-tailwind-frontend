<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">📊 Dashboard Overview</h1>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Total Products</h2>
        <p class="text-2xl font-bold text-blue-600">120</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Orders Today</h2>
        <p class="text-2xl font-bold text-green-600">45</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Customers</h2>
        <p class="text-2xl font-bold text-purple-600">980</p>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="bg-white p-6 rounded shadow mb-6">
      <h2 class="text-lg font-semibold mb-4">🛒 Recent Orders</h2>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b">
            <th class="py-2">Order ID</th>
            <th class="py-2">Customer</th>
            <th class="py-2">Status</th>
            <th class="py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="py-2">#1023</td>
            <td class="py-2">John Doe</td>
            <td class="py-2 text-green-600">Completed</td>
            <td class="py-2">$250</td>
          </tr>
          <tr class="border-b">
            <td class="py-2">#1024</td>
            <td class="py-2">Sarah Smith</td>
            <td class="py-2 text-yellow-600">Pending</td>
            <td class="py-2">$180</td>
          </tr>
          <tr>
            <td class="py-2">#1025</td>
            <td class="py-2">Michael Lee</td>
            <td class="py-2 text-red-600">Cancelled</td>
            <td class="py-2">$90</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sales Chart + Extra Info -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
    <!-- Left: Sales Chart -->
    <div class="md:col-span-8 bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">📈 Sales Overview</h2>
        <div class="h-80 flex items-center justify-center">
            <div class="h-full w-full">
                <canvas id="salesChart" class="w-full h-full"></canvas>
            </div>
        </div>
    </div>

    <!-- Right: Extra Info -->
    <div class="md:col-span-4 bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">🔥 Top Selling Products</h2>
        <ul class="space-y-3">
        <li class="flex justify-between">
            <span>🖥 Laptop</span>
            <span class="font-bold text-blue-600">$12,500</span>
        </li>
        <li class="flex justify-between">
            <span>📱 iPhone</span>
            <span class="font-bold text-green-600">$9,800</span>
        </li>
        <li class="flex justify-between">
            <span>🎧 Headphones</span>
            <span class="font-bold text-purple-600">$5,200</span>
        </li>
        <li class="flex justify-between">
            <span>⌚ Smartwatch</span>
            <span class="font-bold text-orange-600">$4,300</span>
        </li>
        </ul>
    </div>
    </div>


    <!-- Right: Recent Customers -->
<div class="bg-white p-4 rounded shadow flex-1">
  <h2 class="text-lg font-semibold mb-2">👥 Recent Customers</h2>
  <ul class="space-y-2">
    <li class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span>John Doe</span>
      </div>
      <span class="text-sm text-gray-500">2 hours ago</span>
    </li>
    <li class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span>Sarah Smith</span>
      </div>
      <span class="text-sm text-gray-500">5 hours ago</span>
    </li>
    <li class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span>Michael Lee</span>
      </div>
      <span class="text-sm text-gray-500">1 day ago</span>
    </li>
    <li class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span>Emma Watson</span>
      </div>
      <span class="text-sm text-gray-500">2 days ago</span>
    </li>
  </ul>
</div>

    
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
 
Chart.register(...registerables)

onMounted(() => {
  const ctx = document.getElementById('salesChart')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sales ($)',
          data: [120, 190, 150, 220, 300, 250, 400],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3, // smooth line
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // important for full height
      plugins: { legend: { display: true, position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  })
})
</script>