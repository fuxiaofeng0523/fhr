<template>
  <Container
    name="transfer"
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
      editData: editTransfer,
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
import { test } from 'node:test'
const { transferStore } = useStore()
const { transferList, editTransfer, page, pageSize, total, searchData } =
  storeToRefs(transferStore)
// 获取数据
const getTransfer = async () => {
  await transferStore.getTransfer()
}

// 初始化数据
const init = async () => {
  await getTransfer()
}

// 渲染字段
const renderKeys = computed(() => {
  if (transferList.value)
    if (transferList.value?.length > 0)
      return [
        'id',
        'staffName',
        'beforeDepartmentName',
        'afterDepartmentName',
        'beforeJobName',
        'afterJobName',
        'date',
        'reason',
        'remark'
      ]
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  transferList.value?.forEach(transfer => {
    const {
      staff,
      afterDepartment,
      beforeDepartment,
      beforeJob,
      afterJob,
      ...rest
    } = transfer
    tableData.push({
      ...rest,
      id: transfer.id,
      staffName: staff.name,
      beforeDepartmentName: beforeDepartment.name,
      afterDepartmentName: afterDepartment.name,
      beforeJobName: beforeJob.name,
      afterJobName: afterJob.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getTransfer())
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
    key: 'beforeDepartmentName',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'afterDepartmentName',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'beforeJobName',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'afterJobName',
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
  transferStore.page = page
  getTransfer()
}
const sizeChange = (pageSize: number) => {
  transferStore.pageSize = pageSize
  getTransfer()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getTransfer()
}

// 添加事件
const insertHandler = (transfer: CreateTransfer) => {
  transferStore.createTransfer(transfer)
}

// 上传事件
const uploadHandler = (file: File) => {
  transferStore.uploadTransfer(file)
}

// 编辑按钮
const editHandler = (info: Transfer) => {
  transferStore.editTransfer = { ...info }
}

// 修改事件
const updateHandler = (transfer: any) => {
  const {
    id,
    staffName,
    beforeDepartmentName,
    afterDepartmentName,
    beforeJobName,
    afterJobName,
    date,
    ...rest
  } = transfer
  transferStore.updateTransfer(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? transferStore.thoroughDeleteTransfer(ids)
    : transferStore.deleteTransfer(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  transferStore.restoreTransfer(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
