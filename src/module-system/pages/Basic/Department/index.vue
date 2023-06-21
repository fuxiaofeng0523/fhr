<template>
  <Container
    name="department"
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
      editData: editDepartment,
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
import { computed, watch, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
const { departmentStore } = useStore()
const { departmentList, editDepartment, page, pageSize, total, searchData } =
  storeToRefs(departmentStore)
// 获取数据
const getDepartment = async () => {
  await departmentStore.getDepartment()
}

// 初始化数据
const init = async () => {
  await getDepartment()
}

// 渲染字段
const renderKeys = computed(() => {
  if (departmentList.value)
    if (departmentList.value?.length > 0)
      return Object.keys(departmentList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  departmentList.value?.forEach(department => {
    tableData.push({
      id: department.id,
      name: department.name,
      desc: department.desc
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getDepartment())
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
    key: 'desc',
    component: 'ElInput'
  }
]

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
  departmentStore.page = page
  getDepartment()
}
const sizeChange = (pageSize: number) => {
  departmentStore.pageSize = pageSize
  getDepartment()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getDepartment()
}

// 添加事件
const insertHandler = (department: CreateDepartment) => {
  departmentStore.createDepartment(department)
}

// 上传事件
const uploadHandler = (file: File) => {
  departmentStore.uploadDepartment(file)
}

// 编辑按钮
const editHandler = (info: Department) => {
  departmentStore.editDepartment = { ...info }
}

// 修改事件
const updateHandler = (department: Partial<Department>) => {
  const { id, ...rest } = department
  departmentStore.updateDepartment(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? departmentStore.thoroughDeleteDepartment(ids)
    : departmentStore.deleteDepartment(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  departmentStore.restoreDepartment(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
