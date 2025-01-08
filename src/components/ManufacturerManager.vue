<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

// State
const manufacturers = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentManufacturer = ref({
  Name: ''
})

// Fetch data
const fetchManufacturers = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/v1/manufacturers`)
    manufacturers.value = response.data
  } catch (error) {
    console.error('Error fetching manufacturers:', error)
  }
}

// CRUD operations
const addManufacturer = async () => {
  try {
    await axios.post(`${API_HOST}/api/v1/manufacturers`, currentManufacturer.value)
    await fetchManufacturers()
    showAddModal.value = false
  } catch (error) {
    console.error('Error adding manufacturer:', error)
  }
}

const editManufacturer = async () => {
  try {
    await axios.put(`${API_HOST}/api/v1/manufacturers/${currentManufacturer.value.ID}`, currentManufacturer.value)
    await fetchManufacturers()
    showEditModal.value = false
  } catch (error) {
    console.error('Error editing manufacturer:', error)
  }
}

const deleteManufacturer = async (id) => {
  try {
    await axios.delete(`${API_HOST}/api/v1/manufacturers/${id}`)
    await fetchManufacturers()
  } catch (error) {
    console.error('Error deleting manufacturer:', error)
  }
}

// Lifecycle hook
onMounted(() => {
  fetchManufacturers()
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Manage Manufacturers</h2>

    <!-- Add Button -->
    <button
      @click="showAddModal = true; currentManufacturer = { Name: '' }"
      class="btn btn-primary mb-4"
    >
      Add New Manufacturer
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
          <tr v-for="manufacturer in manufacturers" :key="manufacturer.ID">
            <td>{{ manufacturer.Name }}</td>
            <td>
              <button
                @click="currentManufacturer = {...manufacturer}; showEditModal = true"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteManufacturer(manufacturer.ID)"
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
        <h3 class="font-bold text-lg">Add New Manufacturer</h3>
        <form @submit.prevent="addManufacturer" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentManufacturer.Name"
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
        <h3 class="font-bold text-lg">Edit Manufacturer</h3>
        <form @submit.prevent="editManufacturer" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentManufacturer.Name"
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
