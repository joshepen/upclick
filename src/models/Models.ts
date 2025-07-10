import type { Ref } from 'vue'

export interface TaskModel {
  title: string
  description: string
  status: Ref<StatusModel>
  createdOn: Date
  deadline: Date | null
  tags: Ref<TagModel>[]
}

export interface TagModel {
  title: string
  color: string
}

export interface StatusModel {
  title: string
  color: string
  order: number
}
