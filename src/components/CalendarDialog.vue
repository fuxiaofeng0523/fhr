<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="type === ADD ? '添加日程' : '编辑日程'"
    style="width: 30vw">
    <el-form
      v-if="dialogFormVisible"
      ref="ruleFormRef"
      :rules="rules"
      label-width="120px"
      :model="form">
      <el-form-item
        label="标题"
        prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="item in calendarType"
            :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="开始时间"
        prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          :clearable="false"
          placeholder="开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item
        label="结束时间"
        prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          :clearable="false"
          placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item label="提醒时间">
        <el-select
          placeholder="提醒时间"
          v-model="form.remindTime">
          <el-option
            v-for="item in remindTime"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="address">
        <el-input
          placeholder="地址"
          v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark">
        <el-input
          placeholder="备注"
          v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandler">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-if="type === EDIT"
        @click="deleteHandler"
        type="danger">
        {{ $t('common.delete') }}
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
import { ref, reactive, watch } from 'vue'
import useStore from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { CalendarTypeEnum } from '@/enums/calendar'
import { formatEnumData } from '@/utils'
import moment from 'moment'
import { ADD, EDIT } from '@/utils/constant'
const { calendarStore, appStore } = useStore()
const remindTime = [
  {
    label: '不提醒',
    value: '0'
  },
  {
    label: '提前5分钟',
    value: '5'
  },
  {
    label: '提前10分钟',
    value: '10'
  },
  {
    label: '提前15分钟',
    value: '15'
  },
  {
    label: '提前30分钟',
    value: '30'
  },
  {
    label: '提前1小时',
    value: '60'
  },
  {
    label: '提前2小时',
    value: '120'
  },
  {
    label: '提前1天',
    value: '1440'
  }
]

const dialogFormVisible = ref(false)
watch(dialogFormVisible, val => {
  if (!val) {
    form.value = {
      title: '',
      type: '0',
      startTime: '',
      endTime: '',
      remindTime: '0',
      address: '',
      remark: ''
    }
  }
})
const type = ref<string>('')
const form = ref({
  title: '',
  type: '0',
  startTime: '',
  endTime: '',
  remindTime: '0',
  address: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const validateEndTime = (rule: any, value: any, callback: any) => {
  if (value < form.value.startTime) {
    callback(new Error('结束时间不能小于开始时间'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { max: 20, message: '标题最大长度为20', trigger: 'blur' }
  ],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  endTime: [{ validator: validateEndTime, trigger: 'change' }],
  address: [{ max: 30, message: '地址最大长度为30', trigger: 'blur' }],
  remark: [{ max: 100, message: '备注最大长度为100', trigger: 'blur' }]
})

const deleteHandler = () => {
  calendarStore.deleteCalendar(calendarStore.editCalendar!.id)
  dialogFormVisible.value = !dialogFormVisible.value
}

const cancelHandler = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}

const confirmHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (type.value === EDIT) {
        calendarStore.updateCalendar(calendarStore.editCalendar!.id, {
          ...form.value,
          type: +form.value.type
        })
        return
      } else {
        calendarStore.createCalendar({
          ...form.value,
          staffId: appStore.userInfo.id,
          type: +form.value.type
        })
      }
      dialogFormVisible.value = !dialogFormVisible.value
    }
  })
}

const changeVisible = (key: string, date: Date) => {
  type.value = key
  if (key === EDIT) {
    const { id, ...rest } = calendarStore.editCalendar!
    form.value = {
      ...rest,
      endTime: rest.endTime ? rest.endTime : '',
      remindTime: rest.remindTime ? rest.remindTime : '0',
      address: rest.address ? rest.address : '',
      remark: rest.remark ? rest.remark : '',
      type: '' + form.value.type
    }
  } else {
    form.value.startTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
    form.value.endTime = moment(date)
      .add(1, 'hours')
      .format('YYYY-MM-DD HH:mm:ss')
  }
  dialogFormVisible.value = !dialogFormVisible.value
}
const calendarType = formatEnumData(CalendarTypeEnum)
defineExpose({
  changeVisible
})
</script>

<style lang="less" scoped>
.el-input,
:deep(.el-input__wrapper) {
  width: 15vw !important;
}
</style>
