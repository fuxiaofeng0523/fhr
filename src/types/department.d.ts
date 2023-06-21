interface Department {
  desc?: string
  id: number
  name: string
}

interface GetDepartment extends Pagination {}

interface CreateDepartment {
  desc?: string
  name: string
}
