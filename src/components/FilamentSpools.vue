<script setup>
import { ref, onMounted, computed } from 'vue'

// Dropdown options
const manufacturers = ref([])
const materials = ref([])
const colors = ref([])

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    const [manRes, matRes, colRes] = await Promise.all([
      axios.get(`${API_HOST}/api/v1/manufacturers`),
      axios.get(`${API_HOST}/api/v1/materials`),
      axios.get(`${API_HOST}/api/v1/colors`)
    ])
    manufacturers.value = manRes.data
    materials.value = matRes.data
    colors.value = colRes.data
  } catch (error) {
    console.error('Error fetching dropdown options:', error)
  }
}
import axios from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

// State
const filamentSpools = ref([])
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentSpool = ref({
  manufacturer_id: '',
  material_id: '',
  color_id: '',
  weight_total: 0,
  weight_remaining: 0,
  purchase_date: '',
  price: 0,
  rating: 0,
  notes: '',
  code_id: ''
})

// Fetch data
const fetchFilamentSpools = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/v1/filament-spools`)
    console.log('API Response:', response.data)
    filamentSpools.value = response.data
  } catch (error) {
    console.error('Error fetching filament spools:', error)
  }
}

// Search functionality
const filteredSpools = computed(() => {
  return filamentSpools.value.filter(spool => {
    const codeMatch = spool.code_id?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    const notesMatch = spool.notes?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false

    // Get names from IDs
    const manufacturer = manufacturers.value.find(m => m.ID === spool.manufacturer_id)
    const material = materials.value.find(m => m.ID === spool.material_id)
    const color = colors.value.find(c => c.ID === spool.color_id)

    const manufacturerMatch = manufacturer?.Name.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    const materialMatch = material?.Name.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    const colorMatch = color?.Name.toLowerCase().includes(searchQuery.value.toLowerCase()) || false

    return codeMatch || notesMatch || manufacturerMatch || materialMatch || colorMatch
  })
})

// CRUD operations
const addSpool = async () => {
  // Validate required fields
  if (!currentSpool.value.manufacturer_id ||
      !currentSpool.value.material_id ||
      !currentSpool.value.color_id) {
    alert('Please select manufacturer, material and color')
    return
  }

  try {
    const code_id = `${currentSpool.value.manufacturer_id}-${currentSpool.value.material_id}-${currentSpool.value.color_id}`
    const response = await axios.post(`${API_HOST}/api/v1/filament-spools`, {
      ...currentSpool.value,
      manufacturer_id: parseInt(currentSpool.value.manufacturer_id, 10),
      material_id: parseInt(currentSpool.value.material_id, 10),
      color_id: parseInt(currentSpool.value.color_id, 10),
      weight_total: parseFloat(currentSpool.value.weight_total),
      weight_remaining: parseFloat(currentSpool.value.weight_remaining),
      price: parseFloat(currentSpool.value.price),
      rating: parseInt(currentSpool.value.rating, 10),
      purchase_date: currentSpool.value.purchase_date ?
        new Date(currentSpool.value.purchase_date).toISOString() :
        null,
      code_id: code_id
    })

    if (response.data) {
      await fetchFilamentSpools()
      showAddModal.value = false
      currentSpool.value = {
        manufacturer_id: '',
        material_id: '',
        color_id: '',
        weight_total: 0,
        weight_remaining: 0,
        purchase_date: '',
        price: 0,
        rating: 0,
        notes: ''
      }
    }
  } catch (error) {
    console.error('Error adding spool:', error)
    alert(`Error adding spool: ${error.response?.data?.message || error.message}`)
  }
}

const editSpool = async () => {
  try {
    const code_id = `${currentSpool.value.manufacturer_id}-${currentSpool.value.material_id}-${currentSpool.value.color_id}`
    const payload = {
      manufacturer_id: parseInt(currentSpool.value.manufacturer_id, 10),
      material_id: parseInt(currentSpool.value.material_id, 10),
      color_id: parseInt(currentSpool.value.color_id, 10),
      weight_total: parseFloat(currentSpool.value.weight_total),
      weight_remaining: parseFloat(currentSpool.value.weight_remaining),
      price: parseFloat(currentSpool.value.price),
      rating: parseInt(currentSpool.value.rating, 10),
      purchase_date: currentSpool.value.purchase_date ?
        new Date(currentSpool.value.purchase_date).toISOString() :
        null,
      notes: currentSpool.value.notes,
      code_id: code_id
    }

    await axios.put(`${API_HOST}/api/v1/filament-spools/${currentSpool.value.id}`, payload)
    await fetchFilamentSpools()
    showEditModal.value = false
  } catch (error) {
    console.error('Error editing spool:', error)
  }
}

const deleteSpool = async (id) => {
  try {
    await axios.delete(`${API_HOST}/api/v1/filament-spools/${id}`)
    await fetchFilamentSpools()
  } catch (error) {
    console.error('Error deleting spool:', error)
  }
}

// Lifecycle hook
onMounted(() => {
  fetchFilamentSpools()
  fetchDropdownOptions()
})
</script>

<template>
  <div class="p-4">
    <!-- Search and Add Button -->
    <div class="flex justify-between items-center mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search spools..."
        class="input input-bordered w-full max-w-xs"
      />
      <button
        @click="showAddModal = true; currentSpool = {}"
        class="btn btn-primary"
      >
        Add New Spool
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Code</th>
            <th>Manufacturer</th>
            <th>Material</th>
            <th>Color</th>
            <th>Weight</th>
            <th>Purchase Date</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="spool in filteredSpools" :key="spool.ID">
            <td>{{ spool.code_id }}</td>
            <td>{{ manufacturers.find(m => m.ID === spool.manufacturer_id)?.Name || 'Unknown' }}</td>
            <td>{{ materials.find(m => m.ID === spool.material_id)?.Name || 'Unknown' }}</td>
            <td>{{ colors.find(c => c.ID === spool.color_id)?.Name || 'Unknown' }}</td>
            <td>{{ spool.weight_remaining }} / {{ spool.weight_total }}</td>
            <td>{{
              new Date(spool.purchase_date).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).replace(/\//g, '.')
            }}</td>
            <td>${{ spool.price }}</td>
            <td>{{ spool.rating }}</td>
            <td>
              <button
                @click="currentSpool = {...spool, id: spool.ID, purchase_date: spool.purchase_date ? new Date(spool.purchase_date).toISOString().split('T')[0] : ''}; showEditModal = true"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteSpool(spool.ID)"
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
        <h3 class="font-bold text-lg">Add New Filament Spool</h3>
        <form @submit.prevent="addSpool" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Manufacturer</span>
            </label>
            <select v-model="currentSpool.manufacturer_id" class="select select-bordered">
              <option disabled selected>Select manufacturer</option>
              <option
                v-for="manufacturer in manufacturers"
                :key="manufacturer.ID"
                :value="manufacturer.ID"
              >
                {{ manufacturer.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Material</span>
            </label>
            <select v-model="currentSpool.material_id" class="select select-bordered">
              <option disabled selected>Select material</option>
              <option
                v-for="material in materials"
                :key="material.ID"
                :value="material.ID"
              >
                {{ material.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Color</span>
            </label>
            <select v-model="currentSpool.color_id" class="select select-bordered">
              <option disabled selected>Select color</option>
              <option
                v-for="color in colors"
                :key="color.ID"
                :value="color.ID"
              >
                {{ color.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Total Weight (g)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.weight_total"
              class="input input-bordered"
              min="0"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Remaining Weight (g)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.weight_remaining"
              class="input input-bordered"
              min="0"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Purchase Date</span>
            </label>
            <input
              type="date"
              v-model="currentSpool.purchase_date"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Price ($)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.price"
              class="input input-bordered"
              min="0"
              step="0.01"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Rating (1-5)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.rating"
              class="input input-bordered"
              min="1"
              max="5"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Notes</span>
            </label>
            <textarea
              v-model="currentSpool.notes"
              class="textarea textarea-bordered"
              placeholder="Additional notes..."
            ></textarea>
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
        <h3 class="font-bold text-lg">Edit Filament Spool</h3>
        <form @submit.prevent="editSpool" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Manufacturer</span>
            </label>
            <select v-model="currentSpool.manufacturer_id" class="select select-bordered">
              <option disabled selected>Select manufacturer</option>
              <option
                v-for="manufacturer in manufacturers"
                :key="manufacturer.ID"
                :value="manufacturer.ID"
              >
                {{ manufacturer.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Material</span>
            </label>
            <select v-model="currentSpool.material_id" class="select select-bordered">
              <option disabled selected>Select material</option>
              <option
                v-for="material in materials"
                :key="material.ID"
                :value="material.ID"
              >
                {{ material.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Color</span>
            </label>
            <select v-model="currentSpool.color_id" class="select select-bordered">
              <option disabled selected>Select color</option>
              <option
                v-for="color in colors"
                :key="color.ID"
                :value="color.ID"
              >
                {{ color.Name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Total Weight (g)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.weight_total"
              class="input input-bordered"
              min="0"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Remaining Weight (g)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.weight_remaining"
              class="input input-bordered"
              min="0"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Purchase Date</span>
            </label>
            <input
              type="date"
              v-model="currentSpool.purchase_date"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Price (CHF)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.price"
              class="input input-bordered"
              min="0"
              step="0.01"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Rating (1-5)</span>
            </label>
            <input
              type="number"
              v-model="currentSpool.rating"
              class="input input-bordered"
              min="1"
              max="5"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Notes</span>
            </label>
            <textarea
              v-model="currentSpool.notes"
              class="textarea textarea-bordered"
              placeholder="Additional notes..."
            ></textarea>
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
