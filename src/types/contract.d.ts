interface Contract {
  id: number
  jobDescription: string
  agreed: boolean
  effectiveDate: Date
  sign: string
  staff: {
    id: number
    name: string
    basisSalary: number
  }
  job: {
    id: number
    name: string
  }
  department: {
    id: number
    name: string
  }
}

interface GetContract extends Pagination {}

interface CreateContract {
  staffId: string
  jobDescription: string
  agreed?: boolean
  effectiveDate: Date
  sign: string
}
