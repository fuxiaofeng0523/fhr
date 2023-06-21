<template>
  <el-dialog
    v-model="dialogVisible"
    title="分配权限">
    <el-tree
      v-if="dialogVisible"
      ref="treeRef"
      :data="menuTree"
      :props="defaultProps"
      default-expand-all
      :default-checked-keys="defaultKeys"
      show-checkbox
      node-key="id" />
    <template #footer>
      <el-button @click="cancelHandler">
        {{ $t('common.close') }}
      </el-button>
      <el-button
        type="primary"
        @click="confirmHandler">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import { ElTree } from 'element-plus'
const { authStore, roleStore } = useStore()
const { editAuth, menuTree } = storeToRefs(authStore)
const { editRole } = storeToRefs(roleStore)

const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultKeys = computed(() => editAuth.value?.menuId.split(','))
const init = async () => {
  await authStore.getAuthMenuTree()
}
init()

const defaultProps = {
  children: 'children',
  label: 'label'
}

const cancelHandler = () => {
  changeShowDialog()
}
const confirmHandler = async () => {
  const key = (treeRef.value!.getCheckedKeys() as number[]).join(',')
  if (editAuth.value) {
    await authStore.updateAuth(editAuth.value.id, {
      menuId: key
    })
    window.history.go(0)
  } else {
    authStore.createAuth({
      roleId: editRole.value!.id,
      menuId: key
    })
  }

  changeShowDialog()
}
// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
const changeShowDialog = () => {
  dialogVisible.value = !dialogVisible.value
}

defineExpose({
  changeShowDialog
})
</script>

<style lang="less" scoped></style>
