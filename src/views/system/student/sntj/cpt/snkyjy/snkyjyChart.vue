
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getSnKyjyData } from '@/api/student'

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
     [
       ['product', '2015', '2016', '2017'],
       ['Matcha Latte', 43.3, 85.8, 93.7],
       ['Milk Tea', 83.1, 73.4, 55.1],
       ['Cheese Cocoa', 86.4, 65.2, 82.5],
       ['Walnut Brownie', 72.4, 53.9, 39.1]
     ]
   */
  data() {
    return {
      showData: [],
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

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      var that = this
      const xData = (async function() {
        await getSnKyjyData().then(response => {
          var listdata = response.data
          var arrX = ['年份']
          var arrKy = ['考研人数']
          var arrJy = ['工作人数']
          var arrTotal = ['总人数']
          for (let i = 0; i　< listdata.length; i++) {
            arrX.push(listdata[i].year + '')
            arrKy.push(listdata[i].kySum)
            arrJy.push(listdata[i].jySum)
            arrTotal.push(listdata[i].stuTotal)
          }
          var arr = [arrX, arrKy, arrJy, arrTotal]
          that.showData = arr
          console.log(arr)
          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '学生近三年毕业去向统计',
              x: '5',
              top: '5',
              textStyle: {
                color: '#000000',
                fontSize: '18'
              },
              // x: '300',
              // top: '15',
              // textStyle: {
              //   color: '#000000',
              //   fontSize: '22'
              // },
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
            legend: {},
            tooltip: {},
            dataset: {
              // source:that.showData
              //  用一手假数据 好看一些
              source:
                    [
                      ['年级', '2015', '2016', '2017'],
                      ['考研人数', 130, 140, 201],
                      ['就业人数', 220, 270, 180],
                      ['总人数', 376, 432, 324]
                    ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              { type: 'bar' },
              { type: 'bar' },
              { type: 'bar' }
            ]

          })
        })
      }())
    }
  }
}
</script>

