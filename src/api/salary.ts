import request from './request'

// 获取工资
export const getSalaryApi = (data: GetSalary) =>
  request.post('salary/all', data)

// 根据员工Id获取工资
export const getSalaryByStaffIdApi = (id: number, data: GetSalary) =>
  request.post(`salary/staff/${id}`, data)

// 下载工资表
export const downloadSalaryApi = (year: string, month: string) =>
  request.get(`salary/download/${year}/${month}`, {
    responseType: 'arraybuffer'
  })

// 获取部门平均工资
export const getDepartmentAvgSalaryApi = () => request.get('salary/avg')

// 获取部门全部工资（上月）
export const getDepartmentSumSalaryApi = () => request.get('salary/sum')

// 获取近六个月的总工资
export const getSixMonthSalaryApi = () => request.get('salary/six')

// 获取上月工资详情按部门分组
export const getLastDepartmentSalaryApi = () => request.get('salary/last')

// 获取有工资数据的年份
export const getSalaryYearApi = () => request.get('salary/year')

// 根据年份获取有工资数据的月份
export const getSalaryMonthApi = (year: number) =>
  request.get(`salary/month/${year}`)

// 获取指定年月部门职位的工资详情
export const getEchartsApi = (data: GetEcharts) =>
  request.get('salary/echarts', { params: data })

// 创建工资
export const createSalaryApi = (data: CreateSalary) =>
  request.post('salary', data)

// 创建全部工资
export const createSalaryAllApi = () => request.post('salary/create')

// 更新工资
export const updateSalaryApi = (id: number, data: Partial<CreateSalary>) =>
  request.patch(`salary/${id}`, data)

// 批量删除工资
export const batchDeleteSalaryApi = (data: number[]) =>
  request.delete('salary', { data })

// 彻底删除工资
export const thoroughDeleteSalaryApi = (data: number[]) =>
  request.delete('salary/thorough', { data })

// 批量恢复工资
export const batchRestoreSalaryApi = (data: number[]) =>
  request.put('salary/restore', data)
