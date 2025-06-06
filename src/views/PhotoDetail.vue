<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '../stores/photos'
import { formatFileSize, formatDate } from '../utils/formatters'

const route = useRoute()
const router = useRouter()
const photoStore = usePhotoStore()

const photoId = computed(() => route.params.id as string)
const isLoading = ref(false)
const error = ref('')

// Get the current photo
const photo = computed(() => {
  return photoStore.getPhotoById(photoId.value)
})

// Get the index of the current photo
const currentIndex = computed(() => {
  if (!photo.value) return -1
  return photoStore.photos.findIndex(p => p.id === photoId.value)
})

// Get the next and previous photos
const nextPhoto = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value === photoStore.photos.length - 1) return null
  return photoStore.photos[currentIndex.value + 1]
})

const prevPhoto = computed(() => {
  if (currentIndex.value <= 0) return null
  return photoStore.photos[currentIndex.value - 1]
})

// Navigation functions
const goToNext = () => {
  if (nextPhoto.value) {
    router.push(`/photo/${nextPhoto.value.id}`)
  }
}

const goToPrev = () => {
  if (prevPhoto.value) {
    router.push(`/photo/${prevPhoto.value.id}`)
  }
}

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    goToNext()
  } else if (e.key === 'ArrowLeft') {
    goToPrev()
  } else if (e.key === 'Escape') {
    router.push('/gallery')
  }
}

// Download photo
const downloadPhoto = () => {
  if (!photo.value) return
  
  const a = document.createElement('a')
  a.href = photo.value.url
  a.download = photo.value.fileName
  a.click()
}

// Delete photo
const deletePhoto = async () => {
  if (!photo.value) return
  
  if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
    const success = await photoStore.deletePhoto(photoId.value)
    
    if (success) {
      if (nextPhoto.value) {
        router.push(`/photo/${nextPhoto.value.id}`)
      } else if (prevPhoto.value) {
        router.push(`/photo/${prevPhoto.value.id}`)
      } else {
        router.push('/gallery')
      }
    }
  }
}

onMounted(() => {
  if (photoStore.photos.length === 0) {
    photoStore.fetchPhotos()
  }
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeyDown)
  
  // Clean up
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header with actions -->
    <div class="bg-gray-800/80 backdrop-blur-sm text-white px-4 py-3 flex items-center justify-between">
      <button 
        @click="router.push('/gallery')" 
        class="flex items-center text-sm text-gray-300 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Gallery
      </button>
      
      <div class="flex space-x-4">
        <button 
          @click="downloadPhoto" 
          class="flex items-center text-sm text-gray-300 hover:text-white"
          v-if="photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
        
        <button 
          @click="deletePhoto" 
          class="flex items-center text-sm text-red-400 hover:text-red-300"
          v-if="photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading || photoStore.isLoading" class="flex-1 flex justify-center items-center">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-primary-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error || !photo" class="flex-1 flex flex-col justify-center items-center text-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-xl font-medium">{{ error || 'Photo not found' }}</p>
      <button 
        @click="router.push('/gallery')" 
        class="mt-4 btn btn-outline text-white border-gray-500 hover:bg-gray-700"
      >
        Return to Gallery
      </button>
    </div>
    
    <!-- Photo view -->
    <div v-else class="flex-1 flex items-center justify-center relative">
      <!-- Navigation arrows -->
      <button 
        v-if="prevPhoto" 
        @click="goToPrev" 
        class="absolute left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        v-if="nextPhoto" 
        @click="goToNext" 
        class="absolute right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Main photo -->
      <div class="max-h-[calc(100vh-120px)] max-w-full p-4">
        <img 
          :src="photo.url" 
          :alt="photo.fileName" 
          class="max-h-full max-w-full object-contain"
        />
      </div>
      
      <!-- Info panel -->
      <div class="absolute bottom-0 inset-x-0 bg-gray-800/80 backdrop-blur-sm text-white p-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-medium truncate">{{ photo.fileName }}</h2>
          <p class="text-sm text-gray-300">
            {{ formatFileSize(photo.fileSize) }} • {{ formatDate(photo.uploadDate) }}
          </p>
        </div>
        
        <div class="text-sm text-gray-300">
          {{ currentIndex + 1 }} of {{ photoStore.photos.length }}
        </div>
      </div>
    </div>
  </div>
</template>