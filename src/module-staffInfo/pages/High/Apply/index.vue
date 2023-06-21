<template>
  <Container
    style="height: calc(100% - 55px)"
    name="apply"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool-buttons="[]"
    :operation-buttons="[]"
    :card="false"
    :selection="false"
    :operationWidth="'120px'"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }">
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
    <template #button>
      <el-button
        @click="changeShowDialog(ADD)"
        class="button">
        {{ $t('common.add') }}
      </el-button>
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
    <template #operation="{ row }">
      <el-button
        @click="changeShowDialog(DETAIL, row)"
        size="small"
        link
        type="primary">
        {{ $t('common.detail') }}
      </el-button>
      <el-button
        v-if="row.state === ApplyStateEnum['审核未通过'] && !row.reapply"
        @click="changeShowDialog(ADD, row, true)"
        size="small"
        link
        type="success">
        {{ $t('common.reapply') }}
      </el-button>
      <el-popconfirm
        v-if="row.state === ApplyStateEnum['审核中']"
        title="确定进行撤回？"
        @confirm="withdrawHandler(row)">
        <template #reference>
          <el-button
            size="small"
            link
            type="warning">
            {{ $t('common.withdraw') }}
          </el-button>
        </template>
      </el-popconfirm>
    </template>
    <template #show>
      <ApplyDialog ref="applyDialog" />
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import { selectApplyStateTagType } from '@/module-staff/utils'
import { ApplyStateEnum } from '@/enums/apply'
import Container from '@/components/Container/index.vue'
import ApplyDialog from '@/module-staffInfo/components/ApplyDialog.vue'
import { formatEnumData } from '@/utils'
import { DETAIL, ADD } from '@/utils/constant'
const { applyStore, workStateStore, appStore, staffInfoStore } = useStore()
const { page, pageSize, total, searchData, applyInfo } =
  storeToRefs(staffInfoStore)
// 获取数据
const getApply = async () => {
  await staffInfoStore.getApplyByStaffId(appStore.userInfo.id)
}

// 初始化数据
const init = async () => {
  await getApply()
  await workStateStore.getWorkStateOption()
}

// option数据
const optionData = computed(() => formatEnumData(ApplyStateEnum))

// 渲染字段
const renderKeys = computed(() => {
  if (applyInfo.value)
    if (applyInfo.value?.length > 0)
      return [
        'id',
        'staffName',
        'workStateName',
        'reason',
        'content',
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
  applyInfo.value?.forEach(apply => {
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
  staffInfoStore.page = page
  getApply()
}
const sizeChange = (pageSize: number) => {
  staffInfoStore.pageSize = pageSize
  getApply()
}

// 获取ApplyDialog组件
const applyDialog = ref<InstanceType<typeof ApplyDialog>>()
// 切换ApplyDialog组件显示与隐藏
const changeShowDialog = (
  type: string,
  apply?: Apply,
  reapply: boolean = false
) => {
  if (apply) {
    if (reapply) {
      applyStore.editApply = { ...apply }
      applyStore.editApply.state = ApplyStateEnum['审核中']
    } else {
      applyStore.editApply = { ...apply }
    }
  }
  applyDialog.value?.changeShowDialog(type, reapply)
}

// 撤回事件
const withdrawHandler = async (row: Apply) => {
  await applyStore.thoroughDeleteApply([row.id], false, '撤回成功')
  await staffInfoStore.getApplyByStaffId(appStore.userInfo.id)
}

// 初始化
init()
</script>

<style lang="less" scoped>
.el-select {
  width: 120px;
}
</style>
