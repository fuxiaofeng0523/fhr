<template>
  <Container
    name="workState"
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
      editData: editWorkState,
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
const { workStateStore } = useStore()
const { workStateList, editWorkState, page, pageSize, total, searchData } =
  storeToRefs(workStateStore)
// 获取数据
const getWorkState = async () => {
  await workStateStore.getWorkState()
}

// 初始化数据
const init = async () => {
  await getWorkState()
}

// 渲染字段
const renderKeys = computed(() => {
  if (workStateList.value)
    if (workStateList.value?.length > 0)
      return Object.keys(workStateList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  workStateList.value?.forEach(workState => {
    tableData.push({
      id: workState.id,
      name: workState.name,
      desc: workState.desc
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getWorkState())
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
    disabled: false,
    key: 'name',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'desc',
    component: 'ElInput'
  }
])
// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
  ],
  desc: [{ max: 50, message: '描述不能超过50个字符', trigger: 'blur' }]
})

// 分页器事件
const pageChange = (page: number) => {
  workStateStore.page = page
  getWorkState()
}
const sizeChange = (pageSize: number) => {
  workStateStore.pageSize = pageSize
  getWorkState()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getWorkState()
}

// 添加事件
const insertHandler = (workState: CreateWorkState) => {
  workStateStore.createWorkState(workState)
}

// 上传事件
const uploadHandler = (file: File) => {
  workStateStore.uploadWorkState(file)
}

// 编辑按钮
const editHandler = (info: WorkState) => {
  workStateStore.editWorkState = { ...info }
}

// 修改事件
const updateHandler = (workState: Partial<WorkState>) => {
  const { id, ...rest } = workState
  workStateStore.updateWorkState(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? workStateStore.thoroughDeleteWorkState(ids)
    : workStateStore.deleteWorkState(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  workStateStore.restoreWorkState(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
