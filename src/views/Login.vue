<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!password.value.trim()) {
    errorMessage.value = '请输入密码'
    return
  }
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.login(password.value)
    
    if (success) {
      const redirectPath = route.query.redirect as string || '/gallery'
      await router.push(redirectPath)
    } else {
      errorMessage.value = authStore.authError || '密码错误，请重试'
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-grid-primary/[0.02] bg-[size:20px_20px]"></div>
    <div class="absolute w-96 h-96 blur-3xl bg-primary-200/20 rounded-full -top-48 -left-48 animate-pulse"></div>
    <div
      class="absolute w-96 h-96 blur-3xl bg-primary-200/20 rounded-full -bottom-48 -right-48 animate-pulse delay-1000">
    </div>

    <div class="max-w-md w-full">
      <!-- 登录卡片 -->
      <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-8 animate-fade-in relative">
        <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-2xl"></div>

        <div class="relative">
          <div class="flex justify-center transform hover:scale-105 transition-transform duration-300">
            <div class="relative">
              <div class="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-primary-600 relative" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2
            class="mt-8 text-center text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            欢迎使用云相册
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            请输入密码访问您的照片
          </p>
        </div>

        <form class="mt-8 space-y-6 relative" @submit.prevent="handleSubmit">
          <div class="rounded-xl shadow-sm -space-y-px">
            <div class="group">
              <label for="password" class="sr-only">密码</label>
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/70"
                placeholder="请输入密码" />
            </div>
          </div>

          <div v-if="errorMessage"
            class="rounded-xl bg-red-50 p-4 animate-fade-in border border-red-100 relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-red/[0.02] bg-[size:20px_20px]"></div>
            <div class="flex relative">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <div class="relative">
            <button type="submit" :disabled="isSubmitting"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-primary-300 group-hover:text-primary-200 transition-colors duration-300"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              {{ isSubmitting ? '登录中...' : '登录' }}
            </button>

            <!-- 按钮装饰效果 -->
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-grid-primary {
  background-size: 20px 20px;
  background-image: linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
}

.bg-grid-red {
  background-size: 20px 20px;
  background-image: linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
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

.delay-1000 {
  animation-delay: 1s;
}
</style>