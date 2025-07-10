import type { TaskModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { useStatusStore } from './StatusStore'

export const useTaskStore = defineStore('taskstore', () => {
  const { defaultStatus } = storeToRefs(useStatusStore())
  const tasks: Ref<TaskModel[]> = useLocalStorage('tasks', [
    {
      title: 'Example Task',
      description: 'Example Description',
      status: defaultStatus,
      createdOn: new Date(),
      deadline: null,
      tags: [],
    } as TaskModel,
  ])
  return { tasks }
})
