import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const isAuthLoading = ref(false)
  const authError = ref('')
  
  // Check if we have a token in localStorage
  const initAuth = () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      isAuthenticated.value = true
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
  
  // Login function
  const login = async (password: string) => {
    isAuthLoading.value = true
    authError.value = ''
    
    try {
      const response = await apiClient.post('/auth', { password })
      const { token } = response.data
      
      localStorage.setItem('authToken', token)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      isAuthenticated.value = true
      
      return true
    } catch (error: any) {
      authError.value = error.response?.data?.message || 'Login failed. Please try again.'
      return false
    } finally {
      isAuthLoading.value = false
    }
  }
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken')
    delete apiClient.defaults.headers.common['Authorization']
    isAuthenticated.value = false
    router.push('/login')
  }
  
  return {
    isAuthenticated,
    isAuthLoading,
    authError,
    initAuth,
    login,
    logout
  }
})