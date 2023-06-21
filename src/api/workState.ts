import request from './request'

// 获取工作状态
export const getWorkStateApi = (data: GetWorkState) =>
  request.post('work-state/all', data)

// 获取全部工作状态Option
export const getWorkStateOptionApi = () => request.get('work-state/all')

// 创建工作状态
export const createWorkStateApi = (data: CreateWorkState) =>
  request.post('work-state', data)

// Execl上传工作状态
export const uploadWorkStateApi = (data: FormData) =>
  request.post('work-state/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新工作状态
export const updateWorkStateApi = (
  id: number,
  data: Partial<CreateWorkState>
) => request.patch(`work-state/${id}`, data)

// 批量删除工作状态
export const batchDeleteWorkStateApi = (data: number[]) =>
  request.delete('work-state', { data })

// 彻底删除工作状态
export const thoroughDeleteWorkStateApi = (data: number[]) =>
  request.delete('work-state/thorough', { data })

// 批量恢复工作状态
export const batchRestoreWorkStateApi = (data: number[]) =>
  request.put('work-state/restore', data)
