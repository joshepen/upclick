<script setup lang="ts">
import { Select } from 'primevue';
import { useStatusStore } from '@/stores/StatusStore';

const statusId = defineModel({ type: String })
const { statuses, statusIds } = useStatusStore()
</script>

<template>
    <Select v-model="statusId" :options="statusIds">
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