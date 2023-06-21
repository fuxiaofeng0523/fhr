import request from './request'

// 获取角色
export const getRoleApi = (data: GetRole) => request.post('role/all', data)

// 获取全部角色Option
export const getRoleOptionApi = () => request.get('role/all')

// 创建角色
export const createRoleApi = (data: CreateRole) => request.post('role', data)

// 更新角色
export const updateRoleApi = (id: number, data: Partial<CreateRole>) =>
  request.patch(`role/${id}`, data)

// 批量删除角色
export const batchDeleteRoleApi = (data: number[]) =>
  request.delete('role', { data })

// 彻底删除角色
export const thoroughDeleteRoleApi = (data: number[]) =>
  request.delete('role/thorough', { data })

// 批量恢复角色
export const batchRestoreRoleApi = (data: number[]) =>
  request.put('role/restore', data)
