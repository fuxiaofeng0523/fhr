import request from './request'

// 获取调薪
export const getChangeSalaryApi = (data: GetChangeSalary) =>
  request.post('changeSalary/all', data)

// 根据员工Id获取调薪
export const getChangeSalaryByStaffIdApi = (
  id: number,
  data: GetChangeSalary
) => request.post(`changeSalary/staff/${id}`, data)

// 创建调薪
export const createChangeSalaryApi = (data: CreateChangeSalary) =>
  request.post('changeSalary', data)

// Execl上传调薪
export const uploadChangeSalaryApi = (data: FormData) =>
  request.post('changeSalary/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新调薪
export const updateChangeSalaryApi = (
  id: number,
  data: Partial<CreateChangeSalary>
) => request.patch(`changeSalary/${id}`, data)

// 批量删除调薪
export const batchDeleteChangeSalaryApi = (data: number[]) =>
  request.delete('changeSalary', { data })

// 彻底删除调薪
export const thoroughDeleteChangeSalaryApi = (data: number[]) =>
  request.delete('changeSalary/thorough', { data })

// 批量恢复调薪
export const batchRestoreChangeSalaryApi = (data: number[]) =>
  request.put('changeSalary/restore', data)
