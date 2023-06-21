<template>
  <el-dialog
    v-model="dialogVisible"
    :title="type && $t(`common.${type}`)">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :inline="true"
      :model="dataForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <el-form-item
        :label="$t('notice.title')"
        prop="title">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.title }}
        </span>
        <el-input
          v-else
          v-model="dataForm.title" />
      </el-form-item>
      <el-form-item
        :label="$t('notice.content')"
        prop="content">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.content }}
        </span>
        <el-input
          v-else
          :rows="2"
          type="textarea"
          v-model="dataForm.content" />
      </el-form-item>
      <el-form-item
        :label="$t('notice.date')"
        v-if="!editable">
        <span class="item-span">
          {{ spanForm.date }}
        </span>
      </el-form-item>
      <el-form-item
        :label="$t('notice.status')"
        v-if="!editable">
        <span class="item-span">
          {{ spanForm.status }}
        </span>
      </el-form-item>
      <el-form-item
        :label="$t('notice.admin')"
        v-if="!editable">
        <span class="item-span">
          {{ spanForm.admin }}
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandler">
        {{ cancelText }}
      </el-button>
      <el-button
        type="success"
        v-show="editable"
        @click="releaseHandler(ruleFormRef, NoticeEnum['暂存'] + '')">
        {{ $t('common.save') }}
      </el-button>
      <el-button
        v-if="spanForm.status === NoticeEnum['0'] || editable"
        type="primary"
        @click="releaseHandler(ruleFormRef, NoticeEnum['已发布'] + '')">
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, computed } from 'vue'
import useStore from '@/store'
import { FormRules, FormInstance } from 'element-plus'
import { NoticeEnum } from '@/enums/notice'
import { ADD, DETAIL, EDIT } from '@/utils/constant'
const { noticeStore, appStore } = useStore()
const proxy = getCurrentInstance()

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { max: 20, message: '标题不能超过20个字符', trigger: 'blur' }
  ],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  sign: [
    { required: true, message: '署名不能为空', trigger: 'blur' },
    { max: 20, message: '署名不能超过20个字符', trigger: 'blur' }
  ]
})
const spanForm = computed(() => ({
  ...noticeStore.editNotice
}))

const dataForm = ref({
  title: '',
  content: ''
})

watch(spanForm, newVal => {
  if (newVal) {
    dataForm.value = {
      title: newVal.title!,
      content: newVal.content!
    }
  }
})

const ruleFormRef = ref<FormInstance>()
// 表单校验方法
const verification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  return await formEl.validate()
}
const formLabelWidth = '150px'
// 取消按钮文字
const cancelText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    editable.value ? 'common.cancel' : 'common.close'
  )
)
// 确定按钮文字
const confirmText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    editable.value ? 'common.release' : 'common.edit'
  )
)

// 取消事件
const cancelHandler = () => {
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
}

// 发布事件
const releaseHandler = async (
  formEl: FormInstance | undefined,
  status: string
) => {
  // 如果是可编辑状态 --->  添加和编辑
  if (editable.value) {
    // 确定按钮提交事件
    // 如果可见 ---> 编辑
    const flag = await verification(formEl)
    if (flag) {
      if (visible.value) {
        // 提交编辑
        noticeStore.updateNotice(
          spanForm.value.id!,
          {
            ...dataForm.value,
            status
          },
          status === NoticeEnum['暂存'] + '' ? '修改成功' : '发布成功'
        )
      } else {
        // 不可见 ---> 添加
        // 提交添加
        noticeStore.createNotice({
          ...dataForm.value,
          adminId: appStore.userInfo.id,
          status
        })
      }
      dialogVisible.value = false
    }
  } else {
    // 不是可编辑状态 ---> 详情
    type.value = EDIT
  }
}

// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
watch(dialogVisible, newVal => {
  if (!newVal) {
    // ruleFormRef.value?.resetFields()
    dataForm.value.content = ''
    dataForm.value.title = ''
  }
})
const type = ref<string>()
const changeShowDialog = (key: string) => {
  type.value = key
  dialogVisible.value = !dialogVisible.value
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
  changeShowDialog
})
</script>

<style lang="less" scoped>
.el-input,
.el-select,
.item-span,
.el-textarea,
.el-cascader,
:deep(.el-date-editor),
:deep(.el-input__wrapper) {
  width: 500px !important;
}
</style>
