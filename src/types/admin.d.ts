interface Admin {
  id: number
  name: string
  staff: {
    id: number
    phone: string
    name: string
  }
  role: {
    id: number
    name: string
  }
}

interface GetAdmin extends Pagination {}

interface CreateAdmin {
  name: string
  staffId: number
  roleId: number
}
