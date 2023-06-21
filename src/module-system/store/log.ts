import { defineStore } from 'pinia'
import {
  getLogApi,
  batchDeleteLogApi,
  batchRestoreLogApi,
  thoroughDeleteLogApi
} from '@/api/log'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('log', () => {
  const logList = ref<Log[]>()
  const editLog = ref<Log>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getLog = async (
    parmas: GetLog = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getLogApi(parmas)
    if (data.success) {
      logList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteLog = async (ids: number[]) => {
    const { data } = await batchDeleteLogApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getLog()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteLog = async (ids: number[]) => {
    const { data } = await thoroughDeleteLogApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getLog()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreLog = async (ids: number[]) => {
    const { data } = await batchRestoreLogApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getLog()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    logList,
    getLog,
    editLog,
    deleteLog,
    restoreLog,
    thoroughDeleteLog
  }
})
