<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>课程: {{courseName}}</span> 
      </div>
      <div style="display:inline">
         
        <div style="display:inline">  
          <div style="display:inline;margin-right:35px;"> <i class="header-icon el-icon-star-on"></i>  教学任务编号：{{this.teachtaskid}}   </div>
          <div style="display:inline;margin-right:35px;"> <i class="header-icon el-icon-office-building"></i>  所属学院：{{this.collegeName}} </div>
          <div style="display:inline;margin-right:35px;"> <i class="header-icon el-icon-files"></i>  专业名称：{{this.professionName}}  </div>
          <div style="display:inline;margin-right:35px;"> <i class="header-icon el-icon-collection"></i>  成绩录入-当前班级： {{this.classId}} </div>
        </div>
      </div>
    </el-card>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      fit
      highlight-current-row
      style="width: 100%;">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline style="font-size:10px" >
          <div style="display:inline;margin-right:35px;"> 
            <el-form-item label="班级:" >
            <span>{{ props.row.classId }}</span> 
            </el-form-item> 
          </div>
          <div style="display:inline;margin-right:35px;"> 
            <el-form-item label=" 邮箱:" >
            <span> {{  props.row.studentEmail  }} </span>
          </el-form-item> 
          </div>
          <div style="display:inline;margin-right:35px;">  
           <el-form-item label=" 联系方式:" >
            <span> {{ props.row.studentPhone }} </span>
          </el-form-item>    
          </div>
          <div style="display:inline;margin-right:35px;">
             <el-form-item label=" 性别:" >
            <span> {{ props.row.studentGender=='0'?'男':'女' }} </span>
          </el-form-item>  
          </div>   
          <div style="display:inline;margin-right:35px;"> 
            <el-form-item label=" 学院:" >
            <span> {{ computedSiteType(props.row.collegeId) }}  </span>
          </el-form-item>     
          </div>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="学号" align="center" width="100px">
      <template slot-scope="{row}">
        <span>{{ row.studentId }}</span>
      </template>
    </el-table-column>
    <el-table-column label="姓名" width="120px" align="center">
      <template slot-scope="{row}">
        <span>{{ row.studentName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="班级" width="80px" align="center">
      <template slot-scope="{row}">
        <span >{{ row.classId }}</span>
      </template>
    </el-table-column> 
    <el-table-column label="考勤成绩" width="150px" align="center">
      <template slot-scope="scope">
          <el-input placeholder="请键入分数" v-show="scope.row.show" v-model="scope.row.score_kq"></el-input>
          <span v-show="!scope.row.show">{{scope.row.score_kq}}</span>
      </template>
    </el-table-column> 
    <el-table-column label="平时成绩" width="150px" align="center">
      <template slot-scope="scope">
          <el-input placeholder="请键入分数" v-show="scope.row.show" v-model="scope.row.score_ps"></el-input>
          <span v-show="!scope.row.show">{{scope.row.score_ps}}</span>
      </template>
    </el-table-column>  
    <el-table-column label="实验成绩" width="150px" align="center">
      <template slot-scope="scope">
          <el-input placeholder="请键入分数" v-show="scope.row.show" v-model="scope.row.score_sy"></el-input>
          <span v-show="!scope.row.show">{{scope.row.score_sy}}</span>
      </template>
    </el-table-column> 
    <el-table-column label="期中成绩" width="150px" align="center">
      <template slot-scope="scope">
          <el-input placeholder="请键入分数" v-show="scope.row.show" v-model="scope.row.score_qz"></el-input>
          <span v-show="!scope.row.show">{{scope.row.score_qz}}</span>
      </template>
    </el-table-column>  
    <el-table-column label="期末成绩" width="150px" align="center">
      <template slot-scope="scope">
          <el-input placeholder="请键入分数" v-show="scope.row.show" v-model="scope.row.score_qm"></el-input>
          <span v-show="!scope.row.show">{{scope.row.score_qm}}</span>
      </template>
    </el-table-column> 


    <el-table-column label="操作" align="center">
        <template slot-scope="scope" align="center" width="400" class-name="small-padding fixed-width">
            <el-button @click="scope.row.show =true">编辑</el-button>
            <el-button @click="scope.row.show =false">保存</el-button>
        </template>
    </el-table-column>
   
  </el-table> 
  <div  style="width:90%;margin:0 auto;margin-top:30px" >
    <el-button style="width:100%" type="primary" plain @click="saveScore()">确认提交</el-button>
  </div>
 
  </div>
</template>

<script>
import qs from 'qs'
import {
  fetchStudentList,
  updateStudentInfo,
  createStudentInfo,
  deleteStudentInfo,
  getClasses
} from '@/api/student'
import {
  saveScoreWithHand,
  updateScoreWithHand,
  getScoreData
} from '@/api/score'
import { fetchShowCollegesList } from '@/api/course'
import { returnStatement } from '@babel/types';
export default {
  name: 'saveScoreWithList',
  data() {
    return {
      tableData:[],
      listLoading: false,
      tableKey: 0,
   
      showColleges:[],
 
      // 头部信息
      teachtaskId: null, 
      courseId:null,
      courseName: null, 
      collegeName: null, 
      professionName: null, 
      classId: null
    }
  },
  
  created() { 
    this.teachtaskid = this.$route.query.teachtaskid
    this.courseName = this.$route.query.courseName
    this.collegeName = this.$route.query.collegeName
    this.professionName = this.$route.query.professionName
    this.classId = this.$route.query.classId  
    this.courseId = this.$route.query.courseId  



    fetchShowCollegesList().then(response => {
      var arr = []
      let index = 0
      for (let i = 0; i < response.data.length; i++) {
        var obj = {
          label: response.data[i].collegeName,
          value: response.data[i].collegeId + ''
        }
        arr[index++] = (obj)
      }
      this.showColleges = arr 
    })
    var param = { 
      classid: this.classId, 
      page: 1,
      limit: 100000, 
    } 
    
    this.listLoading = true
    // fetchStudentList(param).then(response => {
    param = { 
      teachtaskId: this.teachtaskid,  
    } 
    getScoreData(param).then(response => {
      console.log(response)  
      if(response.code == 20000){ 
        var arrtmp = response.data
        // for(let i = 0; i < arrtmp.length ;i++){
        //   arrtmp[i].score_kq = null,
        //   arrtmp[i].score_ps = null,
        //   arrtmp[i].score_sy = null,
        //   arrtmp[i].score_qz = null,
        //   arrtmp[i].score_qm = null,  
        //   arrtmp[i].show = false
        // }

        this.tableData = arrtmp
        // this.total = response.data.total 
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: 'SUCCESS！获取学生列表成功！',
          type: 'success',
          duration: 2000
        })
      }else{
        this.listLoading = false 
        this.$notify({
          title: '错误',
          message: '发生错误,获取学生列表失败！',
          type: 'error',
          duration: 2000
        })  
      }   
    })
  },
  methods: {
    saveScore(){
      console.log(this.tableData) 
      for(let i  = 0 ; i < this.tableData.length ; i++){ 
        var param = {
          studentId: this.tableData[i].studentId,
          teachtaskId: this.teachtaskid,
          courseId: this.courseId,
          courseName: this.courseName,
          score_kq: this.tableData[i].score_kq,
          score_ps: this.tableData[i].score_ps,
          score_sy: this.tableData[i].score_sy,
          score_qz: this.tableData[i].score_qz,
          score_qm: this.tableData[i].score_qm,
 
        }  
        if(  
          (this.tableData[i].score_kq) == null ||  (this.tableData[i].score_kq) == "" || 
          (this.tableData[i].score_ps) == null ||  (this.tableData[i].score_ps) == "" || 
          (this.tableData[i].score_sy) == null ||  (this.tableData[i].score_sy) == "" || 
          (this.tableData[i].score_qz) == null ||  (this.tableData[i].score_qz) == "" || 
          (this.tableData[i].score_qm) == null ||  (this.tableData[i].score_qm) == "" 
        ){
          this.$message({
            showClose: true,
            message: '对不起，请完善学生成绩！',
            type: 'error'
          });
        }else if(parseInt(this.tableData[i].score_kq) > 100 || parseInt(this.tableData[i].score_kq) < 0 ||
          parseInt(this.tableData[i].score_ps) > 100 || parseInt(this.tableData[i].score_ps) < 0 ||
          parseInt(this.tableData[i].score_sy) > 100 || parseInt(this.tableData[i].score_sy) < 0 ||
          parseInt(this.tableData[i].score_qz) > 100 || parseInt(this.tableData[i].score_qz) < 0 ||
          parseInt(this.tableData[i].score_qm) > 100 || parseInt(this.tableData[i].score_qm) < 0 
        ){
          this.$message({
            showClose: true,
            message: '对不起，您输入的成绩已超出范围！',
            type: 'error'
          });
        }else{
          var that = this
          saveScoreWithHand(param).then(response => {
            console.log(response)  
            if(response.code == 20000){ 
              if(response.data == false){
                this.$confirm('学号为'+that.tableData[i].studentId+'的学生'+that.tableData[i].studentName+
                '的成绩已录入过, 是否按当前成绩重新录入?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {  
                  updateScoreWithHand(param).then(response => {
                    console.log(response)  
                    if(response.code == 20000){  
                      this.$message({
                        type: 'success',
                        message: '更新成功!'
                      });
                    }else{
                      this.$message({
                        type: 'success',
                        message: '更新失败!'
                      });
                    } 
                  });  
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消重新录入'
                  });          
                });
              }else{
                // var arrtmp = response.data.data
                // for(let i = 0; i < arrtmp.length ;i++){
                //   arrtmp[i].score_kq = null,
                //   arrtmp[i].score_ps = null,
                //   arrtmp[i].score_sy = null,
                //   arrtmp[i].score_qz = null,
                //   arrtmp[i].score_qm = null,
                //   arrtmp[i].score_kq = null, 
                //   arrtmp[i].show = false
                // } 
                // this.tableData = arrtmp
                // this.total = response.data.total 
                // this.listLoading = false
                this.$notify({
                  title: '成功',
                  message: 'SUCCESS！保存学生成绩信息成功！',
                  type: 'success',
                  duration: 2000
                })
              } 
            }else{
              // this.listLoading = false 
              this.$notify({
                title: '错误',
                message: '发生错误,保存学生成绩信息失败！',
                type: 'error',
                duration: 2000
              })  
            }   
          })
        }
       
      }
    




      
    
    },
    computedSiteType(index){   
      for (let i = 0; i < this.showColleges.length; i++) {
        if (index == this.showColleges[i].value) {
          return this.showColleges[i].label
        }
      } 
    }
  }
}
</script>
<style>
 .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

