<template>
  <div class="app-container">
  <!-- <div class="dashboard-editor-container"> -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="课程名关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.collegeid" placeholder="选择所属学院" clearable style="width:140px;margin-left:17px" class="filter-item">
        <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.kcxzid" placeholder="选择课程性质" clearable style="width:140px;margin-left:17px" class="filter-item">
        <el-option v-for="item in showKcxz" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.khfs" placeholder="选择考核方式" clearable style="width:140px;margin-left:17px" class="filter-item">
        <el-option v-for="item in showKhfs" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>  
      <el-button v-waves class="filter-item"  style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateXXCourse">
        创建选修课程信息
      </el-button>  -->
      <!-- 此处需要进行修改 因为选修课信息也放在了课程列表里 在里面直接选择算了 -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="courselist" 
      fit
      highlight-current-row
      style="width: 100%;" 
    >
      <el-table-column label="课程编号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.courseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" width="180px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.courseName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="课程所属院系" width="170px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.collegeName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="课程性质" width="200px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.kcxzName }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="课程考核方式" width="120px" align="center">
        <template slot-scope="{row}"> 
          <span>{{ row.courseCheckkind }}</span>          
        </template>
      </el-table-column>    
      <el-table-column label="Actions" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  type="info"  size="medium" @click="handleGetCourseInfo(row)">
            展示课程详情
          </el-button>
          <el-button type="primary" size="medium" @click="handleChoose(row)">
            点击申请开课
          </el-button> 
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
   
    <el-dialog :visible.sync="courseDialogFormVisible">
      <el-form 
        v-bind:disabled="this.isChangeInputs" 
        ref="dataForm" 
        :rules="rules" 
        :model="courseTemp" 
        label-position="left"
        label-width="200px" 
        style="width: 500px; margin-left:50px;"
      >    
        <el-form-item label="课程编号" prop="courseId">
          <el-input v-model="courseTemp.courseId"/>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseTemp.courseName"/>
        </el-form-item>
        <el-form-item label="课程所属院系" prop="collegeId">
          <el-select v-model="courseTemp.collegeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-form-item> 
        <el-form-item label="课程性质" prop="kcxzId">
          <el-select v-model="courseTemp.kcxzId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKcxz" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-form-item> 
        <el-form-item label="课程考核方式" prop="courseCheckkind">
          <el-select v-model="courseTemp.courseCheckkind" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKhfs" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
        <el-form-item label="课程学分" prop="courseCredit">
          <el-input v-model="courseTemp.courseCredit"/>
        </el-form-item> 
        <el-form-item label="课程理论学时" prop="courseTheoryhours">
          <el-input v-model="courseTemp.courseTheoryhours" />
        </el-form-item>
        <el-form-item label="课程实验学时" prop="courseExperimenthours">
          <el-input v-model="courseTemp.courseExperimenthours" />
        </el-form-item>
        <el-form-item label="课程设计周数" prop="courseDesignweeks">
          <el-input v-model="courseTemp.courseDesignweeks" />
        </el-form-item>
        <el-form-item label="课程描述" prop="courseDescription">
          <el-input v-model="courseTemp.courseDescription" />
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer"> 
        <el-button type="primary"  @click="courseDialogFormVisible = false">
          确认
        </el-button>
      </div>
    </el-dialog> 
   <!-- chooseXXTaskFormVisible -->
   
    <el-dialog :visible.sync="chooseTeachTaskFormVisible">
      <el-form 
        v-bind:disabled="this.isChangeInputs" 
        ref="dataForm" 
        :rules="rules" 
        :model="courseTemp" 
        label-position="left"
        label-width="200px" 
        style="width: 500px; margin-left:50px;"
      > 
        <!-- <el-form-item label="课程编号" prop="courseId" v-if="dialogStatus!='create'&&dialogStatus!='update'"> -->
        <el-form-item label="课程编号" prop="courseId">
          <el-input v-model="courseTemp.courseId"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseTemp.courseName" :disabled="true"/>
        </el-form-item>
        <!-- <el-form-item label="专业id" prop="professionId" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.professionId"/>
        </el-form-item>
        <el-form-item label="专业名称" prop="professionName" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.professionName"/>
        </el-form-item> -->
        <el-form-item label="教师id" prop="teacherId" v-if="dialogStatus === 'burangnikan'">
          <el-input v-model="courseTemp.teacherId"/ >
        </el-form-item>
        <el-form-item label="教师名称" prop="teacherName">
          <el-input v-model="courseTemp.teacherName" :disabled="true"/>
        </el-form-item>
        <!-- <el-form-item label="班级id" prop="classId" v-if="dialogStatus === 'chooseCourse'">
          <el-input v-model="courseTemp.classId"/>
        </el-form-item> -->
        <el-form-item label="开课班级" prop="classId" v-if="dialogStatus === 'chooseCourse'">
          <el-cascader
           :props="propXyzybjOptions"
            style="width: 300px; "
            v-model="courseTemp.classId"
            :options="xyzybjOptions"
           > 
          </el-cascader>
        </el-form-item> 
     
        <el-form-item label="素质课类别" prop="teachtaskRemaerk" v-if="dialogStatus === 'chooseXXCourse'"> 
          <el-select v-model="courseTemp.teachtaskRemaerk" clearable placeholder="请选择素质课类别" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskRemaerkOptions"
              :key="item.index"
              :label="item.label" 
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人数限制" prop="teachtaskMaxnum" v-if="dialogStatus === 'chooseXXCourse'">
          <el-input v-model="courseTemp.teachtaskMaxnum"/>
        </el-form-item>
        <el-form-item label="已选人数" prop="teachtaskSelnum">
          <el-input v-model="courseTemp.teachtaskSelnum"  :disabled="true"/>
        </el-form-item>

        <el-form-item label="选课年级限制" prop="teachtaskGradelimit" v-if="dialogStatus === 'chooseXXCourse'"> 
          <el-select v-model="courseTemp.teachtaskGradelimit" multiple placeholder="请选择年级限制" style="width: 300px; "> 
            <el-option
              v-for="item in teachtaskGradelimitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学年" prop="teachtaskAcademicyear">
          <el-select v-model="courseTemp.teachtaskAcademicyear" clearable placeholder="请选择学年" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskAcademicyearOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="学期" prop="teachtaskAcademicterm"> 
          <el-select v-model="courseTemp.teachtaskAcademicterm" clearable placeholder="请选择学期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskAcademictermOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="课程开始日期" prop="teachtaskStarttime"> 
          <el-select v-model="courseTemp.teachtaskStarttime" clearable placeholder="请选择课程开始日期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskStarttimeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="课程结束日期" prop="teachtaskEndtime"> 
          <el-select v-model="courseTemp.teachtaskEndtime" clearable placeholder="请选择课程结束日期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskEndtimeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item> 
        <el-form-item label="是否单双周" prop="teachtaskIseveryweek">
          <el-select v-model="courseTemp.teachtaskIseveryweek" clearable placeholder="是否单双周" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskIseveryweekOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="每周上几节课" prop="teachtaskNumlimit">
          <el-input v-model="courseTemp.teachtaskNumlimit"/>
        </el-form-item>
        <el-form-item label="优先级别" prop="teachtaskPriority" v-if="dialogStatus === 'burangnikan'">
          <el-input v-model="courseTemp.teachtaskPriority"/>
        </el-form-item>
        <el-form-item label="排课状态" prop="teachtaskIsrank">
          <el-input v-model="courseTemp.teachtaskIsrank"  :disabled="true"/>
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
    </el-dialog>   
  </div>
