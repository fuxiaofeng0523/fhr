export default {
  common: {
    input_placeholder: '请输入',
    select_placeholder: '请选择',
    search: '查询',
    reset: '重置',
    edit: '编辑',
    delete: '删除',
    delete_tip: '确认删除？',
    delete_tip2: '确认删除？此操作不可逆！',
    confirm: '确定',
    cancel: '取消',
    detail: '详情',
    operation: '操作',
    add: '添加',
    close: '关闭',
    save: '暂存',
    release: '发布',
    withdraw: '撤回',
    restore_tip: '确认恢复？',
    restore: '恢复',
    batchDelete: '批量删除',
    batchRestore: '批量恢复',
    reject: '驳回',
    pass: '通过',
    reapply: '重新申请',
    newPWD: '新密码',
    reNewPWD: '确认新密码',
    modPWD: '修改密码',
    modInfo: '修改信息',
    modAvatar: '修改头像'
  },
  login: {
    phone: '请输入您的手机号',
    password: '请输入您的密码',
    loginBtn: '登录',
    code: '请输入验证码'
  },
  title: '人力资源管理系统',
  menu: {
    common: {
      home: '首页'
    },
    staffInfo: {
      staffInfo: '员工信息',
      basic: '基本信息',
      high: {
        high: '高级信息',
        apply: '申请信息',
        award: '奖惩信息',
        changeSalary: '调薪信息',
        salary: '薪资信息',
        transfer: '调动信息',
        contract: '合同信息'
      }
    },
    statistics: {
      statistics: '统计管理',
      operate: '操作统计',
      salary: '薪资统计'
    },
    salary: {
      salaryManage: '薪资管理',
      account: '账套管理',
      salary: '薪资信息'
    },
    staff: {
      staff: '人事管理',
      admin: '管理员管理',
      apply: '申请管理',
      award: '奖惩管理',
      changeSalary: '调薪管理',
      infos: '员工管理',
      transfer: '调动管理'
    },
    system: {
      system: '系统管理',
      auth: '权限管理',
      log: '日志管理',
      notice: '公告管理',
      basic: {
        basic: '基础信息管理',
        awardRule: '奖惩规则管理',
        department: '部门管理',
        job: '职位管理',
        workState: '工作状态管理'
      }
    }
  },
  staff: {
    address: '地址',
    avatar: '头像',
    basisSalary: '基本工资',
    beginDate: '合同起始日期',
    birthday: '出生日期',
    contractDate: '合同期限',
    department: '部门',
    educationLevel: '最高学历',
    email: '邮箱',
    endDate: '合同终止日期',
    engageForm: '合同形式',
    formDate: '转正日期',
    id: 'ID',
    idCard: '身份证号',
    inDate: '入职日期',
    leaveDate: '离职日期',
    job: '职位',
    name: '姓名',
    nation: '民族',
    nativePlace: '籍贯',
    phone: '手机号',
    politicalAffiliation: '政治面貌',
    school: '毕业院校',
    sex: '性别',
    specialty: '专业',
    wedlock: '婚姻状况',
    workAge: '工龄',
    workState: '工作状态',
    workNumber: '工号',
    roleName: '权限'
  },
  awardRule: {
    desc: '描述',
    id: 'ID',
    name: '名称',
    score: '分数',
    type: '类型'
  },
  workState: {
    desc: '描述',
    id: 'ID',
    name: '名称'
  },
  department: {
    desc: '描述',
    id: 'ID',
    name: '名称'
  },
  account: {
    allSalary: '总工资',
    basisSalary: '基本工资',
    id: 'ID',
    lunchSalary: '午餐补助',
    name: '名称',
    trafficSalary: '交通补助'
  },
  job: {
    desc: '描述',
    id: 'ID',
    name: '名称',
    departmentId: '部门',
    accountId: '账套'
  },
  role: {
    desc: '描述',
    id: 'ID',
    name: '名称'
  },
  log: {
    id: 'ID',
    url: 'URL',
    method: '请求方法',
    ip: 'IP地址',
    code: '状态码',
    date: '时间'
  },
  notice: {
    id: 'ID',
    title: '标题',
    content: '内容',
    date: '日期',
    sign: '所属',
    admin: '管理员',
    status: '状态'
  },
  admin: {
    id: 'ID',
    name: '昵称',
    phone: '手机号',
    staffName: '名字',
    roleName: '权限',
    roleId: '权限',
    staffId: '员工'
  },
  award: {
    id: 'ID',
    staffName: '员工',
    awardRuleName: '原因',
    date: '日期',
    desc: '备注'
  },
  changeSalary: {
    id: 'ID',
    staffName: '员工',
    beforeSalary: '调薪前工资',
    afterSalary: '调薪后工资',
    reason: '原因',
    date: '日期',
    remark: '备注'
  },
  transfer: {
    id: 'ID',
    staffName: '员工',
    beforeDepartmentName: '调动前部门',
    afterDepartmentName: '调动后部门',
    beforeJobName: '调动前职位',
    afterJobName: '调动后职位',
    date: '日期',
    reason: '原因',
    remark: '备注'
  },
  apply: {
    id: 'ID',
    staffName: '员工',
    workStateName: '工作状态',
    state: '审核状态',
    reason: '原因',
    content: '申请内容',
    detail: '详情',
    opinion: '审核意见',
    adminName: '管理员',
    applyDate: '申请时间',
    verifyDate: '审核时间'
  },
  salary: {
    id: 'ID',
    staff: '员工',
    lunchSalary: '午餐补助',
    trafficSalary: '交通补助',
    basicSalary: '基本工资',
    awardSalary: '奖金',
    fineSalary: '罚金',
    totalSalary: '总工资',
    remark: '备注'
  }
}
