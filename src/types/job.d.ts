interface Job {
  desc?: string
  id: number
  name: string
  departmentId: number
  accountId: number
}

interface GetJob extends Pagination {
  departmentId?: number
}

interface CreateJob {
  desc?: string
  name: string
  departmentId: number
  accountId: number
}
