export default [
  {
    path: '/staffInfo',
    name: 'staffInfo',
    component: () => import('@/module-staffInfo/index.vue'),
    meta: {
      title: 'menu.staffInfo.staffInfo',
      icon: 'User'
    },
    children: [
      {
        path: '/staffInfo/basic',
        name: 'staffInfoBasic',
        component: () => import('@/module-staffInfo/pages/Basic/index.vue'),
        meta: {
          title: 'menu.staffInfo.basic',
          icon: 'Document'
        }
      },
      {
        path: '/staffInfo/high',
        name: 'staffInfoHigh',
        component: () => import('@/module-staffInfo/pages/High/index.vue'),
        meta: {
          title: 'menu.staffInfo.high.high',
          icon: 'Document'
        },
        children: [
          {
            path: '/staffInfo/high/contract',
            name: 'staffInfoHighContract',
            component: () =>
              import('@/module-staffInfo/pages/High/Contract/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.contract',
              icon: 'Notebook'
            }
          },
          {
            path: '/staffInfo/high/apply',
            name: 'staffInfoHighApply',
            component: () =>
              import('@/module-staffInfo/pages/High/Apply/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.apply',
              icon: 'Notebook'
            }
          },
          {
            path: '/staffInfo/high/award',
            name: 'staffInfoHighAward',
            component: () =>
              import('@/module-staffInfo/pages/High/Award/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.award',
              icon: 'Notebook'
            }
          },
          {
            path: '/staffInfo/high/changeSalary',
            name: 'staffInfoHighChangeSalary',
            component: () =>
              import('@/module-staffInfo/pages/High/ChangeSalary/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.changeSalary',
              icon: 'Notebook'
            }
          },
          {
            path: '/staffInfo/high/salary',
            name: 'staffInfoHighSalary',
            component: () =>
              import('@/module-staffInfo/pages/High/Salary/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.salary',
              icon: 'Notebook'
            }
          },
          {
            path: '/staffInfo/high/transfer',
            name: 'staffInfoHighTransfer',
            component: () =>
              import('@/module-staffInfo/pages/High/Transfer/index.vue'),
            meta: {
              title: 'menu.staffInfo.high.transfer',
              icon: 'Notebook'
            }
          }
        ]
      }
    ]
  }
]
