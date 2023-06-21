interface Calendar {
  id: number
  type: number
  title: string
  startTime: string
  endTime?: string
  remindTime?: string
  address?: string
  remark?: string
}

interface GetCalendar {
  staffId: number
}

interface CreateCalendar {
  type: number
  title: string
  startTime: string
  endTime?: string
  remindTime?: string
  address?: string
  remark?: string
  staffId: number
}
