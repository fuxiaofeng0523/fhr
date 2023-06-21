interface Auth {
  id: number
  menuId: string
}

interface GetAuth extends Pagination {}

interface CreateAuth {
  roleId: number
  menuId: string
}
