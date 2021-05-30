<template>
  <!-- 选修课程管理==》校外的选修 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 是否查看网络课程  开关 --> 
      <el-switch
        style="margin-right:15px;"
        @change="isShowXXKC()"
        v-model="switchXXKC"  
        active-text="校内课程"
        inactive-text="">
      </el-switch> 
    
      <el-switch  
        style="margin-right:15px;"
        v-if="switchXXKC == true"
        @change="isShowSZKC()"
        v-model="switchSZ"
        active-text="校内素质选修课程"
        inactive-text="">
      </el-switch> 
     
      <el-input v-model="listQuery.keyword" placeholder="课程名关键字" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
     
      
      <el-select v-if="showtype=='xxkc'" v-model="listQuery.sourseid" placeholder="选择平台" clearable style="width:140px;margin-left:15px" class="filter-item">
        <el-option v-for="item in showSourse" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-if="showtype=='xxkc'" v-model="listQuery.kindsid" placeholder="选择类别" clearable style="width:140px;margin-left:15px" class="filter-item">
        <el-option v-for="item in showKinds" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>




      <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable style="width:120px;margin-left:15px" class="filter-item">
        <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
      <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable style="width:80px;margin-left:15px;margin-right:5px"  class="filter-item">
        <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
      <el-select v-model="listQuery.teachtaskStarttime" placeholder="开课时间" clearable style="width:110px;margin-left:15px" class="filter-item">
        <el-option v-for="item in teachtaskStarttimeOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.teachtaskEndtime" placeholder="截止时间" clearable style="width:110px;margin-left:15px;margin-right:15px" class="filter-item">
        <el-option v-for="item in teachtaskEndtimeOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
     
 
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button>
  
  
   
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="课程编号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.kcId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" width="160px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.kcName }}</span>
        </template>
      </el-table-column> 

      <el-table-column label="教师" width="130px" align="center"   v-if="showtype=='xnsu'||showtype=='xnkc'">
        <template slot-scope="{row}">
          <span>{{ row.kcTeacher }}</span>
        </template>
      </el-table-column>


      <el-table-column label="网课平台" width="130px" align="center"  v-if="showtype=='xxkc'">>
        <template slot-scope="{row}">
          <span>{{ row.kcSourse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程分类" width="170px" align="center" v-if="showtype=='xxkc'">>
        <template slot-scope="{row}">
          <span>{{ row.kcKind }}</span>
        </template>
      </el-table-column> 
 
      <el-table-column label="学年" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.kcAcademicyear }}-{{ row.kcAcademicyear }}学年</span>
        </template>
      </el-table-column>
      
      <el-table-column label="学期" width="130px" align="center">
        <template slot-scope="{row}">
          <span>第{{ row.kcAcademicterm }}学期</span>
        </template>
      </el-table-column>

      
      <el-table-column label="开课时间" width="130px" align="center">
        <template slot-scope="{row}">
          <span>第{{ row.kcStarttime }}周</span>
        </template>
      </el-table-column>
      <el-table-column label="结课时间" width="130px" align="center">
        <template slot-scope="{row}">
          <span>第{{ row.kcEndtime }}周</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button width="200" type="info" size="medium" @click="handleGetCourseInfo(row)">
            课程详情
          </el-button>   
          <el-button width="200" type="primary" size="medium" @click="showCourseScore(row)">
            课程成绩
          </el-button>  
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :disabled="this.isChangeInputs"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="200px"
        style="width: 500px; margin-left:50px;"
      >

       
        <el-form-item v-if="dialogStatus!='create'&&dialogStatus!='update'" label="课程编号" prop="kcId">
          <el-input v-model="temp.kcId" />
        </el-form-item>
        <el-form-item label="课程名称" prop="kcName">
          <el-input v-model="temp.kcName" />
        </el-form-item> 
        <el-form-item label="教师" prop="kcTeacher"  v-if="showtype=='xnsu'||showtype=='xnkc'">
          <el-input v-model="temp.kcTeacher" />
        </el-form-item> 
       
        <el-form-item label="网课平台" prop="kcSourseid"  v-if="showtype=='xxkc'">
          <el-select v-model="temp.kcSourseid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showSourse" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类" prop="kcKindid"  v-if="showtype=='xxkc'">
          <el-select v-model="temp.kcKindid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKinds" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 

        <el-form-item label="学年" prop="kcKindid"  >
          <el-select v-model="temp.kcAcademicyear" class="filter-item" placeholder="Please select">
            <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
        <el-form-item label="学期" prop="kcAcademicterm"   >
          <el-select v-model="temp.kcAcademicterm" class="filter-item" placeholder="Please select">
            <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
       
       <el-form-item label="开课时间" prop="kcStarttime"  >
          <el-select v-model="temp.kcStarttime" class="filter-item" placeholder="Please select">
            <el-option v-for="item in teachtaskStarttimeOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
        <el-form-item label="结课时间" prop="kcEndtime"   >
          <el-select v-model="temp.kcEndtime" class="filter-item" placeholder="Please select">
            <el-option v-for="item in teachtaskEndtimeOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
    
     
        <el-form-item label="学分" prop="kcCredit">
          <el-input v-model="temp.kcCredit" />
        </el-form-item>
        <el-form-item label="学时" prop="kcLearnHours">
          <el-input v-model="temp.kcLearnHours" />
        </el-form-item>


        <el-form-item label="是否单双周" prop="kcIseveryweek"  v-if="showtype=='xnsu'||showtype=='xnkc'">
          <el-input v-model="temp.kcIseveryweek"/>
        </el-form-item>


        <el-form-item label="每周上几节课" prop="kcNumlimit">
          <el-input v-model="temp.kcNumlimit"/>
        </el-form-item>  

        <el-form-item label="人数限制" prop="kcMaxlimit">
          <el-input v-model="temp.kcMaxlimit"/>
        </el-form-item>
        <el-form-item label="已选人数" prop="kcSelnum">
          <el-input v-model="temp.kcSelnum"  :disabled="true"/>
        </el-form-item>  


        <el-form-item label="排课状态（仅校内课程）" prop="kcIsrank">
          <el-input v-model="temp.kcIsrank"  :disabled="true"/>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          确认
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button> -->
      </div>
    </el-dialog>
    <el-dialog close-on-click-modal close-on-press-escape title="成绩详情" :visible.sync="score_dialogTableVisible"> 
      <el-form  
        label-position="left"
        label-width="200px" 
        style="width: 500px; margin-left:50px;"
      >  
        <el-form-item label="课程名" prop="courseId">
          <el-input v-model="selobj.courseName"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="课程性质" prop="courseId">
          <el-input v-model="selobj.courseKcxz"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="学分" prop="courseName">
          <el-input v-model="selobj.courseCirdit" :disabled="true"/>
        </el-form-item>
        <el-form-item label="考察方式" prop="professionId" >
          <el-input v-model="selobj.courseCheckKind"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="学时" prop="professionName" >
          <el-input v-model="selobj.courseStudyHour"  :disabled="true"/>
        </el-form-item> 
        <el-form-item label="总成绩" prop="teacherId">
          <el-input v-model="selobj.scoreSum"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="考勤成绩" prop="teacherId">
          <el-input v-model="selobj.score_kq"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="平时成绩" prop="teacherId">
          <el-input v-model="selobj.score_ps"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="实验成绩" prop="teacherId">
          <el-input v-model="selobj.score_sy"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="期末成绩" prop="teacherId">
          <el-input v-model="selobj.score_qm"  :disabled="true"/>
        </el-form-item>
        
         
      </el-form> 
    </el-dialog>  
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

