<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="h-screen flex flex-col">
        <header class="w-full h-20">
        </header>
        <main class="w-full h-full">
            <div class="w-full h-full">
                <RouterView />
            </div>
        </main>
    </div>
</template>