<template>
  <Container
    name="awardRule"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :table-row-class-name="tableRowClassName"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editAwardRule,
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
    <template #search>
      <el-select
        v-model="searchData.type"
        class="left-item"
        @change="getAwardRule"
        clearable>
        <el-option
          v-for="item in optionData"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import { AwardRuleTypeEnum } from '@/enums/awardRule'
import { formatEnumData } from '@/utils'
import { validateNumber } from '@/utils/validate'
const { awardRuleStore } = useStore()
const { awardRuleList, editAwardRule, page, pageSize, total, searchData } =
  storeToRefs(awardRuleStore)
// 获取数据
const getAwardRule = async () => {
  await awardRuleStore.getAwardRule()
}

// 初始化数据
const init = async () => {
  await getAwardRule()
}

// 渲染字段
const renderKeys = computed(() => {
  if (awardRuleList.value)
    if (awardRuleList.value?.length > 0)
      return Object.keys(awardRuleList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  awardRuleList.value?.forEach(awardRule => {
    tableData.push({
      id: awardRule.id,
      name: awardRule.name,
      type: AwardRuleTypeEnum[awardRule.type],
      score: awardRule.score,
      desc: awardRule.desc
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getAwardRule())
})
// option数据
const optionData = computed(() => formatEnumData(AwardRuleTypeEnum))

// dialog数据
const renderDialog: RenderDialogData[] = [
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
    key: 'score',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'type',
    component: 'ElSelect',
    optionData: optionData.value
  },
  {
    visible: true,
    disabled: false,
    key: 'desc',
    component: 'ElInput'
  }
]

// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
  ],
  score: [
    { required: true, message: '分数不能为空', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  desc: [{ max: 50, message: '描述不能超过50个字符', trigger: 'blur' }]
})
// 表单样式
const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: AwardRule
  rowIndex: number
}) => {
  // row.type 奖 惩
  if (row.type + '' === '奖') {
    return 'success-row'
  } else {
    return 'warning-row'
  }
}
// 分页器事件
const pageChange = (page: number) => {
  awardRuleStore.page = page
  getAwardRule()
}
const sizeChange = (pageSize: number) => {
  awardRuleStore.pageSize = pageSize
  getAwardRule()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getAwardRule()
}

// 添加事件
const insertHandler = (awardRule: CreateAwardRule) => {
  awardRuleStore.createAwardRule({
    ...awardRule,
    type: Number(awardRule.type),
    score: Number(awardRule.score)
  })
}

// 上传事件
const uploadHandler = (file: File) => {
  awardRuleStore.uploadAwardRule(file)
}

// 编辑按钮
const editHandler = (info: AwardRule) => {
  awardRuleStore.editAwardRule = { ...info }
}

// 修改事件
const updateHandler = (awardRule: Partial<AwardRule>) => {
  const { id, ...rest } = awardRule
  awardRuleStore.updateAwardRule(id!, {
    ...rest,
    type: Object.is(Number(rest.type), NaN)
      ? rest.type && Number(AwardRuleTypeEnum[rest.type])
      : Number(rest.type),
    score: Number(rest.score)
  })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? awardRuleStore.thoroughDeleteAwardRule(ids)
    : awardRuleStore.deleteAwardRule(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  awardRuleStore.restoreAwardRule(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
