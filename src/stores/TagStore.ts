import type { TagModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useTagStore = defineStore('tags', () => {
  const tags: Ref<Ref<TagModel>[]> = useLocalStorage('tags', [
    ref({ title: 'feature', color: 'red-400' }),
  ])

  return { tags }
})
