import request from './request'

// 获取权限
export const getAuthApi = (data: GetAuth) => request.post('auth/all', data)

// 获取权限菜单树
export const getAuthMenuTreeApi = () => request.get('auth/menu/tree')

// 获取单个权限
export const getAuthOneApi = (id: number) => request.get(`auth/${id}`)

// 创建权限
export const createAuthApi = (data: CreateAuth) => request.post('auth', data)

// 更新权限
export const updateAuthApi = (id: number, data: Partial<CreateAuth>) =>
  request.patch(`auth/${id}`, data)

// 批量删除权限
export const batchDeleteAuthApi = (data: number[]) =>
  request.delete('auth', { data })

// 彻底删除权限
export const thoroughDeleteAuthApi = (data: number[]) =>
  request.delete('auth/thorough', { data })

// 批量恢复权限
export const batchRestoreAuthApi = (data: number[]) =>
  request.put('auth/restore', data)
