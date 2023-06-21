import { defineStore } from 'pinia'
import {
  getStaffApi,
  createStaffApi,
  updateStaffApi,
  batchDeleteStaffApi,
  batchRestoreStaffApi,
  uploadStaffApi,
  thoroughDeleteStaffApi
} from '@/api/staff'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('staffInfos', () => {
  const staffList = ref<Staff[]>()
  const editStaff = ref<Staff>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive<StaffSearchData>({
    isDelete: false,
    departmentId: undefined,
    jobId: undefined,
    sex: undefined,
    workStateId: undefined,
    name: undefined
  })
  // 查询
  const getStaff = async (
    parmas: GetStaff = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete,
      departmentId: searchData.departmentId,
      jobId: searchData.jobId,
      sex: searchData.sex,
      workStateId: searchData.workStateId,
      name: searchData.name
    }
  ) => {
    const { data } = await getStaffApi(parmas)
    if (data.success) {
      staffList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 添加
  const createStaff = async (parmas: CreateStaff) => {
    const { data } = await createStaffApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getStaff()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadStaff = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadStaffApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getStaff()
    } else throw new Error(data.message)
  }
  // 修改
  const updateStaff = async (
    id: number,
    parmas: Partial<CreateStaff>,
    message: string = '修改成功'
  ) => {
    const { data } = await updateStaffApi(id, parmas)
    if (data.success) {
      ElMessage.success(message)
      getStaff()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteStaff = async (ids: number[]) => {
    const { data } = await batchDeleteStaffApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getStaff()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteStaff = async (ids: number[]) => {
    const { data } = await thoroughDeleteStaffApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getStaff()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreStaff = async (ids: number[]) => {
    const { data } = await batchRestoreStaffApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getStaff()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    staffList,
    getStaff,
    editStaff,
    deleteStaff,
    createStaff,
    updateStaff,
    restoreStaff,
    uploadStaff,
    thoroughDeleteStaff
  }
})
