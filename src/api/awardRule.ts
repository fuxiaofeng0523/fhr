import request from './request'

// 获取奖励规则
export const getAwardRuleApi = (data: GetAwardRule) =>
  request.post('award-rule/all', data)

// 获取全部奖励规则Option
export const getAwardRuleOptionApi = () => request.get('award-rule/all')

// 创建奖惩规则
export const createAwardRuleApi = (data: CreateAwardRule) =>
  request.post('award-rule', data)

// Execl上传奖惩规则
export const uploadAwardRuleApi = (data: FormData) =>
  request.post('award-rule/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新奖惩规则
export const updateAwardRuleApi = (
  id: number,
  data: Partial<CreateAwardRule>
) => request.patch(`award-rule/${id}`, data)

// 批量删除奖惩规则
export const batchDeleteAwardRuleApi = (data: number[]) =>
  request.delete('award-rule', { data })

// 彻底删除奖惩规则
export const thoroughDeleteAwardRuleApi = (data: number[]) =>
  request.delete('award-rule/thorough', { data })

// 批量恢复奖惩规则
export const batchRestoreAwardRuleApi = (data: number[]) =>
  request.put('award-rule/restore', data)
