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
const scale = ref(0.75)
const isFullscreen = ref(false)

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
    resetZoom()
  }
}

const goToPrev = () => {
  if (prevPhoto.value) {
    router.push(`/photo/${prevPhoto.value.id}`)
    resetZoom()
  }
}

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    goToNext()
  } else if (e.key === 'ArrowLeft') {
    goToPrev()
  } else if (e.key === 'Escape') {
    if (isFullscreen.value) {
      exitFullscreen()
    } else {
      router.push('/gallery')
    }
  } else if (e.key === '+' || e.key === '=') {
    zoomIn()
  } else if (e.key === '-') {
    zoomOut()
  }
}

// Zoom functions
const zoomIn = () => {
  if (scale.value < 3) {
    scale.value += 0.25
  }
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value -= 0.25
  }
}

const resetZoom = () => {
  scale.value = 0.75
}

// Fullscreen functions
const enterFullscreen = async () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    await elem.requestFullscreen()
    isFullscreen.value = true
  }
}

const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    isFullscreen.value = false
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
  
  if (confirm('确定要删除这张照片吗？此操作无法撤销。')) {
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

// Share photo
const sharePhoto = async () => {
  if (!photo.value) return
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: photo.value.fileName,
        url: photo.value.url
      })
    } catch (err) {
      console.error('分享失败:', err)
    }
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(photo.value.url)
      .then(() => alert('链接已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err))
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
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
    <!-- Header with actions -->
    <div class="bg-gray-800/80 backdrop-blur-sm text-white px-4 py-3 flex items-center justify-between 
      shadow-lg border-b border-white/10">
      <button 
        @click="router.push('/gallery')" 
        class="flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回相册
      </button>
      
      <div class="flex space-x-4">
        <button 
          @click="sharePhoto" 
          class="flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
          v-if="photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享
        </button>

        <button 
          @click="downloadPhoto" 
          class="flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
          v-if="photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载
        </button>
        
        <button 
          @click="deletePhoto" 
          class="flex items-center text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
          v-if="photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          删除
        </button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading || photoStore.isLoading" class="flex-1 flex justify-center items-center">
      <div class="relative">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-primary-500"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-12 w-12 animate-pulse rounded-full bg-primary-500/20"></div>
        </div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error || !photo" class="flex-1 flex flex-col justify-center items-center text-white">
      <div class="relative">
        <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-xl font-medium mt-4">{{ error || '未找到照片' }}</p>
      <button 
        @click="router.push('/gallery')" 
        class="mt-4 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 
          transition-colors duration-200 text-white border border-white/20"
      >
        返回相册
      </button>
    </div>
    
    <!-- Photo view -->
    <div v-else class="flex-1 relative flex flex-col h-[calc(100vh-56px)] bg-grid-white/[0.02]">
      <!-- Zoom controls -->
      <div class="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <button 
          @click="zoomOut" 
          class="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 
            transition-colors duration-200 backdrop-blur-sm"
          :disabled="scale <= 0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        
        <button 
          @click="resetZoom" 
          class="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 
            transition-colors duration-200 backdrop-blur-sm"
        >
          <span class="text-sm">{{ Math.round(scale * 100) }}%</span>
        </button>
        
        <button 
          @click="zoomIn" 
          class="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 
            transition-colors duration-200 backdrop-blur-sm"
          :disabled="scale >= 3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button 
          @click="isFullscreen ? exitFullscreen() : enterFullscreen()" 
          class="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 
            transition-colors duration-200 backdrop-blur-sm"
        >
          <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
        </button>
      </div>

      <!-- Main content area with scroll -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="min-h-full flex items-center justify-center p-4">
          <!-- Navigation arrows -->
          <button 
            v-if="prevPhoto" 
            @click="goToPrev" 
            class="fixed left-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 
              transition-all duration-200 backdrop-blur-sm transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-white group z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
              class="h-8 w-8 transform transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            v-if="nextPhoto" 
            @click="goToNext" 
            class="fixed right-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 
              transition-all duration-200 backdrop-blur-sm transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-white group z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
              class="h-8 w-8 transform transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Main photo -->
          <div class="relative group">
            <div class="absolute -inset-4 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              :src="photo.url" 
              :alt="photo.fileName" 
              class="max-h-[calc(100vh-180px)] max-w-full object-contain rounded-2xl transition-transform duration-300 relative"
              :style="{ transform: `scale(${scale})` }"
              @dblclick="scale === 0.75 ? zoomIn() : resetZoom()"
            />
          </div>
        </div>
      </div>
      
      <!-- Info panel -->
      <div class="group/panel sticky bottom-0">
        <!-- Hover trigger area -->
        <div class="absolute -top-6 left-0 right-0 h-6 bg-transparent"></div>
        
        <div class="bg-gray-900/80 backdrop-blur-md text-white 
          border-t border-white/10 transition-all duration-300 transform"
          :class="{ 'translate-y-[calc(100%-2.5rem)] group-hover/panel:translate-y-0': !isFullscreen }"
        >
          <div class="flex justify-center">
            <div class="w-12 h-1 bg-white/20 rounded-full my-2 transition-colors duration-300 group-hover/panel:bg-white/40"></div>
          </div>
          <div class="px-4 py-3 flex justify-between items-start">
            <div class="space-y-1">
              <h2 class="text-lg font-medium truncate">{{ photo.fileName }}</h2>
              <div class="flex items-center space-x-3 text-sm text-gray-400">
                <span>{{ formatFileSize(photo.fileSize) }}</span>
                <span>•</span>
                <span>{{ formatDate(photo.uploadDate) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-400">
                {{ currentIndex + 1 }} / {{ photoStore.photos.length }}
              </span>
              <div class="h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 rounded-full" 
                  :style="{ width: `${((currentIndex + 1) / photoStore.photos.length) * 100}%` }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-grid-white {
  background-size: 30px 30px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>