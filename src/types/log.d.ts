interface Log {
  id: number
  url: string
  method: string
  ip: string
  code: string
  date: string
}

interface GetLog extends Pagination {}

interface Module {
  module: string
  count: number
}

interface Time {
  time: string
  count: number
}

interface Method {
  method: string
  count: string
}

interface Code {
  code: string
  count: number
}

interface GetUser {
  departmentId?: number
  jobId?: number
  staffId?: number
  roleId?: number
}
