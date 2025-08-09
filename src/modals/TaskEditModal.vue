<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { InputText, DatePicker, Button } from 'primevue'
import type { TaskModel } from '@/models/Models'
import { useTaskStore } from '@/stores/TaskStore'

const taskStore = useTaskStore()
const dialogRef: Ref<any> | undefined = inject('dialogRef')


const id = ref(dialogRef?.value.data ? dialogRef.value.data.id : '')
const title = ref(dialogRef?.value.data ? taskStore.tasks[id.value].title : '')
const description = ref(dialogRef?.value.data ? taskStore.tasks[id.value].description : '')
const createdOn = ref(
  dialogRef?.value.data ? taskStore.tasks[id.value].createdOn : new Date().toISOString(),
)
const deadline = ref(
  dialogRef?.value.data
    ? taskStore.tasks[id.value].deadline
      ? new Date(taskStore.tasks[id.value].deadline)
      : null
    : new Date(),
)

function onSaveClicked() {
  const deadlineStr = deadline.value ? deadline.value.toISOString() : ''
  if (!dialogRef?.value.data) {
    taskStore.tasks[taskStore.getNextId()] = {
      title: title.value,
      description: description.value,
      createdOn: createdOn.value,
      deadline: deadlineStr,
      statusId: '',
      tagIds: [],
    } as TaskModel
  } else {
    taskStore.tasks[id.value] = {
      ...taskStore.tasks[id.value],
      title: title.value,
      description: description.value,
      deadline: deadlineStr,
    }
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
      <span class="text-lg">Description:</span>
      <InputText v-model="description" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Deadline:</span>
      <DatePicker v-model="deadline" pt:header:class="!bg-inherit" />
    </div>
    <div class="flex gap-5 justify-end">
      <Button label="Cancel" @click="onCancelClicked"
        class="!bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200" />
      <Button label="Save" @click="onSaveClicked" />
    </div>
  </div>
</template>
