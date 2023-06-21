<template>
  <Container
    style="height: calc(100% - 55px)"
    name="changeSalary"
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
const { changeSalaryStore, staffInfoStore, appStore } = useStore()
const { changeSalaryInfo, page, pageSize, total } = storeToRefs(staffInfoStore)
// 获取数据
const getChangeSalary = async () => {
  await staffInfoStore.getChangeSalaryByStaffId(appStore.userInfo.id)
}

// 初始化数据
const init = async () => {
  initPagination(staffInfoStore)
  await getChangeSalary()
}

// 渲染字段
const renderKeys = computed(() => {
  if (changeSalaryInfo.value)
    if (changeSalaryInfo.value?.length > 0)
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
  changeSalaryInfo.value?.forEach(changeSalary => {
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

// 分页器事件
const pageChange = (page: number) => {
  staffInfoStore.page = page
  getChangeSalary()
}

const sizeChange = (pageSize: number) => {
  staffInfoStore.pageSize = pageSize
  getChangeSalary()
}

// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
