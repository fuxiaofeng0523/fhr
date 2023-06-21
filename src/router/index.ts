/**
 * createRouter 这个为创建路由的方法
 * createWebHashHistory 这个就是vue2中路由的模式，
 *                      这里的是hash模式，这个还可以是createWebHistory等
 * RouteRecordRaw 这个为要添加的路由记录，也可以说是routes的ts类型
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import routeAssembler from './setup'
import defaultRoutes from './default'
import useStore from '@/store'
import { ElMessage } from 'element-plus'
// import { RoleEnum } from '@/module-staff/utils/enum'
// 路由记录，这个跟vue2中用法一致
const routes: Array<RouteRecordRaw> = [...defaultRoutes]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
let registerRouteFresh = true //是否还没有动态加载过
router.beforeEach(async (to, from, next) => {
  const { appStore } = useStore()
  const isLogin = appStore.isLogin
  const isHello = sessionStorage.getItem('isHello')
  if (isLogin) {
    appStore.userInfo ?? (await appStore.getUserInfo())
    !isHello &&
      from.name === 'login' &&
      appStore.userInfo &&
      (sessionStorage.setItem('isHello', 'Hello'),
      ElMessage({
        type: 'success',
        message: `登陆成功，欢迎您,${appStore.userInfo.name}`
      }))
    if (registerRouteFresh) {
      //还没有动态加载过
      //动态注册路由 <----------------------------------------
      await routeAssembler(router)
      registerRouteFresh = false
      next({
        ...to,
        replace: true
      })
    } else {
      //已经登录了，不能再打开登录页
      to.path === '/login' ? next('/home') : next()
    }
  } else {
    //如果无须登录则直接打开，否则转向登录页面
    to.meta.noLogin || to.path === '/login' ? next() : next('/login')
  }
})

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
export default router
