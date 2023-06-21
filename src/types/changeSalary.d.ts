interface ChangeSalary {
  id: number
  staff: {
    id: number
    name: string
  }
  beforeSalary: number
  afterSalary: number
  reason: string
  date: string
  remake?: string
}

interface GetChangeSalary extends Pagination {}

interface CreateChangeSalary {
  staffId: number
  beforeSalary: number
  afterSalary: number
  reason: string
  remark?: string
}
