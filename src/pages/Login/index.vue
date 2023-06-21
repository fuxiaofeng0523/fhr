<template>
  <div class="loginPage">
    <canvas
      id="canvas"
      style="display: block"></canvas>
    <div class="loginBox">
      <div class="title">
        <h1>人力资源管理系统</h1>
        <p>Strive Everyday</p>
      </div>

      <el-form
        ref="ruleFormRef"
        :model="loginMessage"
        :rules="rules">
        <el-form-item prop="phone">
          <el-input
            v-model="loginMessage.phone"
            :placeholder="$t('login.phone')" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginMessage.password"
            type="password"
            show-password
            :placeholder="$t('login.password')" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            class="code"
            v-model="loginMessage.code"
            :placeholder="$t('login.code')" />
          <img
            @click="resetCodeUrl"
            :src="codeUrl"
            alt="" />
        </el-form-item>
        <!-- <el-form-item>
          <el-radio-group
            v-model="loginMessage.type"
            size="large">
            <el-radio label="1">管理员</el-radio>
            <el-radio label="2">用户</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="login(ruleFormRef)">
            {{ $t('login.loginBtn') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useStore from '@/store'
import initLoginBg from '@/utils/intiLoginBg'
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '手机号格式错误',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度在 6 到 20 个字符',
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const router = useRouter()
const { appStore } = useStore()
const loginMessage = ref<LoginMessage>({
  phone: '',
  password: '',
  code: ''
})

const codeUrl = ref<string>('/dev-api/captcha')
const resetCodeUrl = () =>
  (codeUrl.value = '/dev-api/captcha' + '?' + new Date())

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const success = await appStore.login(loginMessage.value)
        success && router.replace('/home')
      } catch (error: any) {
        ElMessage.error(error.message)
        resetCodeUrl()
      }
    }
  })
}
const onResize = () => {
  initLoginBg()
}
const keyup = (e: KeyboardEvent) => {
  if (e.code === 'Enter') login(ruleFormRef.value)
}

onMounted(() => {
  initLoginBg()
  window.addEventListener('resize', onResize)
  window.addEventListener('keyup', keyup)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keyup', keyup)
})
</script>

<style lang="less" scoped>
.loginPage {
  position: relative;
  .loginBox {
    width: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;

    h1 {
      font-weight: bold;
      font-size: 22px;
      text-align: center;
      color: #fff;
    }
    p {
      text-align: center;
      margin: 20px 0;
    }
    .title {
      margin-bottom: 40px;
      position: relative;
      &:before,
      &:after {
        content: '';
        width: 100px;
        height: 2px;
        position: absolute;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), #1976d2);
        left: -20px;
        top: 18px;
      }
      &:after {
        left: auto;
        background: linear-gradient(to left, rgba(255, 255, 255, 0), #1976d2);
        right: -20px;
      }
    }

    .el-input {
      :deep(.el-input__wrapper) {
        background-color: rgba(255, 255, 255, 0);
        box-shadow: 0 0 0 0px
          var(--el-input-border-color, var(--el-border-color)) inset;
        height: 38px;
        outline: none;
        border: 1px #409eff solid !important ;
        .el-input__inner {
          color: #fff !important;
        }
      }
    }
    .code {
      width: 75%;
    }
    img {
      cursor: pointer;
      width: 25%;
      height: 38px;
    }
    .el-radio-group {
      width: 100%;
      display: flex;
      justify-content: space-around;
      .el-radio {
        color: var(--ff-radio-text-color) !important;
      }
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
