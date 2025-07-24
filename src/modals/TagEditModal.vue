<script setup lang="ts">
import { inject, ref } from 'vue'
import { InputText, DatePicker, Button } from 'primevue'
import type { TagModel } from '@/models/Models'
import { useTagStore } from '@/stores/TagStore'

const tagStore = useTagStore()
const dialogRef = inject('dialogRef') as any

const id = ref(dialogRef.value.data ? dialogRef.value.data.id : '')
const title = ref(dialogRef.value.data ? tagStore.tags[id.value].title : '')
const color = ref(dialogRef.value.data ? tagStore.tags[id.value].color : '')

function onSaveClicked() {
  if (!dialogRef.value.data) {
    tagStore.tags[id.value] = {
      title: title.value,
      color: color.value,
    } as TagModel
  } else if (dialogRef.value.data.id !== id.value) {
    tagStore.tags[id.value] = {
      ...tagStore.tags[dialogRef.value.data.id],
      title: title.value,
      color: color.value,
    } as TagModel
    delete tagStore.tags[dialogRef.value.data.id]
  } else {
    tagStore.tags[id.value] = {
      ...tagStore.tags[id.value],
      title: title.value,
      color: color.value,
    } as TagModel
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
      <span class="text-lg">Task ID:</span>
      <InputText v-model="id" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Title:</span>
      <InputText v-model="title" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Color:</span>
      <InputText v-model="color" />
    </div>
    <div class="flex gap-5 justify-end">
      <Button label="Cancel" @click="onCancelClicked"
        class="!bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200" />
      <Button label="Save" @click="onSaveClicked" />
    </div>
  </div>
</template>
