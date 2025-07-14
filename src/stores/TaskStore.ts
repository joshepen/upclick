import type { TaskModel } from '@/models/Models'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { useStatusStore } from './StatusStore'

export const useTaskStore = defineStore('taskstore', () => {
  const tasks: Ref<TaskModel[]> = useLocalStorage('tasks', [
    {
      title: 'Example Task',
      description: 'Example Description',
      statusId: 'default_status',
      createdOn: new Date(),
      deadline: null,
      tags: ['feature', 'needs_refinement'],
    } as TaskModel,
  ])
  return { tasks }
})
