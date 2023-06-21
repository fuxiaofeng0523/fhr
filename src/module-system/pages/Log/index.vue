<template>
  <Container
    name="log"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool-buttons="['delete', 'restore', 'isDelete']"
    :operation-buttons="['delete', 'restore']"
    :table-row-class-name="tableRowClassName"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    @delete="deleteHandler"
    @restore="restoreHandler"
    @change-isDelete="changeIsDeleteHandler"></Container>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
const { logStore } = useStore()
const { logList, page, pageSize, total, searchData } = storeToRefs(logStore)
// 获取数据
const getLog = async () => {
  await logStore.getLog()
}

// 初始化数据
const init = async () => {
  await getLog()
}

// 渲染字段
const renderKeys = computed(() => {
  if (logList.value)
    if (logList.value?.length > 0) return Object.keys(logList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  logList.value?.forEach(log => {
    tableData.push({
      id: log.id,
      url: log.url,
      method: log.method,
      ip: log.ip,
      code: log.code,
      date: log.date
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getLog())
})

// 表格样式
const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: Log
  rowIndex: number
}) => {
  const type = (row.code + '').slice(0, 1)
  // row.type 奖 惩
  if (type === '2') {
    return 'success-row'
  } else if (type === '4') {
    return 'warning-row'
  } else if (type === '5') {
    return 'danger-row'
  }
}
// 分页器事件
const pageChange = (page: number) => {
  logStore.page = page
  getLog()
}
const sizeChange = (pageSize: number) => {
  logStore.pageSize = pageSize
  getLog()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getLog()
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? logStore.thoroughDeleteLog(ids)
    : logStore.deleteLog(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  logStore.restoreLog(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
