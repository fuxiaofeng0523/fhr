import { defineStore } from 'pinia'
import {
  getAccountApi,
  createAccountApi,
  updateAccountApi,
  batchDeleteAccountApi,
  batchRestoreAccountApi,
  uploadAccountApi,
  thoroughDeleteAccountApi,
  getAccountOptionApi
} from '@/api/account'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('account', () => {
  const accountList = ref<Account[]>()
  const editAccount = ref<Account>()
  const accountOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getAccount = async (
    parmas: GetAccount = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getAccountApi(parmas)
    if (data.success) {
      accountList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询全部Option
  const getAccountOption = async () => {
    const { data } = await getAccountOptionApi()
    if (data.success) {
      accountOption.value = data.data
    } else throw new Error(data.message)
  }
  // 添加
  const createAccount = async (parmas: CreateAccount) => {
    const { data } = await createAccountApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getAccount()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadAccount = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadAccountApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getAccount()
    } else throw new Error(data.message)
  }
  // 修改
  const updateAccount = async (id: number, parmas: Partial<CreateAccount>) => {
    const { data } = await updateAccountApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAccount()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteAccount = async (ids: number[]) => {
    const { data } = await batchDeleteAccountApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getAccount()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteAccount = async (ids: number[]) => {
    const { data } = await thoroughDeleteAccountApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getAccount()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreAccount = async (ids: number[]) => {
    const { data } = await batchRestoreAccountApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getAccount()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    accountList,
    getAccount,
    editAccount,
    deleteAccount,
    createAccount,
    updateAccount,
    restoreAccount,
    uploadAccount,
    thoroughDeleteAccount,
    accountOption,
    getAccountOption
  }
})
