import request from './request'

// 根据员工Id获取合同
export const getContractByStaffIdApi = (id: number) =>
  request.get(`contract/staff/${id}`)

// 创建合同
export const createContractApi = (data: CreateContract) =>
  request.post('contract', data)

// 更新合同
export const updateContractApi = (id: number, data: Partial<CreateContract>) =>
  request.patch(`contract/${id}`, data)
