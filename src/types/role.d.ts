interface Role {
  desc?: string
  id: number
  name: string
}

interface GetRole extends Pagination {}

interface CreateRole {
  desc?: string
  name: string
}
