import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { VueToastPlugin } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

import App from './App.vue'
import './style.css'

// Import routes
import { routes } from './router'

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create pinia store
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueToastPlugin)

app.mount('#app')