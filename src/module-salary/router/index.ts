export default [
  {
    path: '/salary',
    name: 'salary',
    component: () => import('@/module-salary/index.vue'),
    meta: {
      title: 'menu.salary.salaryManage',
      icon: 'User'
    },
    children: [
      {
        path: '/salary/account',
        name: 'salaryAccount',
        component: () => import('@/module-salary/pages/Account/index.vue'),
        meta: {
          title: 'menu.salary.account',
          icon: 'Document'
        }
      },
      {
        path: '/salary/salary',
        name: 'salarySalary',
        component: () => import('@/module-salary/pages/Salary/index.vue'),
        meta: {
          title: 'menu.salary.salary',
          icon: 'Document'
        }
      }
    ]
  }
]
