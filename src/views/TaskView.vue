<script setup lang="ts">
import { DataTable, Column, InputText, Select } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TagMultiSelect from '@/components/TagMultiSelect.vue'
import StatusSelect from '@/components/StatusSelect.vue'

const { tasks } = storeToRefs(useTaskStore())
const { statuses, statusIds } = useStatusStore()

onMounted(() => {
    tasks.value.forEach((task) => {
        const keys: string[] = Object.keys(statuses)
        if (!keys.includes(task.statusId) && keys.length > 0) {
            task.statusId = statusIds[0]
        }
    })
})

// TODO handle no longer valid statusId
</script>

<template>
    <DataTable :value="tasks">
        <Column field="title" header="Title" />
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
    </DataTable>
</template>
