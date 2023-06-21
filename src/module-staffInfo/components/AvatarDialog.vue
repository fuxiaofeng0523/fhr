<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('common.modAvatar')"
    style="width: 400px; margin: 10px auto">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :model="infoForm">
      <el-form-item prop="avatar">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="/dev-api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-change="changeHandler"
          :auto-upload="false">
          <template #trigger>
            <el-button type="primary">+上传文件</el-button>
          </template>
        </el-upload>
        <div
          class="upload"
          v-if="imageUrl">
          <div class="imgBox">
            <div class="imgLight"></div>
          </div>
          <div class="avatar">
            <img
              class="img"
              v-on:mousedown="handleMouseDown"
              draggable="false"
              :style="{ transform: `rotate(${degree}deg) scale(${scale})` }"
              :src="imageUrl" />
          </div>
        </div>
        <div class="tool">
          <div
            class="left"
            @click="scaleImage('sub')">
            <Icon
              iconName="icon-jian"
              className="icon" />
          </div>
          <div class="lineBox">
            <div
              class="line"
              ref="line"
              @click="handleLineClick"></div>
            <div
              class="pointer"
              ref="pointer"
              @drag="handlePointerDrag"></div>
          </div>
          <div
            class="right"
            @click="scaleImage('add')">
            <Icon
              iconName="icon-jia"
              className="icon" />
          </div>
          <div
            class="right"
            @click="rotateImage('left')">
            <Icon
              iconName="icon-acrotate"
              className="icon" />
          </div>
          <div
            class="right"
            @click="rotateImage('right')">
            <Icon
              iconName="icon-cwrotate"
              className="icon" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import useStore from '@/store'
import { ElMessage, ElUpload } from 'element-plus'
import type {
  UploadProps,
  FormInstance,
  FormRules,
  UploadRawFile
} from 'element-plus'
import { storeToRefs } from 'pinia'
const { staffInfoStore, staffInfosStore, appStore } = useStore()
const { staffInfo } = storeToRefs(staffInfoStore)
const dialogVisible = ref(false)
const chagneDialogVisible = () => {
  dialogVisible.value = !dialogVisible.value
}

watch(dialogVisible, newVal => {
  if (!newVal) {
    infoForm.value.avatar = undefined
    imageUrl.value = `${import.meta.env.VITE_IMG_URL}/${
      appStore.userInfo.avatar
    }`
    degree.value = 0
    scale.value = 1
  }
})

// 设定img的旋转中心
const setImgRotateCenter = () => {
  const img = document.querySelector('.img') as HTMLElement
  const imgBox = document.querySelector('.imgBox') as HTMLElement
  const imgBoxWidth = imgBox.offsetWidth
  const imgBoxHeight = imgBox.offsetHeight
  img.style.transformOrigin = `${imgBoxWidth / 2}px ${imgBoxHeight / 2}px`
}

const degree = ref(0)

const rotateImage = (key: string) => {
  if (key === 'right') {
    degree.value += 90
  } else {
    degree.value -= 90
  }
}

const scale = ref(1)
const line = ref<HTMLElement>()
const pointer = ref<HTMLElement>()
// 点击+ - 放大缩小图片，scale为1-1.5，pointer位置变化
const scaleImage = (key: string) => {
  if (key === 'add') {
    if (scale.value >= 1.5) return
    scale.value += 0.02
  } else {
    if (scale.value <= 1) return
    scale.value -= 0.02
  }
  const percent = (scale.value - 1) / 0.5
  const pointerWidth = pointer.value!.offsetWidth
  const pointerLeft = percent * line.value!.offsetWidth - pointerWidth / 2
  pointer.value!.style.left = `${pointerLeft}px`
}

// line分成25段，点击line移动pointer
const handleLineClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const { left, width } = target.getBoundingClientRect()
  const { clientX } = e
  const percent = (clientX - left) / width
  const pointerWidth = pointer.value!.offsetWidth
  const pointerLeft = percent * width - pointerWidth / 2
  pointer.value!.style.left = `${pointerLeft}px`
  scale.value = 1 + percent * 0.5
}

// 拖动pointer放大缩小图片，pointer的范围为0-100%
const handlePointerDrag = (e: MouseEvent) => {
  const { left, width } = line.value!.getBoundingClientRect()
  const { clientX } = e
  const percent = (clientX - left) / width
  if (percent < 0 || percent > 1) return
  const pointerWidth = pointer.value!.offsetWidth
  const pointerLeft = percent * width - pointerWidth / 2
  pointer.value!.style.left = `${pointerLeft}px`
  scale.value = 1 + percent * 0.5
}
const lastX = ref<number>(0)
const lastY = ref<number>(0)

