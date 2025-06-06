import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '../services/api'
import { Photo } from '../types'

export const usePhotoStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const selectedPhotos = ref<string[]>([])
  
  // Get all photos
  const fetchPhotos = async () => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await apiClient.get('/photos')
      photos.value = response.data
    } catch (err: any) {
      error.value = 'Failed to load photos. Please try again.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Get a single photo by ID
  const getPhotoById = computed(() => {
    return (id: string) => photos.value.find(photo => photo.id === id)
  })
  
  // Upload a photo
  const uploadPhoto = async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percentCompleted)
          }
        }
      })
      
      // Add the new photo to the photos array
      photos.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = 'Failed to upload photo. Please try again.'
      console.error(err)
      throw err
    }
  }
  
  // Delete a photo
  const deletePhoto = async (id: string) => {
    try {
      await apiClient.delete(`/photos/${id}`)
      photos.value = photos.value.filter(photo => photo.id !== id)
      selectedPhotos.value = selectedPhotos.value.filter(photoId => photoId !== id)
      return true
    } catch (err: any) {
      error.value = 'Failed to delete photo. Please try again.'
      console.error(err)
      return false
    }
  }
  
  // Toggle photo selection
  const toggleSelection = (id: string) => {
    const index = selectedPhotos.value.indexOf(id)
    if (index === -1) {
      selectedPhotos.value.push(id)
    } else {
      selectedPhotos.value.splice(index, 1)
    }
  }
  
  // Clear all selections
  const clearSelection = () => {
    selectedPhotos.value = []
  }
  
  // Delete multiple photos
  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.value.length === 0) return
    
    try {
      await apiClient.post('/photos/delete-multiple', { ids: selectedPhotos.value })
      photos.value = photos.value.filter(photo => !selectedPhotos.value.includes(photo.id))
      selectedPhotos.value = []
      return true
    } catch (err: any) {
      error.value = 'Failed to delete selected photos. Please try again.'
      console.error(err)
      return false
    }
  }
  
  return {
    photos,
    isLoading,
    error,
    selectedPhotos,
    fetchPhotos,
    getPhotoById,
    uploadPhoto,
    deletePhoto,
    toggleSelection,
    clearSelection,
    deleteSelectedPhotos
  }
})