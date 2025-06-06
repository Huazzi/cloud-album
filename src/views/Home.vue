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
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -inset-[10px] bg-grid-primary-700/[0.02] [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="py-12 md:py-20">
        <!-- Hero section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span class="block text-gray-900 dark:text-gray-100">你的私人</span>
              <span class="block bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                云端相册空间
              </span>
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              安全存储、便捷管理、优雅浏览，让每一张照片都成为永恒的记忆。
              简约而不简单，为你打造专属的回忆空间。
            </p>
            <div class="flex flex-wrap gap-4">
              <button 
                @click="navigateToGallery"
                class="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white 
                  bg-gradient-to-r from-primary-600 to-primary-500 hover:to-primary-600
                  rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                  hover:shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span class="relative flex items-center space-x-3">
                  <span>开始体验</span>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-8">
              <div class="text-center">
                <div class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  100%
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">安全存储</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-400 bg-clip-text text-transparent">
                  快速
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">上传体验</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent">
                  简单
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">操作方式</div>
              </div>
            </div>
          </div>
          
          <!-- Hero image -->
          <div class="relative animate-fade-in">
            <!-- Decorative elements -->
            <div class="absolute -inset-4">
              <div class="w-full h-full rotate-180 opacity-30 blur-3xl"
                style="background: radial-gradient(circle at top right, rgba(var(--primary-500-rgb), 0.1), transparent 70%);">
              </div>
            </div>

            <div class="relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 
                animate-pulse transition-all duration-1000"></div>
              <div class="relative rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                <img 
                  src="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                  alt="相册展示" 
                  class="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            <!-- Floating cards -->
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl 
              animate-float backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 
                    flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 text-primary-600 dark:text-primary-400" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">安全存储</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">基于 Backblaze B2</p>
                </div>
              </div>
            </div>
            
            <div class="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl 
              animate-float-delayed backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 
                    flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 text-secondary-600 dark:text-secondary-400" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">私密访问</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">密码保护</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Features section -->
        <div class="mt-24 relative">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent 
            dark:from-transparent dark:via-primary-900/10 dark:to-transparent"></div>
          
          <h2 class="text-3xl font-bold text-center mb-4">
            <span class="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              核心特性
            </span>
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            为您打造简单易用、安全可靠的云端相册体验
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Feature 1 -->
            <div class="group">
              <div class="card relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent 
                  dark:from-primary-500/10 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div class="relative">
                  <div class="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 
                    flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 text-primary-600 dark:text-primary-400" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">优雅展示</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    响应式瀑布流布局，完美适配各种屏幕尺寸，带来极致的视觉体验。
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Feature 2 -->
            <div class="group">
              <div class="card relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div class="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-transparent 
                  dark:from-secondary-500/10 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div class="relative">
                  <div class="h-12 w-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 
                    flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 text-secondary-600 dark:text-secondary-400" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">便捷上传</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    支持拖拽上传和多文件选择，简单快速地将照片添加到云端相册。
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Feature 3 -->
            <div class="group">
              <div class="card relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div class="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent 
                  dark:from-accent-500/10 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div class="relative">
                  <div class="h-12 w-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 
                    flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 text-accent-600 dark:text-accent-400" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">安全存储</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    采用 Backblaze B2 云存储，确保照片安全存储，支持密码保护访问。
                  </p>
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
.bg-grid-primary-700 {
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(var(--primary-700-rgb), 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--primary-700-rgb), 0.1) 1px, transparent 1px);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-delayed {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3s ease-in-out infinite;
  animation-delay: 1.5s;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
</style>