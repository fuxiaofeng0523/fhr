<template>
  <div class="common-layout">
    <el-config-provider :locale="locale">
      <el-container>
        <el-aside width="auto">
          <el-scrollbar height="100vh">
            <Aside />
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-header>
            <Header :toggle="toggle" />
          </el-header>
          <el-card>
            <Tabs />
          </el-card>
          <el-main>
            <Main />
          </el-main>
        </el-container>
      </el-container>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import Aside from './Aside/index.vue'
import Header from './Header/index.vue'
import Main from './Main/index.vue'
import Tabs from './Tabs/index.vue'
import useStore from '@/store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
const { appStore } = useStore()
const { userInfo } = storeToRefs(appStore)
// elementplus内部的语言切换
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}
</script>

<style lang="less" scoped>
.common-layout {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      > .el-scrollbar {
        :deep(.el-scrollbar__view) {
          height: 100%;
        }
      }
    }
    .el-header {
      padding-left: 16px;
    }
    > .el-card {
      padding: 0;
      min-height: 40px;
      display: flex;
      align-items: center;
      border-radius: 0;
      border: none;
      border-top: 1px #dcdfe6 solid;
      box-shadow: 0px 0.6px 1.4px rgba(0, 0, 0, 0.046),
        0px 5px 10px rgba(0, 0, 0, 0.09);
      :deep(.el-card__body) {
        padding: 0;
        overflow: hidden;
      }
    }
    .el-main {
      padding: 16px;
      overflow: hidden;
    }
  }
}
</style>
