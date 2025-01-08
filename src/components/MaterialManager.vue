<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

// State
const materials = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentMaterial = ref({
  Name: ''
})

// Fetch data
const fetchMaterials = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/v1/materials`)
    materials.value = response.data
  } catch (error) {
    console.error('Error fetching materials:', error)
  }
}

// CRUD operations
const addMaterial = async () => {
  try {
    await axios.post(`${API_HOST}/api/v1/materials`, currentMaterial.value)
    await fetchMaterials()
    showAddModal.value = false
  } catch (error) {
    console.error('Error adding material:', error)
  }
}

const editMaterial = async () => {
  try {
    await axios.put(`${API_HOST}/api/v1/materials/${currentMaterial.value.ID}`, currentMaterial.value)
    await fetchMaterials()
    showEditModal.value = false
  } catch (error) {
    console.error('Error editing material:', error)
  }
}

const deleteMaterial = async (id) => {
  try {
    await axios.delete(`${API_HOST}/api/v1/materials/${id}`)
    await fetchMaterials()
  } catch (error) {
    console.error('Error deleting material:', error)
  }
}

// Lifecycle hook
onMounted(() => {
  fetchMaterials()
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Manage Materials</h2>

    <!-- Add Button -->
    <button
      @click="showAddModal = true; currentMaterial = { Name: '' }"
      class="btn btn-primary mb-4"
    >
      Add New Material
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
          <tr v-for="material in materials" :key="material.ID">
            <td>{{ material.Name }}</td>
            <td>
              <button
                @click="currentMaterial = {...material}; showEditModal = true"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteMaterial(material.ID)"
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
        <h3 class="font-bold text-lg">Add New Material</h3>
        <form @submit.prevent="addMaterial" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentMaterial.Name"
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
        <h3 class="font-bold text-lg">Edit Material</h3>
        <form @submit.prevent="editMaterial" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="currentMaterial.Name"
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
