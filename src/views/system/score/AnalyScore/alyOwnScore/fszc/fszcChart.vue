
<template>
  <div>
    <div>
      <el-row> 
        <el-col :span="8">
          <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="8">
          <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="8">
          <el-button  style="margin-left:27px;margin-top:15px"  type="primary" @click="changeData">确认</el-button>
        </el-col>
      </el-row> 
    </div> 
    <div id="cnnn" style="height:600px;" />
  </div> 
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getJyqxData, getClasses } from '@/api/student'
import { getOwnScoreForChart } from '@/api/score'

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
        teachtaskAcademicyear:'',
        teachtaskAcademicterm:''
      },
      
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],

     
      // 展现的数据
      show_xAxis:[],
      show_series_max:[],
      show_series_min:[],
      show_series_avg:[], 
      
       
      show_scoreSum:[],
      show_score_kq:[],
      show_score_ps:[],
      show_score_qm:[],
      show_score_qz:[],
      show_score_sy:[],

      show_indicator:[],
      show_legend:[], 
      show_Data: [], // 展现的数据


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
      if(this.listQuery.teachtaskAcademicyear == null || this.listQuery.teachtaskAcademicyear == ""){
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
          await getOwnScoreForChart(that.listQuery).then(response => {
            console.log(response)  
            
            that.show_legend = [] 
            that.show_scoreSum = [] 
            that.show_score_kq = [] 
            that.show_score_ps = [] 
            that.show_score_qm = [] 
            that.show_score_qz = [] 
            that.show_score_sy = [] 
            that.show_Data = []
            if(response.data.data.length != 0){
              for(let i = 0 ; i < response.data.data.length ; i++){
                 
                that.show_legend.push(response.data.data[i].courseName)

                var scoredata = []
                that.show_scoreSum.push(response.data.data[i].scoreSum)
                that.show_score_kq.push(response.data.data[i].score_kq)
                that.show_score_ps.push(response.data.data[i].score_ps)
                that.show_score_qm.push(response.data.data[i].score_qm)
                that.show_score_qz.push(response.data.data[i].score_qz)
                that.show_score_sy.push(response.data.data[i].score_sy)
          
                scoredata.push(response.data.data[i].scoreSum)
                scoredata.push(response.data.data[i].score_kq)
                scoredata.push(response.data.data[i].score_ps)
                scoredata.push(response.data.data[i].score_qm)
                scoredata.push(response.data.data[i].score_qz)
                scoredata.push(response.data.data[i].score_sy)
                that.show_Data.push({
                  value: scoredata,
                  name: response.data.data[i].courseName
                }) 
              }  
            }   
            var that_ = that 
            var tmpOption = { 
                backgroundColor: '#d9d9d9',
                title: {
                  text: '成绩组成统计',
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
                legend: {
                  // data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                  data: that_.show_legend
                },
                radar: { 
                    indicator: [
                        { name: '总成绩', max: 100},
                        { name: '考勤成绩', max: 100},
                        { name: '平时成绩', max: 100},
                        { name: '期末成绩', max: 100},
                        { name: '期中成绩', max: 100},
                        { name: '实验成绩', max: 100}
                    ]
                    // indicator: 
                    // [
                    //     { name: '销售（Sales）', max: 6500},
                    //     { name: '管理（Administration）', max: 16000},
                    //     { name: '信息技术（Information Technology）', max: 30000},
                    //     { name: '客服（Customer Support）', max: 38000},
                    //     { name: '研发（Development）', max: 52000},
                    //     { name: '市场（Marketing）', max: 25000}
                    // ]
                },
                series: [{
                    name: '成绩组成统计',
                    type: 'radar',
                    data: that_.show_Data  
                    // [
                    //     {
                    //         value: [4200, 3000, 20000, 35000, 50000, 18000],
                    //         name: '预算分配（Allocated Budget）'
                    //     },
                    //     {
                    //         value: [5000, 14000, 28000, 26000, 42000, 21000],
                    //         name: '实际开销（Actual Spending）'
                    //     }
                    // ]
                }]
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
      this.chart = echarts.init(document.getElementById('cnnn')) 
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

