<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="w-full h-18">
      <app-header />
    </header>
    <main class="w-full flex-1 flex flex-col">
      <RouterView />
    </main>
  </div>
</template>
