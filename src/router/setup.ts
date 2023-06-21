/*
  装配路由及菜单
 */
import { RouteRecordRaw } from 'vue-router'

import staffInfoItems from '@/module-staffInfo/router' //具体业务系统的路由
import statisticsItem from '@/module-statistics/router'
import salaryItem from '@/module-salary/router'
import staffItem from '@/module-staff/router'
import systemItem from '@/module-system/router'
import useStore from '@/store'

export default async (router: any) => {
  //获得动态路由
  const dynaItems = await getDynamicItems()
  //添加动态路由
  dynaItems.forEach(value => {
    router.addRoute('layout', value)
    router.options.routes[1].children =
      router.options.routes[1].children.concat(value)
  })
  router.addRoute({
    path: '/:catchAll(.*)',
    redirect: '/404'
  })
}

const getDynamicItems = async () => {
  /*
    获取动态路由，从指定文件加载或从后端获取
  */
  const { appStore } = useStore()
  await appStore.getMenu()
  const menu = verifyRoute(
    [
      ...staffInfoItems,
      ...statisticsItem,
      ...salaryItem,
      ...staffItem,
      ...systemItem
    ],
    appStore.menu
  )
  return appStore.isAdminNow ? menu : menu[0].children!
}
const verifyRoute = (localRoutes: RouteRecordRaw[], asyncRoutes: Menu[]) => {
  /**
   * 循环数据
   *   -比较path
   *    -如果有，保存
   *   -如果有children
   *     -递归
   */
  const check = (localRoutes: RouteRecordRaw[], asyncRoutes: Menu[]) => {
    const menuItems: RouteRecordRaw[] = []
    for (let i = 0; i < localRoutes.length; i++) {
      for (let j = 0; j < asyncRoutes.length; j++) {
        if (localRoutes[i].path === asyncRoutes[j].path) {
          menuItems.push(localRoutes[i])
          if (asyncRoutes[j].children) {
            const children = check(
              localRoutes[i].children!,
              asyncRoutes[j].children!
            )
            menuItems[menuItems.length - 1].children = children
          }
          break
        }
      }
    }
    return menuItems
  }
  return check(localRoutes, asyncRoutes)
}
