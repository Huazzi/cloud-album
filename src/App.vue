<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { setupRouterGuards } from './router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Set up router guards
  setupRouterGuards(router)
  
  // Initialize auth state
  authStore.initAuth()
})
</script>

<template>
  <div>
    <NavBar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>