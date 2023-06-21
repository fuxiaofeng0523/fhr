import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  loginApi,
  getUserInfoApi,
  logoutApi,
  getMenuApi,
  uploadApi
} from '@/api/app'
import {
  getToken,
  removeToken,
  removeTokenTime,
  setToken,
  setTokenTime
} from '@/utils/token'
import { TABS_VALUE, TAB_VALUE, DARK_KEY } from '@/layout/utils/constant'
import { LANG, FASTDATA, FASTACTIVE } from '@/utils/constant'
import { formatEnumData } from '@/utils'
import {
  EducationLevelEnum,
  EngageFormEnum,
  NationEnum,
  PoliticalAffiliationEnum,
  SexEnum,
  WedlockEnum
} from '@/enums/staff'

export default defineStore('app', () => {
  const app = ref<string>('app')
  const lang = ref<string>(localStorage.getItem('lang') || 'zh')
  const theme = ref<boolean>(localStorage.getItem(DARK_KEY) === 'dark')
  const isCollapse = ref<boolean>(false)
  const isLogin = ref<boolean>(getToken() ? true : false)
  const isAdmin = ref<boolean>(
    JSON.parse(localStorage.getItem('isAdmin') || 'false')
  )
  const isAdminNow = ref<boolean>(
    JSON.parse(localStorage.getItem('isAdminNow') || 'false')
  )
  const token = ref<string | null>(getToken())
  const menu = ref<Menu[]>([])
  const userInfo = ref()
  const sexOption = ref<Option[]>()
  const wedlockOption = ref<Option[]>()
  const nationOption = ref<Option[]>()
  const politicalAffiliationOption = ref<Option[]>()
  const engageFormOption = ref<Option[]>()
  const educationLevelOption = ref<Option[]>()

  // 登录
  const login = async (loginMessage: LoginMessage) => {
    const { data } = await loginApi(loginMessage)
    if (data.success) {
      setToken(data.data.access_token)
      setTokenTime()
      isLogin.value = true
      isAdmin.value = data.data.isAdmin
      localStorage.setItem('isAdmin', JSON.stringify(isAdmin.value))
      localStorage.setItem('isAdminNow', JSON.stringify(isAdminNow.value))
      token.value = data.data.access_token
      sessionStorage.setItem('hello', 'hello')
      return data.success
    } else throw new Error(data.message)
  }
  // 获取登录的用户信息
  const getUserInfo = async () => {
    const { data } = await getUserInfoApi()
    if (data.success) {
      userInfo.value = data.data
    } else throw new Error(data.message)
  }
  // 获取菜单
  const getMenu = async () => {
    const { data } = await getMenuApi(isAdminNow.value)
    if (data.success) {
      menu.value = data.data
    } else throw new Error(data.message)
  }
  // 上传
  const upload = async (file: FormData) => {
    const { data } = await uploadApi(file)
    return data
  }
  // 登出
  const logout = async () => {
    const { data } = await logoutApi()
    if (data.success) {
      clear()
    } else throw new Error(data.message)
  }
  // 清除数据
  const clear = () => {
    removeToken()
    removeTokenTime()
    localStorage.removeItem(TAB_VALUE)
    localStorage.removeItem(TABS_VALUE)
    localStorage.removeItem(DARK_KEY)
    localStorage.removeItem(LANG)
    localStorage.removeItem(FASTDATA)
    localStorage.removeItem(FASTACTIVE)
    sessionStorage.removeItem('isHello')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('isAdminNow')
    window.location.reload()
  }

  // 获取sexOption
  const getSexOption = () => {
    if (!sexOption.value) {
      sexOption.value = formatEnumData(SexEnum)
    }
    return sexOption.value
  }
  // 获取wedlockOption
  const getWedlockOption = () => {
    if (!wedlockOption.value) {
      wedlockOption.value = formatEnumData(WedlockEnum)
    }
    return wedlockOption.value
  }
  // 获取nationOption
  const getNationOption = () => {
    if (!nationOption.value) {
      nationOption.value = formatEnumData(NationEnum)
    }
    return nationOption.value
  }

  // 获取politicalAffiliationOption
  const getPoliticalAffiliationOption = () => {
    if (!politicalAffiliationOption.value) {
      politicalAffiliationOption.value = formatEnumData(
        PoliticalAffiliationEnum
      )
    }
    return politicalAffiliationOption.value
  }
  // 获取engageFormOption
  const getEngageFormOption = () => {
    if (!engageFormOption.value) {
      engageFormOption.value = formatEnumData(EngageFormEnum)
    }
    return engageFormOption.value
  }
  // 获取educationLevelOption
  const getEducationLevelOption = () => {
    if (!educationLevelOption.value) {
      educationLevelOption.value = formatEnumData(EducationLevelEnum)
    }
    return educationLevelOption.value
  }

  return {
    theme,
    app,
    lang,
    isCollapse,
    isLogin,
    token,
    login,
    logout,
    userInfo,
    getUserInfo,
    clear,
    menu,
    getMenu,
    getSexOption,
    getWedlockOption,
    getNationOption,
    getPoliticalAffiliationOption,
    getEngageFormOption,
    getEducationLevelOption,
    isAdmin,
    isAdminNow,
    upload
  }
})
