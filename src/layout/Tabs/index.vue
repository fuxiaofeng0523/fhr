<template>
  <div class="tabs-outer">
    <div class="nav">
      <Icon
        :class="iconBan === -1 || iconBan === 2 ? 'ban' : ''"
        @click="pageHandler(-1)"
        iconName="icon-jiantou_shangyiye"
        className="icon" />
      <Icon
        :class="iconBan === 1 || iconBan === 2 ? 'ban' : ''"
        @click="pageHandler(1)"
        iconName="icon-jiantou_xiayiye"
        className="icon" />
      <Icon
        @click="pageHandler(0)"
        iconName="icon-shuaxin"
        className="icon" />
    </div>
    <el-tabs
      class="home"
      v-model="editableTabsValue"
      type="card"
      @tab-change="changeTab">
      <el-tab-pane
        :closable="false"
        :key="'/home'"
        :label="$t(`menu.common.home`)"
        :name="'/home'"></el-tab-pane>
    </el-tabs>
    <el-tabs
      class="other"
      v-model="editableTabsValue"
      type="card"
      @tab-remove="removeTab"
      @tab-change="changeTab">
      >
      <el-tab-pane
        v-for="item in editableTabs"
        closable
        :key="item.name"
        :name="item.name">
        <!-- 右键菜单开始：自定义标签页显示名称，保证每个标签页都能实现右键菜单 -->
        <template #label>
          <el-dropdown
            trigger="contextmenu"
            :id="item.name"
            @visible-change="handleChange($event, item.name)"
            ref="dropdownRef">
            <span :class="editableTabsValue === item.name ? 'label' : ''">
              {{ $t(`menu.${item.title}`) }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="removeTab(item.name)">
                  <el-icon><Close /></el-icon>
                  关闭当前标签页
                </el-dropdown-item>
                <el-dropdown-item
                  @click="removeTab(item.name, 'left')"
                  v-if="show(item.name, 'left')">
                  <el-icon><DArrowLeft /></el-icon>
                  关闭左侧标签页
                </el-dropdown-item>
                <el-dropdown-item
                  @click="removeTab(item.name, 'right')"
                  v-if="show(item.name, 'right')">
                  <el-icon><DArrowRight /></el-icon>
                  关闭右侧标签页
                </el-dropdown-item>
                <el-dropdown-item
                  @click="removeTab(item.name, 'other')"
                  v-if="editableTabs.length > 1">
                  <el-icon><Operation /></el-icon>
                  关闭其他标签页
                </el-dropdown-item>
                <el-dropdown-item @click="removeTab(item.name, 'all')">
                  <el-icon><Minus /></el-icon>
                  关闭全部标签页
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <!-- 右键菜单结束 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Close,
  DArrowLeft,
  DArrowRight,
  Operation,
  Minus
} from '@element-plus/icons-vue'
import { TABS_VALUE, TAB_VALUE } from '../utils/constant'
interface EditableTab {
  title: string
  name: string
  path: string
}
const router = useRouter()
const route = useRoute()

const iconBan = ref<number>(0)
const checkHistory = () => {
  if (window.history.length === 1) {
    iconBan.value = 2
  } else if (window.history.state.position === 0) {
    iconBan.value = -1
  } else if (window.history.state.position === window.history.length - 1) {
    iconBan.value = 1
  } else {
    iconBan.value = 0
  }
}
checkHistory()
watch(
  () => route.name,
  () => {
    checkHistory()
  }
)
const pageHandler = (key: number) => {
  // window.history.state.position 获取到的是没有跳转时的历史记录的位置，不能直接使用
  /*
    判断：key
      - 如果是-1 ===> 回退 ===> 跳转后位置 = window.history.state.position - 1

      - 如果是1  ===> 前进 ===> 跳转后位置 = window.history.state.position + 1
  */
  // 后退
  if (iconBan.value === key && key !== 0 && key !== 2) {
  } else if (key === -1) {
    if (window.history.state.position - 1 === 0) {
      iconBan.value = -1
      router.go(key)
    } else {
      iconBan.value = 0
      router.go(key)
    }
  } else if (key === 1) {
    // 前进
    if (window.history.state.position + 1 === window.history.length - 1) {
      iconBan.value = 1
      router.go(key)
    } else {
      iconBan.value = 0
      router.go(key)
    }
  } else {
    // 刷新
    router.go(key)
  }
}

