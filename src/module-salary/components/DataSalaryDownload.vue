<template>
  <el-select
    clearable
    placeholder="年"
    v-model="salaryStore.downloadData.year">
    <el-option
      v-for="item in salaryStaStore.yearOption"
      :key="item.value"
      :value="item.value"
      :label="item.label" />
  </el-select>
  <el-select
    clearable
    placeholder="月"
    :disabled="!salaryStore.downloadData.year"
    v-model="salaryStore.downloadData.month">
    <el-option
      v-for="item in salaryStaStore.monthOption"
      :key="item.value"
      :value="item.value"
      :label="item.label" />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useStore from '@/store'
const { salaryStaStore, salaryStore } = useStore()
salaryStaStore.getSalaryYear()
// 监听年份变化，获取月份
watch(
  () => salaryStore.downloadData.year,
  async (newVal, oldVal) => {
    if (newVal) {
      await salaryStaStore.getSalaryMonth(+newVal)
    } else {
      salaryStore.downloadData.month = ''
    }
  }
)
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
  margin-right: 10px;
}
</style>
