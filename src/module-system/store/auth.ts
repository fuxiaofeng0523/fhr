import { defineStore } from 'pinia'
import {
  getAuthApi,
  createAuthApi,
  updateAuthApi,
  batchDeleteAuthApi,
  batchRestoreAuthApi,
  thoroughDeleteAuthApi,
  getAuthOneApi,
  getAuthMenuTreeApi
} from '@/api/auth'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
import { formatElTree } from '../utils'
export default defineStore('auth', () => {
  const authList = ref<Auth[]>()
  const editAuth = ref<Auth>()
  const menuTree = ref<AuthTree[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getAuth = async (
    parmas: GetAuth = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getAuthApi(parmas)
    if (data.success) {
      authList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询全部
  const getAuthMenuTree = async () => {
    const { data } = await getAuthMenuTreeApi()
    if (data.success) {
      menuTree.value = formatElTree(data.data)
    } else throw new Error(data.message)
  }
  // 查询一个
  const getAuthOne = async (id: number) => {
    const { data } = await getAuthOneApi(id)
    if (data.success) {
      editAuth.value = data.data[0]
    } else throw new Error(data.message)
  }
  // 添加
  const createAuth = async (parmas: CreateAuth) => {
    const { data } = await createAuthApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getAuth()
    } else throw new Error(data.message)
  }

  // 修改
  const updateAuth = async (id: number, parmas: Partial<CreateAuth>) => {
    const { data } = await updateAuthApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAuth()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteAuth = async (ids: number[]) => {
    const { data } = await batchDeleteAuthApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getAuth()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteAuth = async (ids: number[]) => {
    const { data } = await thoroughDeleteAuthApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getAuth()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreAuth = async (ids: number[]) => {
    const { data } = await batchRestoreAuthApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getAuth()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    authList,
    getAuth,
    editAuth,
    deleteAuth,
    createAuth,
    updateAuth,
    restoreAuth,
    thoroughDeleteAuth,
    getAuthOne,
    getAuthMenuTree,
    menuTree
  }
})
