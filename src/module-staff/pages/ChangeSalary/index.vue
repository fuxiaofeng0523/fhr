<template>
  <Container
    name="changeSalary"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool-buttons="['delete', 'restore', 'isDelete']"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editChangeSalary,
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
import { computed, watch, reactive, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
const { changeSalaryStore } = useStore()
const {
  changeSalaryList,
  editChangeSalary,
  page,
  pageSize,
  total,
  searchData
} = storeToRefs(changeSalaryStore)
// 获取数据
const getChangeSalary = async () => {
  await changeSalaryStore.getChangeSalary()
}

// 初始化数据
const init = async () => {
  await getChangeSalary()
}

// 渲染字段
const renderKeys = computed(() => {
  if (changeSalaryList.value)
    if (changeSalaryList.value?.length > 0)
      return [
        'id',
        'staffName',
        'beforeSalary',
        'afterSalary',
        'reason',
        'date',
        'remark'
      ]
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  changeSalaryList.value?.forEach(changeSalary => {
    const { staff, ...rest } = changeSalary
    tableData.push({
      staffName: staff.name,
      ...rest
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getChangeSalary())
})

// dialog数据
const renderDialog: ComputedRef<RenderDialogData[]> = computed(() => [
  {
    visible: false,
    disabled: true,
    key: 'id',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'staffName',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'beforeSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'afterSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'reason',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'date',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    visible: true,
    disabled: false,
    key: 'remark',
    component: 'ElInput'
  }
])
// 表单验证
const rules = reactive<FormRules>({
  reason: [
    { required: true, message: '原因不能为空', trigger: 'blur' },
    { max: 100, message: '名称不能超过100个字符', trigger: 'blur' }
  ],
  remark: [{ max: 200, message: '备注不能超过200个字符', trigger: 'blur' }]
})

// 分页器事件
const pageChange = (page: number) => {
  changeSalaryStore.page = page
  getChangeSalary()
}
const sizeChange = (pageSize: number) => {
  changeSalaryStore.pageSize = pageSize
  getChangeSalary()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getChangeSalary()
}

// 添加事件
const insertHandler = (changeSalary: CreateChangeSalary) => {
  changeSalaryStore.createChangeSalary(changeSalary)
}

// 上传事件
const uploadHandler = (file: File) => {
  changeSalaryStore.uploadChangeSalary(file)
}

// 编辑按钮
const editHandler = (info: ChangeSalary) => {
  changeSalaryStore.editChangeSalary = { ...info }
}

// 修改事件
const updateHandler = (changeSalary: any) => {
  const { id, staffName, beforeSalary, afterSalary, ...rest } = changeSalary
  changeSalaryStore.updateChangeSalary(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? changeSalaryStore.thoroughDeleteChangeSalary(ids)
    : changeSalaryStore.deleteChangeSalary(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  changeSalaryStore.restoreChangeSalary(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
