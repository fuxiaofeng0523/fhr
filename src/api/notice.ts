import request from './request'

// 获取公告
export const getNoticeApi = (data: GetNotice) =>
  request.post('notice/all', data)

// 创建公告
export const createNoticeApi = (data: CreateNotice) =>
  request.post('notice', data)

// 更新公告
export const updateNoticeApi = (id: number, data: Partial<CreateNotice>) =>
  request.patch(`notice/${id}`, data)

// 批量删除公告
export const batchDeleteNoticeApi = (data: number[]) =>
  request.delete('notice', { data })

// 彻底删除公告
export const thoroughDeleteNoticeApi = (data: number[]) =>
  request.delete('notice/thorough', { data })

// 批量恢复公告
export const batchRestoreNoticeApi = (data: number[]) =>
  request.put('notice/restore', data)
