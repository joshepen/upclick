<script setup lang="ts">
import { DataTable, Column, Button, useDialog } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { onMounted, watch } from 'vue'
import TagMultiSelect from '@/components/TagMultiSelect.vue'
import StatusSelect from '@/components/StatusSelect.vue'
import TaskEditModal from '@/modals/TaskEditModal.vue'
import type { TaskModel } from '@/models/Models'

const taskStore = useTaskStore()
const { statusIds } = useStatusStore()
const dialog = useDialog()

watch(taskStore.tasks, () => {
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
            if (options?.data) {
                if (options?.data.id !== id) {
                    delete taskStore.tasks[id]
                }
                taskStore.tasks[options?.data.id] = options?.data.task
            }
        },
    })
}

function onAddClicked() {
    dialog.open(TaskEditModal, {
        props: { modal: true },
        onClose: (options) => {
            if (options?.data) {
                taskStore.tasks[options?.data.id] = options?.data.task
            }
        },
    })
}

function onDeleteClicked(id: string) {
    delete taskStore.tasks[id]
}

// TODO handle no longer valid statusId
</script>

<template>
    <DataTable :value="taskStore.taskIds.map((id) => {
        return { ...taskStore.tasks[id], id }
    })
        " show-gridlines>
        <Column field="title" header="Title" class="text-nowrap" />
        <Column field="status" header="Status">
            <template #body="slotProps">
                <StatusSelect v-model="taskStore.tasks[slotProps.data.id].statusId" />
            </template>
        </Column>
        <Column field="tags" header="Tags">
            <template #body="slotProps">
                <TagMultiSelect v-model="taskStore.tasks[slotProps.data.id].tags" />
            </template>
        </Column>
        <Column field="buttons" class="!w-12">
            <template #header>
                <div class="flex justify-center grow">
                    <Button label="Add" class="w-24" @click="onAddClicked" />
                </div>
            </template>
            <template #body="slotProps">
                <div class="flex gap-3">
                    <Button label="✎" pt:root:class="!w-10 !h-10" pt:label:class="!text-slate-800 text-2xl"
                        @click="onEditClicked(slotProps.data.id, slotProps.data)" />
                    <Button label="X"
                        pt:root:class="!w-10 !h-10 !bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200 !border-none"
                        pt:label:class="!text-slate-800 text-xl" @click="onDeleteClicked(slotProps.data.id)" />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
