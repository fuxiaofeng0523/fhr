import { defineStore } from 'pinia'
import {
  getChangeSalaryApi,
  createChangeSalaryApi,
  updateChangeSalaryApi,
  batchDeleteChangeSalaryApi,
  batchRestoreChangeSalaryApi,
  uploadChangeSalaryApi,
  thoroughDeleteChangeSalaryApi
} from '@/api/changeSalary'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('changeSalary', () => {
  const changeSalaryList = ref<ChangeSalary[]>()
  const editChangeSalary = ref<ChangeSalary>()
  const changeSalaryOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getChangeSalary = async (
    parmas: GetChangeSalary = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getChangeSalaryApi(parmas)
    if (data.success) {
      changeSalaryList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createChangeSalary = async (parmas: CreateChangeSalary) => {
    const { data } = await createChangeSalaryApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadChangeSalary = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadChangeSalaryApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }
  // 修改
  const updateChangeSalary = async (
    id: number,
    parmas: Partial<CreateChangeSalary>
  ) => {
    const { data } = await updateChangeSalaryApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteChangeSalary = async (ids: number[]) => {
    const { data } = await batchDeleteChangeSalaryApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteChangeSalary = async (ids: number[]) => {
    const { data } = await thoroughDeleteChangeSalaryApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreChangeSalary = async (ids: number[]) => {
    const { data } = await batchRestoreChangeSalaryApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getChangeSalary()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    changeSalaryList,
    getChangeSalary,
    editChangeSalary,
    deleteChangeSalary,
    createChangeSalary,
    updateChangeSalary,
    restoreChangeSalary,
    uploadChangeSalary,
    thoroughDeleteChangeSalary,
    changeSalaryOption
  }
})
