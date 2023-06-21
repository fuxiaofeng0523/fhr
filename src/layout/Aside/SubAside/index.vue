<template>
  <template
    v-for="menu of props.item"
    :key="menu.path">
    <el-sub-menu
      v-if="menu.children"
      :index="menu.path">
      <template #title>
        <i class="Iicon">
          <EIcon
            class="icon"
            :icon="menu.meta?.icon"></EIcon>
        </i>
        <span>{{ $t(`${menu.meta?.title}`) }}</span>
      </template>
      <SubAside :item="menu.children" />
    </el-sub-menu>
    <el-menu-item
      v-else
      :index="menu.path">
      <i class="Iicon">
        <EIcon
          class="icon"
          :icon="menu.meta?.icon"></EIcon>
      </i>
      <template #title>
        <span>{{ $t(`${menu.meta?.title}`) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import SubAside from './index.vue'
const props = defineProps<{
  item: RouteRecordRaw[]
}>()
</script>

<style lang="less" scoped>
.Iicon {
  display: flex;
  align-items: center;
}

.icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}
</style>
