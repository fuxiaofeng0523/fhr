interface Apply {
  detail: string
  opinion?: string
  id: number
  staff: {
    id: number
    name: string
  }
  workState: {
    id: number
    name: string
  }
  admin?: {
    id: number
    name: string
  }
  reason: string
  state: number
  applyDate: string
  verifyDate?: string
  content: string
  reapply: boolean
}

interface GetApply extends Pagination {
  state?: string
}

interface CreateApply {
  staffId: number
  workStateId: number
  reason: string
  detail: string
  content: string
}

interface UpdateApply extends CreateApply {
  state: number
  adminId: number
  opinion: string
  reapply: boolean
}
