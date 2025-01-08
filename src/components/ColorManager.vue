<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

// State
const colors = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentColor = ref({
  Name: ''
})

// Fetch data
const fetchColors = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/v1/colors`)
    colors.value = response.data
  } catch (error) {
    console.error('Error fetching colors:', error)
  }
}

// CRUD operations
const addColor = async () => {
  try {
    await axios.post(`${API_HOST}/api/v1/colors`, currentColor.value)
    await fetchColors()
    showAddModal.value = false
  } catch (error) {
    console.error('Error adding color:', error)
  }
}

const editColor = async () => {
  try {
    await axios.put(`${API_HOST}/api/v1/colors/${currentColor.value.ID}`, currentColor.value)
    await fetchColors()
    showEditModal.value = false
  } catch (error) {
    console.error('Error editing color:', error)
  }
}

const deleteColor = async (id) => {
  try {
    await axios.delete(`${API_HOST}/api/v1/colors/${id}`)
    await fetchColors()
  } catch (error) {
    console.error('Error deleting color:', error)
  }
}

// Lifecycle hook
onMounted(() => {
  fetchColors()
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Manage Colors</h2>

    <!-- Add Button -->
    <button
      @click="showAddModal = true; currentColor = { Name: '' }"
      class="btn btn-primary mb-4"
    >
      Add New Color
    </button>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in colors" :key="color.ID">
            <td>{{ color.Name }}</td>
            <td>
              <button
                @click="currentColor = {...color}; showEditModal = true"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteColor(color.ID)"
                class="btn btn-sm btn-error"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <dialog :open="showAddModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Add New Color</h3>
        <form @submit.prevent="addColor" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentColor.Name"
              class="input input-bordered"
              required
            />
          </div>
          <div class="modal-action">
            <button type="button" @click="showAddModal = false" class="btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Edit Modal -->
    <dialog :open="showEditModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Edit Color</h3>
        <form @submit.prevent="editColor" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentColor.Name"
              class="input input-bordered"
              required
            />
          </div>
          <div class="modal-action">
            <button type="button" @click="showEditModal = false" class="btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>
