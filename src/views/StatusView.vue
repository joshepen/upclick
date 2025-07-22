<script setup lang="ts">
import { Button } from 'primevue'
import { useStatusStore } from '@/stores/StatusStore'

const statusStore = useStatusStore()

function onAddClicked() {}

function onEditClicked(id: string) {}

function onDeleteClicked(id: string) {}
</script>
<template>
  <div class="grid grid-cols-7 gap-1 pb-1">
    <div class="col-start-1 col-span-2 cell-header text-nowrap">Title</div>
    <div class="col-start-3 col-span-2 cell-header overflow-hidden">Color</div>
    <div class="col-start-5 col-span-2 cell-header overflow-hidden">Order</div>
    <div class="col-start-7 col-span-1 cell-header !p-2 flex">
      <Button label="Add" @click="onAddClicked" class="grow" pt:label:class="!text-slate-800" />
    </div>
  </div>
  <div v-for="id in statusStore.statusIds" class="grid grid-cols-7 gap-1 pb-1">
    <div class="col-start-1 col-span-2 cell text-nowrap text-lg">
      {{ statusStore.statuses[id].title }}
    </div>
    <div
      :class="[
        'col-start-3 col-span-2 cell overflow-hidden',
        `!text-${statusStore.statuses[id].color}-300`,
      ]"
    >
      {{ statusStore.statuses[id].color }}
    </div>
    <div class="col-start-5 col-span-2 cell overflow-hidden">
      {{ statusStore.statuses[id].order }}
    </div>
    <div class="col-start-7 col-span-1 cell">
      <div class="flex justify-around gap-2 p-1 grow">
        <Button
          label="✎"
          pt:root:class="!h-10 w-full"
          pt:label:class="!text-slate-800 text-2xl"
          @click="onEditClicked(id)"
        />
        <Button
          label="X"
          pt:root:class="w-full !h-10 !bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200 !border-none"
          pt:label:class="!text-slate-800 text-xl"
          @click="onDeleteClicked(id)"
        />
      </div>
    </div>
  </div>
</template>
