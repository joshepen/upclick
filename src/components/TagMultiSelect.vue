<script setup lang="ts">
import { Chip } from 'primevue'
import { useTagStore } from '@/stores/TagStore'
import { MultiSelect } from 'primevue'
import type { PropType } from 'vue'
const selectedTagIds = defineModel({ type: Object as PropType<string[]>, required: true })
const { tags, tagIds } = useTagStore()
</script>

<template>
  <MultiSelect v-model="selectedTagIds" :options="tagIds" display="chip" fluid>
    <template #option="slotProps">
      {{ tags[slotProps.option].title }}
    </template>
    <template #chip="slotProps">
      <Chip
        :label="tags[slotProps.value].title"
        pt:label:class="!text-black"
        :pt:root:class="['!bg-' + tags[slotProps.value].color + '-300']"
      />
    </template>
  </MultiSelect>
</template>
