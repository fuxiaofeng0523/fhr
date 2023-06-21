interface Staff {
  address: string
  avatar: string
  basisSalary: number
  beginDate: string
  birthday: string
  contractDate: number
  educationLevel: number
  email: string
  endDate: string
  engageForm: number
  formDate: string
  id: number
  idCard: string
  inDate: string
  leaveDate: string
  name: string
  nation: number
  nativePlace: string
  phone: string
  politicalAffiliation: number
  school: string
  sex: number
  specialty: string
  wedlock: number
  workAge: number
  workNumber: string
  department: string
  job: string
  workState: string
  role: {
    id: number
    name: string
    flag?: boolean
  }
}
interface GetStaff extends Pagination {
  departmentId?: string
  jobId?: string
  sex?: string
  name?: string
  workStateId?: string
}

interface StaffSearchData {
  isDelete: boolean
  departmentId?: string
  jobId?: string
  sex?: string
  name?: string
  workStateId?: string
}

interface CreateStaff {
  address?: string
  avatar?: string
  basisSalary?: number
  beginDate: string
  birthday?: string
  contractDate: number
  educationLevel?: number
  email?: string
  endDate?: string
  engageForm: number
  formDate?: string
  idCard: string
  inDate?: string
  leaveDate?: string
  name: string
  nation?: number
  nativePlace?: string
  phone: string
  politicalAffiliation?: number
  school?: string
  sex?: number
  specialty?: string
  wedlock?: number
  workAge?: number
  workNumber: string
  departmentId: number
  jobId: number
  workStateId?: number
  password?: string
}
