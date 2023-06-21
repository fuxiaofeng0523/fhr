import { defineStore } from 'pinia'
import {
  getDepartmentApi,
  createDepartmentApi,
  updateDepartmentApi,
  batchDeleteDepartmentApi,
  batchRestoreDepartmentApi,
  uploadDepartmentApi,
  thoroughDeleteDepartmentApi,
  getDepartmentOptionApi
} from '@/api/department'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('department', () => {
  const departmentList = ref<Department[]>()
  const editDepartment = ref<Department>()
  const departmentOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getDepartment = async (
    parmas: GetDepartment = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getDepartmentApi(parmas)
    if (data.success) {
      departmentList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询全部Option
  const getDepartmentOption = async () => {
    const { data } = await getDepartmentOptionApi()
    if (data.success) {
      departmentOption.value = data.data
    } else throw new Error(data.message)
  }
  // 添加
  const createDepartment = async (parmas: CreateDepartment) => {
    const { data } = await createDepartmentApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getDepartment()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadDepartment = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadDepartmentApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getDepartment()
    } else throw new Error(data.message)
  }
  // 修改
  const updateDepartment = async (
    id: number,
    parmas: Partial<CreateDepartment>
  ) => {
    const { data } = await updateDepartmentApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getDepartment()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteDepartment = async (ids: number[]) => {
    const { data } = await batchDeleteDepartmentApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getDepartment()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteDepartment = async (ids: number[]) => {
    const { data } = await thoroughDeleteDepartmentApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getDepartment()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreDepartment = async (ids: number[]) => {
    const { data } = await batchRestoreDepartmentApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getDepartment()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    departmentList,
    getDepartment,
    editDepartment,
    deleteDepartment,
    createDepartment,
    updateDepartment,
    restoreDepartment,
    uploadDepartment,
    thoroughDeleteDepartment,
    getDepartmentOption,
    departmentOption
  }
})
