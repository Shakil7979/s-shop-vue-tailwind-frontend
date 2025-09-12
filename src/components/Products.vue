<template>
  <div>
    <div class="grid grid-cols-2 mb-3 items-center align-middle"> 
        <h1 class="text-2xl font-bold mb-6">🛍️ Products</h1>
        <div class="text-end"> 
            <button 
              @click="openAddModal"
              class="w-[150px] rounded py-1.5 px-3 border-0 bg-purple-900 text-white font-bold cursor-pointer !inline-block">
              Add Product
            </button>
        </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 class="text-xl font-bold mb-4">{{ isEditMode ? '✏️ Edit Product' : '➕ Add New Product' }}</h2>

        <form @submit.prevent="saveProduct" enctype="multipart/form-data" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block font-medium">Name</label>
            <input
                v-model="form.name"
                type="text"
                class="w-full border rounded px-3 py-2" 
            />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block font-medium">Description</label>
            <textarea
                v-model="form.description"
                class="w-full border rounded px-3 py-2"
                rows="3" 
            ></textarea>
            <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
          </div>

          <!-- Price -->
          <div>
            <label class="block font-medium">Price</label>
            <input
                v-model="form.price"
                type="number"
                class="w-full border rounded px-3 py-2" 
            />
            <p v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</p>
          </div>

          <!-- Stock -->
          <div>
            <label class="block font-medium">Stock</label>
            <input
                v-model="form.stock"
                type="number"
                class="w-full border rounded px-3 py-2" 
            />
            <p v-if="errors.stock" class="text-red-500 text-sm">{{ errors.stock }}</p>
          </div>

          <!-- Image -->
          <div>
            <label class="block font-medium">Image</label>
            <input
                type="file"
                @change="handleImageUpload"
                class="w-full border rounded px-3 py-2"
                accept="image/*"
            />
            <p v-if="errors.image" class="text-red-500 text-sm">{{ errors.image }}</p>
            <div v-if="previewImage" class="mt-2">
                <img :src="previewImage" alt="Preview" class="h-32 object-cover rounded" />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div> 

    <!-- Products List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id" class="bg-white rounded shadow p-4 flex flex-col">
        <!-- Product Image -->
        <div class="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
          <img 
            v-if="product.image" 
            :src="`http://127.0.0.1:8000/storage/${product.image}`" 
            alt="Product Image" 
            class="h-full object-cover" 
          />
          <span v-else>No Image</span>
        </div>

        <!-- Product Info -->
        <h2 class="font-semibold text-lg">{{ product.name }}</h2>
        <p class="text-gray-500 text-sm">{{ product.description || 'No description' }}</p>
        <p class="text-blue-600 font-bold mt-2">${{ product.price }}</p>
        <p class="text-gray-600 mt-1">Stock: {{ product.stock }}</p>

        <!-- Actions -->
        <div class="mt-auto flex justify-between items-center">
          <button class="text-blue-500 hover:underline" @click="editProduct(product.id)">Edit</button>
          <button class="text-red-500 hover:underline" @click="deleteProduct(product.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const showModal = ref(false)
const previewImage = ref(null)
const errors = ref({}) 

const isEditMode = ref(false)
const editProductId = ref(null)

const form = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: null
})

// Open modal for adding
function openAddModal() {
  isEditMode.value = false
  editProductId.value = null
  form.value = { name:'', description:'', price:'', stock:'', image:null }
  previewImage.value = null
  showModal.value = true
}

// Close modal
function closeModal() {
  showModal.value = false
  previewImage.value = null
  errors.value = {}
}

// Fetch products
onMounted(async () => { await fetchProducts() })

async function fetchProducts() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/products')
    products.value = res.data
  } catch (err) {
    console.error('API Error:', err)
    alert('Failed to fetch products from API')
  }
}

// Handle image
function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    previewImage.value = URL.createObjectURL(file)
  }
}

// Validation
function validateForm() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Price must be > 0'
  if (!form.value.stock || form.value.stock < 0) errors.value.stock = 'Stock must be 0 or more'
  if (form.value.image && !['image/jpeg','image/png'].includes(form.value.image.type)) errors.value.image = 'Image must be JPG or PNG'
  return Object.keys(errors.value).length === 0
}

// Add/Edit product
async function saveProduct() {
  if (!validateForm()) return

  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('description', form.value.description)
  formData.append('price', form.value.price)
  formData.append('stock', form.value.stock)
  if (form.value.image) formData.append('image', form.value.image)

  try {
    if (isEditMode.value) {
      // Update
      await axios.post(`http://127.0.0.1:8000/api/products/${editProductId.value}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      // Create
      await axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    await fetchProducts()
    closeModal()
  } catch (err) {
    console.error('Save Error:', err)
    alert('Failed to save product')
  }
}

// Edit product
function editProduct(id) {
  const product = products.value.find(p => p.id === id)
  if (!product) return

  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: null
  }

  editProductId.value = id
  isEditMode.value = true
  previewImage.value = product.image ? `http://127.0.0.1:8000/storage/${product.image}` : null
  showModal.value = true
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}`)
    await fetchProducts()
  } catch (err) {
    console.error('Delete Error:', err)
    alert('Failed to delete product')
  }
}
</script>
