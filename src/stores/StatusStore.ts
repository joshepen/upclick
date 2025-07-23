import type { StatusModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type Ref, computed } from 'vue'

export const useStatusStore = defineStore('statuses', () => {
  const completed_id = 'completed'
  const statuses: Ref<{ [id: string]: StatusModel }> = useLocalStorage('statuses', {
    default_status: {
      title: 'To Do',
      color: 'slate',
      order: 0,
    },
    in_progress: {
      title: 'In Progress',
      color: 'fuchsia',
      order: 40,
    },
    waiting: {
      title: 'Waiting',
      color: 'yellow',
      order: 50,
    },
  })

  statuses.value[completed_id] = {
    title: 'Completed',
    color: 'green',
    order: 100,
  }

  const statusIds = computed<string[]>(() =>
    Object.keys(statuses.value).sort((status1: string, status2: string) => {
      return statuses.value[status1].order - statuses.value[status2].order
    }),
  )

  return { statuses, statusIds, completed_id }
})
