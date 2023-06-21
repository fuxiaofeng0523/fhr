import request from './request'

// 获取奖惩
export const getAwardApi = (data: GetAward) => request.post('award/all', data)

// 根据员工Id获取奖惩
export const getAwardByStaffIdApi = (id: number, data: GetAward) =>
  request.post(`award/staff/${id}`, data)

// 创建奖惩
export const createAwardApi = (data: CreateAward) => request.post('award', data)

// Execl上传奖惩
export const uploadAwardApi = (data: FormData) =>
  request.post('award/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新奖惩
export const updateAwardApi = (id: number, data: Partial<CreateAward>) =>
  request.patch(`award/${id}`, data)

// 批量删除奖惩
export const batchDeleteAwardApi = (data: number[]) =>
  request.delete('award', { data })

// 彻底删除奖惩
export const thoroughDeleteAwardApi = (data: number[]) =>
  request.delete('award/thorough', { data })

// 批量恢复奖惩
export const batchRestoreAwardApi = (data: number[]) =>
  request.put('award/restore', data)
