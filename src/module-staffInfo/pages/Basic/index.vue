<template>
  <div class="outer">
    <el-card>
      <el-form
        label-width="100px"
        v-if="staffInfo"
        style="text-align: center"
        label-suffix=":">
        <el-row>
          <el-col :span="8">
            <el-row>
              <el-col :span="10">
                <el-avatar
                  @click="changeDialog"
                  :size="150"
                  fit="cover"
                  :src="avatarUrl" />
              </el-col>
              <el-col :span="14">
                <el-form-item :label="$t('staff.name')">
                  <span>{{ staffInfo.name }}</span>
                </el-form-item>
                <el-form-item :label="$t('staff.workNumber')">
                  <span>{{ staffInfo.workNumber }}</span>
                </el-form-item>
                <el-form-item :label="$t('staff.roleName')">
                  <span>{{ staffInfo.role }}</span>
                </el-form-item>
                <el-form-item :label="$t('staff.department')">
                  <span>{{ staffInfo.department }}</span>
                </el-form-item>
                <el-form-item :label="$t('staff.job')">
                  <span>{{ staffInfo.job }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('staff.sex')">
              <span>{{ staffInfo.sex }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.workAge')">
              <span>{{ staffInfo.workAge }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.workState')">
              <span>{{ staffInfo.workState }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.basisSalary')">
              <span>{{ staffInfo.basisSalary }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('staff.engageForm')">
              <span>{{ staffInfo.engageForm }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.contractDate')">
              <span>{{ staffInfo.contractDate }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.beginDate')">
              <span>{{ staffInfo.beginDate }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.endDate')">
              <span>{{ staffInfo.endDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('staff.inDate')">
              <span>{{ staffInfo.inDate }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.formDate')">
              <span>{{ staffInfo.formDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('staff.phone')">
              <span>{{ staffInfo.phone }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.email')">
              <span>{{ staffInfo.email }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.address')">
              <span>{{ staffInfo.address }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('staff.birthday')">
              <span>{{ staffInfo.birthday }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.idCard')">
              <span>{{ staffInfo.idCard }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.wedlock')">
              <span>{{ staffInfo.wedlock }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('staff.nation')">
              <span>{{ staffInfo.nation }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.nativePlace')">
              <span>{{ staffInfo.nativePlace }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.politicalAffiliation')">
              <span>{{ staffInfo.politicalAffiliation }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('staff.school')">
              <span>{{ staffInfo.school }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.specialty')">
              <span>{{ staffInfo.specialty }}</span>
            </el-form-item>
            <el-form-item :label="$t('staff.educationLevel')">
              <span>{{ staffInfo.educationLevel }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <AvatarDialog ref="avatarDialog" />
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import AvatarDialog from '@/module-staffInfo/components/AvatarDialog.vue'
const { staffInfoStore, appStore } = useStore()
const { userInfo } = storeToRefs(appStore)
const { staffInfo } = storeToRefs(staffInfoStore)
const init = async () => {
  userInfo.value && (await staffInfoStore.getStaffById(userInfo.value.id))
}
const avatarUrl = computed<string>(
  () => `${import.meta.env.VITE_IMG_URL}/${staffInfo.value?.avatar}`
)
const avatarDialog = ref<InstanceType<typeof AvatarDialog>>()
const changeDialog = () => {
  avatarDialog.value && avatarDialog.value.chagneDialogVisible()
}
init()
</script>

<style lang="less" scoped>
.outer {
  width: 100%;
  height: 100%;
}
.active {
  cursor: pointer;
  position: absolute !important;
  z-index: 999;
  top: 0px;
}
.el-form {
  margin: 10px;
  :deep(.el-form-item) {
    margin-bottom: 5px;
  }
}
.el-avatar {
  border: 1px solid #e0e0e0;
  cursor: pointer;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
