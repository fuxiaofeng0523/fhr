interface Transfer {
  id: number
  reason: string
  date: string
  remake?: string
  staff: {
    id: number
    name: string
  }
  beforeDepartment: {
    id: number
    name: string
  }
  afterDepartment: {
    id: number
    name: string
  }
  beforeJob: {
    id: number
    name: string
  }
  afterJob: {
    id: number
    name: string
  }
}

interface GetTransfer extends Pagination {}

interface CreateTransfer {
  staffId: number
  beforeDepartmentId: number
  afterDepartmentId: number
  beforeJobId: number
  afterJobId: number
  reason: string
  remark?: string
}
