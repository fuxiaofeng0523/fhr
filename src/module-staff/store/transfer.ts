import { defineStore } from 'pinia'
import {
  getTransferApi,
  createTransferApi,
  updateTransferApi,
  batchDeleteTransferApi,
  batchRestoreTransferApi,
  uploadTransferApi,
  thoroughDeleteTransferApi
} from '@/api/transfer'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('transfer', () => {
  const transferList = ref<Transfer[]>()
  const editTransfer = ref<Transfer>()
  const transferOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getTransfer = async (
    parmas: GetTransfer = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getTransferApi(parmas)
    if (data.success) {
      transferList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createTransfer = async (parmas: CreateTransfer) => {
    const { data } = await createTransferApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getTransfer()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadTransfer = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadTransferApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getTransfer()
    } else throw new Error(data.message)
  }
  // 修改
  const updateTransfer = async (
    id: number,
    parmas: Partial<CreateTransfer>
  ) => {
    const { data } = await updateTransferApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getTransfer()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteTransfer = async (ids: number[]) => {
    const { data } = await batchDeleteTransferApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getTransfer()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteTransfer = async (ids: number[]) => {
    const { data } = await thoroughDeleteTransferApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getTransfer()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreTransfer = async (ids: number[]) => {
    const { data } = await batchRestoreTransferApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getTransfer()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    transferList,
    getTransfer,
    editTransfer,
    deleteTransfer,
    createTransfer,
    updateTransfer,
    restoreTransfer,
    uploadTransfer,
    thoroughDeleteTransfer,
    transferOption
  }
})
