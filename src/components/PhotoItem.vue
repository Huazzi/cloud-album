<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Photo } from '../types'
import { formatFileSize, formatDate } from '../utils/formatters'
import { usePhotoStore } from '../stores/photos'

const props = defineProps<{
  photo: Photo
  selectable?: boolean
}>()

const router = useRouter()
const photoStore = usePhotoStore()

const isSelected = computed(() => {
  return photoStore.selectedPhotos.includes(props.photo.id)
})

const isHovered = ref(false)

const handleClick = () => {
  if (props.selectable) {
    photoStore.toggleSelection(props.photo.id)
  } else {
    router.push(`/photo/${props.photo.id}`)
  }
}

const stopPropagation = (e: Event) => {
  e.stopPropagation()
}
</script>

<template>
  <div 
    class="card group relative cursor-pointer overflow-hidden"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Selection checkbox -->
    <div 
      v-if="selectable" 
      class="absolute top-2 left-2 z-10"
    >
      <input 
        type="checkbox" 
        :checked="isSelected"
        class="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        @click="stopPropagation"
        @change="photoStore.toggleSelection(photo.id)"
      />
    </div>
    
    <!-- Image -->
    <div class="relative overflow-hidden pb-[100%]">
      <img 
        :src="photo.thumbnailUrl || photo.url" 
        :alt="photo.fileName"
        class="absolute h-full w-full object-cover transition duration-500 ease-in-out group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Overlay with actions -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-30"
      >
        <div 
          class="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        >
          <div class="flex justify-between">
            <span class="text-sm text-white truncate max-w-[70%]">{{ photo.fileName }}</span>
            <span class="text-xs text-white">{{ formatFileSize(photo.fileSize) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>