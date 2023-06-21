import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getModuleApi,
  getTimeApi,
  getDayApi,
  getMethodApi,
  getCodeApi,
  getUserApi
} from '@/api/log'
export default defineStore('operate', () => {
  const moduleList = ref<Module[]>()
  const timeList = ref<Time[]>()
  const dayList = ref<Time[]>()
  const methodList = ref<Method[]>()
  const codeList = ref<Code[]>()
  const userList = ref<Time[]>()
  const search = ref({
    departmentId: undefined,
    jobId: undefined,
    staffId: undefined,
    roleId: 1
  })
  const getModule = async () => {
    const { data } = await getModuleApi()
    if (data.success) {
      moduleList.value = data.data
    } else throw new Error(data.message)
  }
  const getTime = async () => {
    const { data } = await getTimeApi()
    if (data.success) {
      timeList.value = data.data
    } else throw new Error(data.message)
  }
  const getDay = async () => {
    const { data } = await getDayApi()
    if (data.success) {
      dayList.value = data.data
    } else throw new Error(data.message)
  }
  const getMethod = async () => {
    const { data } = await getMethodApi()
    if (data.success) {
      methodList.value = data.data
    } else throw new Error(data.message)
  }
  const getCode = async () => {
    const { data } = await getCodeApi()
    if (data.success) {
      codeList.value = data.data
    } else throw new Error(data.message)
  }
  const getUser = async (
    params: GetUser = {
      departmentId: search.value.departmentId,
      jobId: search.value.jobId,
      staffId: search.value.staffId,
      roleId: search.value.roleId
    }
  ) => {
    const { data } = await getUserApi(params)
    if (data.success) {
      userList.value = data.data
    } else throw new Error(data.message)
  }
  return {
    moduleList,
    getModule,
    timeList,
    getTime,
    dayList,
    getDay,
    methodList,
    getMethod,
    codeList,
    getCode,
    search,
    userList,
    getUser
  }
})
