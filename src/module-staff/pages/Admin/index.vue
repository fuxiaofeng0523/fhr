<template>
  <Container
    name="admin"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editAdmin,
      renderDialog,
      editabled: true,
      rules
    }"
    @edit="editHandler"
    @delete="deleteHandler"
    @insert="insertHandler"
    @update="updateHandler"
    @restore="restoreHandler"
    @upload="uploadHandler"
    @change-isDelete="changeIsDeleteHandler">
    <template
      #other="{ formLabelWidth, visible, editable, dataForm, spanForm }">
      <el-form-item
        :label="$t('admin.staffId')"
        :label-width="formLabelWidth">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.staffName }}
        </span>
        <el-cascader
          v-else
          :props="props"
          v-model="dataForm.staffName"
          :show-all-levels="false"
          style="width: 180px" />
      </el-form-item>
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import type { CascaderProps } from 'element-plus'
import useStore from '@/store'
import { getDepartmentOptionApi } from '@/api/department'
import { geJobOptionApi } from '@/api/job'
import { getStaffOptionApi } from '@/api/staff'
import Container from '@/components/Container/index.vue'
import { getValueByOptionData } from '@/utils'

const { adminStore, roleStore } = useStore()
const { adminList, editAdmin, page, pageSize, total, searchData } =
  storeToRefs(adminStore)
// 获取数据
const getAdmin = async () => {
  await adminStore.getAdmin()
  await roleStore.getRoleOption()
}

// 初始化数据
const init = async () => {
  await getAdmin()
}
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level, value } = node
    let nodes
    if (level === 0) {
      const { data } = await getDepartmentOptionApi()
      nodes = data.data.map((item: any) => ({
        value: item.value,
        label: item.label,
        leaf: false
      }))
    } else if (level === 1) {
      const { data } = await geJobOptionApi(Number(value))
      nodes = data.data.map((item: any) => ({
        value: item.value,
        label: item.label,
        leaf: false
      }))
    } else if (level === 2) {
      const { data } = await getStaffOptionApi(Number(value))
      nodes = data.data.map((item: any) => ({
        value: item.value,
        label: item.label,
        leaf: true
      }))
    }
    resolve(nodes)
  }
}

// 渲染字段
const renderKeys = computed(() => {
  if (adminList.value)
    if (adminList.value?.length > 0)
      return ['id', 'name', 'phone', 'staffName', 'roleName']
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  adminList.value?.forEach(admin => {
    tableData.push({
      id: admin.id,
      name: admin.name,
      phone: admin.staff.phone,
      staffName: admin.staff.name,
      roleName: admin.role.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getAdmin())
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
    key: 'roleName',
    component: 'ElSelect',
    optionData: roleStore.roleOption
  }
])
// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { max: 5, message: '昵称不能超过5个字符', trigger: 'blur' }
  ],
  roleName: [{ required: true, message: '权限不能为空', trigger: 'change' }],
  staffName: [{ required: true, message: '员工不能为空', trigger: 'change' }]
})

// 分页器事件
const pageChange = (page: number) => {
  adminStore.page = page
  getAdmin()
}
const sizeChange = (pageSize: number) => {
  adminStore.pageSize = pageSize
  getAdmin()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getAdmin()
}

// 添加事件
const insertHandler = (admin: any) => {
  const { roleName, staffName, name } = admin
  const staffId = staffName[staffName.length - 1]
  adminStore.createAdmin({ roleId: roleName, staffId, name })
}

// 上传事件
const uploadHandler = (file: File) => {
  adminStore.uploadAdmin(file)
}

// 编辑按钮
const editHandler = (info: Admin) => {
  adminStore.editAdmin = { ...info }
}

// 修改事件
const updateHandler = (admin: any) => {
  const { id, roleName, staffName, name } = admin
  const roleId = getValueByOptionData(roleName, roleStore.roleOption!)
  const staffId = staffName[staffName.length - 1]
  adminStore.updateAdmin(id!, { roleId: roleId!, staffId, name })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? adminStore.thoroughDeleteAdmin(ids)
    : adminStore.deleteAdmin(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  adminStore.restoreAdmin(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
