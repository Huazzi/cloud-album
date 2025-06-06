<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import { usePhotoStore } from '../stores/photos'
import { UploadProgress } from '../types'

const toast = useToast()
const photoStore = usePhotoStore()

const isDragging = ref(false)
const uploadQueue = ref<UploadProgress[]>([])
const isUploading = ref(false)

const totalProgress = computed(() => {
  if (uploadQueue.value.length === 0) return 0
  const total = uploadQueue.value.reduce((sum, item) => sum + item.progress, 0)
  return Math.round(total / uploadQueue.value.length)
})

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  if (!e.dataTransfer) return
  
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  
  const files = Array.from(input.files)
  handleFiles(files)
  
  // Reset input so the same file can be uploaded again
  input.value = ''
}

const handleFiles = (files: File[]) => {
  // Filter for image files only
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length === 0) {
    toast.error('Please select image files only')
    return
  }
  
  // Add files to upload queue
  imageFiles.forEach(file => {
    uploadQueue.value.push({
      file,
      progress: 0,
      status: 'pending'
    })
  })
  
  // Start upload process
  processUploadQueue()
}

const processUploadQueue = async () => {
  if (isUploading.value) return
  
  const pendingUploads = uploadQueue.value.filter(item => item.status === 'pending')
  if (pendingUploads.length === 0) return
  
  isUploading.value = true
  
  for (const upload of pendingUploads) {
    try {
      upload.status = 'uploading'
      
      await photoStore.uploadPhoto(upload.file, (progress) => {
        upload.progress = progress
      })
      
      upload.progress = 100
      upload.status = 'completed'
      
      toast.success(`${upload.file.name} uploaded successfully`)
    } catch (error) {
      upload.status = 'error'
      upload.error = 'Upload failed'
      
      toast.error(`Failed to upload ${upload.file.name}`)
    }
  }
  
  isUploading.value = false
  
  // Clean up completed uploads after 2 seconds
  setTimeout(() => {
    uploadQueue.value = uploadQueue.value.filter(item => item.status !== 'completed')
  }, 2000)
}

const clearQueue = () => {
  // Only clear non-uploading items
  uploadQueue.value = uploadQueue.value.filter(item => item.status === 'uploading')
}
</script>

<template>
  <div class="upload-container">
    <!-- Dropzone area -->
    <div
      class="relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300 ease-in-out"
      :class="[
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
      ]"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            {{ isDragging ? 'Drop files here' : 'Drag and drop your images' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">Or select files from your computer</p>
        </div>
        
        <div>
          <label class="btn btn-primary cursor-pointer">
            Browse Files
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              class="hidden" 
              @change="handleFileInput"
            />
          </label>
        </div>
      </div>
    </div>
    
    <!-- Upload queue -->
    <div v-if="uploadQueue.length > 0" class="mt-6 animate-slide-up">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium">Uploads</h3>
        <button 
          v-if="!isUploading && uploadQueue.length > 0" 
          @click="clearQueue" 
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
      
      <!-- Overall progress -->
      <div v-if="isUploading" class="mb-3">
        <div class="flex justify-between text-sm mb-1">
          <span>Overall progress</span>
          <span>{{ totalProgress }}%</span>
        </div>
        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary-500 transition-all duration-300 ease-in-out" 
            :style="{ width: `${totalProgress}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Individual uploads -->
      <ul class="space-y-3">
        <li 
          v-for="(upload, index) in uploadQueue" 
          :key="index"
          class="bg-white rounded-lg border border-gray-200 p-3"
        >
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium truncate max-w-[70%]">{{ upload.file.name }}</span>
            <span class="text-xs" :class="{
              'text-primary-600': upload.status === 'uploading',
              'text-green-600': upload.status === 'completed',
              'text-red-600': upload.status === 'error'
            }">
              {{ upload.status === 'completed' ? 'Uploaded' : 
                 upload.status === 'error' ? 'Failed' : 
                 `${upload.progress}%` }}
            </span>
          </div>
          <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-300 ease-in-out" 
              :class="{
                'bg-primary-500': upload.status === 'uploading',
                'bg-green-500': upload.status === 'completed',
                'bg-red-500': upload.status === 'error'
              }"
              :style="{ width: `${upload.progress}%` }"
            ></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>