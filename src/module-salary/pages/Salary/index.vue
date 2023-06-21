<template>
  <Container
    name="salary"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool-buttons="['delete', 'restore', 'isDelete']"
    :operation-buttons="['delete']"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editSalary,
      renderDialog,
      editabled: true,
      rules
    }"
    @delete="deleteHandler"
    @restore="restoreHandler"
    @change-isDelete="changeIsDeleteHandler">
    <template #button>
      <el-button
        style="margin-left: 12px"
        type="primary"
        @click="createSalaryAllHandler">
        生成本月工资信息
      </el-button>
      <el-button
        @click="downloadHandler"
        type="success">
        下载工资表
      </el-button>
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef, ref, h } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules, ElMessageBox, ElMessage, ElDatePicker } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import DataSalaryDownload from '@/module-salary/components/DataSalaryDownload.vue'
const { salaryStore } = useStore()
const { salaryList, editSalary, page, pageSize, total, searchData } =
  storeToRefs(salaryStore)
// 获取数据
const getSalary = async () => {
  await salaryStore.getSalary()
}

// 初始化数据
const init = async () => {
  await getSalary()
}

// 渲染字段
const renderKeys = computed(() => {
  if (salaryList.value)
    if (salaryList.value?.length > 0)
      return [
        'id',
        'staff',
        'lunchSalary',
        'trafficSalary',
        'basicSalary',
        'awardSalary',
        'fineSalary',
        'totalSalary',
        'remark'
      ]
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  salaryList.value?.forEach(salary => {
    tableData.push({ ...salary, staff: salary.staff.name })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getSalary())
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
  salaryStore.page = page
  getSalary()
}
const sizeChange = (pageSize: number) => {
  salaryStore.pageSize = pageSize
  getSalary()
}
// 生成事件
const createSalaryAllHandler = () => {
  salaryStore.createSalaryAll()
}

// 下载事件
const downloadHandler = () => {
  ElMessageBox({
    title: '选择日期',
    message: () => h(DataSalaryDownload),
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        const { year, month } = salaryStore.downloadData
        if (!year || !month) return ElMessage.error('请选择日期')
        else
          salaryStore.downloadSalary(
            salaryStore.downloadData.year,
            String(Number(salaryStore.downloadData.month))
          )
      }
      salaryStore.downloadData.year = ''
      salaryStore.downloadData.month = ''
      done() // 关闭对话框
    }
  })
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getSalary()
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? salaryStore.thoroughDeleteSalary(ids)
    : salaryStore.deleteSalary(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  salaryStore.restoreSalary(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
