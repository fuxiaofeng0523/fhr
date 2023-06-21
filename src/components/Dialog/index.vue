<template>
  <component
    :is="drawer ? 'ElDrawer' : 'ElDialog'"
    :class="props.className"
    direction="ltr"
    v-model="dialogVisible"
    :title="type && $t(`common.${type}`)">
    <el-scrollbar>
      <el-form
        v-if="dialogVisible"
        ref="ruleFormRef"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        :label-width="formLabelWidth"
        label-suffix=":">
        <slot name="dialog">
          <el-form-item
            v-for="item of renderData"
            :key="item.key"
            :label="$t(`${name}.${item.key}`)"
            :prop="item.key">
            <span
              v-if="!editable"
              class="item-span">
              {{ spanForm[item.key] }}
            </span>
            <component
              v-else
              v-model="dataForm[item.key]"
              :is="item.component"
              clearable
              :type="item.type"
              :disabled="item.disabled"
              :format="item.format"
              :value-format="item.valueFormat"
              autocomplete="off">
              <template v-if="item.component === 'ElSelect'">
                <component
                  is="ElOption"
                  v-for="option of item.optionData"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"></component>
              </template>
            </component>
          </el-form-item>
        </slot>
        <slot
          name="other"
          :formLabelWidth="formLabelWidth"
          :visible="visible"
          :editable="editable"
          :dataForm="dataForm"
          :spanForm="spanForm"></slot>
      </el-form>
    </el-scrollbar>

    <template #footer>
      <!-- 取消按钮 -->
      <el-button @click="cancelHandler">{{ cancelText }}</el-button>
      <!-- 确定按钮 -->
      <el-button
        type="primary"
        @click="confirmHandler(ruleFormRef)">
        {{ confirmText }}
      </el-button>
    </template>
  </component>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed, getCurrentInstance } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ADD, DETAIL, EDIT } from '@/utils/constant'
import { initData } from '@/utils/index'
interface DialogProps {
  name: string // 名字,在$t使用
  editData: any // 编辑的数据
  rules?: FormRules // 校验规则
  formLabelWidth?: string // 表单label宽度
  renderDialog: RenderDialogData[] // 渲染到页面的数据
  editabled?: boolean // 是否可编辑，用来控制确定按钮
  className?: string // 类名
  drawer?: boolean
}
interface DialogEmits {
  (e: 'insert', data: any): void // 添加事件
  (e: 'update', data: any): void // 修改事件
}
const props = withDefaults(defineProps<DialogProps>(), {
  formLabelWidth: '150px',
  editabled: true,
  className: 'd1',
  drawer: false
})
const emit = defineEmits<DialogEmits>()
const proxy = getCurrentInstance()
// 表单数据
// 获取默认数据
const defalutDataHandler = () => {
  const defalutData: any = {}
  for (const item of props.renderDialog) {
    defalutData[item.key] = null
  }
  return defalutData
}
const defalutData = defalutDataHandler()
const dataForm = ref({ ...(defalutData as any) })
const spanForm = ref({ ...(defalutData as any) })
watch(
  () => props.editData,
  newVal => {
    newVal && ((dataForm.value = newVal), (spanForm.value = { ...newVal }))
  }
)
// 表单数据
const renderData = computed(() => {
  return type.value === ADD
    ? props.renderDialog.filter(item => item.visible)
    : props.renderDialog
})

// 表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>(props.rules!)
// 表单校验方法
const verification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  return await formEl.validate()
}
// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 监听dialogVisible状态，如果为false清空数据
watch(dialogVisible, newVal => {
  !newVal && initData(dataForm, defalutData as any)
})
const type = ref<string>()
const changeShowVisible = (key: string) => {
  type.value = key
  dialogVisible.value = !dialogVisible.value
}
// 取消按钮文字
const cancelText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    props.editabled
      ? editable.value
        ? 'common.cancel'
        : 'common.close'
      : 'common.close'
  )
)
// 确定按钮文字
const confirmText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    props.editabled
      ? editable.value
        ? 'common.confirm'
        : 'common.edit'
      : 'common.confirm'
  )
)
// 取消按钮事件
const cancelHandler = () => {
  // 如果可编辑
  if (props.editabled) {
    // 如果是可编辑状态
    if (editable.value) {
      // 如果可见 ---> 编辑
      if (visible.value) {
        // 退出编辑状态
        type.value = DETAIL
      } else {
        // 不可见 ---> 添加
        // 隐藏界面
        dialogVisible.value = false
      }
    } else {
      // 隐藏界面
      dialogVisible.value = false
    }
  } else {
    dialogVisible.value = false
  }
}
// 确定按钮事件
const confirmHandler = async (formEl: FormInstance | undefined) => {
  // 如果是可编辑的   --->  用来控制编辑和详情   --->   编辑、详情、添加
  if (props.editabled || type.value === ADD) {
    // 如果是可编辑状态 --->  添加和编辑
    if (editable.value) {
      // 确定按钮提交事件
      // 如果可见 ---> 编辑
      const flag = await verification(formEl)
      if (flag) {
        if (visible.value) {
          // 提交编辑
          emit('update', { ...dataForm.value })
        } else {
          // 不可见 ---> 添加
          // 提交添加
          emit('insert', { ...dataForm.value })
        }
        dialogVisible.value = false
      }
    } else {
      // 不是可编辑状态 ---> 详情
      type.value = EDIT
    }
  } else {
    dialogVisible.value = false
  }
}

// 是否可见
const visible = ref<boolean>()
// 是否可修改
const disabled = ref<boolean>()
// 是否可编辑
const editable = ref<boolean>()
watch(type, newVal => {
  disabled.value = newVal === DETAIL ? false : true
  visible.value = newVal === DETAIL || newVal === EDIT ? true : false
  editable.value = newVal === EDIT || newVal === ADD ? true : false
})
defineExpose({
  dialogVisible,
  changeShowVisible,
  dataForm
})
</script>

<style lang="less" scoped>
.d1 {
  .el-input,
  .el-select,
  .item-span,
  .el-textarea,
  .el-cascader,
  :deep(.el-date-editor),
  :deep(.el-input__wrapper) {
    width: 180px !important;
  }
}
.d2 {
  .el-input,
  .el-select,
  .item-span,
  .el-textarea,
  .el-cascader,
  :deep(.el-date-editor),
  :deep(.el-input__wrapper) {
    width: 400px !important;
  }
}
</style>
