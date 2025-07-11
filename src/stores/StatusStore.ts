import type { StatusModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useStatusStore = defineStore('statuses', () => {
  // This needs to be sorted by order so I won't make statuses directly accessible
  const statuses: Ref<{ [id: string]: StatusModel }> = useLocalStorage('statuses', {
    default_status: {
      title: 'To Do',
      color: 'slate',
      order: 0,
    },
    completed: {
      title: 'Completed',
      color: 'green',
      order: 100,
    },
  })
  // TODO Add getNext function

  return { statuses }
})
