export interface TaskModel {
  title: string
  description: string
  status: StatusModel
  createdOn: Date
  deadline: Date | null
  tags: TagModel[]
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
