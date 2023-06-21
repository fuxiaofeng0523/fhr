interface AwardRule {
  desc?: string
  id: number
  name: string
  score: number
  type: number
}

interface GetAwardRule extends Pagination {
  type?: AwardRuleType
}

interface CreateAwardRule {
  desc?: string
  name: string
  score: number
  type: number
}
