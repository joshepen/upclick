<script setup lang="ts">
import { Button } from 'primevue'
import { useStatusStore } from '@/stores/StatusStore'

const statusStore = useStatusStore()

function onAddClicked() {}

function onEditClicked(id: string) {}

function onDeleteClicked(id: string) {}
</script>
<template>
  <div class="flex flex-col justify-between p-1 gap-1">
    <div class="flex gap-1">
      <div class="cell-header w-[30%] text-nowrap">Title</div>
      <div class="cell-header w-[30%] overflow-hidden">Color</div>
      <div class="cell-header w-[30%] overflow-hidden">Order</div>
      <div class="cell-header !p-2 flex w-[10%]">
        <Button label="Add" @click="onAddClicked" class="grow" pt:label:class="!text-slate-800" />
      </div>
    </div>
    <div v-for="id in statusStore.statusIds" class="flex gap-1">
      <div class="cell w-[30%] text-nowrap text-lg">
        {{ statusStore.statuses[id].title }}
      </div>
      <div :class="['cell w-[30%] overflow-hidden', `!text-${statusStore.statuses[id].color}-300`]">
        {{ statusStore.statuses[id].color }}
      </div>
      <div class="cell w-[30%] overflow-hidden">
        {{ statusStore.statuses[id].order }}
      </div>
      <div class="cell w-[10%]">
        <div class="flex gap-3">
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
  </div>
</template>
