import { defineStore } from 'pinia'
import {
  getAwardRuleApi,
  createAwardRuleApi,
  updateAwardRuleApi,
  batchDeleteAwardRuleApi,
  batchRestoreAwardRuleApi,
  uploadAwardRuleApi,
  thoroughDeleteAwardRuleApi,
  getAwardRuleOptionApi
} from '@/api/awardRule'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('awardRule', () => {
  const awardRuleList = ref<AwardRule[]>()
  const editAwardRule = ref<AwardRule>()
  const awardRuleOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    type: undefined,
    isDelete: false
  })
  // 查询
  const getAwardRule = async (
    parmas: GetAwardRule = {
      page: page.value,
      pageSize: pageSize.value,
      type: searchData.type,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getAwardRuleApi(parmas)
    if (data.success) {
      awardRuleList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 添加
  const createAwardRule = async (parmas: CreateAwardRule) => {
    const { data } = await createAwardRuleApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getAwardRule()
    } else throw new Error(data.message)
  }

  // 查询全部Option
  const getAwardRuleOption = async () => {
    if (!awardRuleOption.value) {
      const { data } = await getAwardRuleOptionApi()
      if (data.success) {
        awardRuleOption.value = data.data
      } else throw new Error(data.message)
    }
    return awardRuleOption.value
  }

  // 上传
  const uploadAwardRule = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadAwardRuleApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getAwardRule()
    } else throw new Error(data.message)
  }
  // 修改
  const updateAwardRule = async (
    id: number,
    parmas: Partial<CreateAwardRule>
  ) => {
    const { data } = await updateAwardRuleApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAwardRule()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteAwardRule = async (ids: number[]) => {
    const { data } = await batchDeleteAwardRuleApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getAwardRule()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteAwardRule = async (ids: number[]) => {
    const { data } = await thoroughDeleteAwardRuleApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getAwardRule()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreAwardRule = async (ids: number[]) => {
    const { data } = await batchRestoreAwardRuleApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getAwardRule()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    awardRuleList,
    getAwardRule,
    editAwardRule,
    deleteAwardRule,
    createAwardRule,
    updateAwardRule,
    restoreAwardRule,
    uploadAwardRule,
    thoroughDeleteAwardRule,
    getAwardRuleOption,
    awardRuleOption
  }
})
