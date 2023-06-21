<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    :collapse="appStore.isCollapse"
    :unique-opened="true"
    router>
    <SubAside :item="menuItems" />
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
import useStore from '@/store'
import SubAside from './SubAside/index.vue'
const router = useRouter()
const route = useRoute()
const { appStore } = useStore()

const menuItems = ref<RouteRecordRaw[]>(router.options.routes[1].children!)
// 默认激活的菜单
const defaultActive = ref<string>(route.path)
// 监听路由的变化动态赋值给菜单默认值
watch(
  () => route.path,
  (newVal, oldVal) => {
    defaultActive.value = newVal
  }
)
</script>

<style>
.el-menu {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
