<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMenuOpen = ref(false)

const isLoggedIn = computed(() => {
  return authStore.isAuthenticated
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  closeMenu()
}

const isActive = (route: string) => {
  return router.currentRoute.value.path.includes(route)
}
</script>

<template>
  <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and main nav -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center group">
              <div class="relative">
                <div class="absolute inset-0 bg-primary-100 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-primary-500 relative transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">云相册</span>
            </router-link>
          </div>
          
          <!-- Desktop navigation -->
          <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
            <router-link 
              to="/gallery" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
              :class="[
                isActive('/gallery') 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-300'
              ]"
              v-if="isLoggedIn"
            >
              相册
            </router-link>
            
            <router-link 
              to="/upload" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
              :class="[
                isActive('/upload') 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-300'
              ]"
              v-if="isLoggedIn"
            >
              上传
            </router-link>
          </div>
        </div>
        
        <!-- Mobile menu button and right side actions -->
        <div class="flex items-center">
          <div class="sm:hidden flex items-center">
            <button 
              @click="toggleMenu" 
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200"
            >
              <span class="sr-only">打开主菜单</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6 transition-opacity duration-200" 
                :class="{'opacity-0': isMenuOpen, 'opacity-100': !isMenuOpen}" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6 absolute transition-opacity duration-200" 
                :class="{'opacity-100': isMenuOpen, 'opacity-0': !isMenuOpen}" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Login/Logout button -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              v-if="isLoggedIn" 
              @click="logout" 
              class="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></span>
              <span class="relative">退出登录</span>
            </button>
            
            <router-link 
              v-else 
              to="/login" 
              class="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></span>
              <span class="relative">登录</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div 
      v-if="isMenuOpen" 
      class="sm:hidden fixed inset-0 z-40"
      @click.self="closeMenu"
    >
      <div class="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"></div>
      <div class="absolute top-[64px] inset-x-4 bg-white rounded-2xl shadow-xl p-4 transform transition-all duration-300 animate-slide-up">
        <div class="space-y-1">
          <router-link 
            to="/gallery" 
            @click="closeMenu"
            class="block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
            :class="[
              isActive('/gallery')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50/50'
            ]"
            v-if="isLoggedIn"
          >
            相册
          </router-link>
          
          <router-link 
            to="/upload" 
            @click="closeMenu"
            class="block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
            :class="[
              isActive('/upload')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50/50'
            ]"
            v-if="isLoggedIn"
          >
            上传
          </router-link>
          
          <!-- Login/Logout button for mobile -->
          <div class="px-2 pt-4">
            <button
              v-if="isLoggedIn" 
              @click="logout" 
              class="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              退出登录
            </button>
            
            <router-link 
              v-else 
              to="/login" 
              @click="closeMenu"
              class="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              登录
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.25;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>