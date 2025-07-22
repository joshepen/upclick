<script setup lang="ts">
import { Button, useDialog } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { onBeforeMount } from 'vue'
import TagMultiSelect from '@/components/TagMultiSelect.vue'
import StatusSelect from '@/components/StatusSelect.vue'
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

function onEditClicked(id: string) {
    dialog.open(TaskEditModal, {
        props: { modal: true },
        data: { id },
    })
}

function onAddClicked() {
    dialog.open(TaskEditModal, {
        props: { modal: true },
    })
}

function onDeleteClicked(id: string) {
    delete taskStore.tasks[id]
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
    <div v-for="id in taskStore.taskIds" class="grid grid-cols-12 gap-1 pb-1">
        <div class="col-start-1 col-span-2 cell text-nowrap text-lg">
            {{ taskStore.tasks[id].title }}
        </div>
        <div class="col-start-3 col-span-2 cell overflow-hidden">
            <StatusSelect v-model="taskStore.tasks[id].statusId" />
        </div>
        <div class="col-start-5 col-span-3 cell overflow-hidden">
            <TagMultiSelect v-model="taskStore.tasks[id].tagIds" />
        </div>
        <div class="col-start-8 col-span-2 cell overflow-hidden">
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
        <div class="col-start-10 col-span-2 cell overflow-hidden">
            {{
                taskStore.tasks[id].deadline ? new Date(taskStore.tasks[id].deadline).toDateString() : ''
            }}
        </div>
        <div class="col-start-12 col-span-1 cell overflow-hidden">
            <div class="flex justify-around gap-2 p-1 grow">
                <Button label="✎" pt:root:class="w-full !h-10" pt:label:class="!text-slate-800 text-2xl"
                    @click="onEditClicked(id)" />
                <Button label="X"
                    pt:root:class="w-full !h-10 !bg-red-400 !border-none hover:!bg-red-300 active:!bg-red-200 !border-none"
                    pt:label:class="!text-slate-800 text-xl" @click="onDeleteClicked(id)" />
            </div>
        </div>
    </div>
</template>
