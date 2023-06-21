export default [
  {
    path: '/staff',
    name: 'staff',
    component: () => import('@/module-staff/index.vue'),
    meta: {
      title: 'menu.staff.staff',
      icon: 'User'
    },
    children: [
      {
        path: '/staff/admin',
        name: 'staffAdmin',
        component: () => import('@/module-staff/pages/Admin/index.vue'),
        meta: {
          title: 'menu.staff.admin',
          icon: 'Document'
        }
      },
      {
        path: '/staff/apply',
        name: 'staffApply',
        component: () => import('@/module-staff/pages/Apply/index.vue'),
        meta: {
          title: 'menu.staff.apply',
          icon: 'Document'
        }
      },
      {
        path: '/staff/award',
        name: 'staffAward',
        component: () => import('@/module-staff/pages/Award/index.vue'),
        meta: {
          title: 'menu.staff.award',
          icon: 'Document'
        }
      },
      {
        path: '/staff/changeSalary',
        name: 'staffChangeSalary',
        component: () => import('@/module-staff/pages/ChangeSalary/index.vue'),
        meta: {
          title: 'menu.staff.changeSalary',
          icon: 'Document'
        }
      },
      {
        path: '/staff/infos',
        name: 'staffInfos',
        component: () => import('@/module-staff/pages/Infos/index.vue'),
        meta: {
          title: 'menu.staff.infos',
          icon: 'Document'
        }
      },
      {
        path: '/staff/transfer',
        name: 'staffTransfer',
        component: () => import('@/module-staff/pages/Transfer/index.vue'),
        meta: {
          title: 'menu.staff.transfer',
          icon: 'Document'
        }
      }
    ]
  }
]
