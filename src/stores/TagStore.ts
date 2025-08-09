import type { TagModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useTagStore = defineStore('tags', () => {
  const tags: Ref<{ [id: string]: TagModel }> = useLocalStorage('tags', {
    feature: {
      title: 'feature',
      color: 'green',
    },
    bug: {
      title: 'bug',
      color: 'red',
    },
    needs_refinement: {
      title: 'needs refinement',
      color: 'yellow',
    },
  })

  const tagIds = computed<string[]>(() => Object.keys(tags.value))

  function getNextId(): string {
    let id = 0

    while (tagIds.value.includes(id.toString())) {
      id++
    }
    return id.toString()
  }

  return { tags, tagIds, getNextId }
})
