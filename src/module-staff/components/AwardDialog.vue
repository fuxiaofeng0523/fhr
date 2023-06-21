<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加奖惩">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :inline="true"
      :model="awardForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <!-- 人员 -->
      <el-form-item
        :label="$t('staff.name')"
        prop="name">
        <el-input
          v-model="awardForm.name"
          :disabled="true" />
      </el-form-item>
      <!-- 奖惩规则 -->
      <el-form-item
        :label="$t('award.awardRuleName')"
        prop="awardRuleId">
        <el-select
          v-model="awardForm.awardRuleId"
          clearable
          placeholder="Select">
          <el-option
            v-for="award in awardRuleStore.awardRuleOption"
            :key="award.value"
            :label="award.label"
            :value="award.value" />
        </el-select>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('award.desc')">
        <el-input
          v-model="awardForm.desc"
          clearable
          :rows="2"
          type="textarea"
          autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandler">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="confirmHandler(ruleFormRef)">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import useStore from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { initData } from '@/utils'
const { awardRuleStore, awardStore } = useStore()
awardRuleStore.getAwardRuleOption()
// 表单数据
const defalutAward = {
  staffId: null,
  name: null,
  awardRuleId: null,
  desc: null
}
const awardForm = ref({ ...(defalutAward as any) })

// 监听员工id，获取信息
watch(
  () => awardForm.value.personnelId,
  (newVal: number | object) => {
    if (typeof newVal === 'object') {
      if (newVal) {
        awardForm.value.personnelId = (newVal as any)[2]
      }
    }
  }
)
// 表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  awardRuleId: [
    { required: true, message: '请选择奖惩原因', trigger: 'change' }
  ],
  desc: [{ max: 50, message: '最多输入50个字符', trigger: 'blur' }]
})
// 表单校验方法
const verification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
  return result
}
// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
//监听dialogVisible状态，如果为false清空数据
watch(dialogVisible, newVal => {
  !newVal && initData(awardForm, defalutAward as any)
})
const changeShowDialog = (staffId: number, name: string) => {
  awardForm.value.staffId = staffId
  awardForm.value.name = name
  dialogVisible.value = !dialogVisible.value
}

// 取消按钮事件
const cancelHandler = () => {
  dialogVisible.value = !dialogVisible.value
}
// 确定按钮事件
const confirmHandler = async (formEl: FormInstance | undefined) => {
  const flag = await verification(formEl)
  if (flag) {
    const { name, ...rest } = awardForm.value
    awardStore.createAward({ ...rest })
    dialogVisible.value = !dialogVisible.value
  }
}
const formLabelWidth = '130px'

defineExpose({
  changeShowDialog
})
</script>

<style lang="less" scoped>
.el-input,
.el-select,
.item-span,
:deep(.el-date-editor),
:deep(.el-input__wrapper) {
  width: 180px;
}
</style>
