
<template>
  <div>
    <div>
      <el-row> 
        <el-col :span="8">
          <el-select v-model="listQuery.cjms_teachtaskAcademicyear" placeholder="学年" clearable 
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="8">
          <el-select v-model="listQuery.cjms_teachtaskAcademicterm" placeholder="学期" clearable
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="8">
          <el-button  style="margin-left:27px;margin-top:15px"  type="primary" @click="changeData">确认</el-button>
        </el-col>
      </el-row> 
    </div> 
    <div id="csdn" style="height:600px;" />
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
        cjms_teachtaskAcademicyear:'',
        cjms_teachtaskAcademicterm:''
      },
      
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],

      classOption: [], // 此页面需要展现的班级信息（此教师/管理员可以查看的班级列表 根据班级列表获得学生列表信息）

      // 展现的数据
      show_xAxis:[],
      show_series_max:[],
      show_series_min:[],
      show_series_avg:[], 

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
      if(this.listQuery.cjms_teachtaskAcademicyear == null || this.listQuery.cjms_teachtaskAcademicyear == ""){
        this.$message({
          showClose: true,
          message: '您需要选择教学学年' 
        });
      }else if(this.listQuery.cjms_teachtaskAcademicterm == null || this.listQuery.cjms_teachtaskAcademicterm == ""){
        this.$message({
          showClose: true,
          message: '您需要选择教学学期', 
        });
      }else {
        var that = this
        const res = (async function() {
          var param={
            teachtaskAcademicyear: that.listQuery.cjms_teachtaskAcademicyear,
            teachtaskAcademicterm: that.listQuery.cjms_teachtaskAcademicterm
          }
          await getOwnScoreForChart(param).then(response => {
            console.log(response)    
            that.show_Data = []
            if(response.data != null){ 
              that.show_Data.push( 
                {
                  value: response.data.score_0_60,
                  name: '不及格'
                },
                {
                  value: response.data.score_60_70,
                  name: '合格'
                },
                {
                  value: response.data.score_70_80,
                  name: '良'
                },
                {
                  value: response.data.score_80_90,
                  name: '良好'
                },
                {
                  value: response.data.score_90_100,
                  name: '优秀'
                } 
              )  
            }   
            var that_ = that 
            var tmpOption = { 
                backgroundColor: '#d9d9d9',
                title: {
                  text: '成绩分布统计',
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
                  // top: 'bottom' 
                  left: 'center',
                  top: 'bottom',
                  data: ['不及格', '合格', '良', '良好', '优秀' ]
   
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '成绩分布统计',
                        type: 'pie',
                        radius: [50, 250],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },   
                         
                        data: that_.show_Data
                        // [
                        //     {value: 40, name: 'rose 1'},
                        //     {value: 38, name: 'rose 2'},
                        //     {value: 32, name: 'rose 3'},
                        //     {value: 30, name: 'rose 4'},
                        //     {value: 28, name: 'rose 5'},
                        //     {value: 26, name: 'rose 6'},
                        //     {value: 22, name: 'rose 7'},
                        //     {value: 18, name: 'rose 8'}
                        // ]
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
      this.chart = echarts.init(document.getElementById('csdn')) 
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

