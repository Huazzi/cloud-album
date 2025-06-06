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
  
  if (confirm(`确定要删除这 ${selectedCount.value} 张照片吗？此操作无法撤销。`)) {
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
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 顶部操作栏 -->
      <div class="sticky top-0 z-10 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm p-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <!-- 标题区域 -->
          <div class="flex items-center space-x-4">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              我的相册
            </h1>
            <div v-if="selectedCount > 0" 
              class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 
                rounded-full text-sm font-medium animate-fade-in">
              已选择 {{ selectedCount }} 张
            </div>
          </div>
          
          <!-- 操作按钮组 -->
          <div class="flex items-center space-x-3">
            <!-- 选择模式切换按钮 -->
            <button 
              @click="toggleSelectionMode" 
              class="group relative px-4 py-2 rounded-lg transition-all duration-300"
              :class="selectionMode 
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            >
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 transition-transform duration-300"
                  :class="selectionMode ? 'rotate-180' : ''"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span v-if="selectionMode">
                  {{ selectedCount > 0 ? '完成' : '取消' }}
                </span>
                <span v-else>选择</span>
              </div>
            </button>
            
            <!-- 删除按钮 -->
            <button 
              v-if="selectionMode && selectedCount > 0" 
              @click="deleteSelected"
              class="group px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg 
                shadow-lg shadow-red-500/30 transition-all duration-300 
                transform hover:scale-105"
            >
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 group-hover:animate-bounce" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>删除 {{ selectedCount }}</span>
              </div>
            </button>
            
            <!-- 上传按钮 -->
            <button 
              v-if="!selectionMode" 
              @click="uploadPhotos"
              class="group px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 
                text-white rounded-lg shadow-lg shadow-primary-500/30 transition-all duration-300 
                transform hover:scale-105"
            >
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 group-hover:animate-bounce" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>上传照片</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 照片网格 -->
      <div class="transform transition-all duration-500" 
        :class="{'opacity-75 scale-[0.99]': selectionMode}">
        <PhotoGrid :selectable="selectionMode" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* 暗色模式渐变文字 */
@media (prefers-color-scheme: dark) {
  .from-primary-600 {
    --tw-gradient-from: var(--primary-400);
  }
  .to-primary-400 {
    --tw-gradient-to: var(--primary-300);
  }
}
</style>