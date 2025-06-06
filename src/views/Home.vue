<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateToGallery = () => {
  if (authStore.isAuthenticated) {
    router.push('/gallery')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-12 md:py-20">
        <!-- Hero section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your personal <span class="text-primary-600">cloud photo album</span>
            </h1>
            <p class="text-xl text-gray-600">
              Securely store, manage, and view your memories in one beautiful place. 
              Simple, elegant, and just for you.
            </p>
            <div class="flex flex-wrap gap-4">
              <button 
                @click="navigateToGallery"
                class="btn px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <!-- Hero image -->
          <div class="relative animate-fade-in">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30"></div>
            <div class="relative">
              <img 
                src="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Photo album showcase" 
                class="rounded-2xl shadow-xl w-full"
              />
            </div>
            
            <!-- Floating elements -->
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg animate-slide-up opacity-90 hidden md:block">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Secure Storage</p>
                  <p class="text-xs text-gray-500">Using Backblaze B2</p>
                </div>
              </div>
            </div>
            
            <div class="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-slide-up opacity-90 hidden md:block">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Private Access</p>
                  <p class="text-xs text-gray-500">Password protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Features section -->
        <div class="mt-24">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Features</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Beautiful Gallery</h3>
              <p class="text-gray-600">
                View your photos in a responsive masonry layout that adapts to any screen size.
              </p>
            </div>
            
            <!-- Feature 2 -->
            <div class="card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div class="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy Uploads</h3>
              <p class="text-gray-600">
                Simply drag and drop your photos or select files from your device.
              </p>
            </div>
            
            <!-- Feature 3 -->
            <div class="card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div class="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p class="text-gray-600">
                Your photos are securely stored on Backblaze B2 with password protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>