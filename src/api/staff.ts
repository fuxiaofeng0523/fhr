import request from './request'

// 获取员工
export const getStaffApi = (data: GetStaff) => request.post('staff/all', data)

// 根据ID获取员工
export const getStaffByIdApi = (id: number) => request.get(`staff/${id}`)

// 创建员工
export const createStaffApi = (data: CreateStaff) => request.post('staff', data)

// 获取全部员工Option
export const getStaffOptionApi = (id: number, type?: boolean) =>
  request.get(`staff/all/${id}`, { params: { type } })

// Execl上传员工
export const uploadStaffApi = (data: FormData) =>
  request.post('staff/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新员工
export const updateStaffApi = (id: number, data: Partial<CreateStaff>) =>
  request.patch(`staff/${id}`, data)

// 批量删除员工
export const batchDeleteStaffApi = (data: number[]) =>
  request.delete('staff', { data })

// 彻底删除员工
export const thoroughDeleteStaffApi = (data: number[]) =>
  request.delete('staff/thorough', { data })

// 批量恢复员工
export const batchRestoreStaffApi = (data: number[]) =>
  request.put('staff/restore', data)
