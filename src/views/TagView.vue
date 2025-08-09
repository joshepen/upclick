<script setup lang="ts">
import TagEditModal from '@/modals/TagEditModal.vue'
import { useTagStore } from '@/stores/TagStore'
import { useDialog, Button } from 'primevue'

const dialog = useDialog()
const tagStore = useTagStore()

function onEditClicked(id: string) {
  dialog.open(TagEditModal, {
    props: { modal: true },
    data: { id },
  })
}

function onAddClicked() {
  dialog.open(TagEditModal, {
    props: { modal: true },
  })
}

function onDeleteClicked(id: string) {
  delete tagStore.tags[id]
}
</script>

<template>
  <div class="grid grid-cols-5 pb-1 gap-1">
    <div class="col-start-1 col-span-2 cell-header text-nowrap">Title</div>
    <div class="col-start-3 col-span-2 cell-header overflow-hidden">Color</div>
    <div class="col-start-5 col-span-1 cell-header !p-2 flex">
      <Button label="Add" @click="onAddClicked" class="grow" pt:root:class="!bg-slate-700" />
    </div>
  </div>
  <div v-for="id in tagStore.tagIds" class="grid grid-cols-5 gap-1 pb-1">
    <div class="col-start-1 col-span-2 cell text-nowrap text-lg">
      {{ tagStore.tags[id].title }}
    </div>
    <div class="col-start-3 col-span-2 cell text-nowrap text-lg">
      <span
        :class="['py-1 px-2 rounded-sm !bg-' + tagStore.tags[id].color + '-300 !text-slate-800']"
      >
        {{ tagStore.tags[id].color }}
      </span>
    </div>
    <div class="col-start-5 col-span-1 cell text-nowrap text-lg">
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
