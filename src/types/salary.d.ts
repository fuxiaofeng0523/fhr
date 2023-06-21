interface Salary {
  id: number
  staff: {
    id: number
    name: string
  }
  lunchSalary: number
  trafficSalary: number
  basicSalary: number
  awardSalary: number
  fineSalary: number
  totalSalary: number
  remark?: string
}

interface GetSalary extends Pagination {}

interface CreateSalary {
  staffId: number
  remark?: string
}

interface DepartmentSalary {
  department: string
  value: string
}

interface MonthSalary {
  month: string
  value: string
}

interface LastSalary {
  department: string
  basis_salary: string
  lunch_salary: string
  traffic_salary: string
  award_salary: string
  fine_salary: string
}

interface GetEcharts {
  year?: string
  month?: string
  departmentId?: number
  jobId?: number
}

interface EchartsSalary {
  month?: string
  year?: string
  department?: string
  job?: string
  value: string
}
