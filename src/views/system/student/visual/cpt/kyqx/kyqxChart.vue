
<template>
  <div>
    <div>
      <el-select v-model="selClass" placeholder="请选择班级">
        <el-option
          v-for="item in classOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="changeData">确认</el-button>
    </div>
    <div id="container" style=" height:600px;" />
    <!-- <div id="container" style="width: 1250px;height:550px;margin:0 auto;"></div>  -->

    <!-- <div :id="id" :class="className" :style="{height:height,width:width}" ></div> -->
    <!-- <div id="container" style="width: 100%;height:80%;margin:0 auto;"></div>  -->
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getKyqxData, getClasses } from '@/api/student'

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
  /**
   *  {
        "code": 20000,
        "data": [{
            "classid": "172021",
            "total": 100,
            "ky":50,
            "jy":50,
            "myd":70
        }]
    }

   */
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
        await getKyqxData(that.selClass).then(response => {
          var arrtmp = []
          // 返回值data是一个对象obj
          for (var key in response.data) {
            arrtmp.push({ name: key, value: response.data[key] })
          }
          that.showData = arrtmp
          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '考研去向统计',
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
                name: '录取院校',
                type: 'pie',
                radius: '50%',
                // data: that.showData,
                data: [
                  { value: 2, name: '吉林大学' },
                  { value: 7, name: '东北大学' },
                  { value: 9, name: '大连理工大学' },
                  { value: 14, name: '北京航空航天大学' },
                  { value: 3, name: '上海交通大学' }
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
      // async function asyncCall() {
      //   await getClasses().then(response => {
      //     this.chart.setOption({
      //     })
      //   })
      // }
    },
    initChart() {
      // this.chart = echarts.init(document.getElementById(this.id))
      this.chart = echarts.init(document.getElementById('container'))

      var that = this
      const xData = (async function() {
        await getClasses().then(response => {
          that.selClass = response.data[0]
          for (let i = 0; i < response.data.length; i++) {
            that.classOption.push({ value: response.data[i], label: response.data[i] })
          }
        })
        await getKyqxData(that.selClass).then(response => {
          var arrtmp = []
          // 返回值data是一个对象obj
          for (var key in response.data) {
            arrtmp.push({ name: key, value: response.data[key] })
          }
          that.showData = arrtmp
          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '考研去向统计',
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
                name: '录取院校',
                type: 'pie',
                radius: '50%',
                // data: that.showData,
                data: [
                  { value: 2, name: '华南理工大学' },
                  { value: 3, name: '哈尔滨工业大学' },
                  { value: 5, name: '北京理工大学' },
                  { value: 9, name: '南京航空航天大学' },
                  { value: 1, name: '复旦大学' }
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

