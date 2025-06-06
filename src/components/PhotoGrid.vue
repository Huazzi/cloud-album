<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { VirtualWaterfall } from '@lhlyu/vue-virtual-waterfall'
import PhotoItem from './PhotoItem.vue'
import { usePhotoStore } from '../stores/photos'

const props = defineProps<{
  selectable?: boolean
}>()

const photoStore = usePhotoStore()
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')

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
  <div>
    <!-- Search and filter controls -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <!-- Search input -->
      <div class="relative w-full sm:w-auto">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Search photos..." class="input pl-10" />
      </div>

      <!-- Sort controls -->
      <div class="flex items-center space-x-2">
        <label for="sort-by" class="text-sm font-medium text-gray-700">Sort by:</label>
        <select id="sort-by" v-model="sortBy"
          class="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500">
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
        </select>

        <button @click="toggleSortOrder"
          class="inline-flex items-center rounded-md border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': sortOrder === 'asc' }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="photoStore.isLoading" class="flex justify-center py-12">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="photoStore.error" class="rounded-lg bg-red-50 p-4 text-center">
      <p class="text-red-700">{{ photoStore.error }}</p>
      <button @click="photoStore.fetchPhotos" class="mt-2 btn btn-outline">
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredPhotos.length === 0" class="py-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        {{ searchQuery ? 'No photos match your search' : 'No photos yet' }}
      </h3>
      <p class="mt-1 text-gray-500">
        {{ searchQuery ? 'Try a different search term' : 'Upload some photos to get started' }}
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
          <PhotoItem 
            :key="item.id"
            :photo="item" 
            :selectable="props.selectable" 
          />
        </template>
      </VirtualWaterfall>
    </div>
  </div>
</template>

<style scoped>
.virtual-waterfall-container {
  /* 设置固定高度以启用虚拟滚动 */
  height: calc(100vh - 200px); /* 根据你的布局调整 */
  overflow: auto;
}

/* 如果需要自定义滚动条样式 */
.virtual-waterfall-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-waterfall-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-waterfall-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-waterfall-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>