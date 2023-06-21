<template>
  <el-form
    style="margin: 10px"
    v-if="contract"
    :inline="true"
    :model="contract"
    :label-width="formLabelWidth"
    label-suffix=":">
    <el-form-item label="姓名">
      <span>{{ contract.staff.name }}</span>
    </el-form-item>
    <el-form-item label="部门">
      <span>
        {{ contract.department.name }}
      </span>
    </el-form-item>
    <el-form-item label="职位">
      <span>
        {{ contract.job.name }}
      </span>
    </el-form-item>
    <el-form-item label="基本工资">
      <span>{{ contract.staff.basisSalary }}</span>
    </el-form-item>
    <el-form-item label="生效时间">
      <span>
        {{
          new Date(contract.effectiveDate)
            .toLocaleString()
            .replace('/', '-')
            .replace('/', '-')
        }}
      </span>
    </el-form-item>
    <el-form-item label="员工同意">
      <span v-if="contract.agreed">已同意</span>
      <el-radio-group
        v-else
        v-model="agreed">
        <el-radio
          label="1"
          border>
          确定
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="工作职责">
      <span style="width: 900px">
        {{ contract.jobDescription }}
      </span>
    </el-form-item>
    <el-form-item label="签名">
      <el-image
        v-if="contract.sign"
        :src="url"
        fit="cover" />
      <div
        v-else
        class="sign">
        <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"></canvas>
        <el-button
          size="small"
          @click="clearHanlder">
          清除
        </el-button>
      </div>
    </el-form-item>
    <el-form-item v-if="!contract.sign">
      <el-button
        type="primary"
        @click="confirmHandler">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import { ElMessage } from 'element-plus'

const { contractStore, appStore } = useStore()
const { userInfo } = appStore
const { contract } = storeToRefs(contractStore)
const init = () => {
  contractStore.getContractByStaffId(userInfo.id)
}
init()
const url = computed<string>(
  () => `${import.meta.env.VITE_IMG_URL}/${contract.value?.sign}`
)
const agreed = ref()
const formLabelWidth = '120px'
// 对话页面的显示与隐藏

const drawing = reactive({
  isDrawing: false, // 判断鼠标是否被按下并开始绘制
  path: [] as { x: number; y: number }[] // 存储鼠标位置坐标的数组
})
// canvas手写
// 获取canvas
const canvas = ref<HTMLCanvasElement>()
// mousedown ---> 开始绘制
const startDrawing = (event: MouseEvent) => {
  drawing.isDrawing = true
  drawing.path.push({ x: event.offsetX, y: event.offsetY })
}
// mousemove ---> 绘制中
const draw = (event: MouseEvent) => {
  if (!drawing.isDrawing) {
    return
  }
  drawing.path.push({ x: event.offsetX, y: event.offsetY })
  const ctx = canvas.value!.getContext('2d') as CanvasRenderingContext2D
  // 设置样式
  ctx.strokeStyle = '#000000'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2
  ctx.beginPath()
  // 从起点开始绘制路径
  ctx.moveTo(drawing.path[0].x, drawing.path[0].y)
  for (let i = 1; i < drawing.path.length; ++i) {
    ctx.lineTo(drawing.path[i].x, drawing.path[i].y)
  }
  // 绘制路径
  ctx.stroke()
}
// mouseup ---> 停止绘制
const stopDrawing = (event: MouseEvent) => {
  drawing.isDrawing = false
  drawing.path = []
}
// 清除事件
const clearHanlder = () => {
  const ctx = canvas.value!.getContext('2d') as CanvasRenderingContext2D
  ctx.clearRect(0, 0, 300, 150)
}
// 确定事件
const confirmHandler = () => {
  if (!agreed.value) {
    ElMessage.error('请确定')
    return
  }
  if (canvas.value) {
    // 将签名图片数据提交到后端进行保存
    canvas.value.toBlob(
      async blob => {
        if (blob) {
          const file = new File([blob], `${appStore.userInfo.name}.png`, {
            type: blob.type
          })
          // 创建一个 FormData 对象，并将签名文件添加到其中
          const formData = new FormData()
          formData.append('file', file)
          const fileName = await appStore.upload(formData)
          if (fileName) {
            await contractStore.updateContract(contract.value!.id, {
              agreed: agreed.value,
              sign: fileName
            })
            init()
          } else {
            ElMessage.error('图片上传错误')
          }
        }
      },
      'image/png',
      1
    )
  }
}
</script>

<style lang="less" scoped>
span {
  width: 200px;
}
.sign {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

canvas,
.el-image {
  border: 1px dashed #dcdfe6;
  width: 300px;
  height: 150px;
}
</style>
