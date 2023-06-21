<template>
  <div class="outer">
    <Container
      name="role"
      ref="container"
      :table-data="tableData"
      :render-keys="renderKeys"
      :tool-buttons="['delete', 'restore', 'isDelete']"
      :pagination="{
        page,
        pageSize,
        total,
        pageChange,
        sizeChange
      }"
      :dialog="{
        editData: editRole,
        renderDialog,
        editabled: true,
        rules
      }"
      @edit="editHandler"
      @delete="deleteHandler"
      @insert="insertHandler"
      @update="updateHandler"
      @restore="restoreHandler"
      @change-isDelete="changeIsDeleteHandler">
      <template #operation="{ row }">
        <el-button
          @click="permissionHandler(row)"
          v-if="!searchData.isDelete"
          type="primary"
          size="small"
          link>
          权限
        </el-button>
      </template>
    </Container>
    <AuthDialog ref="authDialog" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import AuthDialog from '@/module-system/components/AuthDialog.vue'
const { roleStore, authStore } = useStore()
const { roleList, editRole, page, pageSize, total, searchData } =
  storeToRefs(roleStore)
// 获取数据
const getRole = async () => {
  await roleStore.getRole()
}

// 初始化数据
const init = async () => {
  await getRole()
  await authStore.getAuthMenuTree()
}

// 渲染字段
const renderKeys = computed(() => {
  if (roleList.value)
    if (roleList.value?.length > 0) return Object.keys(roleList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  roleList.value?.forEach(role => {
    tableData.push({
      id: role.id,
      name: role.name,
      desc: role.desc
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getRole())
})

// dialog数据
const renderDialog: ComputedRef<RenderDialogData[]> = computed(() => [
  {
    visible: false,
    disabled: true,
    key: 'id',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'name',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'desc',
    component: 'ElInput'
  }
])
// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
  ],
  desc: [{ max: 50, message: '描述不能超过50个字符', trigger: 'blur' }]
})

// 分页器事件
const pageChange = (page: number) => {
  roleStore.page = page
  getRole()
}
const sizeChange = (pageSize: number) => {
  roleStore.pageSize = pageSize
  getRole()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getRole()
}

// 添加事件
const insertHandler = (role: CreateRole) => {
  roleStore.createRole(role)
}

// 编辑按钮
const editHandler = (info: Role) => {
  roleStore.editRole = { ...info }
}

// 修改事件
const updateHandler = (role: Partial<Role>) => {
  const { id, ...rest } = role
  roleStore.updateRole(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  if (ids.includes(1)) {
    ElMessage.error('超级管理员不可删除！')
    return
  }
  searchData.value.isDelete
    ? roleStore.thoroughDeleteRole(ids)
    : roleStore.deleteRole(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  roleStore.restoreRole(ids)
}

// 权限事件
const permissionHandler = async (role: Role) => {
  roleStore.editRole = { ...role }
  await authStore.getAuthOne(role.id)
  changeAuthDialog()
}

// 获取AuthDialog组件实例
const authDialog = ref<InstanceType<typeof AuthDialog>>()
// 切换组件显示与隐藏
const changeAuthDialog = () => {
  authDialog.value?.changeShowDialog()
}
// 初始化
init()
</script>

<style lang="less" scoped>
.outer {
  width: 100%;
  height: 100%;
}
</style>
