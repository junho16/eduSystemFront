
<template>
  <div>
    <div>
      <el-row>
        <el-col :span="8">
          <el-select
            style="margin-left:7px;margin-top:15px;margin-bottom:10px" class="filter-item" 
            v-model="listQuery.selClass" placeholder="请选择班级">
            <el-option
              v-for="item in classOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
            style="margin-left:7px;margin-top:15px;margin-bottom:10px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
            style="margin-left:7px;margin-top:15px;margin-bottom:10px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="4">
          <el-button  style="margin-left:27px;margin-top:15px;margin-bottom:10px"  type="primary" @click="changeData">确认</el-button>
        </el-col>
      </el-row> 
    </div> 
    <div id="cdn" style="height:600px;" />
  </div> 
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getJyqxData, getClasses,getClassesForEveryTsk } from '@/api/student'
import { getStudentScoreForChart } from '@/api/score'

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
       listQuery:{
        selClass: '',
        teachtaskAcademicyear:'',
        teachtaskAcademicterm:''
      },
     
      teacherOptions:[],
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],

      classOption: [], // 此页面需要展现的班级信息（此教师/管理员可以查看的班级列表 根据班级列表获得学生列表信息）

      // 展现的数据
      show_xAxis:[],
      show_series_max:[],
      show_series_min:[],
      show_series_avg:[], 

      show_score_0_60:[],
      show_score_60_70:[],
      show_score_70_80:[], 
      show_score_80_90:[],
      show_score_90_100:[],

      showData: [], // 展现的数据
      chart: null
    }
  },
  mounted() {
     this.$message({
      showClose: true,
      message: '您可以选择班级、学年、学期进行分析',
      duration: 6000
    });
     // 补充正常数据到选择框
    var myDate = new Date()
    var yearNow = myDate.getFullYear(); //(4位,1970-????)
    for(let i = yearNow+1 ; i > yearNow-10 ; i--){
      // 年份统一格式是2019-2020-1/2 value记录的时候记录左年份 如 2019代表2019-2020
      var obj = {
        label : i-1+"-"+i+"学年",
        value : i-1+""
      }  
      this.teachtaskAcademicyearOptions.push(obj)
    } 
    for(let i = 1 ; i <=2 ; i++){ 
      var obj = {
        label : "第"+i+"学期",
        value : i+""
      }  
      this.teachtaskAcademictermOptions.push(obj)
    } 
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
      console.log(this.listQuery)
      if(this.listQuery.selClass == null || this.listQuery.selClass == "" ){
        this.$message({
          showClose: true,
          message: '对不起，请选择班级！',
          type: 'error'
        });
      }else if(this.listQuery.teachtaskAcademicyear == null || this.listQuery.teachtaskAcademicyear == ""){
        this.$message({
          showClose: true,
          message: '您需要选择教学学年' 
        });
      }else if(this.listQuery.teachtaskAcademicterm == null || this.listQuery.teachtaskAcademicterm == ""){
        this.$message({
          showClose: true,
          message: '您需要选择教学学期', 
        });
      }else {
        var that = this
        const res = (async function() {
          await getStudentScoreForChart(that.listQuery).then(response => {
            console.log(response) 
            that.show_xAxis = []
            that.show_score_0_60 = []
            that.show_score_60_70 = []
            that.show_score_70_80 = []
            that.show_score_80_90 = []
            that.show_score_90_100 = []
            if(response.data.length != 0){
              for(let i = 0 ; i < response.data.length ; i++){
                that.show_xAxis.push(response.data[i].coursename)
                that.show_score_0_60.push(response.data[i].score_0_60)
                that.show_score_60_70.push(response.data[i].score_60_70)
                that.show_score_70_80.push(response.data[i].score_70_80)
                that.show_score_80_90.push(response.data[i].score_80_90)
                that.show_score_90_100.push(response.data[i].score_90_100)
              }  
            }  
            var that_ = that 
            var tmpOption = {

                backgroundColor: '#d9d9d9',
                title: {
                  text: '成绩分段统计',
                  x: '50',
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
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // Use axis to trigger tooltip
                      type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                legend: {
                  data: ['不及格', '合格', '良', '良好', '优秀']
                },
                grid: {
                    left: '3%',
                    right: '2%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    data:  that_.show_xAxis
                },
                series: [
                    {
                        name: '不及格',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: that_.show_score_0_60 
                        // data: [320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '合格',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        // data: [120, 132, 101, 134, 90, 230, 210]
                        data: that_.show_score_60_70
                        
                    },
                    {
                        name: '良',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        // data: [220, 182, 191, 234, 290, 330, 310]
                        data:  that_.show_score_70_80 
                    },
                    {
                        name: '良好',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        }, 
                        data: that_.show_score_80_90
                        // data: [150, 212, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '优秀',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        }, 
                        data: that_.show_score_90_100
                        // data: [820, 832, 901, 934, 1290, 1330, 1320]
                    }
                ]
              }
            that_.chart.setOption(
              tmpOption
            )
          })
        }()) 
      } 
    },
    initChart() {
      // this.chart = echarts.init(document.getElementById(this.id))
      this.chart = echarts.init(document.getElementById('cdn'))

      var that = this
      const xData = (async function() {
        await getClassesForEveryTsk().then(response => {
          that.listQuery.selClass = response.data[0]
          for (let i = 0; i < response.data.length; i++) {
            that.classOption.push({ value: response.data[i], label: response.data[i] })
          }
        }) 
      }())
    }

  }
}
</script>
//  await getJyqxData(that.selClass).then(response => {
//           var arrtmp = []
//           // 返回值data是一个对象obj
//           for (var key in response.data) {
//             arrtmp.push({ name: key, value: response.data[key] })
//           }
//           that.showData = arrtmp
//           that.chart.setOption({
//             backgroundColor: '#d9d9d9',
//             title: {
//               text: '就业去向统计',
//               x: '300',
//               top: '15',
//               textStyle: {
//                 color: '#000000',
//                 fontSize: '22'
//               },
//               subtextStyle: {
//                 color: '#90979c',
//                 fontSize: '16'
//               }
//             },
//             toolbox: {
//               feature: {
//                 dataView: { show: true, readOnly: false },
//                 magicType: { show: true, type: ['line', 'bar'] },
//                 restore: { show: true },
//                 saveAsImage: { show: true }
//               }
//             },
//             legend: {
//               orient: 'vertical',
//               left: 'left'
//             },
//             tooltip: { trigger: 'item' },
//             series: [
//               {
//                 name: '入职单位',
//                 type: 'pie',
//                 radius: '50%',
//                 // data: that.showData,
//                 data: [
//                   { value: 2, name: '腾讯' },
//                   { value: 3, name: '阿里巴巴' },
//                   { value: 5, name: '京东' },
//                   { value: 9, name: '美团' },
//                   { value: 1, name: '快手' }
//                 ],
//                 emphasis: {
//                   itemStyle: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                   }
//                 }
//               }
//             ]

//           })
//         })

