import { defineStore } from 'pinia'
import {
  getAwardApi,
  createAwardApi,
  updateAwardApi,
  batchDeleteAwardApi,
  batchRestoreAwardApi,
  uploadAwardApi,
  thoroughDeleteAwardApi
} from '@/api/award'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('award', () => {
  const awardList = ref<Award[]>()
  const editAward = ref<Award>()
  const awardOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getAward = async (
    parmas: GetAward = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getAwardApi(parmas)
    if (data.success) {
      awardList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createAward = async (parmas: CreateAward) => {
    const { data } = await createAwardApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getAward()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadAward = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadAwardApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getAward()
    } else throw new Error(data.message)
  }
  // 修改
  const updateAward = async (id: number, parmas: Partial<CreateAward>) => {
    const { data } = await updateAwardApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAward()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteAward = async (ids: number[]) => {
    const { data } = await batchDeleteAwardApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getAward()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteAward = async (ids: number[]) => {
    const { data } = await thoroughDeleteAwardApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getAward()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreAward = async (ids: number[]) => {
    const { data } = await batchRestoreAwardApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getAward()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    awardList,
    getAward,
    editAward,
    deleteAward,
    createAward,
    updateAward,
    restoreAward,
    uploadAward,
    thoroughDeleteAward,
    awardOption
  }
})
