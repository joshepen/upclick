<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { computed } from 'vue'
import { useDialog, Button } from 'primevue'
import TaskEditModal from '@/modals/TaskEditModal.vue'
import TagMultiSelect from './TagMultiSelect.vue'
import StatusSelect from './StatusSelect.vue'
import { useStatusStore } from '@/stores/StatusStore'

const props = defineProps({ id: { type: String, required: true } })

const taskStore = useTaskStore()
const { completed_id } = useStatusStore()
const dialog = useDialog()

function onEditClicked(id: string) {
  dialog.open(TaskEditModal, {
    props: { modal: true },
    data: { id },
  })
}

function onDeleteClicked(id: string) {
  delete taskStore.tasks[id]
}

const opacity = computed<string>(() => {
  if (taskStore.tasks[props.id].statusId === completed_id) {
    return 'opacity-50'
  }
  return ''
})

const dueColor = computed(() =>
  new Date().toISOString() > taskStore.tasks[props.id].deadline ? '!text-red-300' : '',
)
</script>

<template>
  <div :class="['grid grid-cols-24 gap-1 pb-1', opacity]">
    <div
      class="col-start-1 col-span-4 cell text-nowrap text-lg"
      v-tooltip="taskStore.tasks[id].description"
    >
      {{ taskStore.tasks[id].title }}
    </div>
    <div class="col-start-5 col-span-6 cell overflow-hidden">
      <StatusSelect v-model="taskStore.tasks[id].statusId" />
    </div>
    <div class="col-start-11 col-span-6 cell overflow-hidden">
      <TagMultiSelect v-model="taskStore.tasks[id].tagIds" />
    </div>
    <div class="col-start-17 col-span-3 cell overflow-hidden">
      {{
        taskStore.tasks[id].createdOn ? new Date(taskStore.tasks[id].createdOn).toDateString() : ''
      }}
      {{
        taskStore.tasks[id].createdOn
          ? new Date(taskStore.tasks[id].createdOn).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : ''
      }}
    </div>
    <div :class="['col-start-20 col-span-3 cell overflow-hidden', dueColor]">
      {{
        taskStore.tasks[id].deadline ? new Date(taskStore.tasks[id].deadline).toDateString() : ''
      }}
    </div>
    <div class="col-start-23 col-span-2 cell overflow-hidden">
      <div class="flex justify-around gap-2 p-1 grow">
        <Button
          label="✎"
          pt:root:class="w-full !h-10"
          pt:label:class="text-2xl"
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
