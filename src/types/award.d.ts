interface Award {
  desc?: string
  id: number
  date: string
  staff: {
    id: number
    name: string
  }
  awardRule: {
    id: number
    name: string
  }
}

interface GetAward extends Pagination {}

interface CreateAward {
  desc?: string
  date: string
  staffId: number
  awardRuleId: number
}
