import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/token'
import NProgress from 'nprogress' // 引入NProgress进度条
import 'nprogress/nprogress.css'
import { openLoading, closeLoading } from '@/utils/loading'
import useStore from '@/store'

interface ResponseData<T> {
  success: boolean
  data?: T
  code: number
  error?: string
  timestamp?: string
  msg?: string
}

const service = axios.create({
  baseURL: import.meta.env.VITE_PREFIX,
  timeout: 6000
})

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    openLoading()
    // 设置加载进度
    NProgress.start() // 设置加载进度条(开始..)
    const token = getToken()
    // 获取用户token，用于校验
    token && (config.headers.Authorization = 'Bearer ' + token)

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse<ResponseData<any>>) => {
    closeLoading()
    // 关闭加载进度
    NProgress.done() // 设置加载进度条(结束..)
    return response
  },
  (error: AxiosError) => {
    closeLoading()
    // 关闭加载进度
    NProgress.done() // 设置加载进度条(结束..)
    if (error.response?.status === 401) {
      const { appStore } = useStore()
      appStore.clear()
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
