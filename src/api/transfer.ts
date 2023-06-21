import request from './request'

// 获取调动
export const getTransferApi = (data: GetTransfer) =>
  request.post('transfer/all', data)

// 根据员工Id获取调动
export const getTransferByStaffIdApi = (id: number, data: GetTransfer) =>
  request.post(`transfer/staff/${id}`, data)

// 创建调动
export const createTransferApi = (data: CreateTransfer) =>
  request.post('transfer', data)

// Execl上传调动
export const uploadTransferApi = (data: FormData) =>
  request.post('transfer/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新调动
export const updateTransferApi = (id: number, data: Partial<CreateTransfer>) =>
  request.patch(`transfer/${id}`, data)

// 批量删除调动
export const batchDeleteTransferApi = (data: number[]) =>
  request.delete('transfer', { data })

// 彻底删除调动
export const thoroughDeleteTransferApi = (data: number[]) =>
  request.delete('transfer/thorough', { data })

// 批量恢复调动
export const batchRestoreTransferApi = (data: number[]) =>
  request.put('transfer/restore', data)
