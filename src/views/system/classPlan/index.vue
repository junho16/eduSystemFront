<template> 
  <div>
    <el-dialog
      title="提示"
      :visible.sync="re_classplan_dialogVisible"
      width="40%" >
      <span>该学期、学年下的课程已经编排，重新编排会删除原编排计划。是否重排？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="re_classplan_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="re_create_classplan">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="课程编排-换课"
      :visible.sync="update_dialogVisible"
      width="50%" >
      <span>请选择换课信息</span>
        <div style="margin-top:10px">
          <el-select v-model="updatelistQuery.from_teachtaskAcademicyear" placeholder="学年" clearable 
              style="width:200px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select v-model="updatelistQuery.from_teachtaskAcademicterm" placeholder="学期" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select v-model="updatelistQuery.from_day" placeholder="工作日" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in dayOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select v-model="updatelistQuery.from_jc" placeholder="节次" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in jcOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </div>
       
        <div style="margin-top:10px"> 
          <el-select disabled v-model="updatelistQuery.to_teachtaskAcademicyear" placeholder="学年" clearable 
              style="width:200px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select  disabled v-model="updatelistQuery.to_teachtaskAcademicterm" placeholder="学期" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select v-model="updatelistQuery.to_day" placeholder="工作日" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in dayOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
          <el-select v-model="updatelistQuery.to_jc" placeholder="节次" clearable
              style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in jcOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </div>
       

      <span slot="footer" class="dialog-footer">
        <el-button @click="update_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateClassPlan">确 定</el-button>
      </span>
    </el-dialog>
    <div style="margin-top:10px">
      <el-row> 
          <el-col :span="24">
              <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
                  style="width:200px;margin-left:17px" class="filter-item">
                <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
              </el-select> 
              <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
                  style="width:150px;margin-left:17px" class="filter-item">
                <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
              </el-select> 
              <el-button class="filter-item"  style="width:190px; margin-left: 25px;" type="primary" icon="el-icon-search" @click="fetchClassPlan">
                查询课表
              </el-button> 
              <el-button v-if="role != 'student' && role != 'teacher'  "  class="filter-item"  style="width:210px; margin-left: 25px;" type="primary" icon="el-icon-notebook-2" @click="createNewClassPlan">
                生成课表
              </el-button>  
              <el-button v-if="role != 'student' && role != 'teacher'  " class="filter-item"  style="width:210px; margin-left: 25px;" type="primary" icon="el-icon-notebook-2" @click="update_dialogVisible = true">
                课表换课
              </el-button> 
            
          </el-col> 
      </el-row>
    </div>
 
    <div class="class-table">
        <div class="table-wrapper">
            <div class="tabel-container">

                <table>
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th v-for="(weekNum, weekIndex) in dayeData " :key="weekIndex"> {{'周' + weekNum}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(lesson, lessonIndex) in classTableData.lessons" :key="lessonIndex">
                            <td>
                                <p>{{'第' + digital2Chinese(lessonIndex+1) + "节"}}</p>
                                <p class="period">{{ lesson }}</p>
                            </td>

                            <td v-for="(course, courseIndex) in classTableData.courses" :key="courseIndex">
                              <div style="text-align:left;font-size:12px">
                                <span v-html="classTableData.courses[courseIndex][lessonIndex]"> 
                                </span>
                              </div>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import user from '@/store/modules/user'
import {
  zdpk,
  rePk,
  fetchClassPlan,
  fetchClassPlanWithRole,
  updateClassPlan
} from '@/api/classplan'
export default {
  name: 'Teacher',
  data() {
   return {
      //当前角色
      role: null,

      //重新排课
      re_classplan_dialogVisible: false,
      
      //换课
      update_dialogVisible: false,

      updatelistQuery:{
        from_teachtaskAcademicyear:null,
        from_teachtaskAcademicterm:null,
        from_day:null,
        from_jc:null,

        to_teachtaskAcademicyear:null,
        to_teachtaskAcademicterm:null,
        to_day:null,
        to_jc:null,
        
      },

      listQuery:{
        teachtaskAcademicyear:null,
        teachtaskAcademicterm:null
      },
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],
      dayOptions:[],
      jcOptions:[],
      classTableData: {
          lessons: [
              '08:00-09:40',
              '10:00-11:40',
              '14:00-15:40',
              '16:00-17:40',
              '19:00-20:40',
              '21:00-21:40' 
          ],
          courses: [
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', '']
          ]
          // courses: [
          //     ['', '', '', '', '', '', '', ''],
          //     ['生物', '物理', '化学', '政治', '历史', '英语', '', '语文'],
          //     ['语文', '数学', '英语', '历史', '', '化学', '物理', '生物'],
          //     ['生物', '', '化学', '政治', '历史', '英语', '数学', '语文'],
          //     ['语文', '数学', '英语', '历史', '政治', '', '物理', '生物'],
          //     ['生物', '物理', '化学', '', '历史', '英语', '数学', '语文'],
          //     ['语文', '数学', '英语', '', '', '', '', ''],
          // ]
      },
      dayeData: [
        '一', '二', '三', '四', '五', '六', '日' 
      ]

    }; 
  },
  created() {
    this.role = user.state.roles
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

    for(let i = 1 ; i <=7 ; i++){ 
      var obj = {
        label : "周"+this.dayeData[i-1]+"",
        value : i
      }  
      this.dayOptions.push(obj)
    } 
    // for(let i = 1 ; i <=7 ; i++){  
    this.jcOptions = [{
        label : "第一、二节次",
        value : 1
      },{
        label : "第三、四节次",
        value : 2
      } ,{
        label : "第五、六节次",
        value : 3
      } ,{
        label : "第七、八节次",
        value : 4
      } ,{
        label : "第九、十节次",
        value : 5
      } ,{
        label : "第十一节次",
        value : 6
      }   
    ] 
    // }   

  // /* mock随机数据*/
  // Mock.mock({
  //     lessons: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
  //     'courses|7': [['生物', '物理', '化学', '政治', '历史', '英语', '', '语文']]
  // });
  },
  methods: {
      /**
      * 数字转中文
      * @param {Number} num 需要转换的数字
      * @param {String} identifier 标识符
      * @returns {String} 转换后的中文
      */
      digital2Chinese(num, identifier) {
          const character = ['零', '一、二', '三、四', '五、六', '七、八',  '九、十', '十一', ];
          return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num];
      },
      fetchClassPlan(){
        var param = {
          teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear,
          teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm
        } 
        if(param.teachtaskAcademicyear==null || param.teachtaskAcademicyear==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学年！',
            type: 'error'
          });
        }else if(param.teachtaskAcademicterm==null || param.teachtaskAcademicterm==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学期！',
            type: 'error'
          });
        }else{
          var that = this
          if(this.role != 'teacher' && this.role != 'student'){
            fetchClassPlan(param).then(response => {    
              console.log(response)
              if(response.code == 20000){
                var tmp = [
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', '']
                ]
                for(let i = 0 ; i < response.data.length ;i++){
                  var content = 
                  
                    "" + response.data[i].courseName + '</br>'+
                    "教室: " + response.data[i].classroomName +  '</br>'+
                    "教师: " + response.data[i].teacherName +  '</br>'+
                    "时间: " + "第"+response.data[i].startTime + "周-" + 
                        "第"+response.data[i].endTime + "周" +  '</br>'

                  if(response.data[i].professionName != null){
                    content += ("" +  response.data[i].professionName)
                  }
                  if(response.data[i].classid != null){
                    content += (" "+response.data[i].classid +  '</br>' )
                  }
                
                  content += " 教学任务编号: " + response.data[i].teachtaskId  +" "
                  // console.log(content)
                  // console.log(response.data[i].classplanDay)
                  // console.log(response.data[i].classplanClassnum-1)
                  tmp [ response.data[i].classplanDay-1 ] [response.data[i].classplanClassnum-1] = content
                    
                }
                that.classTableData.courses = tmp
              }else{
                this.$notify({
                  title: '错误',
                  message: '发生错误,'+response.message,
                  type: 'error',
                  duration: 2000
                })   
              }
            }) 
          }else{ 
            console.log(param)
            fetchClassPlanWithRole(param).then(response => {    
              console.log(response)
              if(response.code == 20000){
                var tmp = [
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', '']
                ]
                for(let i = 0 ; i < response.data.length ;i++){
                  var content = 
                  
                    "" + response.data[i].courseName + '</br>'+
                    "教室: " + response.data[i].classroomName +  '</br>'+
                    "教师: " + response.data[i].teacherName +  '</br>'+
                    "时间: " + "第"+response.data[i].startTime + "周-" + 
                        "第"+response.data[i].endTime + "周" +  '</br>'

                  if(response.data[i].professionName != null){
                    content += ("" +  response.data[i].professionName)
                  }
                  if(response.data[i].classid != null){
                    content += (" "+response.data[i].classid +  '</br>' )
                  }
                
                  content += " 教学任务编号: " + response.data[i].teachtaskId  +" " 
                  tmp [ response.data[i].classplanDay-1 ] [response.data[i].classplanClassnum-1] = content
                    
                }
                that.classTableData.courses = tmp
              }else{
                this.$notify({
                  title: '错误',
                  message: '发生错误,'+response.message,
                  type: 'error',
                  duration: 2000
                })   
              }
            }) 
          }
       
        }
      },
      createNewClassPlan(){ 
        var param = {
          teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear,
          teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm
        } 
         if(param.teachtaskAcademicyear==null || param.teachtaskAcademicyear==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学年！',
            type: 'error'
          });
        }else if(param.teachtaskAcademicterm==null || param.teachtaskAcademicterm==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学期！',
            type: 'error'
          });
        }else{
          var that = this 
          // console.log(param)
          zdpk(param).then(response => {   
            if(response.code == 20000){ 
              console.log(response)
              if(typeof(response.data) == 'string' ) {
                //已经排过课程了
                this.$notify({
                  title: '错误',
                  message: '此学年学期下已排过课了！',
                  type: 'error',
                  duration: 5000
                })   
                that.re_classplan_dialogVisible = true
              }else{
                console.log(response)
                this.$notify({
                  title: '成功',
                  message: '排课成功！',
                  type: 'success',
                  duration: 5000
                })    
              }
             
              
              // var dataArr = []
              // for(let i = 0 ; i < response.data.data.length ; i++){
              //   dataArr.push({
              //     timestamp: response.data.data[i].tipTime, 
              //     content: response.data.data[i].tipContent,
              //     ischeck: response.data.data[i].tipIscheck,
              //     tip: response.data.data[i]
              //   })
              // } 
              // this.tipList = dataArr
              // this.total = response.data.total   
              // this.listLoading = false  
            }
          })  
        }
      },
      re_create_classplan(){
        var param = {
          teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear,
          teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm
        } 
        if(param.teachtaskAcademicyear==null || param.teachtaskAcademicyear==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学年！',
            type: 'error'
          });
        }else if(param.teachtaskAcademicterm==null || param.teachtaskAcademicterm==""){
          this.$message({
            showClose: true,
            message: '对不起，需要选择学期！',
            type: 'error'
          });
        }else{
          var that = this 
          rePk(param).then(response => {   
            if(response.code == 20000){  
              console.log(response)
              that.re_classplan_dialogVisible = false
              this.$notify({
                title: '成功',
                message: '重新排课成功！',
                type: 'success',
                duration: 5000
              }) 
              
              
            }
          })  
        }
      },
      updateClassPlan(){
        var param = {
          from_teachtaskAcademicyear : this.updatelistQuery.from_teachtaskAcademicyear,
          from_teachtaskAcademicterm : this.updatelistQuery.from_teachtaskAcademicterm,
          from_day : this.updatelistQuery.from_day,
          from_jc : this.updatelistQuery.from_jc,

          to_teachtaskAcademicyear : this.updatelistQuery.from_teachtaskAcademicyear,
          to_teachtaskAcademicterm : this.updatelistQuery.from_teachtaskAcademicterm,
          to_day : this.updatelistQuery.to_day,
          to_jc : this.updatelistQuery.to_jc,
        } 
        if(
          param.from_teachtaskAcademicyear == null || 
          param.from_teachtaskAcademicterm == null || 
          param.from_day == null || 
          param.from_jc == null || 

          param.to_teachtaskAcademicyear == null || 
          param.to_teachtaskAcademicterm == null || 
          param.to_day == null || 
          param.to_jc == null ||

          param.from_teachtaskAcademicyear == "" || 
          param.from_teachtaskAcademicterm == "" || 
          param.from_day == "" || 
          param.from_jc == "" || 

          param.to_teachtaskAcademicyear == "" || 
          param.to_teachtaskAcademicterm == "" || 
          param.to_day == "" || 
          param.to_jc == ""
        ){
          this.$message({
            showClose: true,
            message: '对不起，参数缺失，请检查！',
            type: 'error'
          }); 
        }else{
          var that = this
          updateClassPlan(param).then(response => {    
            console.log(response)
            if(response.code == 20000){
              this.$notify({
                title: '成功',
                message: 'SUCCESS！课程编排信息对换成功！',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '错误',
                message: '发生错误,'+response.message,
                type: 'error',
                duration: 2000
              })  
            } 
            this.update_dialogVisible = false
          }) 
        }
      }
  
  } 
}
</script>
<style lang="scss" scoped>
.class-table {
    .table-wrapper {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .tabel-container {
        margin: 7px;

        table {
            table-layout: fixed;
            width: 100%;

            thead {
                background-color: #67a1ff;
                th {
                    color: #fff;
                    line-height: 17px;
                    font-weight: normal;
                }
            }
            tbody {
                background-color: #eaf2ff;
                td {
                    color: #677998;
                    line-height: 12px;
                }
            }
            th,
            td {
                width: 60px;
                padding: 12px 2px;
                font-size: 12px;
                text-align: center;
            }

            tr td:first-child {
                color: #333;
                .period {
                    font-size: 8px;
                }
            }
        }
    }
}
</style>  