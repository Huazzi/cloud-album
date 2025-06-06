<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UploadDropzone from '../components/UploadDropzone.vue'

const router = useRouter()

const goToGallery = () => {
  router.push('/gallery')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Upload Photos</h1>
      
      <button @click="goToGallery" class="btn btn-outline">
        Back to Gallery
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <UploadDropzone />
    </div>
    
    <div class="mt-8 bg-primary-50 border border-primary-100 rounded-lg p-6">
      <h3 class="text-lg font-medium text-primary-800 mb-2">Tips for uploading</h3>
      <ul class="space-y-2 text-primary-700">
        <li class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          You can upload multiple files at once by selecting them all or using drag and drop.
        </li>
        <li class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Supported file types: JPG, JPEG, PNG, GIF, WebP, and SVG.
        </li>
        <li class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Your photos are securely stored on Backblaze B2 cloud storage.
        </li>
        <li class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          After uploading, your photos will immediately appear in your gallery.
        </li>
      </ul>
    </div>
  </div>
</template>