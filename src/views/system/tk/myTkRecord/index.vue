<template>
  <div class="app-container">
  <!-- <div class="dashboard-editor-container"> -->
    <div class="filter-container">
    <el-row> 
        <el-col :span="24">
            <el-cascader
                v-model="listQuery.selTeacher"
                :options="teacherOptions"
                placeholder="选择任课老师" 
                clearable 
                style="width:400px;" 
                class="filter-item" > 
            </el-cascader> 
            <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
                style="width:300px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
            </el-select> 
            <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
                style="width:150px;margin-left:17px" class="filter-item">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
            </el-select> 
            <el-button class="filter-item"  style="width:190px; margin-left: 25px;" type="primary" icon="el-icon-search" @click="fetchTkList">
                查询记录
            </el-button> 
        </el-col> 
    </el-row>
    </div>
                        
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="showTkList" 
      fit
      highlight-current-row
      style="width: 100%;" 
    >
      <el-table-column label="听课记录编号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.tkId }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="教学任务编号" align="center" width="120px"  >
        <template slot-scope="{row}">
          <span>{{ row.teachtaskId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center" width="180px"  >
        <template slot-scope="{row}">
          <span>{{ row.tk_CourseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学年" width="170px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tk_AcaYear }}-{{ parseInt(row.tk_AcaYear)+1 }}学年</span>
        </template>
      </el-table-column> 
      <el-table-column label="学期" width="170px" align="center">
        <template slot-scope="{row}">
          <span>第{{ row.tk_AcaTerm }}学期</span>
        </template>
      </el-table-column> 
      <el-table-column label="任课教师" width="170px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tk_btkTeacherName }}</span>
        </template>
      </el-table-column>   
      <el-table-column label="听课时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>
            {{ 
                new Date(+new Date(new Date(row.tkTime).toJSON())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            }}
          </span>
        </template>
      </el-table-column>   
      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
            <!-- :to="{name:'detail',params:{name:1}}" -->
          <router-link :to="{path:'/system/tk/createTkRecord/' , query:{tk_id:row.tkId}}">
            <el-button type="primary" size="medium" icon="el-icon-edit">
              更改听课记录
            </el-button>  
          </router-link>
        </template>
        <!-- <template slot-scope="{row,$index}">
          <el-button  type="primary"  size="medium" @click="handleTkInfo(row)">
            更改听课记录
          </el-button> 
        </template> -->
      </el-table-column>
    </el-table> 
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
   
 
   
    <!-- <el-dialog :visible.sync="chooseTeachTaskFormVisible">
      <el-form 
        v-bind:disabled="this.isChangeInputs" 
        ref="dataForm" 
        :rules="rules" 
        :model="courseTemp" 
        label-position="left"
        label-width="200px" 
        style="width: 500px; margin-left:50px;"
      > 
        
        <el-form-item label="教学任务编号" prop="courseId">
          <el-input v-model="courseTemp.teachtaskId"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="课程编号" prop="courseId">
          <el-input v-model="courseTemp.courseId"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseTemp.courseName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="专业id" prop="professionId" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.professionId"/>
        </el-form-item>
        <el-form-item label="专业名称" prop="professionName" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.professionName"/>
        </el-form-item>

        <el-form-item label="教师id" prop="teacherId" v-if="dialogStatus === 'burangnikan'">
          <el-input v-model="courseTemp.teacherId"/>
        </el-form-item>
        <el-form-item label="教师名称" prop="teacherName">
          <el-input v-model="courseTemp.teacherName" :disabled="true"/>
        </el-form-item> 
        <el-form-item label="开课班级" prop="classId" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.classId"/>
        </el-form-item>
        <el-form-item label="素质课类别" prop="teachtaskRemaerk" v-if="dialogStatus === 'chooseXXCourse'">
          <el-input v-model="courseTemp.teachtaskRemaerk"/>
        </el-form-item>
   

        <el-form-item label="人数限制" prop="teachtaskMaxnum" v-if="dialogStatus === 'chooseXXCourse'">
          <el-input v-model="courseTemp.teachtaskMaxnum"/>
        </el-form-item>
        <el-form-item label="已选人数" prop="teachtaskSelnum">
          <el-input v-model="courseTemp.teachtaskSelnum"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="选课年级限制" prop="teachtaskGradelimit" v-if="dialogStatus === 'chooseXXCourse'"> 
          <el-input v-model="courseTemp.teachtaskGradelimit"  />
        </el-form-item>

        <el-form-item label="学年" prop="teachtaskAcademicyear"> 
          <el-input v-model="courseTemp.teachtaskAcademicyear"  />
        </el-form-item>
        <el-form-item label="学期" prop="teachtaskAcademicterm"> 
          <el-input v-model="courseTemp.teachtaskAcademicterm"  />
        </el-form-item>
      
        <el-form-item label="课程开始日期" prop="teachtaskStarttime"> 
          <el-input v-model="courseTemp.teachtaskStarttime"  />
        </el-form-item>
        <el-form-item label="课程结束日期" prop="teachtaskEndtime"> 
          <el-input v-model="courseTemp.teachtaskEndtime"  />
        </el-form-item>
        <el-form-item label="是否单双周" prop="teachtaskIseveryweek"> 
          <el-input v-model="courseTemp.teachtaskIseveryweek==0?'是':'否'" />
        </el-form-item> 
        <el-form-item label="每周上几节课" prop="teachtaskNumlimit">
          <el-input v-model="courseTemp.teachtaskNumlimit"/>
        </el-form-item>
        <el-form-item label="优先级别" prop="teachtaskPriority" v-if="dialogStatus === 'burangnikan'">
          <el-input v-model="courseTemp.teachtaskPriority"/>
        </el-form-item>
        <el-form-item label="排课状态" prop="teachtaskIsrank">
          <el-input v-model="courseTemp.teachtaskIsrank==0?'未审核':'已审核'"  :disabled="true"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseTeachTaskFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" 
            @click="dialogStatus==='chooseCourse'?handleChooseCourse():handleChooseXXCourse()">
          确认
        </el-button>
      </div>
    </el-dialog>    -->
  </div>
</template>

<script>
// import createTkRecordComponent from '@/views/system/tk/createTkRecord'

import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
// ====================
// 课程管理api
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
  fetchTeacherList, 
  fetchTeachTaskList, 
  handleTeachtaskStatus, 
  createTeachTaskInfo, 
} from '@/api/teachtask'
import { 
    
  fetchTkList,
  createTkRecord
} from '@/api/tk'

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
  name: 'myTkRecord',
  components: { PanThumb, GithubCorner , Pagination }, directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
        /**
            tk_id
            tk_teachtaskid
            tk_courseid
            tk_coursename
            tk_Academicyear
            tk_Academicterm
            tk_teacherid
            tk_teacher
            tk_time
         */
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      
      teacherOptions:[],
      teachtaskAcademictermOptions:[],
      teachtaskAcademicyearOptions:[], 
 
      // 查询条件
      listQuery: { 
        selTeacher : null, 
        teachtaskAcademicterm : null,
        teachtaskAcademicyear : null, 
        page: 1,  
        limit: 10,  
      },  
      showTkList: [],
      total: 0, 
      tableKey: 0, 
      listLoading: true,   

      downloadLoading: false,
    }
  },
  
   /**
   *  自定义vue生命周期create方法
   *  获取此角色可视的列表
   */ 
  created() { 
    fetchTeacherList().then(response => {    
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
      this.teacherOptions = collegeArr 
    })  
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
    this.fetchTkList()
    
  },
  
  methods: {   

    handleTkInfo(){
        
    },
    fetchTkList(){
        var param = {
            selTeacher : null,
            teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm,
            teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear,
            page: this.listQuery.page,
            limit: this.listQuery.limit
        }
        if(this.listQuery.selTeacher != null){
            param.selTeacher = this.listQuery.selTeacher[1]
        }
        console.log(param)
        fetchTkList(param).then(response => {  
            console.log(response) 
            this.total = response.data.total 
            this.showTkList = response.data.data
            this.listLoading = false  
        })
    },
 
    // getlist在分页、初始化、根据条件搜索 确认搜索 的时候会使用，以及更新信息后使用
    getList() { 
      this.listLoading = true  
      
      this.xxteachtasklist = [] 
      this.zcteachtasklist = [] 
      this.showteachtasklist = []

      fetchTeachTaskList( JSON.stringify(this.listQuery)).then(response => {   
      

        this.teachtasklist =  response.data.data
        
        var listTmp = this.teachtasklist 
        for(let i = 0 ;i < listTmp.length ;i++){
          if(listTmp[i].professionId == "" || listTmp[i].professionId == null){
            this.xxteachtasklist.push(listTmp[i])
          }else{
            this.zcteachtasklist.push(listTmp[i])
          }
        } 
        this.showteachtasklist = this.teachtasklist

        this.total = response.data.total
        this.listLoading = false 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 
      })  
    }, 
    //确认搜索按钮逻辑
    handleFilter() {
      // console.log(this.listQuery)
      // console.log(  qs.stringify(this.listQuery, { arrayFormat: 'repeat' })) 
      // console.log(JSON.stringify(this.listQuery))
      var tmpp = this.listQuery
      var xyzybjTmp = tmpp.xyzybj
      if(xyzybjTmp!=null){
        this.listQuery.collegeid = xyzybjTmp[0]
        this.listQuery.professionid = xyzybjTmp[1]
        this.listQuery.classid = xyzybjTmp[2]
        this.listQuery.xyzybj = null 
      }
      this.getList()
    }, 
   
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