const editableTabsValue = ref<string>(localStorage.getItem(TAB_VALUE) || '')
const editableTabs = ref<EditableTab[]>(
  JSON.parse(localStorage.getItem(TABS_VALUE) || '[]')
)
const show = (name: string, type: string) => {
  const index = editableTabs.value.findIndex(item => name === item.name)
  return type === 'left' ? index !== 0 : index !== editableTabs.value.length - 1
}
const changeTab = (name: string) => {
  router.push(name)
}
const addTab = (targetName: string) => {
  const title = targetName.split('/').join('.').slice(1)
  const path = targetName.split('/').at(-1)
  editableTabs.value.push({
    path: path!,
    name: targetName,
    title: title
  })
  editableTabsValue.value = targetName
}
const removeTab = (targetName: string, type?: string) => {
  const index = editableTabs.value.findIndex(item => item.name === targetName) //查找触发右键菜单所在标签页index
  const currentIndex = editableTabs.value.findIndex(
    item => item.name === editableTabsValue.value
  ) //查找当前激活标签页index，存在当前激活标签页与触发右键菜单标签页不是同一个的情况
  switch (type) {
    case 'all': //关闭全部标签页
      editableTabs.value = [] //清空除【首页】外所有标签页
      editableTabsValue.value = '/home' //修改标签激活页
      break
    case 'other': //关闭其他标签页
      editableTabs.value = [editableTabs.value[index]]
      if (targetName !== editableTabsValue.value) {
        editableTabsValue.value = targetName
      }
      break
    case 'left': //关闭左侧标签页
      editableTabs.value.splice(0, index)
      if (currentIndex < index) {
        editableTabsValue.value = targetName
      }
      break
    case 'right': //关闭右侧标签页
      editableTabs.value.splice(index + 1)
      if (currentIndex > index) {
        editableTabsValue.value = targetName
      }
      break
    default: //默认关闭当前标签页
      editableTabs.value.splice(index, 1)
      //当前激活标签页与触发右键菜单标签页是同一页
      if (targetName === editableTabsValue.value) {
        //当前激活标签页是标签页数组的第一个，则将激活标签页设置为 home
        //当前激活标签页不是标签页数组的第一个，则将激活标签页设置为当前激活标签页的前一页
        editableTabsValue.value =
          index === 0 ? '/home' : editableTabs.value[index - 1].name
      }
      break
  }
}
const dropdownRef = ref()
const handleChange = (visible: boolean, name: string) => {
  if (!visible) return
  dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
    if (item.id === name) return
    item.handleClose()
  })
}

const checkEditableTabs = (newTagsName: string) => {
  for (let index = 0; index < editableTabs.value.length; index++) {
    const element = editableTabs.value[index]
    if (element.name === newTagsName) return true
  }
  return false
}
watch(
  () => route.path,
  (newVal, oldVal) => {
    editableTabsValue.value = newVal
    localStorage.setItem(TAB_VALUE, editableTabsValue.value)
    newVal !== '/home' && !checkEditableTabs(newVal) && addTab(newVal)
  },
  { immediate: true }
)
watch(
  () => editableTabs.value.length,
  () => {
    localStorage.setItem(TABS_VALUE, JSON.stringify(editableTabs.value))
  }
)
</script>
<style lang="less" scoped>
.tabs-outer {
  display: flex;
  width: 100%;
  .nav {
    display: flex;
    align-items: center;
    height: 40px;
    .ban {
      cursor: default !important;
      color: var(--ff-icon-disabled);
      &:hover {
        color: var(--ff-icon-disabled) !important;
      }
    }
    .icon {
      &:first-child {
        margin-left: 8px;
      }
      cursor: pointer;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .home {
    width: 85px;
    :deep(.el-tabs__item) {
      width: 85px;
      text-align: center;
    }
  }
  .other {
    width: calc(100% - 85px - 92px);
  }
}
.label {
  color: var(--el-color-primary); //激活标签页高亮
}

:deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none !important;
}
:deep(.el-tabs__item) {
  border-bottom: none !important;
  &:first-child {
    border-left: 1px solid var(--el-border-color-light) !important;
    transition: color var(--el-transition-duration)
        var(--el-transition-function-ease-in-out-bezier),
      padding var(--el-transition-duration)
        var(--el-transition-function-ease-in-out-bezier);
  }
  &:hover {
    span {
      color: var(--el-color-primary); //鼠标移到标签页高亮
    }
  }
  .el-dropdown {
    line-height: inherit; // 统一标签页显示名称行高
  }
}

.el-tabs {
  height: 40px;
}
:deep(.el-tabs__nav) {
  border: none !important;
}
:deep(.el-tabs__content) {
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
