<template>
  <el-row :gutter="20">
    <el-col
      :span="8"
      class="thumb">
      <el-card>
        <span>上月总工资</span>
        <div
          class="echarts"
          id="bar1"></div>
      </el-card>
    </el-col>
    <el-col
      :span="8"
      class="thumb">
      <el-card>
        <span>总工资变化</span>
        <div
          class="echarts"
          id="line"></div>
      </el-card>
    </el-col>
    <el-col
      :span="8"
      class="thumb">
      <el-card>
        <span>人均工资</span>
        <div
          class="echarts"
          id="bar2"></div>
      </el-card>
    </el-col>
    <el-col
      :span="16"
      class="bottom">
      <el-card>
        <div class="tool">
          <div class="left">
            <el-select
              @change="getEcharts"
              clearable
              placeholder="年"
              size="small"
              v-model="salaryStaStore.search.year">
              <el-option
                v-for="item in salaryStaStore.yearOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getEcharts"
              clearable
              placeholder="月"
              size="small"
              :disabled="!salaryStaStore.search.year"
              v-model="salaryStaStore.search.month">
              <el-option
                v-for="item in salaryStaStore.monthOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getEcharts"
              clearable
              placeholder="部门"
              size="small"
              v-model="salaryStaStore.search.departmentId">
              <el-option
                v-for="item in departmentStore.departmentOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
            <el-select
              @change="getEcharts"
              clearable
              placeholder="职位"
              size="small"
              :disabled="!salaryStaStore.search.departmentId"
              v-model="salaryStaStore.search.jobId">
              <el-option
                v-for="item in jobStore.jobOption"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
          </div>
        </div>
        <el-divider />
        <div
          class="echarts"
          id="bar3"></div>
      </el-card>
    </el-col>
    <el-col
      :span="8"
      class="bottom">
      <el-card>
        <span>上月各部门工资</span>
        <div
          class="echarts"
          id="pie"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useStore from '@/store'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
const { salaryStaStore, departmentStore, jobStore } = useStore()
const init = async () => {
  await departmentStore.getDepartmentOption()
  await salaryStaStore.getSalaryYear()
  await salaryStaStore.getSalaryMonth(new Date().getFullYear())
}
init()

// 监听年份变化，获取月份
watch(
  () => salaryStaStore.search.year,
  async (newVal, oldVal) => {
    if (newVal) {
      await salaryStaStore.getSalaryMonth(+newVal)
    } else {
      salaryStaStore.search.month = undefined
    }
  }
)

// 监听部门变化，获取职位
watch(
  () => salaryStaStore.search.departmentId,
  async (newVal, oldVal) => {
    if (newVal) {
      await jobStore.getJobOption(+newVal)
    } else {
      salaryStaStore.search.jobId = undefined
    }
  }
)

const getEcharts = async () => {
  await salaryStaStore.getEcharts()
  const chartDom = document.getElementById('bar3')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption
  option = {
    grid: {
      left: 'center',
      top: 'center',
      containLabel: true,
      width: '85%',
      height: '65%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      appendToBody: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value',
      name: '工资（元）'
    },
    dataset: {
      dimensions:
        salaryStaStore.echartsSalary && salaryStaStore.echartsSalary?.length > 0
          ? Object.keys(salaryStaStore.echartsSalary[0])
          : [],
      source: salaryStaStore.echartsSalary
    },
    series: [
      {
        type: 'bar'
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}
onMounted(async () => {
  await salaryStaStore.getLastDepartmentSalary()
  const chartDom = document.getElementById('bar1')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      appendToBody: true
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      dimensions: [
        'department',
        'basis_salary',
        'lunch_salary',
        'traffic_salary',
        'award_salary',
        'fine_salary'
      ],
      source: salaryStaStore.lastDepartmentSalary
    },
    series: [
      {
        name: '基本工资',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '午餐补助',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '交通补助',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '奖金',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '罚金',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        }
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})

onMounted(async () => {
  await salaryStaStore.getSixMonthSalary()
  const chartDom = document.getElementById('line')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    grid: {
      left: 'center',
      top: 'center',
      containLabel: true,
      width: '85%',
      height: '65%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      appendToBody: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      dimensions: ['month', 'value'],
      source: salaryStaStore.sixMonthSalary
    },
    series: [
      {
        type: 'line',
        smooth: true
      }
    ]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})

onMounted(async () => {
  await salaryStaStore.getDepartmentAvgSalary()
  const chartDom = document.getElementById('bar2')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption
  option = {
    grid: {
      left: 'center',
      top: 'center',
      containLabel: true,
      width: '85%',
      height: '65%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      appendToBody: true
    },
    xAxis: { type: 'category' },
    yAxis: {},
    dataset: {
      dimensions: ['department', 'value'],
      source: salaryStaStore.departmentAvgSalary
    },
    series: [{ type: 'bar' }]
  }

  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})

onMounted(async () => {
  /*
    年 月 部门 职位
    1. 0 0 0 0
      - 无
    2. 1 0 0 0
      - 显示当年的工资
        - x: 月份 y: 工资
    3. 1 1 0 0
      - 显示当月的工资
        - x: 部门 y: 工资
    4. 1 0 1 0
      - 显示部门当年的工资
        - x: 月份 y: 工资
    5. 1 1 1 0
      - 显示部门当月的工资
        - x: 职位 y: 工资
    6. 1 0 1 1
      - 显示职位当月的工资
        - x: 月份 y: 工资
    7. 1 1 1 1
      - 显示职位当月的工资
        - x: 职位 y: 工资
    8. 0 0 1 0
      - 显示部门全部的工资
        - x: 年份 y: 工资
    9. 0 0 1 1
      - 显示职位全部的工资
        - x: 年份 y: 工资
  */
  await getEcharts()
})

onMounted(async () => {
  await salaryStaStore.getDepartmentSumSalary()
  const chartDom = document.getElementById('pie')!
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    dataset: {
      dimensions: ['department', 'value'],
      source: salaryStaStore.departmentSumSalary
    },
    series: [
      {
        name: '各部门收入占比（月份）',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
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
.thumb {
  height: 30%;
}
.tool {
  display: flex;
  justify-content: space-between;
  .left {
    .el-select {
      width: 80px;
      margin-right: 10px;
    }
  }
}
.el-divider {
  margin: 10px 0;
}
.bottom {
  padding-top: 20px;
  height: 70%;
}

.el-row,
.el-card,
.echarts {
  height: 100%;
  width: 100%;
}
</style>