// 点击图片进行拖动，范围为avatar的宽高内
const handleMouseDown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const avatar = document.querySelector('.avatar') as HTMLElement
  const {
    left: circleLeft,
    top: circleTop,
    right: circleRight,
    bottom: circleBottom
  } = avatar.getBoundingClientRect()
  const { left, top, right, bottom } = target.getBoundingClientRect()
  const { clientX, clientY } = event
  const x = clientX - left
  const y = clientY - top
  const X = lastX.value
  const Y = lastY.value
  const move = (e: MouseEvent) => {
    const { clientX, clientY } = e
    const moveX = clientX - left - x
    const moveY = clientY - top - y
    if (circleLeft > left + moveX && circleRight < right + moveX) {
      target.style.left = `${X + moveX}px`
      lastX.value = X + moveX
    }
    if (circleTop > top + moveY && circleBottom < bottom + moveY) {
      target.style.top = `${Y + moveY}px`
      lastY.value = Y + moveY
    }
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const imgWidth = ref<number>(0)
const imgHeight = ref<number>(0)

// 剪切图片并添加到el-upload组件中
const handleCut = () => {
  const avatar = document.querySelector('.avatar') as HTMLElement
  const {
    width: circleWidth,
    height: circleHeight,
    left: circleLeft,
    top: circleTop,
    right: circleRight,
    bottom: circleBottom
  } = avatar.getBoundingClientRect()
  const img = document.querySelector('.img') as HTMLImageElement
  const { left, top, right, bottom, width, height } =
    img.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl.value!
    img.onload = () => {
      // 计算目标宽度和高度，如目标宽度为360
      canvas.width = circleWidth
      canvas.height = circleHeight
      const length = Math.min(
        img.width - Math.abs(circleLeft - left) - Math.abs(circleRight - right),
        img.height - Math.abs(circleTop - top) - Math.abs(circleBottom - bottom)
      )
      // 将原点移动到画布中心位置
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((degree.value * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
      ctx.drawImage(
        img,
        (circleLeft - left) / (width / imgWidth.value),
        (circleTop - top) / (height / imgHeight.value),
        length,
        length,
        0,
        0,
        circleWidth,
        circleHeight
      )
      const dataURL = canvas.toDataURL('image/png')
      infoForm.value.dataURL = dataURL
      resolve(dataURL)
    }
  })
}
function dataURLtoFile(dataurl: string, filename: string) {
  const base64Data = dataurl.split(',')[1] // 去掉前缀，只保留base64编码的数据
  const Match = dataurl.match(/:(.*?);/)
  const contentType = Match && Match[1] // 获取文件的MIME类型
  if (!contentType) return new File([], filename)
  const byteCharacters = atob(base64Data) // 将base64字符串转换为二进制数据
  const byteArrays = []
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  const blob = new Blob(byteArrays, { type: contentType })
  return new File([blob], filename, { type: contentType })
}

const infoForm = ref<{
  avatar: string | undefined
  dataURL: string | undefined
}>({
  avatar: appStore.userInfo.avatar,
  dataURL: ''
})
const upload = ref<InstanceType<typeof ElUpload>>()

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await handleCut()
      const uid = new Date().getTime()
      const file = dataURLtoFile(infoForm.value.dataURL!, 'file.png')
      ;(file as UploadRawFile).uid = uid
      upload.value?.clearFiles()
      upload.value?.handleStart(file as UploadRawFile)
      upload.value?.submit()
      dialogVisible.value = false
    }
  })
}
watch(
  () => infoForm.value.avatar,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      await staffInfosStore.updateStaff(staffInfo.value!.id, {
        avatar: infoForm.value.avatar
      })
      await appStore.getUserInfo()
      await staffInfoStore.getStaffById(appStore.userInfo!.id)
    }
  }
)
const imageUrl = ref(`${import.meta.env.VITE_IMG_URL}/${infoForm.value.avatar}`)

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // 保存图片名称
  infoForm.value.avatar = response
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const changeHandler: UploadProps['onChange'] = rawFile => {
  if (rawFile.raw)
    if (rawFile.raw.type !== 'image/jpeg' && rawFile.raw.type !== 'image/png') {
      ElMessage.error('图片必须是JPG或PNG格式!')
      return false
    }
  degree.value = 0
  scale.value = 1
  pointer.value!.style.left = 0 + 'px'
  const img = document.querySelector('.img') as HTMLImageElement
  imageUrl.value = URL.createObjectURL(rawFile.raw!)
  const avatar = document.querySelector('.avatar') as HTMLElement
  const { width: circleWidth, height: circleHeight } =
    avatar.getBoundingClientRect()
  const Img = new Image()
  Img.src = imageUrl.value
  Img.onload = () => {
    imgWidth.value = Img.width
    imgHeight.value = Img.height
    if (Img.width > Img.height) {
      img.style.height = `${circleHeight}px`
      img.style.width = 'auto'
      const { width } = img.getBoundingClientRect()
      lastX.value = -(width - circleWidth) / 2
      img.style.left = `${lastX.value}px`
    } else {
      img.style.width = `${circleWidth}px`
      img.style.height = 'auto'
      const { height } = img.getBoundingClientRect()
      lastY.value = -(height - circleHeight) / 2
      img.style.top = `${lastY.value}px`
    }
    img.style.left = lastX.value + 'px'
    img.style.top = lastY.value + 'px'
    setImgRotateCenter()
  }
}

defineExpose({
  chagneDialogVisible
})
</script>
<style scoped lang="less">
.upload {
  margin-top: 20px;
  position: relative;
  width: 360px;
  height: 360px;
  aspect-ratio: 1/1;
  .imgBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: url('../../asset/img/circle.png');
    pointer-events: none;
    .imgLight {
      pointer-events: auto;
    }
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      // width: 100%;
      // height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
}
.tool {
  width: 360px;
  display: grid;
  grid-template-columns: 40px 1fr 40px 40px 40px;
  align-items: center;
  .icon {
    margin-top: 8px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  > .left {
    margin: 0 auto 0 0;
  }
  > .right {
    margin: 0 0 0 auto;
  }

  .lineBox {
    position: relative;
    width: 100%;
    .line {
      width: 100%;
      border: 2.5px solid rgba(187, 187, 187);
    }
    .pointer {
      cursor: pointer;
      top: -2px;
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(18, 183, 245);
    }
  }
}
</style>
