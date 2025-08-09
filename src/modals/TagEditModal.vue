<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { InputText, DatePicker, Button } from 'primevue'
import type { TagModel } from '@/models/Models'
import { useTagStore } from '@/stores/TagStore'

const tagStore = useTagStore()
const dialogRef: Ref<any> | undefined = inject('dialogRef')


const id = ref(dialogRef?.value.data ? dialogRef.value.data.id : '')
const title = ref(dialogRef?.value.data ? tagStore.tags[id.value].title : '')
const color = ref(dialogRef?.value.data ? tagStore.tags[id.value].color : '')

function onSaveClicked() {
  if (!dialogRef?.value.data) {
    tagStore.tags[tagStore.getNextId()] = {
      title: title.value,
      color: color.value,
    } as TagModel
  } else {
    tagStore.tags[id.value] = {
      ...tagStore.tags[id.value],
      title: title.value,
      color: color.value,
    } as TagModel
  }
  dialogRef?.value.close()
}

function onCancelClicked() {
  dialogRef?.value.close()
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
    <div class="flex gap-5 justify-end">
      <Button label="Cancel" @click="onCancelClicked"
        class="!bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200" />
      <Button label="Save" @click="onSaveClicked" />
    </div>
  </div>
</template>
