<template>
  <Container
    name="apply"
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
    @edit="editHandler"
    @delete="deleteHandler"
    @insert="insertHandler"
    @update="updateHandler"
    @restore="restoreHandler"
    @upload="uploadHandler"
    @change-isDelete="changeIsDeleteHandler">
    <template #search>
      <el-select
        v-model="searchData.state"
        @change="getApply"
        clearable>
        <el-option
          v-for="item in optionData"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
    <template #table>
      <el-table-column
        key="state"
        prop="state"
        :label="$t('apply.state')">
        <template #default="scope">
          <el-tag :type="selectApplyStateTagType(scope.row.state)">
            {{ ApplyStateEnum[scope.row.state] }}
          </el-tag>
        </template>
      </el-table-column>
    </template>
    <template #show><ApplyDialog ref="applyDialog" /></template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import { selectApplyStateTagType } from '@/module-staff/utils'
import { ApplyStateEnum } from '@/enums/apply'
import { DETAIL } from '@/utils/constant'
import Container from '@/components/Container/index.vue'
import ApplyDialog from '@/module-staff/components/ApplyDialog.vue'
import { formatEnumData } from '@/utils'
const { applyStore } = useStore()
const { applyList, page, pageSize, total, searchData } = storeToRefs(applyStore)
// 获取数据
const getApply = async () => {
  await applyStore.getApply()
}

// 初始化数据
const init = async () => {
  await getApply()
}

// option数据
const optionData = computed(() => formatEnumData(ApplyStateEnum))

// 渲染字段
const renderKeys = computed(() => {
  if (applyList.value)
    if (applyList.value?.length > 0)
      return [
        'id',
        'staffName',
        'workStateName',
        'reason',
        'detail',
        'applyDate',
        'verifyDate',
        'adminName',
        'opinion'
      ]
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  applyList.value?.forEach(apply => {
    tableData.push({
      ...apply,
      staffName: apply.staff.name,
      adminName: apply.admin?.name,
      workStateName: apply.workState.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getApply())
})

// 分页器事件
const pageChange = (page: number) => {
  applyStore.page = page
  getApply()
}
const sizeChange = (pageSize: number) => {
  applyStore.pageSize = pageSize
  getApply()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getApply()
}

// 添加事件
const insertHandler = (apply: CreateApply) => {
  applyStore.createApply(apply)
}

// 上传事件
const uploadHandler = (file: File) => {
  applyStore.uploadApply(file)
}

// 编辑按钮
const editHandler = (info: Apply) => {
  applyStore.editApply = { ...info }
  changeShowDialog()
}

// 修改事件
const updateHandler = (apply: Partial<Apply>) => {
  const { id, ...rest } = apply
  applyStore.updateApply(id!, rest)
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? applyStore.thoroughDeleteApply(ids)
    : applyStore.deleteApply(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  applyStore.restoreApply(ids)
}

// 获取ApplyDialog组件
const applyDialog = ref<InstanceType<typeof ApplyDialog>>()
// 切换ApplyDialog组件显示与隐藏
const changeShowDialog = () => {
  applyDialog.value?.changeShowDialog(DETAIL)
}
// 初始化
init()
</script>

<style lang="less" scoped>
.el-select {
  width: 120px;
}
</style>
