<template>
  <Container
    style="height: calc(100% - 55px)"
    name="salary"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool="false"
    :card="false"
    :operation="false"
    :selection="false"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"></Container>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import { initPagination } from '@/utils'
import Container from '@/components/Container/index.vue'
const { salaryStore, staffInfoStore, appStore } = useStore()
const { salaryInfo, page, pageSize, total } = storeToRefs(staffInfoStore)
// 获取数据
const getSalary = async () => {
  await staffInfoStore.getSalaryByStaffId(appStore.userInfo.id)
}

// 初始化数据
const init = async () => {
  initPagination(staffInfoStore)
  await getSalary()
}

// 渲染字段
const renderKeys = computed(() => {
  if (salaryInfo.value)
    if (salaryInfo.value?.length > 0)
      return [
        'id',
        'staff',
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
  salaryInfo.value?.forEach(salary => {
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

// 分页器事件
const pageChange = (page: number) => {
  staffInfoStore.page = page
  getSalary()
}

const sizeChange = (pageSize: number) => {
  staffInfoStore.pageSize = pageSize
  getSalary()
}

// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
