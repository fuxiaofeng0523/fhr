interface Notice {
  id: number
  title: string
  content: string
  date: string
  admin: string
  status: string
}

interface GetNotice extends Pagination {
  status?: string
}

interface CreateNotice {
  title: string
  content: string
  sign?: string
  adminId: number
  status?: string
}
