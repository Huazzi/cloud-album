<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PhotoGrid from '../components/PhotoGrid.vue'
import { usePhotoStore } from '../stores/photos'

const router = useRouter()
const photoStore = usePhotoStore()

const selectionMode = ref(false)

const selectedCount = computed(() => {
  return photoStore.selectedPhotos.length
})

const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value
  
  if (!selectionMode.value) {
    photoStore.clearSelection()
  }
}

const deleteSelected = async () => {
  if (selectedCount.value === 0) return
  
  if (confirm(`Are you sure you want to delete ${selectedCount.value} photo(s)? This action cannot be undone.`)) {
    const success = await photoStore.deleteSelectedPhotos()
    
    if (success) {
      selectionMode.value = false
    }
  }
}

const uploadPhotos = () => {
  router.push('/upload')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">My Photos</h1>
      
      <div class="flex space-x-3">
        <!-- Selection mode toggle -->
        <button 
          @click="toggleSelectionMode" 
          class="btn"
          :class="selectionMode ? 'btn-primary' : 'btn-outline'"
        >
          <span v-if="selectionMode">
            {{ selectedCount > 0 ? `${selectedCount} selected` : 'Cancel' }}
          </span>
          <span v-else>Select</span>
        </button>
        
        <!-- Delete button (only visible in selection mode) -->
        <button 
          v-if="selectionMode && selectedCount > 0" 
          @click="deleteSelected"
          class="btn btn-danger"
        >
          Delete {{ selectedCount }}
        </button>
        
        <!-- Upload button (only visible when not in selection mode) -->
        <button 
          v-if="!selectionMode" 
          @click="uploadPhotos"
          class="btn btn-primary"
        >
          Upload Photos
        </button>
      </div>
    </div>
    
    <!-- Photo grid component -->
    <PhotoGrid :selectable="selectionMode" />
  </div>
</template>