<template>
  <div>
    <div style="margin-top:10px;margin-bottom:13px">
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
              <el-button class="filter-item"  style="width:190px; margin-left: 25px;" type="primary" icon="el-icon-search" @click="fetchTeachTaskList">
                查询教学任务
              </el-button>  
  
          </el-col> 
      </el-row>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="showteachtasklist" 
      fit
      highlight-current-row
      style="width: 100%;" 
    >
      <el-table-column label="教学任务编号" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.teachtaskId }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="课程名称" width="170px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="课程所属院系" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.collegeName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="专业" width="170px" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.professionName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="班级" width="170px" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.classId }}</span>
        </template>
      </el-table-column>  
      
      <el-table-column label="Actions" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="{path:'/saveScoreWithList/',query: {
              teachtaskid: row.teachtaskId,
              courseName: row.courseName,
              collegeName: row.collegeName,
              professionName: row.professionName,
              classId: row.classId,
              courseId:row.courseId
            }}">
            <el-button  type="info"  size="medium">
              手动录入成绩
            </el-button> 
          </router-link>

          <router-link :to="{path:'/saveScoreWithXls/',query: {
              teachtaskid: row.teachtaskId,
              courseName: row.courseName,
              collegeName: row.collegeName,
              professionName: row.professionName,
              classId: row.classId,
              courseId:row.courseId
            }}">
            <el-button  type="info"  size="medium" style="margin-left:10px">
              批量录入成绩
            </el-button> 
          </router-link>
        </template>
      </el-table-column> 
 
         
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
   
  </div>
</template>
<script>
import saveScoreWithList from './saveScoreWithList'
import saveScoreWithXls from './saveScoreWithXls'

import {
  fetchCourseList ,
  updateCourseInfo ,
  createCourseInfo , 
  deleteCourseInfo ,

  fetchShowCollegesList ,
  fetchShowKcxzList ,
  fetchShowKhfsList ,
} from '@/api/course'

import {
  fetchProfessionList  
} from '@/api/profession'
import {
  createTeachTaskInfo,
  fetchTeachTaskList
} from '@/api/teachtask'
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import userInfo from '@/store/modules/user' 
import { thisExpression } from '@babel/types'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import qs from 'qs'
export default {
  computed:{
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]) 
  }, 
  components: { PanThumb, GithubCorner , Pagination,saveScoreWithList  ,saveScoreWithXls  }, directives: { waves },
  name: 'adminHome',
  data() {
    return {
      showteachtasklist: [], //显示出的教学任务列表，

      listQuery:{
        teachtaskAcademicyear:null,
        teachtaskAcademicterm:null,
        page: 1,  
        limit: 10, 
      },
      teachtaskAcademicyearOptions:[],
      teachtaskAcademictermOptions:[],

      total: 0,
      tableKey: 0,
      listLoading: false 
    }
  },
  created() {
    this.listQuery.teacherid = userInfo.state.userid
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
  },
  methods: { 
    getList(){
      this.fetchTeachTaskList()
    }, 
    fetchTeachTaskList() { 
      var param = {
          teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear,
          teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm,

          page : this.listQuery.page,
          limit : this.listQuery.limit, 
          
          teacherid: this.listQuery.teacherid, 

      } 
      if(
        param.teachtaskAcademicyear == null || 
        param.teachtaskAcademicterm == null ||   
        param.teachtaskAcademicyear == "" || 
        param.teachtaskAcademicterm == ""  
      ){
        this.$message({
          showClose: true,
          message: '对不起，参数缺失，请检查！',
          type: 'error'
        }); 
      }else{
        var that = this
        this.listLoading = true
        fetchTeachTaskList(JSON.stringify(param)).then(response => {   
          console.log(response)
          if(response.code == 20000){ 
            this.showteachtasklist = response.data.data  
            this.total = response.data.total
            this.listLoading = false 
            this.$notify({
              title: '成功',
              message: 'SUCCESS！获取教学任务列表成功！',
              type: 'success',
              duration: 2000
            })
          }else{
            this.listLoading = false 
            this.$notify({
              title: '错误',
              message: '发生错误,获取教学任务列表失败！',
              type: 'error',
              duration: 2000
            })  
          }  
        
        }) 
      }
       
    }
  }
}
</script>
