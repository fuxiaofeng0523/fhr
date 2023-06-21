<template>
  <el-row
    :gutter="16"
    class="outer">
    <el-col
      :span="7"
      class="top">
      <el-card>
        <div
          class="echarts"
          id="echarts3"></div>
      </el-card>
    </el-col>
    <el-col
      :span="17"
      class="top">
      <el-card>
        <div class="tool">
          <div class="left">
            <el-select
              @change="getUser"
              placeholder="角色"
              size="small"
              v-model="operateStore.search.roleId">
              <el-option
                v-for="item in roleStore.roleOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getUser"
              clearable
              placeholder="部门"
              size="small"
              v-model="operateStore.search.departmentId">
              <el-option
                v-for="item in departmentStore.departmentOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getUser"
              clearable
              placeholder="职位"
              size="small"
              :disabled="!operateStore.search.departmentId"
              v-model="operateStore.search.jobId">
              <el-option
                v-for="item in jobStore.jobOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getUser"
              clearable
              placeholder="员工"
              size="small"
              :disabled="!operateStore.search.jobId"
              v-model="operateStore.search.staffId">
              <el-option
                v-for="item in staffOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
          </div>
        </div>
        <el-divider />
        <div
          class="echarts"
          id="echarts2"></div>
      </el-card>
    </el-col>
    <el-row class="four">
      <el-col
        :spna="24"
        class="fourin">
        <el-card>
          <div
            class="echarts"
            id="echarts11"></div>
        </el-card>
      </el-col>
      <el-col
        :spna="24"
        class="fourin"
        style="padding-top: 8px">
        <el-card>
          <div
            class="echarts"
            id="echarts12"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-col class="four">
      <el-card>
        <div
          class="echarts"
          id="echarts4"></div>
      </el-card>
    </el-col>
    <el-col class="four">
      <el-card>
        <div
          class="echarts"
          id="echarts5"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import useStore from '@/store'
import * as echarts from 'echarts'
import { getStaffOptionApi } from '@/api/staff'
import { getUserInfoApi } from '@/api/app'
/*
  1. 按时间 统计用户的操作行为
    - 0-6 6-12 12-18 18-24
        - 柱状图 饼图
    - 天数
        - 折线图
  2. 按用户 统计用户的操作行为
    - 用户名 用户角色 用户部门 用户职位
        - 柱状图  饼图
  3. 按模块 统计用户的操作行为
    - 模块名称 模块类型 模块状态
        - 柱状图  饼图

  4. 按操作类型 统计用户的操作行为
    - 增删改查
        - 柱状图  饼图
  5. 按操作结果 统计用户的操作行为
    - 成功 失败
        - 柱状图  饼图
*/
type EChartsOption = echarts.EChartsOption

const { operateStore, jobStore, departmentStore, roleStore } = useStore()
const init = async () => {
  await departmentStore.getDepartmentOption()
  await roleStore.getRoleOption()
}
init()
const staffOption = ref<Option[]>()
// 获取员工的方法
const getStaffOption = async (jobId: number) => {
  const { data } = await getStaffOptionApi(jobId, true)
  if (data.success) {
    staffOption.value = data.data
  } else throw new Error(data.message)
}

// 监听部门变化，获取职位
watch(
  () => operateStore.search.departmentId,
  async (newVal, oldVal) => {
    if (newVal) {
      await jobStore.getJobOption(+newVal)
    } else {
      operateStore.search.jobId = undefined
    }
  }
)
// 监听职位变化，获取员工
watch(
  () => operateStore.search.jobId,
  async (newVal, oldVal) => {
    if (newVal) {
      await getStaffOption(+newVal)
    } else {
      operateStore.search.staffId = undefined
    }
  }
)
const getUser = async () => {
  await operateStore.getUser()
  const chartDom = document.getElementById('echarts2')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      dimensions: ['time', 'count'],
      source: operateStore.userList
    },
    series: [
      {
        type: 'bar'
      },
      {
        type: 'line'
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}
// 3
onMounted(async () => {
  await operateStore.getModule()
  const chartDom = document.getElementById('echarts3')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    title: {
      text: '模块统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left'
    // },
    dataset: {
      dimensions: ['module', 'count'],
      source: operateStore.moduleList
    },
    series: [
      {
        name: '模块统计',
        type: 'pie',
        radius: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
        // label: {
        //   show: false
        // },
        // labelLine: {
        //   show: false
        // }
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})
// 2
onMounted(async () => {
  await getUser()
})
// 1-1
onMounted(async () => {
  await operateStore.getTime()
  const chartDom = document.getElementById('echarts11')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    title: {
      text: '时间段统计',
      left: 'right'
    },
    tooltip: {
      trigger: 'item',
      appendToBody: true
    },
    legend: {
      left: 'left',
      orient: 'vertical'
    },
    dataset: {
      dimensions: ['time', 'count'],
      source: operateStore.timeList
    },
    series: [
      {
        name: '时间段统计',
        type: 'pie',
        radius: '80%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})
// 1-2
onMounted(async () => {
  await operateStore.getDay()
  const chartDom = document.getElementById('echarts12')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    grid: {
      left: 'center',
      top: 'center',
      containLabel: true,
      width: '85%',
      height: '75%'
    },
    tooltip: {
      trigger: 'item',
      appendToBody: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      dimensions: ['time', 'count'],
      source: operateStore.dayList
    },
    series: [
      {
        name: '时间段统计',
        type: 'line'
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})
// 4
onMounted(async () => {
  await operateStore.getMethod()
  const chartDom = document.getElementById('echarts4')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    title: {
      text: '操作方法统计',
      top: 'bottom',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    dataset: {
      dimensions: ['method', 'count'],
      source: operateStore.methodList
    },
    series: [
      {
        name: '操作方法统计',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        minAngle: 10,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})
// 5
onMounted(async () => {
  await operateStore.getCode()
  const chartDom = document.getElementById('echarts5')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    title: {
      text: '操作码统计',
      top: 'bottom',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    dataset: {
      dimensions: ['code', 'count'],
      source: operateStore.codeList
    },
    series: [
      {
        name: '操作码统计',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        minAngle: 10,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})
</script>

<style lang="less" scoped>
.top {
  margin-bottom: 16px;
  height: 50%;
}
.tool {
  display: flex;
  justify-content: space-between;
  .left {
    .el-select {
      width: 100px;
      margin-right: 10px;
    }
  }
}
.el-divider {
  margin: 10px;
}
.four {
  flex: 1;
  width: 25%;
  padding-bottom: 16px;
  height: 50%;
  .fourin {
    height: 50%;
    width: 100%;
  }
}
.outer,
.el-card,
.echarts {
  height: 100%;
  width: 100%;
}
.el-row {
  display: flex;
}
</style>
