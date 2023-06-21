import { defineStore } from 'pinia'
import {
  getNoticeApi,
  createNoticeApi,
  batchDeleteNoticeApi,
  batchRestoreNoticeApi,
  thoroughDeleteNoticeApi,
  updateNoticeApi
} from '@/api/notice'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
import { NoticeEnum } from '@/enums/notice'
export default defineStore('notice', () => {
  const noticeList = ref<Notice[]>()
  const noticeHome = ref<Notice[]>()
  const editNotice = ref<Notice>()
  const detailNotice = ref<Notice>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false,
    status: ''
  })
  // 查询
  const getNotice = async (
    parmas: GetNotice = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete,
      status: searchData.status
    }
  ) => {
    const { data } = await getNoticeApi(parmas)
    if (data.success) {
      noticeList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  const getHomeNotice = async (
    params: GetNotice = {
      page: 1,
      pageSize: 3
    }
  ) => {
    const { data } = await getNoticeApi(params)
    if (data.success) {
      noticeHome.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.errorMsg)
  }
  // 添加
  const createNotice = async (
    parmas: CreateNotice,
    message: string = '发布成功'
  ) => {
    const { data } = await createNoticeApi(parmas)
    if (data.success) {
      ElMessage.success(message)
      getNotice()
    } else throw new Error(data.message)
  }
  // 修改
  const updateNotice = async (
    id: number,
    parmas: Partial<CreateNotice>,
    message: string = '修改成功'
  ) => {
    const { data } = await updateNoticeApi(id, parmas)
    if (data.success) {
      ElMessage.success(message)
      getNotice()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteNotice = async (ids: number[]) => {
    const { data } = await batchDeleteNoticeApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getNotice()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteNotice = async (ids: number[]) => {
    const { data } = await thoroughDeleteNoticeApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getNotice()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreNotice = async (ids: number[]) => {
    const { data } = await batchRestoreNoticeApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getNotice()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    noticeList,
    getNotice,
    editNotice,
    deleteNotice,
    createNotice,
    restoreNotice,
    thoroughDeleteNotice,
    noticeHome,
    getHomeNotice,
    detailNotice,
    updateNotice
  }
})
