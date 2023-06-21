interface Account {
  allSalary: number
  basisSalary: number
  id: number
  lunchSalary: number
  name: string
  trafficSalary: number
}

interface GetAccount extends Pagination {}

interface CreateAccount {
  allSalary?: number
  basisSalary: number
  lunchSalary: number
  name: string
  trafficSalary: number
}
