import { RouteRecordRaw } from 'vue-router'
/**
 * 默认路由
 * 具体业务路由，应在src/modules/router里定义，或者从后端动态加载
 */
export default [
  /**
   * 路由项结构：
   *{
      path: "/",//路径，（必选；path、name、component是路由规定必选的元素）
                  也可以带参数，如 path: "/resource/detail/:id",
      name: "路由名称，是路由唯一标识",（必选）
      component: 指向组件，如 Home,或者() => import("../views/login/PageIndex.vue")，（必选）
      meta: {//meta里的属性可以自定义，全部为可选项
        text: "名称",//展示在菜单里，（可选）
        navi: true, //导航条(一级菜单)，（可选）
        noLogin: true, //无须登录即可浏览，（可选）
        access: "work:sysmanage,work:resourcemanage",//权限标识，（可选）
      },
      children: [],
    },
   */
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login/index.vue'),
    meta: {
      noLogin: true //无须登录即可浏览
    }
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/Home/index.vue'),
        meta: {
          title: 'menu.common.home',
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/404/index.vue')
  }
] as Array<RouteRecordRaw>
