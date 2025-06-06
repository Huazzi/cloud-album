<script setup lang="ts">
import { useRouter } from 'vue-router'
import UploadDropzone from '../components/UploadDropzone.vue'

const router = useRouter()

const goToGallery = () => {
  router.push('/gallery')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 页面标题和返回按钮 -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div class="flex items-center space-x-3">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            上传照片
          </h1>
          <span class="px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
            轻松分享
          </span>
        </div>
        
        <button @click="goToGallery" 
          class="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm 
          hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 text-gray-500 group-hover:-translate-x-1 transition-transform duration-300" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-gray-700 dark:text-gray-300">返回相册</span>
        </button>
      </div>
      
      <!-- 上传区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-300">
        <UploadDropzone />
      </div>
      
      <!-- 上传提示 -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 上传说明 -->
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 
          border border-primary-200 dark:border-primary-700/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 class="text-xl font-semibold text-primary-800 dark:text-primary-300 mb-4">上传说明</h3>
          <ul class="space-y-4">
            <li class="flex items-start transform hover:translate-x-2 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 mr-3 text-primary-600 dark:text-primary-400 flex-shrink-0" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-primary-700 dark:text-primary-300">
                支持多文件同时上传，可拖拽或点击选择文件
              </span>
            </li>
            <li class="flex items-start transform hover:translate-x-2 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 mr-3 text-primary-600 dark:text-primary-400 flex-shrink-0" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-primary-700 dark:text-primary-300">
                支持的格式：JPG、JPEG、PNG、GIF、WebP、SVG
              </span>
            </li>
          </ul>
        </div>

        <!-- 存储说明 -->
        <div class="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 
          border border-secondary-200 dark:border-secondary-700/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 class="text-xl font-semibold text-secondary-800 dark:text-secondary-300 mb-4">存储说明</h3>
          <ul class="space-y-4">
            <li class="flex items-start transform hover:translate-x-2 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 mr-3 text-secondary-600 dark:text-secondary-400 flex-shrink-0" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-secondary-700 dark:text-secondary-300">
                照片安全存储于 Backblaze B2 云存储
              </span>
            </li>
            <li class="flex items-start transform hover:translate-x-2 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 mr-3 text-secondary-600 dark:text-secondary-400 flex-shrink-0" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-secondary-700 dark:text-secondary-300">
                上传完成后即可在相册中查看
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.from-primary-50 {
  --tw-gradient-from: var(--primary-50);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(239, 246, 255, 0));
}

.to-primary-100 {
  --tw-gradient-to: var(--primary-100);
}

.from-secondary-50 {
  --tw-gradient-from: var(--secondary-50);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(240, 253, 250, 0));
}

.to-secondary-100 {
  --tw-gradient-to: var(--secondary-100);
}
</style>