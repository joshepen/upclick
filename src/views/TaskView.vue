<script setup lang="ts">
import { DataTable, Column } from 'primevue';
import { useTaskStore } from '@/stores/TaskStore';
import { useStatusStore } from '@/stores/StatusStore';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
const { tasks } = storeToRefs(useTaskStore())
const { statuses } = useStatusStore()

onMounted(() => {
    tasks.value.forEach((task) => {
        const keys: string[] = Object.keys(statuses)
        if (!keys.includes(task.statusId) && keys.length > 0) {
            task.statusId = Object.keys(statuses)[0]
        }
    })
})

// TODO handle no longer valid statusId
</script>

<template>
    <DataTable :value="tasks">
        <Column field="title" header="Title" />
        <Column field=" status" header="Status">
            <template #body="slotProps">
                <span :class="['!bg-' + (statuses[slotProps.data.statusId]).color + '-300', 'p-2 rounded-xl']">
                    {{ (statuses[slotProps.data.statusId]).title }}
                </span>
            </template>
        </Column>
    </DataTable>
</template>