import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getDepartmentAvgSalaryApi,
  getDepartmentSumSalaryApi,
  getSixMonthSalaryApi,
  getLastDepartmentSalaryApi,
  getSalaryYearApi,
  getSalaryMonthApi,
  getEchartsApi
} from '@/api/salary'

export default defineStore('salaryStatistics', () => {
  const departmentAvgSalary = ref<DepartmentSalary[]>()
  const departmentSumSalary = ref<DepartmentSalary[]>()
  const sixMonthSalary = ref<MonthSalary[]>()
  const lastDepartmentSalary = ref<LastSalary[]>()
  const yearOption = ref<Option[]>()
  const monthOption = ref<Option[]>()
  const echartsSalary = ref<EchartsSalary[]>()
  const search = ref({
    year: '' + new Date().getFullYear(),
    month: undefined,
    departmentId: undefined,
    jobId: undefined
  })

  // 获取部门平均工资
  const getDepartmentAvgSalary = async () => {
    const { data } = await getDepartmentAvgSalaryApi()
    if (data.success) {
      departmentAvgSalary.value = data.data
    } else throw new Error(data.message)
  }
  // 获取部门全部工资（上月）
  const getDepartmentSumSalary = async () => {
    const { data } = await getDepartmentSumSalaryApi()
    if (data.success) {
      departmentSumSalary.value = data.data
    } else throw new Error(data.message)
  }
  // 获取近六个月的总工资
  const getSixMonthSalary = async () => {
    const { data } = await getSixMonthSalaryApi()
    if (data.success) {
      sixMonthSalary.value = data.data
    } else throw new Error(data.message)
  }
  // 获取上月工资详情按部门分组
  const getLastDepartmentSalary = async () => {
    const { data } = await getLastDepartmentSalaryApi()
    if (data.success) {
      lastDepartmentSalary.value = data.data
    } else throw new Error(data.message)
  }
  // 获取有工资数据的年份
  const getSalaryYear = async () => {
    const { data } = await getSalaryYearApi()
    if (data.success) {
      yearOption.value = data.data.map((item: any) => ({
        label: item.year,
        value: item.year
      }))
    } else throw new Error(data.message)
  }
  // 根据年份获取有工资数据的月份
  const getSalaryMonth = async (year: number) => {
    const { data } = await getSalaryMonthApi(year)
    if (data.success) {
      monthOption.value = data.data.map((item: any) => ({
        label: item.month,
        value: item.month
      }))
    } else throw new Error(data.message)
  }
  // 获取指定年月部门职位的工资详情
  const getEcharts = async () => {
    const { data } = await getEchartsApi({
      year: search.value.year,
      month: search.value.month,
      departmentId: search.value.departmentId,
      jobId: search.value.jobId
    })
    if (data.success) {
      echartsSalary.value = data.data
    } else throw new Error(data.message)
  }

  return {
    departmentAvgSalary,
    getDepartmentAvgSalary,
    departmentSumSalary,
    getDepartmentSumSalary,
    sixMonthSalary,
    getSixMonthSalary,
    lastDepartmentSalary,
    getLastDepartmentSalary,
    search,
    yearOption,
    getSalaryYear,
    monthOption,
    getSalaryMonth,
    echartsSalary,
    getEcharts
  }
})
