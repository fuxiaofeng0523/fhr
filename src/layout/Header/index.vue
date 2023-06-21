<template>
  <div class="header">
    <div class="header-left">
      <!-- 侧边栏的展开折叠按钮 -->
      <el-tooltip
        :content="appStore.isCollapse ? '展开' : '折叠'"
        placement="bottom">
        <Icon
          @click="changeIsCollapse"
          :iconName="
            appStore.isCollapse ? 'icon-zhedie-zhankai' : 'icon-zhedie-shouqi'
          "
          className="icon"
          :color="color" />
      </el-tooltip>
      <span style="font-size: 1em">{{ $t('title') }}</span>
    </div>
    <div class="header-right">
      <!-- 全屏按钮 -->
      <el-tooltip
        :content="isFullscreen ? '退出全屏' : '全屏'"
        placement="bottom">
        <Icon
          @click="screenfullClick"
          :iconName="isFullscreen ? 'icon-tuichuquanping' : 'icon-quanping'"
          className="icon"
          :color="color" />
      </el-tooltip>
      <!-- 切换语言按钮 -->
      <el-tooltip
        :content="appStore.lang === 'zh' ? '英文' : '中文'"
        placement="bottom">
        <Icon
          @click="changeLang($i18n)"
          :iconName="
            appStore.lang === 'zh'
              ? 'icon-zhongyingwen2zhongwen'
              : 'icon-zhongyingwen'
          "
          className="icon"
          :color="color" />
      </el-tooltip>
      <!-- 切换主题 -->
      <el-tooltip
        :content="theme ? '日间模式' : '夜间模式'"
        placement="bottom">
        <Icon
          @click="changeTheme"
          :iconName="theme ? 'icon-yejianmoshi' : 'icon-rijianmoshi'"
          className="icon"
          :color="color" />
      </el-tooltip>
      <Avatar />
    </div>
  </div>
</template>

<script setup lang="ts">
import screenfull from 'screenfull'
import { ref, onMounted, onUnmounted } from 'vue'
import useStore from '@/store'
import { useToggle } from '@vueuse/shared'
import { useDark } from '@vueuse/core'
import Avatar from './Avatar/index.vue'
import { DARK_KEY } from '../utils/constant'
import { LANG } from '@/utils/constant'
import { storeToRefs } from 'pinia'
const props = defineProps({
  toggle: {
    type: Function,
    required: true
  }
})
const { appStore } = useStore()
const { theme } = storeToRefs(appStore)
// 切换主题色
const color = ref<string>(theme.value ? '#fff' : '#000')
const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: DARK_KEY,
  // 暗黑class名字
  valueDark: 'dark',
  // 高亮class名字
  valueLight: 'light'
})
const toggleDark = useToggle(isDark)
const changeTheme = () => {
  toggleDark()
  theme.value = !theme.value
  color.value = theme.value ? '#fff' : '#000'
}
// 切换侧边栏展开折叠
const changeIsCollapse = () => {
  appStore.isCollapse = !appStore.isCollapse
}
// 切换语言
const changeLang = (i18n: { locale: string }) => {
  appStore.lang === 'zh' ? (appStore.lang = 'en') : (appStore.lang = 'zh')
  i18n.locale = appStore.lang
  localStorage.setItem(LANG, appStore.lang)
  props.toggle!()
}
// 切换全屏
const isFullscreen = ref(false)
onMounted(() => {
  window.addEventListener('resize', currentScreen)
})
onUnmounted(() => {
  window.removeEventListener('resize', currentScreen)
})
// 浏览器改变触发
const currentScreen = () => {
  if (screenfull.isFullscreen !== isFullscreen.value)
    isFullscreen.value = screenfull.isFullscreen
}
//  点击切换全屏
const screenfullClick = () => {
  if (screenfull.isEnabled) screenfull.toggle()
}
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .header-left,
  .header-right {
    display: flex;
    align-items: center;
  }
  .icon {
    width: 2em;
    height: 2em;
    margin-right: 16px;
    cursor: pointer;
  }
}
</style>
