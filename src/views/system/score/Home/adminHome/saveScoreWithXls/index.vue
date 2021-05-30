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

        <div style="display:inline">  
          <div style="display:inline;margin-right:35px;">
            <el-button type="primary" icon="el-icon-download" @click="download">成绩模板下载</el-button> 
          </div>
        </div>
      </div>
    </el-card>
 
    <div style="width:368px;heiht:500px;margin:0 auto;margin-top:50px">
      <el-upload
        class="upload-demo"
        drag 
        ref="upload"
        :limit="1" 
        :before-remove="beforeRemove" 
        :before-upload="beforeUpload"
        :on-exceed="onExceed"
        :on-preview="onPreview"
        :on-remove="onRemove" 
        :auto-upload="false"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        action="http://localhost:9530/score/save/xls"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" style=" text-align:center" slot="tip">注意：格式请严格按照模板文件,若该同学成绩已录入则会覆盖</div>
      </el-upload>
      <!-- <el-button type="primary" :loading="uploadLoading"  @click="upload">确认上传</el-button> -->
    </div>
  <div  style="width:90%;margin:0 auto;margin-top:30px" >
    <el-button style="width:100%" type="primary" plain :loading="uploadLoading"  @click="upload">确认提交</el-button>
  </div>
 
  </div>
</template>  
<script>
import qs from 'qs'
import token from '@/store/modules/user'
import axios from 'axios'
import {
  fetchStudentList,
  updateStudentInfo,
  createStudentInfo,
  deleteStudentInfo,
  getClasses
} from '@/api/student'
import {
  downLoadMuban,
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
      classId: null,

      // 上传附件
      uploadLoading:false,

      headers:null
    }
  },
  
  created() { 
    var headerObj = {
      'token': token.state.token 
    }
    this.headers = headerObj

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
    //成绩上传模板下载
    download(){
      downLoadMuban()  
    },
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
    },

    // 上传
    upload() {
      this.uploadLoading = true
      this.$refs.upload.submit()
    },
    beforeUpload(file) { 
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.filename = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.$notify({
        title: '批量录入学生成绩成功！',
        type: 'success',
        duration: 3500
      })
      this.uploadLoading = false
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: '对不起，批量录入学生成绩失败！',
        duration: 3500
      })
      this.uploadLoading = false
    }, 
    beforeRemove(file, fileList){ 
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    onExceed(files, fileList){ 
      this.$message.warning(
        `当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    onPreview(file){ 
      console.log(file); 
    },
    onRemove(file, fileList) {
      console.log(file, fileList);
    },
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

