import request from './request'

// 获取职位
export const getJobApi = (data: GetJob) => request.post('job/all', data)

// 获取全部职位Option
export const geJobOptionApi = (id: number) => request.get(`job/all/${id}`)

// 获取职位工资
export const getJobSalaryApi = (id: number) => request.get(`job/salary/${id}`)

// 创建职位
export const createJobApi = (data: CreateJob) => request.post('job', data)

// Execl上传职位
export const uploadJobApi = (data: FormData) =>
  request.post('job/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 更新职位
export const updateJobApi = (id: number, data: Partial<CreateJob>) =>
  request.patch(`job/${id}`, data)

// 批量删除职位
export const batchDeleteJobApi = (data: number[]) =>
  request.delete('job', { data })

// 彻底删除职位
export const thoroughDeleteJobApi = (data: number[]) =>
  request.delete('job/thorough', { data })

// 批量恢复职位
export const batchRestoreJobApi = (data: number[]) =>
  request.put('job/restore', data)
