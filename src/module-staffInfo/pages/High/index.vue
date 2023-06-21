<template>
  <el-card>
    <el-tabs
      v-model="activeName"
      @tab-click="changeTab">
      <el-tab-pane
        v-for="item of high"
        :key="item.name"
        :label="$t(item.meta.title)"
        :name="item.name" />
    </el-tabs>
    <RouterView />
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
import routes from '../../router'
const route = useRoute()
const router = useRouter()
const high = ref(routes[0].children[1].children)

// 激活的选项
const activeName = ref(route.name)
watch(
  () => route.name,
  newVal => {
    activeName.value = newVal
  }
)
const changeTab = (pane: TabsPaneContext, ev: Event) => {
  router.push({ name: '' + pane.paneName! })
}
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
  :deep(.el-card__body) {
    height: calc(100% - 55px);
  }
}
</style>
