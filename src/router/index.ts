import { RouteRecordRaw } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Gallery from '../views/Gallery.vue'
import PhotoDetail from '../views/PhotoDetail.vue'
import Upload from '../views/Upload.vue'
import NotFound from '../views/NotFound.vue'

import { useAuthStore } from '../stores/auth'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: Gallery,
    meta: { requiresAuth: true }
  },
  {
    path: '/photo/:id',
    name: 'photo-detail',
    component: PhotoDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

// Navigation guard
export function setupRouterGuards(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
}