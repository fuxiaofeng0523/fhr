import request from './request'

// 获取部门
export const getDepartmentApi = (data: GetDepartment) =>
  request.post('department/all', data)

// 获取全部部门Option
export const getDepartmentOptionApi = () => request.get('department/all')

// 创建部门
export const createDepartmentApi = (data: CreateDepartment) =>
  request.post('department', data)

// Execl上传部门
export const uploadDepartmentApi = (data: FormData) =>
  request.post('department/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新部门
export const updateDepartmentApi = (
  id: number,
  data: Partial<CreateDepartment>
) => request.patch(`department/${id}`, data)

// 批量删除部门
export const batchDeleteDepartmentApi = (data: number[]) =>
  request.delete('department', { data })

// 彻底删除部门
export const thoroughDeleteDepartmentApi = (data: number[]) =>
  request.delete('department/thorough', { data })

// 批量恢复部门
export const batchRestoreDepartmentApi = (data: number[]) =>
  request.put('department/restore', data)
