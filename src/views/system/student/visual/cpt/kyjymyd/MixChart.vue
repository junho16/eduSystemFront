
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getKyjymydData } from '@/api/student'

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
      // 对象数组 初始化出的每个班的具体情况
      allClassData: [],
      // 展示的班级名列表 "172021,272022"
      showClassIdArr: [],
      mydData: [],
      kydData: [],
      jyData: [],
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
    /**
    *{
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      var that = this
      const xData = (async function() {
        // return that.showClassIdArr
        // return ['172021','172021','172021','172022'
        // console.log(that.showClassIdArr)
        await getKyjymydData().then(response => {
          var resData = []
          var listdata = response.data
          // arr:{} 每个班的对象
          var arr = []
          var mydDataArr = []
          var kyDataArr = []
          var jyDataArr = []

          for (let i = 0; i　< listdata.length; i++) {
            arr[i] = listdata[i]
            resData.push(listdata[i].classid)
            mydDataArr.push(listdata[i].myd)
            kyDataArr.push(listdata[i].ky)
            jyDataArr.push(listdata[i].jy)
          }
          that.allClassData = arr
          that.showClassIdArr = resData

          that.mydData = mydDataArr
          that.kyData = kyDataArr
          that.jyData = jyDataArr

          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '学生毕业统计',
              x: '5',
              top: '5',
              textStyle: {
                color: '#000000',
                fontSize: '18'
              },
              subtextStyle: {
                color: '#90979c',
                fontSize: '16'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
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
              data: ['考研', '工作', '均满意度']
            },
            xAxis: [
              {
                type: 'category',
                // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                // data: that.showClassIdArr,
                // data: ['172021','172021','172021','172022'],
                data: that.showClassIdArr,
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数',
                min: 0,
                max: 45,
                interval: 5,
                axisLabel: {
                  formatter: '{value} 人'
                }
              },
              {
                type: 'value',
                name: '均满意度',
                min: 0,
                max: 100,
                interval: 25,
                axisLabel: {
                  formatter: '{value} /100'
                }
              }
            ],
            series: [
              {
                name: '考研',
                type: 'bar',
                // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                // data: [2, 4, 7, 23]
                data: that.kyData
              },
              {
                name: '工作',
                type: 'bar',
                // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                // data: [2, 5, 9, 2]
                data: that.jyData
              },
              {
                name: '均满意度',
                type: 'line',
                yAxisIndex: 1,
                // data: [2, 2, 3, 5]
                // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                data: that.mydData
              }
            ]
          })
        })
      }())
    }
  }
}
</script>

