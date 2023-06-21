<template>
  <Container
    name="award"
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
      editData: editAward,
      renderDialog,
      editabled: true,
      rules
    }"
    @edit="editHandler"
    @delete="deleteHandler"
    @update="updateHandler"
    @restore="restoreHandler"
    @change-isDelete="changeIsDeleteHandler"></Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import { getValueByOptionData } from '@/utils'
const { awardStore, awardRuleStore } = useStore()
const { awardList, editAward, page, pageSize, total, searchData } =
  storeToRefs(awardStore)
// 获取数据
const getAward = async () => {
  await awardStore.getAward()
  await awardRuleStore.getAwardRuleOption()
}

// 初始化数据
const init = async () => {
  await getAward()
}

// 渲染字段
const renderKeys = computed(() => {
  if (awardList.value)
    if (awardList.value?.length > 0)
      return ['id', 'staffName', 'awardRuleName', 'date', 'desc']
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  awardList.value?.forEach(award => {
    tableData.push({
      id: award.id,
      date: award.date,
      desc: award.desc,
      staffName: award.staff.name,
      awardRuleName: award.awardRule.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getAward())
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
    disabled: true,
    key: 'staffName',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'awardRuleName',
    component: 'ElSelect',
    optionData: awardRuleStore.awardRuleOption
  },
  {
    visible: true,
    disabled: false,
    key: 'date',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
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
  awardRuleName: [
    { required: true, message: '原因不能为空', trigger: 'change' }
  ],
  desc: [{ max: 50, message: '描述不能超过50个字符', trigger: 'blur' }]
})

// 分页器事件
const pageChange = (page: number) => {
  awardStore.page = page
  getAward()
}

const sizeChange = (pageSize: number) => {
  awardStore.pageSize = pageSize
  getAward()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getAward()
}

// 编辑按钮
const editHandler = (info: Award) => {
  awardStore.editAward = { ...info }
}

// 修改事件
const updateHandler = (award: any) => {
  const { id, staffName, awardRuleName, ...rest } = award
  let awardRuleId = awardRuleName
  const value = getValueByOptionData(
    awardRuleName,
    awardRuleStore.awardRuleOption!
  )
  value ? (awardRuleId = value) : (awardRuleId = awardRuleName)
  awardStore.updateAward(id!, { ...rest, awardRuleId })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? awardStore.thoroughDeleteAward(ids)
    : awardStore.deleteAward(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  awardStore.restoreAward(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped>
:deep(.el-date-editor) {
  width: 180px;
}
</style>
