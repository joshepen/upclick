<script setup lang="ts">
import { DataTable, Column, Button, useDialog } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { onMounted } from 'vue'
import TagMultiSelect from '@/components/TagMultiSelect.vue'
import StatusSelect from '@/components/StatusSelect.vue'
import TaskEditModal from '@/modals/TaskEditModal.vue'
import type { TaskModel } from '@/models/Models'

const taskStore = useTaskStore()
const { statusIds } = useStatusStore()
const dialog = useDialog()

onMounted(() => {
  taskStore.taskIds.forEach((taskId) => {
    if (!statusIds.includes(taskStore.tasks[taskId].statusId) && statusIds.length > 0) {
      taskStore.tasks[taskId].statusId = statusIds[0]
    }
  })
})

function onEditClicked(id: string, task: TaskModel) {
  dialog.open(TaskEditModal, {
    props: { modal: true },
    data: { task, id },
    onClose: (options) => {
      if (options?.data.id !== id) {
        delete taskStore.tasks[id]
      }
      taskStore.tasks[options?.data.id] = options?.data.task
    },
  })
}

// TODO handle no longer valid statusId
</script>

<template>
  <DataTable
    :value="
      taskStore.taskIds.map((id) => {
        return { ...taskStore.tasks[id], id }
      })
    "
    show-gridlines
  >
    <Column field="title" header="Title" class="text-nowrap" />
    <Column field="status" header="Status">
      <template #body="slotProps">
        <StatusSelect v-model="slotProps.data.statusId" />
      </template>
    </Column>
    <Column field="tags" header="Tags">
      <template #body="slotProps">
        <TagMultiSelect v-model="slotProps.data.tags" :tag-ids="slotProps.data.tags" />
      </template>
    </Column>
    <Column field="buttons" class="!w-12">
      <template #body="slotProps">
        <div class="flex gap-3">
          <Button
            label="✎"
            pt:root:class="!w-10 !h-10"
            pt:label:class="!text-slate-800 text-2xl"
            @click="onEditClicked(slotProps.data.id, slotProps.data)"
          />
          <Button
            label="X"
            pt:root:class="!w-10 !h-10 !bg-red-300 !border-none"
            pt:label:class="!text-slate-800 text-xl"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
