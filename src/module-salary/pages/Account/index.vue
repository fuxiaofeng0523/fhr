<template>
  <Container
    name="account"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editAccount,
      renderDialog,
      editabled: true,
      rules
    }"
    @edit="editHandler"
    @delete="deleteHandler"
    @insert="insertHandler"
    @update="updateHandler"
    @restore="restoreHandler"
    @upload="uploadHandler"
    @change-isDelete="changeIsDeleteHandler"></Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import { validateNumber } from '@/utils/validate'
const { accountStore } = useStore()
const { accountList, editAccount, page, pageSize, total, searchData } =
  storeToRefs(accountStore)
// 获取数据
const getAccount = async () => {
  await accountStore.getAccount()
}

// 初始化数据
const init = async () => {
  await getAccount()
}

// Container实例
const container = ref<InstanceType<typeof Container>>()

// 监听dataForm变化,计算总工资
watchEffect(() => {
  if (container.value) {
    if (container.value.dialog) {
      const { basisSalary, lunchSalary, trafficSalary, allSalary } =
        container.value.dialog.dataForm
      container.value.dialog.dataForm.allSalary =
        Number(basisSalary) + Number(lunchSalary) + Number(trafficSalary)
    }
  }
})

// 渲染字段
const renderKeys = computed(() => {
  if (accountList.value)
    if (accountList.value?.length > 0) return Object.keys(accountList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  accountList.value?.forEach(account => {
    tableData.push(account)
  })
  return tableData
})

// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getAccount())
})

// dialog数据
const renderDialog: RenderDialogData[] = [
  {
    visible: false,
    disabled: true,
    key: 'id',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'name',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'basisSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'lunchSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'trafficSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'allSalary',
    component: 'ElInput'
  }
]

// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
  ],
  basisSalary: [
    { required: true, message: '基本工资不能为空', trigger: 'blur' },
    { validator: validateNumber, message: '请输入数字', trigger: 'blur' }
  ],
  lunchSalary: [
    { required: true, message: '午餐补助不能为空', trigger: 'blur' },
    { validator: validateNumber, message: '请输入数字', trigger: 'blur' }
  ],
  trafficSalary: [
    { required: true, message: '交通补助不能为空', trigger: 'blur' },
    { validator: validateNumber, message: '请输入数字', trigger: 'blur' }
  ],
  allSalary: [
    { required: true, message: '总工资不能为空', trigger: 'blur' },
    { validator: validateNumber, message: '请输入数字', trigger: 'blur' }
  ]
})

// 分页器事件
const pageChange = (page: number) => {
  accountStore.page = page
  getAccount()
}
const sizeChange = (pageSize: number) => {
  accountStore.pageSize = pageSize
  getAccount()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getAccount()
}

// 添加事件
const insertHandler = (account: CreateAccount) => {
  accountStore.createAccount({
    ...account,
    basisSalary: Number(account.basisSalary),
    lunchSalary: Number(account.lunchSalary),
    trafficSalary: Number(account.trafficSalary)
  })
}

// 上传事件
const uploadHandler = (file: File) => {
  accountStore.uploadAccount(file)
}

// 编辑按钮
const editHandler = (info: Account) => {
  accountStore.editAccount = { ...info }
}

// 修改事件
const updateHandler = (account: Partial<Account>) => {
  const { id, ...rest } = account
  accountStore.updateAccount(id!, {
    ...rest,
    basisSalary: Number(account.basisSalary),
    lunchSalary: Number(account.lunchSalary),
    trafficSalary: Number(account.trafficSalary)
  })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? accountStore.thoroughDeleteAccount(ids)
    : accountStore.deleteAccount(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  accountStore.restoreAccount(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
