import type { StatusModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useStatusStore = defineStore('statuses', () => {
  // This needs to be sorted by order so I won't make statuses directly accessible
  const statuses: Ref<StatusModel[]> = useLocalStorage('statuses', [])
  const startStatus = ref<StatusModel>({ title: 'To Do', color: 'slate-600', order: 0 })
  const endStatus = ref<StatusModel>({ title: 'Completed', color: 'green-600', order: 100 })

  function add(status: StatusModel) {
    if (startStatus.value.order <= status.order && status.order >= endStatus.value.order) {
      throw new RangeError(
        `Order must be between ${startStatus.value.order} and ${endStatus.value.order}.`,
      )
    }

    let i = 0
    while (i < statuses.value.length && i < 100) {
      if (statuses.value[i].order === status.order) {
        throw new RangeError(`Order ${status.order} already exists.`)
      } else if (statuses.value[i].order < status.order) {
        statuses.value.splice(i + 1, 0, status)
        i = statuses.value.length
      }
      i++
    }
  }

  function getNext(status: StatusModel): StatusModel | undefined {
    if (status === startStatus.value) {
      if (statuses.value.length > 0) {
        return statuses.value[0]
      } else {
        return endStatus.value
      }
    }

    if (status === endStatus.value) {
      return endStatus.value
    }

    const currentIndex = statuses.value.indexOf(status)
    if (currentIndex >= 0 && currentIndex < statuses.value.length - 1) {
      return statuses.value[statuses.value.indexOf(status) + 1]
    } else {
      // Even if status does not exist, return the next status
      return statuses.value.filter((currStatus: StatusModel) => currStatus.order > status.order)[0]
    }
  }

  function remove(status: StatusModel) {
    const currentIndex = statuses.value.indexOf(status)
    if (currentIndex >= 0) {
      statuses.value.splice(currentIndex, 1)
    }
  }

  return { add, getNext, remove, startStatus, statuses, endStatus }
})
