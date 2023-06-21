import request from './request'

// 获取管理员
export const getAdminApi = (data: GetAdmin) => request.post('admin/all', data)

// 创建管理员
export const createAdminApi = (data: CreateAdmin) => request.post('admin', data)

// Execl上传管理员
export const uploadAdminApi = (data: FormData) =>
  request.post('admin/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 根据员工Id更新管理员
export const updateAdminByStaffIdApi = (
  id: number,
  data: Partial<CreateAdmin>
) => request.patch(`admin/staff/${id}`, data)

// 更新管理员
export const updateAdminApi = (id: number, data: Partial<CreateAdmin>) =>
  request.patch(`admin/${id}`, data)

// 批量删除管理员
export const batchDeleteAdminApi = (data: number[]) =>
  request.delete('admin', { data })

// 彻底删除管理员
export const thoroughDeleteAdminApi = (data: number[]) =>
  request.delete('admin/thorough', { data })

// 批量恢复管理员
export const batchRestoreAdminApi = (data: number[]) =>
  request.put('admin/restore', data)
