
<template>
  <div>
    <div style="margin-top:10px;margin-bottom:5px">
      <el-select v-model="selClass" placeholder="请选择班级">
        <el-option
          v-for="item in classOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button style="margin-left:10px" type="primary" @click="changeData">确认</el-button>
    </div>
    <div id="cnm" style="height:600px;" />
    <!-- <div id="container" style="width: 1250px;height:550px;margin:0 auto;"></div>  -->

    <!-- <div :id="id" :class="className" :style="{height:height,width:width}" ></div> -->
    <!-- <div id="container" style="width: 100%;height:80%;margin:0 auto;"></div>  -->
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getJyqxData, getClasses } from '@/api/student'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      selClass: '', // 目前选中的班级
      classOption: [], // 此页面需要展现的班级信息（此教师/管理员可以查看的班级列表 根据班级列表获得学生列表信息）
      showData: [], // 展现的数据
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {

    changeData() {
      var that = this
      const res = (async function() {
        await getJyqxData(that.selClass).then(response => {
          var arrtmp = []
          // 返回值data是一个对象obj
          for (var key in response.data) {
            arrtmp.push({ name: key, value: response.data[key] })
          }
          that.showData = arrtmp
          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '就业去向统计',
              x: '300',
              top: '15',
              textStyle: {
                color: '#000000',
                fontSize: '22'
              },
              subtextStyle: {
                color: '#90979c',
                fontSize: '16'
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            tooltip: { trigger: 'item' },
            series: [
              {
                name: '入职单位',
                type: 'pie',
                radius: '50%',
                data: that.showData,
                // data: [
                //     {value: 2, name: '百度'},
                //     {value: 7, name: '顺丰'},
                //     {value: 9, name: '抖音'},
                //     {value: 14, name: '今日头条'},
                //     {value: 3, name: '恒生'}
                // ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]

          })
        })
      }())
    },
    initChart() {
      // this.chart = echarts.init(document.getElementById(this.id))
      this.chart = echarts.init(document.getElementById('cnm'))

      var that = this
      const xData = (async function() {
        await getClasses().then(response => {
          that.selClass = response.data[0]
          for (let i = 0; i < response.data.length; i++) {
            that.classOption.push({ value: response.data[i], label: response.data[i] })
          }
        })
        await getJyqxData(that.selClass).then(response => {
          var arrtmp = []
          // 返回值data是一个对象obj
          for (var key in response.data) {
            arrtmp.push({ name: key, value: response.data[key] })
          }
          that.showData = arrtmp
          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '就业去向统计',
              x: '300',
              top: '15',
              textStyle: {
                color: '#000000',
                fontSize: '22'
              },
              subtextStyle: {
                color: '#90979c',
                fontSize: '16'
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            tooltip: { trigger: 'item' },
            series: [
              {
                name: '入职单位',
                type: 'pie',
                radius: '50%',
                // data: that.showData,
                data: [
                  { value: 2, name: '腾讯' },
                  { value: 3, name: '阿里巴巴' },
                  { value: 5, name: '京东' },
                  { value: 9, name: '美团' },
                  { value: 1, name: '快手' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]

          })
        })
      }())
    }

  }
}
</script>

