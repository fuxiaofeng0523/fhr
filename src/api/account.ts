import request from './request'

// 获取账套
export const getAccountApi = (data: GetAccount) =>
  request.post('account/all', data)

// 获取全部账套Option
export const getAccountOptionApi = () => request.get('account/all')

// 创建账套
export const createAccountApi = (data: CreateAccount) =>
  request.post('account', data)

// Execl上传账套
export const uploadAccountApi = (data: FormData) =>
  request.post('account/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新账套
export const updateAccountApi = (id: number, data: Partial<CreateAccount>) =>
  request.patch(`account/${id}`, data)

// 批量删除账套
export const batchDeleteAccountApi = (data: number[]) =>
  request.delete('account', { data })

// 彻底删除账套
export const thoroughDeleteAccountApi = (data: number[]) =>
  request.delete('account/thorough', { data })

// 批量恢复账套
export const batchRestoreAccountApi = (data: number[]) =>
  request.put('account/restore', data)
