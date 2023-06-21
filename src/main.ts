import { createApp, createVNode, provide } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from '@/i18n'
import '@/asset/icon/icon.js'
import Icon from '@/components/Icon/index.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/index.css'
import * as Icons from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'
import errorHandler from '@/utils/errorHandler'
import { mockRequest } from '@/mock'
if (process.env.NODE_ENV === 'mock') {
  mockRequest()
}
const { t } = i18n.global
const app = createApp(App)
app.component('Icon', Icon)
app.use(ElementPlus, {
  locale: zhCn
})
// i18n
app.config.globalProperties.$t = t
// 全局异常处理
app.config.errorHandler = errorHandler.errorHandler
// 全局错误处理
window.onerror = errorHandler.onerror
app.use(router).use(createPinia()).use(i18n).mount('#app')

// 创建Icon组件
const EIcon = (props: { icon: string }) => {
  const { icon } = props
  return createVNode(Icons[icon as keyof typeof Icons])
}
// 注册Icon组件
app.component('EIcon', EIcon)
