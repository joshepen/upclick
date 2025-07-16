<script setup lang="ts">
import { inject, ref } from 'vue'
import { InputText, DatePicker, Button } from 'primevue'
import type { TaskModel } from '@/models/Models'
const dialogRef = inject('dialogRef')

const id = ref(dialogRef.value.data.id)
const title = ref(dialogRef.value.data.task?.title ?? '')
const description = ref(dialogRef.value.data.task?.description ?? '')
const deadline = ref(dialogRef.value.data.task ? dialogRef.value.data.task.deadline : new Date())

function onSaveClicked() {
  let newTask: TaskModel
  if (dialogRef.value.data.task) {
    newTask = {
      ...dialogRef.value.data.task,
      title: title.value,
      description: description.value,
      deadline: deadline.value,
    }
  } else {
    newTask = {
      title: title.value,
      description: description.value,
      statusId: '',
      createdOn: new Date(),
      deadline: deadline,
      tags: [],
    }
  }
  dialogRef.value.close({ task: newTask, id: id.value })
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
      <span class="text-lg">Description:</span>
      <InputText v-model="description" />
    </div>
    <div class="flex justify-between gap-10 items-center">
      <span class="text-lg">Deadline:</span>
      <DatePicker v-model="deadline" />
    </div>
    <div class="flex gap-5">
      <Button label="Cancel" />
      <Button label="Save" @click="onSaveClicked" />
    </div>
  </div>
</template>
