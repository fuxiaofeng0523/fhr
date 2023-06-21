import { defineStore } from 'pinia'
import {
  createContractApi,
  updateContractApi,
  getContractByStaffIdApi
} from '@/api/contract'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
export default defineStore('contract', () => {
  const contract = ref<Contract>()
  const editContract = ref<Contract>()

  // 根据员工id获取合同
  const getContractByStaffId = async (id: number) => {
    const { data } = await getContractByStaffIdApi(id)
    if (data.success) {
      contract.value = data.data
    } else throw new Error(data.message)
  }

  // 添加
  const createContract = async (parmas: CreateContract) => {
    const { data } = await createContractApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
    } else throw new Error(data.message)
  }

  // 修改
  const updateContract = async (
    id: number,
    parmas: Partial<CreateContract>
  ) => {
    const { data } = await updateContractApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
    } else throw new Error(data.message)
  }

  return {
    contract,
    getContractByStaffId,
    editContract,
    createContract,
    updateContract
  }
})
