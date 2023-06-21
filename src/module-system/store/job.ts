import { defineStore } from 'pinia'
import {
  getJobApi,
  createJobApi,
  updateJobApi,
  batchDeleteJobApi,
  batchRestoreJobApi,
  uploadJobApi,
  thoroughDeleteJobApi,
  geJobOptionApi,
  getJobSalaryApi
} from '@/api/job'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGESIZE, PAGE } from '@/utils/constant'
import { initArray } from '@/utils'
export default defineStore('job', () => {
  const jobList = ref<Job[]>()
  const editJob = ref<Job>()
  const jobOption = ref<Option[]>([])
  const page = ref<number>(PAGE)
  const pageSize = ref<number>(PAGESIZE)
  const total = ref<number>(0)
  const searchData = reactive({
    departmentId: undefined,
    isDelete: false
  })
  // 查询
  const getJob = async (
    parmas: GetJob = {
      page: page.value,
      pageSize: pageSize.value,
      departmentId: searchData.departmentId,
      isDelete: searchData.isDelete
    }
  ) => {
    const { data } = await getJobApi(parmas)
    if (data.success) {
      jobList.value = data.data.data
      total.value = data.data.total
    } else throw new Error(data.message)
  }
  // 查询全部Option
  const getJobOption = async (departmentId: number) => {
    const { data } = await geJobOptionApi(departmentId)
    if (data.success) {
      initArray(jobOption.value)
      while (data.data.length > 0) {
        jobOption.value.push(data.data.pop())
      }
    } else throw new Error(data.message)
  }
  // 获取职位工资
  const getJobSalary = async (id: number) => {
    const { data } = await getJobSalaryApi(id)
    if (data.success) {
      return data.data
    } else throw new Error(data.message)
  }
  // 添加
  const createJob = async (parmas: CreateJob) => {
    const { data } = await createJobApi(parmas)
    if (data.success) {
      ElMessage.success('添加成功')
      getJob()
    } else throw new Error(data.message)
  }

  // 上传
  const uploadJob = async (parmas: File) => {
    const formData = new FormData()
    formData.append('file', parmas)
    const { data } = await uploadJobApi(formData)
    if (data.success) {
      ElMessage.success('上传成功')
      getJob()
    } else throw new Error(data.message)
  }
  // 修改
  const updateJob = async (id: number, parmas: Partial<CreateJob>) => {
    const { data } = await updateJobApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getJob()
    } else throw new Error(data.message)
  }

  // 批量删除
  const deleteJob = async (ids: number[]) => {
    const { data } = await batchDeleteJobApi(ids)
    if (data.success) {
      ElMessage.success('删除成功')
      getJob()
    } else throw new Error(data.message)
  }

  // 彻底删除
  const thoroughDeleteJob = async (ids: number[]) => {
    const { data } = await thoroughDeleteJobApi(ids)
    if (data.success) {
      ElMessage.success('彻底删除成功')
      getJob()
    } else throw new Error(data.message)
  }

  // 批量恢复
  const restoreJob = async (ids: number[]) => {
    const { data } = await batchRestoreJobApi(ids)
    if (data.success) {
      ElMessage.success('恢复成功')
      getJob()
    } else throw new Error(data.message)
  }
  return {
    page,
    pageSize,
    total,
    searchData,
    jobList,
    getJob,
    editJob,
    deleteJob,
    createJob,
    updateJob,
    restoreJob,
    uploadJob,
    thoroughDeleteJob,
    jobOption,
    getJobOption,
    getJobSalary
  }
})
