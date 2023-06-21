import request from './request'

// 获取日志
export const getLogApi = (data: GetLog) => request.post('log/all', data)

// 获取模块分布
export const getModuleApi = () => request.get('log/module')

// 获取操作信息按时间分组
export const getTimeApi = () => request.get('log/time')

// 获取操作信息按天分组近七天
export const getDayApi = () => request.get('log/day')

// 按操作类型 统计用户的操作行为
export const getMethodApi = () => request.get('log/method')

// 按操作结果 统计用户的操作行为
export const getCodeApi = () => request.get('log/code')

// 按用户 统计用户的操作行为 用户名 用户角色 用户部门 用户职位
export const getUserApi = (data: GetUser) =>
  request.get('log/user', { params: data })

// 批量删除日志
export const batchDeleteLogApi = (data: number[]) =>
  request.delete('log', { data })

// 彻底删除日志
export const thoroughDeleteLogApi = (data: number[]) =>
  request.delete('log/thorough', { data })

// 批量恢复日志
export const batchRestoreLogApi = (data: number[]) =>
  request.put('log/restore', data)
