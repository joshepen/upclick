<script setup lang="ts">
import { inject, ref } from 'vue'
import { InputText, InputNumber, Button } from 'primevue'
import type { StatusModel, TaskModel } from '@/models/Models'
import { useStatusStore } from '@/stores/StatusStore'

const statusStore = useStatusStore()
const dialogRef = inject('dialogRef') as any

const id = ref(dialogRef.value.data ? dialogRef.value.data.id : '')
const title = ref(dialogRef.value.data ? statusStore.statuses[id.value].title : '')
const color = ref(dialogRef.value.data ? statusStore.statuses[id.value].color : '')
const order = ref(dialogRef.value.data ? statusStore.statuses[id.value].order : 0)

function onSaveClicked() {
  if (!dialogRef.value.data) {
    statusStore.statuses[statusStore.getNextId()] = {
      title: title.value,
      color: color.value,
      order: order.value,
    } as StatusModel
  } else {
    statusStore.statuses[id.value] = {
      ...statusStore.statuses[dialogRef.value.data.id],
      title: title.value,
      color: color.value,
      order: order.value,
    } as StatusModel
  }
  dialogRef.value.close()
}

function onCancelClicked() {
  dialogRef.value.close()
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Title:</span>
      <InputText v-model="title" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Color:</span>
      <InputText v-model="color" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Order:</span>
      <InputNumber v-model="order" />
    </div>
    <div class="flex gap-5 justify-end">
      <Button label="Cancel" @click="onCancelClicked"
        class="!bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200" />
      <Button label="Save" @click="onSaveClicked" />
    </div>
  </div>
</template>
