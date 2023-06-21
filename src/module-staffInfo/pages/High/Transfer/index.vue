<template>
  <Container
    style="height: calc(100% - 55px)"
    name="transfer"
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
const { transferStore, staffInfoStore, appStore } = useStore()
const { transferInfo, page, pageSize, total } = storeToRefs(staffInfoStore)
// 获取数据
const getTransfer = async () => {
  await staffInfoStore.getTransferByStaffId(appStore.userInfo.id)
}

// 初始化数据
const init = async () => {
  initPagination(staffInfoStore)
  await getTransfer()
}

// 渲染字段
const renderKeys = computed(() => {
  if (transferInfo.value)
    if (transferInfo.value?.length > 0)
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
  transferInfo.value?.forEach(transfer => {
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

// 分页器事件
const pageChange = (page: number) => {
  staffInfoStore.page = page
  getTransfer()
}

const sizeChange = (pageSize: number) => {
  staffInfoStore.pageSize = pageSize
  getTransfer()
}

// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
