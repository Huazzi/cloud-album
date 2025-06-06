<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { VirtualWaterfall } from '@lhlyu/vue-virtual-waterfall'
import PhotoItem from './PhotoItem.vue'
import { usePhotoStore } from '../stores/photos'

// 定义 props 类型
interface Props {
  selectable?: boolean
}

const props = defineProps<Props>()

const photoStore = usePhotoStore()
const searchQuery = ref('')
const sortBy = ref<'date' | 'name' | 'size'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed properties for filtering and sorting
const filteredPhotos = computed(() => {
  let filtered = [...photoStore.photos]
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(photo => 
      photo.fileName.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let result = 0
    
    if (sortBy.value === 'date') {
      result = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
    } else if (sortBy.value === 'name') {
      result = a.fileName.localeCompare(b.fileName)
    } else if (sortBy.value === 'size') {
      result = a.fileSize - b.fileSize
    }
    
    return sortOrder.value === 'asc' ? result : -result
  })
  
  return filtered
})

onMounted(() => {
  photoStore.fetchPhotos()
})

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// 虚拟瀑布流配置
const virtualWaterfallConfig = {
  gap: 16,
  padding: '0px',
  itemMinWidth: 200,
  maxColumnCount: 6,
  minColumnCount: 1,
  preloadScreenCount: [1, 2] as [number, number] // 预加载上方1屏，下方2屏
}

// 计算每个图片项的高度（根据图片的宽高比）
const calcItemHeight = (item: any, itemWidth: number): number => {
  // 如果图片有宽高信息，根据比例计算
  if (item.width && item.height) {
    const aspectRatio = item.height / item.width
    return itemWidth * aspectRatio + 60 // 60px 用于标题、操作按钮等UI元素
  }
  
  // 默认高度，可以根据实际情况调整
  return itemWidth * 1.2 + 60
}
</script>

<template>
  <div class="photo-grid-container">
    <!-- Search and filter controls -->
    <div class="sticky top-0 z-10 mb-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Search input -->
        <div class="relative flex-grow max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="搜索照片..." 
            class="input pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-gray-800" />
        </div>

        <!-- Sort controls -->
        <div class="flex items-center space-x-3">
          <label for="sort-by" class="text-sm font-medium text-gray-700 dark:text-gray-300">排序方式:</label>
          <select id="sort-by" v-model="sortBy"
            class="rounded-md border-gray-300 dark:border-gray-600 py-1.5 pl-3 pr-8 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
            focus:border-primary-500 focus:ring-primary-500 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800">
            <option value="date">日期</option>
            <option value="name">名称</option>
            <option value="size">大小</option>
          </select>

          <button @click="toggleSortOrder"
            class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 p-1.5 text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" 
              :class="{ 'rotate-180': sortOrder === 'asc' }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="photoStore.isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
      <div class="relative">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 animate-pulse"></div>
        </div>
      </div>
      <p class="text-gray-500 dark:text-gray-400 animate-pulse">加载中...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="photoStore.error" 
      class="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center transform transition-all duration-300 hover:scale-[1.02]">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <p class="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">{{ photoStore.error }}</p>
      <button @click="photoStore.fetchPhotos" 
        class="mt-4 btn btn-outline border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30">
        重试
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredPhotos.length === 0" 
      class="py-12 text-center transform transition-all duration-300 hover:scale-[1.02]">
      <svg xmlns="http://www.w3.org/2000/svg" 
        class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 transition-all duration-500 hover:text-primary-500 dark:hover:text-primary-400" 
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-6 text-xl font-medium text-gray-900 dark:text-gray-100">
        {{ searchQuery ? '没有找到匹配的照片' : '还没有照片' }}
      </h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{ searchQuery ? '请尝试其他搜索关键词' : '上传一些照片开始使用吧' }}
      </p>
    </div>

    <!-- Virtual Waterfall Photo Grid -->
    <div v-else class="virtual-waterfall-container">
      <VirtualWaterfall
        :items="filteredPhotos"
        :gap="virtualWaterfallConfig.gap"
        :padding="virtualWaterfallConfig.padding"
        :item-min-width="virtualWaterfallConfig.itemMinWidth"
        :max-column-count="virtualWaterfallConfig.maxColumnCount"
        :min-column-count="virtualWaterfallConfig.minColumnCount"
        :preload-screen-count="virtualWaterfallConfig.preloadScreenCount"
        :calc-item-height="calcItemHeight"
        row-key="id"
      >
        <template #default="{ item, index }">
          <div class="transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
            <PhotoItem 
              :key="item.id"
              :photo="item" 
              :selectable="props.selectable" 
            />
          </div>
        </template>
      </VirtualWaterfall>
    </div>
  </div>
</template>

<style scoped>
.photo-grid-container {
  @apply px-4 py-6 min-h-screen;
}

.virtual-waterfall-container {
  height: calc(100vh - 180px);
  overflow: auto;
  @apply scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-400 
    dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-600
    hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500
    scrollbar-thin;
}

/* 自定义滚动条样式 */
.virtual-waterfall-container::-webkit-scrollbar {
  width: 6px;
}

.virtual-waterfall-container::-webkit-scrollbar-track {
  @apply bg-gray-200 dark:bg-gray-700;
  border-radius: 3px;
}

.virtual-waterfall-container::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.virtual-waterfall-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}

/* 添加页面过渡动画 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}
</style>