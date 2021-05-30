
<template>
  <div>
    <div>
      <el-row>
        <el-col :span="8">
          <el-cascader
            v-model="listQuery.selTeacher"
            :options="teacherOptions"
            placeholder="选择老师" 
            clearable
            style="margin-top:15px" 
            class="filter-item" 
            > 
          </el-cascader> 
        </el-col>
        <el-col :span="8">
          <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
            style="margin-left:7px;margin-top:15px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-col>
        <el-col :span="4">
          <el-button  style="margin-left:27px;margin-top:15px"  type="primary" @click="changeData">确认</el-button>
        </el-col>
      </el-row> 
    </div>
    <div id="nb" style="height:600px;" />
    <!-- <div id="container" style="width: 1250px;height:550px;margin:0 auto;"></div>  -->

    <!-- <div :id="id" :class="className" :style="{height:height,width:width}" ></div> -->
    <!-- <div id="container" style="width: 100%;height:80%;margin:0 auto;"></div>  -->
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
// import { getJyqxData, getClasses } from '@/api/student'
import { 
  fetchTeacherList, 
  fetchTeachTaskList,   
} from '@/api/teachtask'

import { 
  getTkData,  
} from '@/api/tk'

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
        selTeacher: '',
        teachtaskAcademicyear:'',
        teachtaskAcademicterm:''
      },
     
      teacherOptions:[],
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],
      
      scoresData: [], 
      scoresLegendData: [],
      chart: null,
 

    }
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '您可以选择教师进行分析',
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
      /**
        if(this.listQuery.teachtaskAcademicyear == null || this.listQuery.teachtaskAcademicyear == ""){
          this.$message({
            showClose: true,
            message: '您可以选择教学学年' 
          });
        }
        if(this.listQuery.teachtaskAcademicterm == null || this.listQuery.teachtaskAcademicterm == ""){
          this.$message({
            showClose: true,
            message: '您可以选择教学学期', 
          });
        }
       */
      if(this.listQuery.selTeacher == null || this.listQuery.selTeacher == "" ){
        this.$message({
          showClose: true,
          message: '对不起，请选择教师！',
          type: 'error'
        });
      }else{
        var that = this
        const res = (async function() { 
          var teacherid = that.listQuery.selTeacher[1] 
          var param = {
            selTeacher: teacherid,
            teachtaskAcademicyear: that.listQuery.teachtaskAcademicyear,
            teachtaskAcademicterm: that.listQuery.teachtaskAcademicterm
          }      
          // console.log(that.listQuery)
          await getTkData(param).then(response => { 
            if(response.code === 20000){ 
              // console.log("scores" )
              // console.log(response)
              /**
                teachtaskId: "44cd79ee"
                tkBtkjsid: "222222"
                tkClasses: "123"
                tkComments: "%253Cp%253E123%253C%252Fp%253E"
                tkContentShort: "231"
                tkId: "bB4k9kln"
                tkJc: "1"
                tkJudge: "123"
                tkNeednum: null
                tkRealnum: null
                tkScore: 5
                tkTags: "示例;123"
                tkTime: "2021-04-25T01:15:45.000+00:00"
                tkTitle: "123"
                tkTkjsid: "123123"
              */ 
              var data = response.data //数组
             
              var scoresmap = new Map(); 
              for(let i = 0; i < data.length ;i++ ){   
                if(scoresmap.get(data[i].tkScore+"星分数") == null){
                  scoresmap.set(data[i].tkScore+"星分数",1) 
                }else{
                  scoresmap.set(data[i].tkScore+"星分数", scoresmap.get(data[i].tkScore+"星分数")+1 ) 
                } 
              }   
              // console.log(scoresmap)
 
              var scorestmp = []   
              var scoresLegendData = [] 
              scoresmap.forEach(function(value , key){ 
                scorestmp.push({ name:key , value: value})   
                scoresLegendData.push(key) 
              }) 
              /**
                 0: {"示例" => 1}
                 1: {"123" => 1}
               */   
              that.scoresData = scorestmp 
              that.scoresLegendData = scoresLegendData 

              that.chart.setOption({
                backgroundColor: '#d9d9d9',
                title: {
                  text: '评分',
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
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    top: 'bottom',
                    data: that.scoresLegendData
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
                      name: '分数统计',
                      type: 'pie',
                      radius: [20, 140],  
                      center: ['50%', '50%'],
                      roseType: 'area',
                      itemStyle: {
                        borderRadius: 5
                      },
                      data: that.scoresData
                  } 
                ]
              })  
             
            }else{
              that.$notify.error({
                title: '错误',
                message: '对不起，获取该教师教学质量记录失败！请稍后再试 ~'
              });
            }
          })
        }())
      }
     
    },
    initChart() {
      // this.chart = echarts.init(document.getElementById(this.id))
      this.chart = echarts.init(document.getElementById('nb'))

      var that = this
      const xData = (async function() {
        await fetchTeacherList().then(response => {   
          
          // console.log(response) 
          var data = response.data
          var collegeArr = []
          var teachersArr = [] 

          for(let i = 0 ; i < data.length ;i++){
            // 学院
            var collegeObjTmp = data[i]
            var collegeObj = new Object();
            collegeObj.value = collegeObjTmp.collegeid
            collegeObj.label = collegeObjTmp.collegename
            collegeObj.children = [] 
            // console.log(collegeObjTmp.professions) 
            // console.log(typeof(collegeObjTmp.professions))
            teachersArr = []
            for(let j = 0 ; j < collegeObjTmp.teachers.length ; j++){
              
              // console.log(collegeObjTmp.professions[j])
              // 专业
              var teacherObjTmp = collegeObjTmp.teachers[j]
              var teacherObj = new Object();
              teacherObj.value = teacherObjTmp.teacherId
              teacherObj.label = teacherObjTmp.teacherName 
              teachersArr.push(teacherObj) 
            }  
            // collegeObj.children.push(professionArr) 
            collegeObj.children = teachersArr
            collegeArr.push(collegeObj) 
          } 
          // console.log( collegeArr)
          that.teacherOptions = collegeArr
        }) 
      }())
    }

  }
}
</script>

