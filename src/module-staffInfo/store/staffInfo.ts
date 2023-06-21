import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getStaffByIdApi } from '@/api/staff'
import { getAwardByStaffIdApi } from '@/api/award'
import { getChangeSalaryByStaffIdApi } from '@/api/changeSalary'
import { getTransferByStaffIdApi } from '@/api/transfer'
import { getApplyByStaffIdApi } from '@/api/apply'
import { getSalaryByStaffIdApi } from '@/api/salary'
import { PAGESIZE, PAGE } from '@/utils/constant'
export default defineStore('staffInfo', () => {
  const staffInfo = ref<Staff>()
  const awardInfo = ref<Award[]>()
  const changeSalaryInfo = ref<ChangeSalary[]>()
  const transferInfo = ref<Transfer[]>()
  const applyInfo = ref<Apply[]>()
  const salaryInfo = ref<Salary[]>()
  const editApply = ref<Apply>()
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    state: undefined
  })
  // 查询员工信息
  const getStaffById = async (id: number) => {
    const { data } = await getStaffByIdApi(id)
    if (data.success) {
      staffInfo.value = data.data
    } else throw new Error(data.message)
  }
  // 查询员工奖惩
  const getAwardByStaffId = async (
    id: number,
    parmas: GetChangeSalary = {
      page: page.value,
      pageSize: pageSize.value
    }
  ) => {
    const { data } = await getAwardByStaffIdApi(id, parmas)
    if (data.success) {
      awardInfo.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询员工调薪
  const getChangeSalaryByStaffId = async (
    id: number,
    parmas: GetChangeSalary = {
      page: page.value,
      pageSize: pageSize.value
    }
  ) => {
    const { data } = await getChangeSalaryByStaffIdApi(id, parmas)
    if (data.success) {
      changeSalaryInfo.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询员工调动
  const getTransferByStaffId = async (
    id: number,
    parmas: GetChangeSalary = {
      page: page.value,
      pageSize: pageSize.value
    }
  ) => {
    const { data } = await getTransferByStaffIdApi(id, parmas)
    if (data.success) {
      transferInfo.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询员工申请
  const getApplyByStaffId = async (
    id: number,
    parmas: GetApply = {
      page: page.value,
      pageSize: pageSize.value,
      state: searchData.state
    }
  ) => {
    const { data } = await getApplyByStaffIdApi(id, parmas)
    if (data.success) {
      applyInfo.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询员工申请
  const getSalaryByStaffId = async (
    id: number,
    parmas: GetSalary = {
      page: page.value,
      pageSize: pageSize.value
    }
  ) => {
    const { data } = await getSalaryByStaffIdApi(id, parmas)
    if (data.success) {
      salaryInfo.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }

  return {
    page,
    pageSize,
    total,
    staffInfo,
    getStaffById,
    getAwardByStaffId,
    awardInfo,
    changeSalaryInfo,
    getChangeSalaryByStaffId,
    getTransferByStaffId,
    transferInfo,
    applyInfo,
    getApplyByStaffId,
    searchData,
    editApply,
    getSalaryByStaffId,
    salaryInfo
  }
})
