<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="text-center animate-fade-in">
      <div class="inline-flex rounded-full bg-red-100 p-4">
        <div class="rounded-full stroke-red-600 bg-red-200 p-4">
          <svg class="w-16 h-16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0002 9.33337V14M14.0002 18.6667H14.0118M25.6668 14C25.6668 20.4434 20.4435 25.6667 14.0002 25.6667C7.55684 25.6667 2.3335 20.4434 2.3335 14C2.3335 7.55672 7.55684 2.33337 14.0002 2.33337C20.4435 2.33337 25.6668 7.55672 25.6668 14Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
      <h1 class="mt-5 text-[36px] font-bold text-gray-900 lg:text-[50px]">404 - Page not found</h1>
      <p class="text-slate-600 mt-5 lg:text-lg">The page you are looking for doesn't exist or <br />has been removed.</p>
      <button @click="goHome" class="mt-8 btn btn-primary">
        Go back home
      </button>
    </div>
  </div>
</template>