import type { TaskModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed, type Ref } from 'vue'

export const useTaskStore = defineStore('taskstore', () => {
  const tasks: Ref<{ [id: string]: TaskModel }> = useLocalStorage('tasks', {
    default_task: {
      title: 'To Do',
      description: 'To Do Task',
      statusId: 'default_status',
      createdOn: new Date(),
      deadline: null,
      tags: ['needs_refinement', 'feature'],
    },
    default_task2: {
      title: 'To Do 2',
      description: 'To Do Task',
      statusId: 'default_status',
      createdOn: new Date(),
      deadline: null,
      tags: ['needs_refinement', 'bug'],
    },
  })

  const taskIds = computed<string[]>(() => Object.keys(tasks.value))

  return { tasks, taskIds }
})
