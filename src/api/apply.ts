import request from './request'

// 获取申请
export const getApplyApi = (data: GetApply) => request.post('apply/all', data)

// 根据员工Id获取申请
export const getApplyByStaffIdApi = (id: number, data: GetApply) =>
  request.post(`apply/staff/${id}`, data)

// 获取全部申请Option
export const getApplyOptionApi = () => request.get('apply/all')

// 创建申请
export const createApplyApi = (data: CreateApply) => request.post('apply', data)

// Execl上传申请
export const uploadApplyApi = (data: FormData) =>
  request.post('apply/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新申请
export const updateApplyApi = (id: number, data: Partial<CreateApply>) =>
  request.patch(`apply/${id}`, data)

// 批量删除申请
export const batchDeleteApplyApi = (data: number[]) =>
  request.delete('apply', { data })

// 彻底删除申请
export const thoroughDeleteApplyApi = (data: number[]) =>
  request.delete('apply/thorough', { data })

// 批量恢复申请
export const batchRestoreApplyApi = (data: number[]) =>
  request.put('apply/restore', data)
