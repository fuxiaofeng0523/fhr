interface WorkState {
  desc?: string
  id: number
  name: string
}

interface GetWorkState extends Pagination {}

interface CreateWorkState {
  desc?: string
  name: string
}
