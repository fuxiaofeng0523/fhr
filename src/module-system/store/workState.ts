import { defineStore } from 'pinia'
import {
  getWorkStateApi,
  createWorkStateApi,
  updateWorkStateApi,
  batchDeleteWorkStateApi,
  batchRestoreWorkStateApi,
  uploadWorkStateApi,
  thoroughDeleteWorkStateApi,
  getWorkStateOptionApi
} from '@/api/workState'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('workState', () => {
  const workStateList = ref<WorkState[]>()
  const editWorkState = ref<WorkState>()
  const workStateOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getWorkState = async (
    parmas: GetWorkState = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getWorkStateApi(parmas)
    if (data.success) {
      workStateList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 查询全部Option
  const getWorkStateOption = async () => {
    if (!workStateOption.value) {
      const { data } = await getWorkStateOptionApi()
      if (data.success) {
        workStateOption.value = data.data
      } else throw new Error(data.message)
    }
    return workStateOption.value
  }
  // 添加
  const createWorkState = async (parmas: CreateWorkState) => {
    const { data } = await createWorkStateApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getWorkState()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadWorkState = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadWorkStateApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getWorkState()
    } else throw new Error(data.message)
  }
  // 修改
  const updateWorkState = async (
    id: number,
    parmas: Partial<CreateWorkState>
  ) => {
    const { data } = await updateWorkStateApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getWorkState()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteWorkState = async (ids: number[]) => {
    const { data } = await batchDeleteWorkStateApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getWorkState()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteWorkState = async (ids: number[]) => {
    const { data } = await thoroughDeleteWorkStateApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getWorkState()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreWorkState = async (ids: number[]) => {
    const { data } = await batchRestoreWorkStateApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getWorkState()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    workStateList,
    getWorkState,
    editWorkState,
    deleteWorkState,
    createWorkState,
    updateWorkState,
    restoreWorkState,
    uploadWorkState,
    thoroughDeleteWorkState,
    workStateOption,
    getWorkStateOption
  }
})
