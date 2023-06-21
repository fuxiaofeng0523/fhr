<template>
  <Container
    style="height: calc(100% - 55px)"
    name="award"
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
const { awardStore, awardRuleStore, staffInfoStore, appStore } = useStore()
const { awardInfo, page, pageSize, total } = storeToRefs(staffInfoStore)
// 获取数据
const getAward = async () => {
  await staffInfoStore.getAwardByStaffId(appStore.userInfo.id)
  await awardRuleStore.getAwardRuleOption()
}

// 初始化数据
const init = async () => {
  initPagination(staffInfoStore)
  await getAward()
}

// 渲染字段
const renderKeys = computed(() => {
  if (awardInfo.value)
    if (awardInfo.value?.length > 0)
      return ['id', 'staffName', 'awardRuleName', 'date', 'desc']
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  awardInfo.value?.forEach(award => {
    tableData.push({
      id: award.id,
      date: award.date,
      desc: award.desc,
      staffName: award.staff.name,
      awardRuleName: award.awardRule.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getAward())
})

// 分页器事件
const pageChange = (page: number) => {
  staffInfoStore.page = page
  getAward()
}

const sizeChange = (pageSize: number) => {
  staffInfoStore.pageSize = pageSize
  getAward()
}

// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
