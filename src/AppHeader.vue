<script setup lang="ts">
import { Button } from 'primevue'
</script>

<template>
  <div class="flex justify-between h-full w-full p-2">
    <div class="w-full flex items-center">
      <div class="h-full flex gap-2 items-center !bg-white rounded-xl px-2">
        <Button class="!rounded-xl">Tasks</Button>
        <Button class="!rounded-xl">Statuses</Button>
        <Button class="!rounded-xl">Tags</Button>
      </div>
    </div>
    <div class="flex gap-3 items-center">
      <div class="flex !bg-white rounded-xl h-full items-center p-4">
        <span class="font-semibold !text-teal-800 text-xl">JoshUp</span>
      </div>
    </div>
    <div class="w-full flex items-center justify-end">
      <div class="h-full flex gap-2 items-center !bg-white rounded-xl px-2">
        <Button class="!rounded-xl">About</Button>
        <Button class="!rounded-xl !bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200"
          >Reset</Button
        >
      </div>
    </div>
  </div>
</template>