</template>

<script>
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
  createTeachTaskInfo  
} from '@/api/teachtask'

import userInfo from '@/store/modules/user' 
import { thisExpression } from '@babel/types'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
 
 

export default {
  computed:{
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]) 
  },
  name: 'DashboardEditor',
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
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      
      //用于标记表单中是开设选修课信息还是正常的课程信息 chooseCourse chooseXXCourse
      dialogStatus: '',
      xyzybjOptions: [],//包括学院专业与班级 的 级联选择器数据,
      propXyzybjOptions: { multiple: true },//允许级联多选
      teachtaskRemaerkOptions: [ 
        {
          value: '人文社科',
          label: '人文社科'
        }, {
          value: '自然科学',
          label: '自然科学'
        }, {
          value: '经济管理',
          label: '经济管理'
        }
      ], 
      teachtaskAcademictermOptions:[],
      teachtaskAcademicyearOptions:[],
      teachtaskStarttimeOptions:[],
      teachtaskEndtimeOptions:[],
      teachtaskGradelimitOptions:[],
      teachtaskIseveryweekOptions:[{
        value: '0',
        label: '单周'
      },{
        value: '1',
        label: '双周'
      }], 
      // 新建信息
      courseTemp: {  
        courseId: '',
        courseName: '',
        professionId: '',
        professionName: '',
        teacherId: userInfo.state.userid,
        teacherName: userInfo.state.name,
        classId: '',
        teachtaskRemaerk: '',
        teachtaskMaxnum: '0',
        teachtaskSelnum: '0',
        teachtaskGradelimit: '',
        teachtaskAcademicyear: '',
        teachtaskAcademicterm: '',
        teachtaskStarttime: '',
        teachtaskEndtime: '',
        teachtaskIseveryweek: '',
        teachtaskNumlimit: "0",
        teachtaskPriority: null,
        teachtaskIsrank: "未排课" 
        // courseId: '',
        // courseName: '',
        // professionId: '',
        // professionName: '',
        // teacherId: userInfo.state.userid,
        // teacherName: userInfo.state.name,
        // classId: null,
        // teachtaskRemaerk: '',
        // teachtaskMaxnum: 0,
        // teachtaskSelnum: 0,
        // teachtaskGradelimit:  null,
        // teachtaskAcademicyear: null,
        // teachtaskAcademicterm: null,
        // teachtaskStarttime: null,
        // teachtaskEndtime: null,
        // teachtaskIseveryweek: null,
        // teachtaskNumlimit: 0,
        // teachtaskPriority: null,
        // teachtaskIsrank: "未排课" 
      },

      // 查询条件
      listQuery: {
        collegeid: null,//所属学院
        kcxzid: null,//课程性质
        khfs: null,//考核方式 
        keyword: null,//课程名关键字

        page: 1,  
        limit: 10, 
        type: undefined,
        sort: '+id'
      },  
      // selKeyword: null, 
      // selCollege: null, 
      // selKcxz: null,  
      // selKhfs: null,
      courselist: null,//展示的课程列表
      total: 0,
      tableKey: 0,

      showColleges: null, //此页面需要展现的院系信息（超管：所有学院 ，管理员：一个学院）
      showKcxz: null,
      showKhfs: null, 
      isChangeInputs: null,//对话框是否可以修改
      listLoading: true, 
      chooseTeachTaskFormVisible: false,//查看课程详情 对话框
      courseDialogFormVisible: false,//选择课程 开课对话框



      downloadLoading: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
 
      // 格式化校验
      rules: { 
        //   ======================================
        courseId: [{ required: true, message: '必须字段', trigger: 'change' }],
        courseName: [{ required: true, message: '必须字段', trigger: 'change' }],
       
        teacherId: [{ required: true, message: '必须字段', trigger: 'change' }],
        teacherName: [{ required: true, message: '必须字段', trigger: 'change' }],
        classId: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskRemaerk: [{ required: true, message: '必须字段', trigger: 'change' }],
      
        teachtaskAcademicyear: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskAcademicterm: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskStarttime: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskEndtime: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskIseveryweek: [{ required: true, message: '必须字段', trigger: 'change' }],
        
        teachtaskGradelimit: [{ required: true, message: '必须字段', trigger: 'change' }],
        teachtaskMaxnum: [{ required: true, message: '必须字段', trigger: 'change' }], 
        teachtaskNumlimit:  [  
          {required: true, message: '必须字段,请填写数字', trigger: 'change' },
          {min:1 , max:2}
        ] 
       
      },
      showKhfs: [ {
          value: "考试",
          label: "考试"
        }, {
          value: "考查",
          label: "考查"
        } 
      ],
     
 
    }
  },
  
   /**
   *  自定义vue生命周期create方法
   *  获取此角色可视的课程列表
   */ 
  created() { 
    fetchCourseList(this.listQuery).then(response => {   
      this.courselist =  response.data.data
      this.total = response.data.total
      this.listLoading = false 
    })   
    fetchShowCollegesList().then(response => {    
      var arr = []
      let index = 0
      for(let i = 0 ; i < response.data.length ; i++){
        var obj = {
          label : response.data[i].collegeName,
          value : response.data[i].collegeId+""
        } 
        arr[index++] = (obj)
      } 
      this.showColleges = arr  
    })   
    fetchShowKcxzList().then(response => {   
      var arr = []
      let index = 0
      for(let i = 0 ; i < response.data.length ; i++){
        var obj = {
          label : response.data[i].kcxzName,
          value : response.data[i].kcxzId+""
        }
        arr[index++] = (obj)
      }
      this.showKcxz = arr
    })  
    fetchProfessionList().then(response => {
      console.log(response) 
      var data = response.data
      var collegeArr = []
      var professionArr = []
      var classArr = []
      // var professionList = []
 
      for(let i = 0 ; i < data.length ;i++){
        // 学院
        var collegeObjTmp = data[i]
        var collegeObj = new Object();
        collegeObj.value = collegeObjTmp.collegeid
        collegeObj.label = collegeObjTmp.collegename
        collegeObj.children = [] 
        // console.log(collegeObjTmp.professions) 
        // console.log(typeof(collegeObjTmp.professions))
        professionArr = []
        for(let j = 0 ; j < collegeObjTmp.professions.length ; j++){
          
          // console.log(collegeObjTmp.professions[j])
          // 专业
          var professObjTmp = collegeObjTmp.professions[j]
          var professionObj = new Object();
          professionObj.value = professObjTmp.professionid
          professionObj.label = professObjTmp.professionname
          professionObj.children = []
      
          // 解决无法三层（连续.）的问题
          var classss = professObjTmp.classes
          classArr = []
          for(let k = 0 ; k < classss.length ; k++){ 
            // console.log(classss[k])
            // 班级
            var classObjTmp = professObjTmp.classes[k]//两个连续的点 所以这里可以
            var classObj = new Object();
            classObj.value = classObjTmp.classId
            classObj.label = classObjTmp.classId
            classArr.push(classObj) 
          } 
          // professionObj.children.push(classArr)
          professionObj.children = classArr 
          professionArr.push(professionObj) 
        }  
        // collegeObj.children.push(professionArr) 
        collegeObj.children = professionArr
        collegeArr.push(collegeObj) 
      }
      // console.log(JSON.stringify( collegeArr  ))
      // console.log(JSON.stringify(this.options ))
      // console.log( )
      this.xyzybjOptions = collegeArr
    })
    
    // 补充正常数据到选择框
    var myDate = new Date()
    var yearNow = myDate.getFullYear(); //(4位,1970-????)
    for(let i = yearNow+1 ; i > yearNow-10 ; i--){
      // 年份统一格式是2019-2020-1/2 value记录的时候记录左年份 如 2019代表2019-2020
      var obj = {
        label : i-1+"-"+i,
        value : i-1+""
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
    // 查询课程详细信息面板 （与课程管理一样，可以查看正常课程详细信息） 
    handleGetCourseInfo(row) { 
      // 让其无法进行修改
      this.isChangeInputs = true 
      this.courseTemp = Object.assign({}, row) // copy obj
      // this.dialogStatus = 'query'
      this.courseDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      }) 
    },
    // getlist在分页、初始化、根据条件搜索 确认搜索 的时候会使用，以及更新信息后使用
    getList() {
      this.listLoading = true 
      fetchCourseList(this.listQuery).then(response => {   
        this.courselist =  response.data.data
        this.total = response.data.total
        this.listLoading = false 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 
      })  
    }, 
    //确认搜索按钮逻辑
    handleFilter() {
      console.log(this.listQuery)
      this.getList()
    },
     
    // 选择开课的课程 打开面板进行开课
    handleChoose(row) { 
      this.resetTemp()
      this.isChangeInputs = false
      // 在数据库里 4 是代表选修-通识教育选修课
      if(row.kcxzId === '4'){
        this.dialogStatus = 'chooseXXCourse'
      }else{
        this.dialogStatus = 'chooseCourse'
      }  
      this.chooseTeachTaskFormVisible = true
      
      this.courseTemp.courseId = row.courseId
      this.courseTemp.courseName = row.courseName
      
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }, 



    handleChooseCourse(){  
      this.$refs['dataForm'].validate((valid) => {  
        if (valid) {  
         
           // copy obj
          for(let i = 0 ; i < this.courseTemp.classId.length ;i++ ){
            // console.log(typeof( this.courseTemp.classId[i]))
            var obj = Object.assign({}, this.courseTemp)
            obj.professionId =  this.courseTemp.classId[i][1]
            obj.classId =  this.courseTemp.classId[i][2] 
            
            createTeachTaskInfo(obj).then(response => {
              if(response.code === 20000){ 
                this.$alert('申请开课成功', '操作提示', {
                  confirmButtonText: '确定'   
                });
              }else{
                this.$alert('申请开课失败', '操作提示', {
                  confirmButtonText: '确定'
                });
              }  
            }) 
          } 
        }
      })

    },
    handleChooseXXCourse(){
      this.$refs['dataForm'].validate((valid) => {  
        if (valid) {  
          console.log(this.courseTemp) 
         
          for(let i = 0 ; i < this.courseTemp.teachtaskGradelimit.length ;i++ ){
            var obj = Object.assign({}, this.courseTemp) // copy obj
            // console.log(typeof( this.courseTemp.classId[i]))
            obj.teachtaskGradelimit =  this.courseTemp.teachtaskGradelimit[i]
            console.log(obj)
            createTeachTaskInfo(obj).then(response => {
              if(response.code === 20000){ 
                this.$alert('申请开课成功', '操作提示', {
                  confirmButtonText: '确定'   
                });
              }else{
                this.$alert('申请开课失败', '操作提示', {
                  confirmButtonText: '确定'
                });
              }  
            }) 
          } 
        }
      } )
    },



    // 更新课程信息面板
    handleUpdate(row) {
      this.isChangeInputs = false
      this.courseTemp = Object.assign({}, row) // copy obj
      this.courseTemp.timestamp = new Date(this.courseTemp.timestamp)
      this.dialogStatus = 'update'
      this.courseDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新课程信息数据逻辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {  
        if (valid) {  
          for(let i = 0 ;i < this.showColleges.length ; i++){
            if(this.courseTemp.collegeId === this.showColleges[i].value){
              this.courseTemp.collegeName = this.showColleges[i].label 
            }  
            if(this.courseTemp.kcxzId === this.showKcxz[i].value){
              this.courseTemp.kcxzName = this.showKcxz[i].label  
            }  
          }
          this.courseTemp.courseCredit =  this.courseTemp.courseCredit + ""
          this.courseTemp.courseDesignweeks =  this.courseTemp.courseDesignweeks + ""
          this.courseTemp.courseExperimenthours = this.courseTemp.courseExperimenthours + ""
          this.courseTemp.courseTheoryhours = this.courseTemp.courseTheoryhours + ""
          console.log(this.courseTemp) 
          updateCourseInfo(this.courseTemp).then(response => {
            if(response.code === 20000){
              this.getList()
              this.$alert('更新课程信息成功', '操作提示', {
                confirmButtonText: '确定' 
              });
            }else{
              this.$alert('更新课程信息失败', '操作提示', {
                confirmButtonText: '确定'
              });
            }  
          }) 
        }
      })
    }, 
    // 新增课程数据逻辑
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {  
          for(let i = 0 ;i < this.showColleges.length ; i++){
            if(this.courseTemp.collegeId === this.showColleges[i].value){
              this.courseTemp.collegeName = this.showColleges[i].label 
            }  
            if(this.courseTemp.kcxzId === this.showKcxz[i].value){
              this.courseTemp.kcxzName = this.showKcxz[i].label  
            }  
          }
          this.courseTemp.courseCredit =  this.courseTemp.courseCredit + ""
          this.courseTemp.courseDesignweeks =  this.courseTemp.courseDesignweeks + ""
          this.courseTemp.courseExperimenthours = this.courseTemp.courseExperimenthours + ""
          this.courseTemp.courseTheoryhours = this.courseTemp.courseTheoryhours + ""
          console.log(this.courseTemp) 
          createCourseInfo(this.courseTemp).then(response => {
            if(response.code === 20000){
              this.getList()
              this.$alert('新增课程信息成功', '操作提示', {
                confirmButtonText: '确定' 
              });
            }else{
              this.$alert('新增课程信息失败', '操作提示', {
                confirmButtonText: '确定'
              });
            }  
            
          })
        }
      })
       
        // if (valid) { 
     
        //   var tempStudentBirthday = this.getTime(this.courseTemp.studentBirthday)
        //   var tempStudentRxrq = this.getTime(this.courseTemp.studentRxrq)
        //   this.courseTemp.studentBirthday = tempStudentBirthday
        //   this.courseTemp.studentRxrq = tempStudentRxrq
        //   console.log(this.courseTemp) 
        //   createStudentInfo(this.courseTemp).then(response => {
        //     if(response.code === 20000){
        //       this.getList()
        //       this.$alert('新增学生信息成功', '操作提示', {
        //         confirmButtonText: '确定' 
        //       });
        //     }else{
        //       this.$alert('新增学生信息失败', '操作提示', {
        //         confirmButtonText: '确定'
        //       });
        //     }  
            
        //   })
        //   // this.courseTemp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        //   // this.courseTemp.author = 'vue-element-admin'
        //   // createArticle(this.courseTemp).then(() => {
        //   //   this.list.unshift(this.courseTemp)
        //   //   this.courseDialogFormVisible = false
        //   //   this.$notify({
        //   //     title: 'Success',
        //   //     message: 'Created Successfully',
        //   //     type: 'success',
        //   //     duration: 2000
        //   //   })
        //   // })
        
    },
    getTime(time) {
        let date = new Date(time)
        let y = date.getFullYear(date)
        let m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h =date.getHours()
        h = h < 10 ? ('0' + h) : h
        let M =date.getMinutes()
        M = M < 10 ? ('0' + M) : M
        let s =date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        let dateTime = y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s;
        return dateTime
    },
    // 删除课程数据逻辑
    handleDelete(row, index) { 
      let id = row.courseId  
      this.$confirm('确认删除该课程信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        deleteCourseInfo(id).then(response => {
          if(response.code === 20000){
            this.getList()
            this.$alert('删除课程信息成功', '操作提示', {
              confirmButtonText: '确定' 
            });
          }else{
            this.$alert('删除课程信息失败', '操作提示', {
              confirmButtonText: '确定'
            });
          }   
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
  
    resetTemp() {
      this.courseTemp = {
        courseId: '',
        courseName: '',
        professionId: '',
        professionName: '',
        teacherId: userInfo.state.userid,
        teacherName: userInfo.state.name,
        classId: '',
        teachtaskRemaerk: '',
        teachtaskMaxnum: '0',
        teachtaskSelnum: '0',
        teachtaskGradelimit: '',
        teachtaskAcademicyear: '',
        teachtaskAcademicterm: '',
        teachtaskStarttime: '',
        teachtaskEndtime: '',
        teachtaskIseveryweek: '',
        teachtaskNumlimit: "0",
        teachtaskPriority: null,
        teachtaskIsrank: "未排课"
      }
    },
    formatJson(filterVal) {
      return this.courselist.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
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
