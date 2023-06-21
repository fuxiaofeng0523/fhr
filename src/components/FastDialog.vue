<template>
  <el-dialog
    v-model="dialogFormVisible"
    style="height: 70vh; width: 60vw; margin: 12vh auto; overflow: hidden">
    <el-transfer
      v-model="value"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="搜索"
      :data="data" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { FASTDATA, FASTACTIVE } from '@/utils/constant'
interface Option {
  key: number
  label: string
  initial: string
}
const router = useRouter()
const { $t } = getCurrentInstance()!.appContext.config.globalProperties

const generateData = () => {
  const data: Option[] = []
  const states: string[] = []
  const initials: string[] = []
  const menuItems = ref<RouteRecordRaw[]>(router.options.routes[1].children!)
  const fn = (menuItems: RouteRecordRaw[]) => {
    menuItems.forEach(item => {
      if (item.name === 'home') return
      if (item.children) {
        fn(item.children)
      } else {
        states.push($t(`${item.meta!.title}`))
        initials.push(String(item.path))
      }
    })
  }
  fn(menuItems.value)
  states.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      initial: initials[index]
    })
  })
  return data
}

const data = ref<Option[]>(
  localStorage.getItem(FASTDATA)
    ? JSON.parse(localStorage.getItem(FASTDATA)!)
    : generateData()
)

const value = ref(
  localStorage.getItem(FASTACTIVE)
    ? JSON.parse(localStorage.getItem(FASTACTIVE)!)
    : []
)

// 搜索方法
const filterMethod = (query: any, item: any) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}

const dialogFormVisible = ref(false)
watch(dialogFormVisible, newVal => {
  if (!newVal) {
    localStorage.setItem(FASTDATA, JSON.stringify(data.value))
    localStorage.setItem(FASTACTIVE, JSON.stringify(value.value))
  }
})
const changeVisible = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}
defineExpose({
  dialogFormVisible,
  changeVisible
})
</script>

<style lang="less" scoped>
.el-transfer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  :deep(.el-transfer-panel__body) {
    height: 50vh !important;
  }
}
</style>
