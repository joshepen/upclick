<script setup lang="ts">
import { Button } from 'primevue';
</script>

<template>
    <div class="flex justify-between h-full w-full p-2">
        <div class="flex gap-2 w-full items-center">
            <Button class="!rounded-xl">Tasks</Button>
            <Button class="!rounded-xl">Statuses</Button>
            <Button class="!rounded-xl">Tags</Button>
        </div>
        <div class="flex gap-3 items-center">
            <div class="flex !bg-white rounded-xl h-full items-center p-4">
                <span class="font-semibold !text-teal-800 text-xl">JoshUp</span>
            </div>
        </div>
        <div class="flex gap-2 w-full items-center justify-end">
            <Button class="!rounded-xl">About</Button>

        </div>
    </div>
</template>