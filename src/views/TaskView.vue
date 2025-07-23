<script setup lang="ts">
import { Button, useDialog } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { onBeforeMount } from 'vue'
import TaskRow from '@/components/TaskRow.vue'
import TaskEditModal from '@/modals/TaskEditModal.vue'
import { useTagStore } from '@/stores/TagStore'

const taskStore = useTaskStore()
const { statusIds } = useStatusStore()
const { tagIds } = useTagStore()
const dialog = useDialog()

onBeforeMount(() => {
  taskStore.taskIds.forEach((taskId) => {
    if (!statusIds.includes(taskStore.tasks[taskId].statusId) && statusIds.length > 0) {
      taskStore.tasks[taskId].statusId = statusIds[0]
    }
    taskStore.tasks[taskId].tagIds = taskStore.tasks[taskId].tagIds.filter((tagId) => {
      return tagIds.includes(tagId)
    })
  })
})

function onAddClicked() {
  dialog.open(TaskEditModal, {
    props: { modal: true },
  })
}
</script>

<template>
  <div class="grid grid-cols-12 pb-1 gap-1">
    <div class="col-start-1 col-span-2 cell-header text-nowrap">Title</div>
    <div class="col-start-3 col-span-2 cell-header overflow-hidden">Status</div>
    <div class="col-start-5 col-span-3 cell-header overflow-hidden">Tags</div>
    <div class="col-start-8 col-span-2 cell-header text-center">Created</div>
    <div class="col-start-10 col-span-2 cell-header text-center">Deadline</div>
    <div class="col-start-12 col-span-1 cell-header !p-2 flex">
      <Button label="Add" @click="onAddClicked" class="grow" pt:label:class="!text-slate-800" />
    </div>
  </div>
  <div v-for="id in taskStore.taskIds" :key="id">
    <task-row :id="id" />
  </div>
</template>
