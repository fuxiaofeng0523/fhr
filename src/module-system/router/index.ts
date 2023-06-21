export default [
  {
    path: '/system',
    name: 'system',
    component: () => import('@/module-system/index.vue'),
    meta: {
      title: 'menu.system.system',
      icon: 'User'
    },
    children: [
      {
        path: '/system/auth',
        name: 'systemAuth',
        component: () => import('@/module-system/pages/Auth/index.vue'),
        meta: {
          title: 'menu.system.auth',
          icon: 'Document'
        }
      },

      {
        path: '/system/log',
        name: 'systemLog',
        component: () => import('@/module-system/pages/Log/index.vue'),
        meta: {
          title: 'menu.system.log',
          icon: 'Document'
        }
      },
      {
        path: '/system/notice',
        name: 'systemNotice',
        component: () => import('@/module-system/pages/Notice/index.vue'),
        meta: {
          title: 'menu.system.notice',
          icon: 'Document'
        }
      },
      {
        path: '/system/basic',
        name: 'systemBasic',
        component: () => import('@/module-system/pages/Basic/index.vue'),
        meta: {
          title: 'menu.system.basic.basic',
          icon: 'Document'
        },
        children: [
          {
            path: '/system/basic/awardRule',
            name: 'systemBasicAwardRule',
            component: () =>
              import('@/module-system/pages/Basic/AwardRule/index.vue'),
            meta: {
              title: 'menu.system.basic.awardRule',
              icon: 'Document'
            }
          },
          {
            path: '/system/basic/department',
            name: 'systemBasicDepartment',
            component: () =>
              import('@/module-system/pages/Basic/Department/index.vue'),
            meta: {
              title: 'menu.system.basic.department',
              icon: 'Document'
            }
          },
          {
            path: '/system/basic/job',
            name: 'systemBasiJcob',
            component: () =>
              import('@/module-system/pages/Basic/Job/index.vue'),
            meta: {
              title: 'menu.system.basic.job',
              icon: 'Document'
            }
          },
          {
            path: '/system/basic/workState',
            name: 'systemBasicWorkState',
            component: () =>
              import('@/module-system/pages/Basic/WorkState/index.vue'),
            meta: {
              title: 'menu.system.basic.workState',
              icon: 'Document'
            }
          }
        ]
      }
    ]
  }
]
