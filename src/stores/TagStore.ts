import type { TagModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'

export const useTagStore = defineStore('tags', () => {
  const tags: Ref<TagModel[]> = useLocalStorage('tags', [])

  return { tags }
})
