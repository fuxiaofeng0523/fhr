export default [
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('@/module-statistics/index.vue'),
    meta: {
      title: 'menu.statistics.statistics',
      icon: 'User'
    },
    children: [
      {
        path: '/statistics/operate',
        name: 'statisticsOperate',
        component: () => import('@/module-statistics/pages/Operate/index.vue'),
        meta: {
          title: 'menu.statistics.operate',
          icon: 'Document'
        }
      },
      {
        path: '/statistics/salary',
        name: 'statisticsSalary',
        component: () => import('@/module-statistics/pages/Salary/index.vue'),
        meta: {
          title: 'menu.statistics.salary',
          icon: 'Document'
        }
      }
    ]
  }
]
