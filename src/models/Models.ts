import type { Ref } from 'vue'

export interface TaskModel {
  title: string
  description: string
  statusId: string
  // localStorage can't store dates
  createdOn: string
  deadline: string
  tagIds: string[]
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
