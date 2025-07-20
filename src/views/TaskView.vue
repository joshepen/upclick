<script setup lang="ts">
import { DataTable, Column, Button, useDialog } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { watch } from 'vue'
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

function onEditClicked(id: string) {
    dialog.open(TaskEditModal, {
        props: { modal: true },
        data: { id },
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
</script>

<template>
    <div class="flex flex-col justify-between p-1 gap-1">
        <div class="flex gap-1">
            <div class="!bg-slate-800 p-1 flex w-[20%] justify-center items-center text-nowrap text-lg">Title</div>
            <div class="!bg-slate-800 p-1 flex w-[20%] justify-center items-center overflow-hidden text-lg">
                Status
            </div>
            <div class="!bg-slate-800 p-1 flex w-[34%] justify-center items-center overflow-hidden text-lg">
                Tags
            </div>
            <div class="!bg-slate-800 p-1 flex w-[13%] justify-center items-center text-center text-lg">Created</div>
            <div class="!bg-slate-800 p-1 flex w-[13%] justify-center items-center text-center text-lg"> Deadline</div>
            <div class="!bg-slate-800 p-2 flex w-[10%] justify-center items-center text-lg">
                <Button label="Add" @click="onAddClicked" class="grow" pt:label:class="!text-slate-800" />
            </div>
        </div>
        <div v-for="id in taskStore.taskIds" class="flex gap-1">
            <div class="!bg-slate-700 p-1 flex w-[20%] justify-center items-center text-nowrap text-lg">{{
                taskStore.tasks[id].title
                }}</div>
            <div class="!bg-slate-700 p-1 flex w-[20%] justify-center items-center overflow-hidden">
                <StatusSelect v-model="taskStore.tasks[id].statusId" />
            </div>
            <div class="!bg-slate-700 p-1 flex w-[34%] justify-center items-center overflow-hidden">
                <TagMultiSelect v-model="taskStore.tasks[id].tags" />
            </div>
            <div class="!bg-slate-700 p-1 flex w-[13%] justify-center items-center text-center">{{
                taskStore.tasks[id].createdOn ?
                    new Date(taskStore.tasks[id].createdOn).toDateString() : '' }} {{ taskStore.tasks[id].createdOn ?
                    new Date(taskStore.tasks[id].createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                    ''
                }}</div>
            <div class="!bg-slate-700 p-1 flex w-[13%] justify-center items-center text-center">{{
                taskStore.tasks[id].deadline ?
                    new Date(taskStore.tasks[id].deadline).toDateString() : '' }}</div>
            <div class="!bg-slate-700 p-1 flex w-[10%] justify-center items-center">
                <div class="flex gap-3">
                    <Button label="✎" pt:root:class="!w-10 !h-10" pt:label:class="!text-slate-800 text-2xl"
                        @click="onEditClicked(id)" />
                    <Button label="X"
                        pt:root:class="!w-10 !h-10 !bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200 !border-none"
                        pt:label:class="!text-slate-800 text-xl" @click="onDeleteClicked(id)" />
                </div>
            </div>
        </div>
    </div>
</template>
