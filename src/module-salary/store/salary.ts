import { defineStore } from 'pinia'
import {
  getSalaryApi,
  createSalaryApi,
  updateSalaryApi,
  batchDeleteSalaryApi,
  batchRestoreSalaryApi,
  createSalaryAllApi,
  thoroughDeleteSalaryApi,
  downloadSalaryApi
} from '@/api/salary'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('salary', () => {
  const salaryList = ref<Salary[]>()
  const editSalary = ref<Salary>()
  const salaryOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  const downloadData = reactive({
    year: '',
    month: ''
  })
  // 查询
  const getSalary = async (
    parmas: GetSalary = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getSalaryApi(parmas)
    if (data.success) {
      salaryList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createSalary = async (parmas: CreateSalary) => {
    const { data } = await createSalaryApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getSalary()
    } else throw new Error(data.message)
  }

  // 添加全部
  const createSalaryAll = async () => {
    const { data } = await createSalaryAllApi()
    if (data.success) {
      ElMessage.success('生成成功')
      getSalary()
    } else {
      ElMessage.warning(data.message)
      throw new Error(data.message)
    }
  }

  // 修改
  const updateSalary = async (id: number, parmas: Partial<CreateSalary>) => {
    const { data } = await updateSalaryApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getSalary()
    } else throw new Error(data.message)
  }

  // 下载
  const downloadSalary = async (year: string, month: string) => {
    const { data } = await downloadSalaryApi(year, month)
    if (data) {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      // 创建一个文件下载链接
      const downloadLink = document.createElement('a')
      downloadLink.href = window.URL.createObjectURL(blob)
      downloadLink.download = `${year + '年' + month + '月'}.xlsx` // 下载文件名
      downloadLink.click() // 触发下载
    }
  }

  // 批量删除
  const deleteSalary = async (ids: number[]) => {
    const { data } = await batchDeleteSalaryApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getSalary()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteSalary = async (ids: number[]) => {
    const { data } = await thoroughDeleteSalaryApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getSalary()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreSalary = async (ids: number[]) => {
    const { data } = await batchRestoreSalaryApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getSalary()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    salaryList,
    getSalary,
    editSalary,
    deleteSalary,
    createSalary,
    updateSalary,
    restoreSalary,
    thoroughDeleteSalary,
    salaryOption,
    createSalaryAll,
    downloadSalary,
    downloadData
  }
})
