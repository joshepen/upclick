<script setup lang="ts">
import { Select, Button } from 'primevue'
import { useStatusStore } from '@/stores/StatusStore'

const statusId = defineModel({ type: String, required: true })
const { statuses, statusIds } = useStatusStore()

function nextStatus() {
  const index: number = statusIds.indexOf(statusId.value)
  if (index >= 0 && index < statusIds.length - 1) {
    statusId.value = statusIds[index + 1]
  }
}

function previousStatus() {
  const index: number = statusIds.indexOf(statusId.value)
  if (index > 0 && index < statusIds.length) {
    statusId.value = statusIds[index - 1]
  }
}
</script>

<template>
  <div class="flex gap-1 p-1 w-full">
    <Button @click="previousStatus" label="<" class="w-8" />
    <Select v-model="statusId" :options="statusIds" class="min-w-0 w-full">
      <template #value="slotProps">
        <span :class="['!text-' + statuses[slotProps.value].color + '-300', 'p-2 rounded-xl']">{{
          statuses[slotProps.value].title
        }}</span>
      </template>
      <template #option="slotProps">
        <span :class="['!text-' + statuses[slotProps.option].color + '-300', 'p-2 rounded-xl']">
          {{ statuses[slotProps.option].title }}
        </span>
      </template>
    </Select>
    <Button @click="nextStatus" label=">" class="w-8" />
  </div>
</template>
