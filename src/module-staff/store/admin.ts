import { defineStore } from 'pinia'
import {
  getAdminApi,
  createAdminApi,
  updateAdminApi,
  batchDeleteAdminApi,
  batchRestoreAdminApi,
  uploadAdminApi,
  thoroughDeleteAdminApi,
  updateAdminByStaffIdApi
} from '@/api/admin'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('admin', () => {
  const adminList = ref<Admin[]>()
  const editAdmin = ref<Admin>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getAdmin = async (
    parmas: GetAdmin = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getAdminApi(parmas)
    if (data.success) {
      adminList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  // 添加
  const createAdmin = async (parmas: CreateAdmin) => {
    const { data } = await createAdminApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getAdmin()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadAdmin = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadAdminApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getAdmin()
    } else throw new Error(data.message)
  }

  // 通过员工Id更新
  const updateAdminByStaffId = async (
    id: number,
    parmas: Partial<CreateAdmin>
  ) => {
    const { data } = await updateAdminByStaffIdApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAdmin()
    } else throw new Error(data.message)
  }
  // 修改
  const updateAdmin = async (id: number, parmas: Partial<CreateAdmin>) => {
    const { data } = await updateAdminApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getAdmin()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteAdmin = async (ids: number[]) => {
    const { data } = await batchDeleteAdminApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getAdmin()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteAdmin = async (ids: number[]) => {
    const { data } = await thoroughDeleteAdminApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getAdmin()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreAdmin = async (ids: number[]) => {
    const { data } = await batchRestoreAdminApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getAdmin()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    adminList,
    getAdmin,
    editAdmin,
    deleteAdmin,
    createAdmin,
    updateAdmin,
    restoreAdmin,
    uploadAdmin,
    thoroughDeleteAdmin,
    updateAdminByStaffId
  }
})
