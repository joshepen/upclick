import type { TaskModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { useStatusStore } from './StatusStore'

export const useTaskStore = defineStore('taskstore', () => {
  const statusStore = useStatusStore()
  const tasks: Ref<TaskModel[]> = useLocalStorage('tasks', [
    {
      title: 'Example Task',
      description: 'Example Description',
      status: statusStore.startStatus,
      createdOn: new Date(),
      deadline: null,
      tags: [],
    },
  ])
  return { tasks }
})
