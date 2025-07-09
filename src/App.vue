<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './AppHeader.vue';
</script>

<template>
    <div class="h-screen flex flex-col">
        <header class="w-full h-14">
            <app-header />
        </header>
        <main class="w-full flex-1 flex flex-col bg-slate-300">
            <RouterView />
        </main>
    </div>
</template>