import type { StatusModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useStatusStore = defineStore('statuses', () => {
  // This needs to be sorted by order so I won't make statuses directly accessible
  const statuses: Ref<Ref<StatusModel>[]> = useLocalStorage('statuses', [])
  const defaultStatus: Ref<StatusModel> = useLocalStorage('default_status', {
    title: 'To Do',
    color: 'slate-600',
    order: 0,
  })

  // TODO Add getNext function

  return { statuses, defaultStatus }
})
