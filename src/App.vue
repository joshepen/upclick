<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="h-screen flex flex-col">
        <header class="w-full h-18">
        </header>
        <main class="w-full flex-1 flex flex-col">
            <RouterView />
        </main>
    </div>
</template>