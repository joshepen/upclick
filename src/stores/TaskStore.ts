import type { TaskModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed, watch, type Ref } from 'vue'

export const useTaskStore = defineStore('taskstore', () => {
  const tasks: Ref<{ [id: string]: TaskModel }> = useLocalStorage('tasks', {
    default_task: {
      title: 'To Do',
      description: 'To Do Task',
      statusId: 'default_status',
      createdOn: new Date().toISOString(),
      deadline: '',
      tags: ['needs_refinement', 'feature'],
    },
    default_task2: {
      title: 'To Do 2',
      description: 'To Do Task',
      statusId: 'default_status',
      createdOn: new Date().toISOString(),
      deadline: '',
      tags: ['needs_refinement', 'bug'],
    },
  })

  const taskIds = computed<string[]>(() =>
    Object.keys(tasks.value).sort((task1: string, task2: string) => {
      const deadline1 = tasks.value[task1].deadline
      const deadline2 = tasks.value[task2].deadline

      if (deadline1 === '') {
        return 1
      } else if (deadline2 === '') {
        return -1
      } else if (deadline1 < deadline2) {
        return -1
      } else if (deadline2 < deadline1) {
        return 1
      }
      return 0
    }),
  )

  return { tasks, taskIds }
})
