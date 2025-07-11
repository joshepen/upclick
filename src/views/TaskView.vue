<script setup lang="ts">
import { DataTable, Column, InputText, Select } from 'primevue'
import { useTaskStore } from '@/stores/TaskStore'
import { useStatusStore } from '@/stores/StatusStore'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskModel } from '@/models/Models'
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

// :class="['!bg-' + (statuses[slotProps.data.statusId]).color + '-300', 'p-2 rounded-xl']"
// TODO handle no longer valid statusId
</script>

<template>
    <DataTable :value="tasks">
        <Column field="title" header="Title" />
        <Column field="status" header="Status">
            <template #body="slotProps">
                <Select v-model="slotProps.data.statusId" :options="Object.keys(statuses)">
                    <template #value="slotProps">
                        <span :class="['!text-' + statuses[slotProps.value].color + '-300', 'p-2 rounded-xl']">{{
                            statuses[slotProps.value].title }}</span>
                    </template>
                    <template #option="slotProps">
                        <span :class="['!text-' + statuses[slotProps.option].color + '-300', 'p-2 rounded-xl']">
                            {{ statuses[slotProps.option].title }}
                        </span>
                    </template>
                </Select>
            </template>
        </Column>
    </DataTable>
    <!-- <DataTable :value="[{}]" :show-headers="false">
        <Column field="title">
            <template #body>
                <InputText placeholder="Create new task" />
            </template>
        </Column>
        <Column field="status">
            <template #body>
                <InputText />
            </template>
        </Column>
    </DataTable> -->
</template>
