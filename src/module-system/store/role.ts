import { defineStore } from 'pinia'
import {
  getRoleApi,
  createRoleApi,
  updateRoleApi,
  batchDeleteRoleApi,
  batchRestoreRoleApi,
  thoroughDeleteRoleApi,
  getRoleOptionApi
} from '@/api/role'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('role', () => {
  const roleList = ref<Role[]>()
  const editRole = ref<Role>()
  const roleOption = ref<Option[]>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    isDelete: false
  })
  // 查询
  const getRole = async (
    parmas: GetRole = {
      page: page.value,
      pageSize: pageSize.value,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getRoleApi(parmas)
    if (data.success) {
      roleList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询全部Option
  const getRoleOption = async () => {
    if (!roleOption.value) {
      const { data } = await getRoleOptionApi()
      if (data.success) {
        roleOption.value = data.data
      } else throw new Error(data.message)
    }
    return roleOption.value
  }
  // 添加
  const createRole = async (parmas: CreateRole) => {
    const { data } = await createRoleApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getRole()
    } else throw new Error(data.message)
  }

  // 修改
  const updateRole = async (id: number, parmas: Partial<CreateRole>) => {
    const { data } = await updateRoleApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getRole()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteRole = async (ids: number[]) => {
    const { data } = await batchDeleteRoleApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getRole()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteRole = async (ids: number[]) => {
    const { data } = await thoroughDeleteRoleApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getRole()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreRole = async (ids: number[]) => {
    const { data } = await batchRestoreRoleApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getRole()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    roleList,
    getRole,
    editRole,
    deleteRole,
    createRole,
    updateRole,
    restoreRole,
    thoroughDeleteRole,
    getRoleOption,
    roleOption
  }
})
