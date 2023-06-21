import request from './request'

// 获取日历信息
export const getCalendarApi = (id: number) => request.post(`calendar/all/${id}`)

// 创建日历信息
export const createCalendarApi = (data: CreateCalendar) =>
  request.post('calendar', data)

// 更新日历信息
export const updateCalendarApi = (id: number, data: Partial<CreateCalendar>) =>
  request.patch(`calendar/${id}`, data)

// 彻底删除日历信息
export const thoroughDeleteCalendarApi = (data: number[]) =>
  request.delete('calendar/thorough', { data })