//  ===============================
// 课程管理api
import {
  fetchCourseList,
  updateCourseInfo,
  createCourseInfo,
  deleteCourseInfo, 
  fetchShowCollegesList,
  fetchShowKcxzList,
  fetchShowKhfsList
} from '@/api/course'
import {
  fetchXXKCList,
  updateXXKCInfo,
  createXXKCInfo,
  deleteXXKCInfo,
 
} from '@/api/xxkc'
import {
  tabledata
} from '@/api/xk'
import {
  getStudentScoreByTeachtaskid
} from '@/api/score'

import token from '@/store/modules/user'
import { thisExpression } from '@babel/types'

export default {
  name: 'myselkctable',
  components: { Pagination },
  directives: { waves },
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
      //查询成绩详情
      score_dialogTableVisible:false,
      selobj:{
        classId:null,
        collegeId:null,
        courseCheckKind:null,
        courseCirdit:null,
        courseKcxz:null,
        courseName:null,
        courseStudyHour:null,
        scoreSum:null,
        score_kq:null,
        score_ps:null,
        score_qm:null,
        score_qz:null,
        score_sy:null,
        show:null,
        studentEmail:null,
        studentGender:null,
        studentId:null,
        studentName:null,
        studentPhone:null
      },

      // 新建信息
      temp: {
        kcId: null,
        kcName: null,
        kcTeacher: null,
        kcSourseid: null,
        kcKindid: null,
        kcSourse: null,
        kcKind: null,
        kcAcademicyear: null,
        kcAcademicterm: null,
        kcStarttime: null,
        kcEndtime: null,
        kcCredit: null,
        kcLearnHours: null,
        kcIseveryweek : null,
        kcNumlimit: null, 
        kcMaxlimit: null,
        kcSelnum: null,
        kcIsrank: null,
      },
      switchXXKC: false,//是否为网路课程
      switchSZ: false,//是否为素质选修课（校内课程）
      //展示情况--校内课程（素质或非素质课程）、校外网课课程
      // xnsu xnkc xxkc
      // 校内素质 校内非素质 选修课程
      showtype: 'xxkc',


      // 查询条件
      listQuery: {
        keyword: null, // 课程名关键字
        sourseid: null, 
        kindsid: null, 

        teachtaskAcademicyear: null, 
        teachtaskAcademicterm: null, 
        teachtaskStarttime: null, 
        teachtaskEndtime: null, 
         
        // page: 1,
        // limit: 10, 
      }, 
      list: [], // 展示的总的课程列表
      xxkclist: [],//校外网课
      kclist: [],//校内课程
      szlist:[],//校内素质课程

      // total: 0,
      tableKey: 0,
      
      teachtaskAcademictermOptions:[],
      teachtaskAcademicyearOptions:[],
      teachtaskStarttimeOptions:[],
      teachtaskEndtimeOptions:[],
      teachtaskGradelimitOptions:[],

      showKinds:[{
        label:"中华文化与历史传承",
        value:"1"
      },{
        label:"自然、科学与科技",
        value:"2"
      },{
        label:"社会热点与世界视野",
        value:"3"
      },{
        label:"自我认知与人生发展",
        value:"4"
      },{
        label:"经济管理与法律基础",
        value:"5"
      },{
        label:"文学修养与艺术鉴赏",
        value:"6"
      }],
 
      showSourse:[{
        label:"智慧树",
        value:"1"
      },{
        label:"超星尔雅",
        value:"2"
      },{
        label:"小木虫",
        value:"3"
      },{
        label:"中国大学Mooc",
        value:"4"
      },{
        label:"雨课堂",
        value:"5"
      }],

    

      isChangeInputs: null, // 对话框是否可以修改
      listLoading: true,
      dialogStatus: '', // 用于标记表单中是新建还是更新
      dialogFormVisible: false, // 对话框
      downloadLoading: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },

      // 格式化校验
      rules: {
        xxkcId: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcName: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcSourseid: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcKindid: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcCredit: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcLearnHours: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcMaxlimit: [{ required: true, message: '必须字段', trigger: 'change' }],
        // xxkcSelnum: [{ required: true, message: '必须字段', trigger: 'change' }],
        // xxkcGradelimit: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcAcademicyear: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcAcademicterm: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcStarttime: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcEndtime: [{ required: true, message: '必须字段', trigger: 'change' }],
        xxkcNumlimit: [{ required: true, message: '必须字段', trigger: 'change' }],
        // xxkcIsrank: [{ required: true, message: '必须字段', trigger: 'change' }],
        // xxkcRemaerk: nu[{ required: true, message: '必须字段', trigger: 'change' }]
 

      } 

    }
  },

  

  /**
   *  自定义vue生命周期create方法
   *  获取此角色可视的课程列表
   */
  created() {
    tabledata((this.listQuery)).then(response => {   
      console.log(response)
      this.list =  response.data 
      for(let i = 0;i < this.list.length ;i++){
        if(this.list[i].kcSourse != null)
          this.xxkclist.push(this.list[i])
        else{
          if(this.list[i].kcClassid == null || this.list[i].kcClassid == "")
            this.szlist.push(this.list[i])
          else
            this.kclist.push(this.list[i])
        } 
      }
      console.log(this.xxkclist)
      console.log(this.szlist)
      console.log(this.kclist)
      this.listLoading = false 
    })
    // 补充正常数据到选择框
    var myDate = new Date()
    var yearNow = myDate.getFullYear(); //(4位,1970-????)
    for(let i = yearNow+1 ; i > yearNow-10 ; i--){
      // 年份统一格式是2019-2020-1/2 value记录的时候记录左年份 如 2019代表2019-2020
      var obj = {
        label : i-1+"-"+i,
        value : i-1
      }  
      this.teachtaskAcademicyearOptions.push(obj)
    }
    for(let i = 1 ; i <=2 ; i++){ 
      var obj = {
        label : i+"",
        value : i+""
      }  
      this.teachtaskAcademictermOptions.push(obj)
    } 
    for(let i = 1 ; i <=20 ; i++){ 
      var obj = {
        label : "第"+i+"周",
        value : i+""
      }  
      this.teachtaskStarttimeOptions.push(obj)
      this.teachtaskEndtimeOptions.push(obj) 
    } 

    for(let i = yearNow+1 ; i > yearNow-10 ; i--){ 
      var obj = {
        label : i+"级",
        value : i+""
      }  
      this.teachtaskGradelimitOptions.push(obj)
    }
   
  }, 
  methods: {
    // 查看课程成绩详情
    showCourseScore(row){
      this.selobj = Object.assign({}, row)
      console.log(this.selobj) 
      var param = {
        teachtaskid: row.kcId
      }
      getStudentScoreByTeachtaskid(param).then(response => {  
        if(response.data.length != 0) {
          console.log(response) 
          this.selobj = response.data[0]
          this.score_dialogTableVisible = true
        }else{
          this.$notify({
            title: '成功',
            message: '此课程还未发布成绩！',
            type: 'success',
            duration: 4000
          })
        }
       
      }) 
     
    },
    isShowXXKC(){
      // 靠不同的字段 将data分一下就可以实现网课和非网课了
      if(this.switchXXKC==true){
        this.showtype  = 'xnkc'
        this.list = this.kclist
      }else{
        this.showtype  = 'xxkc'
        this.list = this.xxkclist
      }
    },
     
    isShowSZKC(){
      if(this.switchXXKC==true && this.switchSZ==true){ 
        this.showtype  = 'sukc' 
        this.list = this.szlist
      }else if(this.switchXXKC==true && this.switchSZ==false){ 
        this.showtype  = 'xnkc'
        this.list = this.kclist
      }
    },
   



    // 查询课程详细信息面板
    handleGetCourseInfo(row) {
      // 让其无法进行修改
      this.isChangeInputs = true
      // this.resetTemp()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'query'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // getlist在分页、初始化、根据条件搜索 确认搜索 的时候会使用，以及 更新 新增 删除 学生信息后使用
    getList() {
      this.listLoading = true
      tabledata((this.listQuery)).then(response => {   
        console.log(response)
        this.list =  response.data 
        for(let i = 0;i < this.list.length ;i++){
          if(this.list[i].kcSourse != null)
            this.xxkclist.push(this.list[i])
          else{
            if(this.list[i].kcClassid == null || this.list[i].kcClassid == "")
              this.szlist.push(this.list[i])
            else
              this.kclist.push(this.list[i])
          } 
        } 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 
      })
     
    },
    // 确认搜索按钮逻辑
    handleFilter() {
      this.list = [] // 展示的总的课程列表
      this.xxkclist = [] // 展示的总的课程列表
      this.kclist = [] // 展示的总的课程列表
      this.szlist = [] // 展示的总的课程列表
      console.log(this.listQuery)
      this.getList()
    },





    // 更新课程信息面板
    handleUpdate(row) {
      this.isChangeInputs = false
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新课程信息数据逻辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
         
          // this.temp.courseCredit = this.temp.courseCredit + ''
          // this.temp.courseDesignweeks = this.temp.courseDesignweeks + ''
          // this.temp.courseExperimenthours = this.temp.courseExperimenthours + ''
          // this.temp.courseTheoryhours = this.temp.courseTheoryhours + ''
          this.temp.xxkcAcademicterm = this.temp.xxkcAcademicterm + ''
          this.temp.xxkcAcademicyear = this.temp.xxkcAcademicyear + ''
          this.temp.xxkcCredit = this.temp.xxkcCredit + ''
          this.temp.xxkcStarttime = this.temp.xxkcStarttime + ''
          this.temp.xxkcEndtime = this.temp.xxkcEndtime + ''
          this.temp.xxkcIsrank = this.temp.xxkcIsrank + ''
          this.temp.xxkcLearnHours = this.temp.xxkcLearnHours + ''
          this.temp.xxkcMaxlimit = this.temp.xxkcMaxlimit + ''
          this.temp.xxkcNumlimit = this.temp.xxkcNumlimit + ''
          this.temp.xxkcSelnum = this.temp.xxkcSelnum + ''
           
          updateXXKCInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('更新网课信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('更新网课信息失败', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      })
    },
    // 新建课程信息面板
    handleCreate() {
      this.isChangeInputs = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增课程数据逻辑
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          
          console.log(this.temp)
          this.temp.xxkcAcademicterm = this.temp.xxkcAcademicterm + ''
          this.temp.xxkcAcademicyear = this.temp.xxkcAcademicyear + ''
          this.temp.xxkcCredit = this.temp.xxkcCredit + ''
          this.temp.xxkcStarttime = this.temp.xxkcStarttime + ''
          this.temp.xxkcEndtime = this.temp.xxkcEndtime + ''
          this.temp.xxkcIsrank = this.temp.xxkcIsrank + ''
          this.temp.xxkcLearnHours = this.temp.xxkcLearnHours + ''
          this.temp.xxkcMaxlimit = this.temp.xxkcMaxlimit + ''
          this.temp.xxkcNumlimit = this.temp.xxkcNumlimit + ''
          this.temp.xxkcSelnum = '0'

          createXXKCInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('新增网课信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('新增网课信息失败', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }) 
    },
    getTime(time) {
      const date = new Date(time)
      const y = date.getFullYear(date)
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let M = date.getMinutes()
      M = M < 10 ? ('0' + M) : M
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      const dateTime = y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s
      return dateTime
    },
    // 删除课程数据逻辑
    handleDelete(row, index) {
      const id = row.xxkcId
      this.$confirm('确认移除此网课?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteXXKCInfo(id).then(response => {
          if (response.code === 20000) {
            this.getList()
            this.$alert('移除此网课成功', '操作提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('移除此网课失败', '操作提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 下载
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '课程编号',
          '课程名', 
          '教师',
          '平台',
          '类型',
          '学年',
          '学期',
          '开始周数',
          '结束周数',
          '学分',
          '学时',
          '是否每周上课',
          '每周课程数',
          '人数限制',
          '已选人数',
         
          '排课状态',
        ]
        const filterVal = [
          'kcId', 
          'kcName',
          'kcTeacher', 
          'kcSourse',
          'kcKind',
          'kcAcademicyear',
          'kcAcademicterm',
          'kcStarttime',
          'kcEndtime',
          'kcCredit',
          'kcLearnHours',
          'kcIseveryweek',
          'kcNumlimit',
          'kcMaxlimit',
          'kcSelnum',
          'kcIsrank',
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '课程列表'
        })
        this.downloadLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        xxkcId: null,
        xxkcName: null,
        xxkcSourseid: null,
        xxkcKindid: null,
        xxkcCredit: null,
        xxkcLearnHours: null,
        xxkcMaxlimit: null,
        xxkcSelnum: null,
        xxkcGradelimit: null,
        xxkcAcademicyear: null,
        xxkcAcademicterm: null,
        xxkcStarttime: null,
        xxkcEndtime: null,
        xxkcNumlimit: null,
        xxkcIsrank: null,
        xxkcRemaerk: null
      }
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // =====================================

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

