import { defineStore } from 'pinia'
import {
  getApplyApi,
  createApplyApi,
  updateApplyApi,
  batchDeleteApplyApi,
  batchRestoreApplyApi,
  uploadApplyApi,
  thoroughDeleteApplyApi
} from '@/api/apply'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
import { ApplyStateEnum } from '@/enums/apply'
export default defineStore('apply', () => {
  const applyList = ref<Apply[]>()
  const editApply = ref<Apply>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false,
    state: undefined
  })
  // 查询
  const getApply = async (
    parmas: GetApply = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete,
      state: searchData.state
    }
  ) => {
    const { data } = await getApplyApi(parmas)
    if (data.success) {
      applyList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createApply = async (parmas: CreateApply, get: boolean = true) => {
    const { data } = await createApplyApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      get && getApply()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadApply = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadApplyApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getApply()
    } else throw new Error(data.message)
  }
  // 修改
  const updateApply = async (
    id: number,
    parmas: Partial<UpdateApply>,
    get: boolean = true
  ) => {
    const { data } = await updateApplyApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      get && getApply()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteApply = async (ids: number[], get: boolean = true) => {
    const { data } = await batchDeleteApplyApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      get && getApply()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteApply = async (
    ids: number[],
    get: boolean = true,
    message: string = '彻底删除成功'
  ) => {
    const { data } = await thoroughDeleteApplyApi(ids)
    if (data.success) {
      ElMessage.success(message)
      get && getApply()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreApply = async (ids: number[]) => {
    const { data } = await batchRestoreApplyApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getApply()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    applyList,
    getApply,
    editApply,
    deleteApply,
    createApply,
    updateApply,
    restoreApply,
    uploadApply,
    thoroughDeleteApply
  }
})
