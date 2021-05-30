<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 学院 班级 关键字 所属学院 -->
      <el-input v-model="listQuery.keyword" placeholder="关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.collegeid" placeholder="选择学院" clearable style="width:140px;margin-left:17px" class="filter-item">
        <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.classid" placeholder="选择班级" clearable style="width:140px;margin-left:17px" class="filter-item">
        <el-option v-for="item in showClasses" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <el-select v-model="listQuery.classid" placeholder="选择班级" clearable style="width:140px" class="filter-item">
        <el-option v-for="item in showClasses" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> -->
      <!-- <el-select v-model="selClass" placeholder="选择班级" clearable style="width:140px" class="filter-item">
        <el-option v-for="item in showClasses" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" style="margin-left:17px" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button>
      <el-button v-if="role != 'student' && role != 'teacher'  " class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建学生信息
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出学生名单
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="学号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="120px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.classId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="学院" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">  {{ row.collegeId}} </span>
        </template>
      </el-table-column> -->
      <el-table-column label="学院" width="110px" align="left">
        <template slot-scope="scope">
          <span  >  {{ computedSiteType(scope.row.collegeId) }} </span>
        </template>
      </el-table-column>
      <!-- <el-form-item label="所属学院">
          <el-select v-model="row.collegeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>  -->
      <el-table-column label="性别" width="100px" align="center">
        <template slot-scope="{row}">
          <!-- {{ scope.row.sex === 1 ? '男' : '女' }} -->
          <!-- <span class="link-type">{{ row.studentGender }}</span> -->
          <span >{{ row.studentGender === 1 ? '男' : '女' }}</span>

        </template>
      </el-table-column>
      <el-table-column label="年龄" width="100px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.studentAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="寝室号" width="100px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.studentRoomid }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <el-table-column label="Actions" align="center" width="500" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="info" size="medium" @click="handleGetStudentInfo(row)">
            展示学生详情
          </el-button>
          <el-button v-if="role != 'student' && role != 'teacher'" type="primary" size="medium" @click="handleUpdate(row)">
            更新学生信息
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button> -->
          <el-button v-if="role != 'student' && role != 'teacher'" size="medium" type="danger" @click="handleDelete(row,$index)">
            删除学生信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :disabled="this.isChangeInputs" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item v-if="dialogStatus!='update'" label="学号" prop="studentId">
          <el-input v-model="temp.studentId" />
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-select v-model="temp.classId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showClasses" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="studentIdnumber">
          <el-input v-model="temp.studentIdnumber" />
        </el-form-item>
        <!-- <el-form-item label="所属学院" prop="collegeId">
          <el-input v-model="temp.collegeId"/>
        </el-form-item> -->
        <el-form-item label="所属院系" prop="collegeId">
          <el-select v-model="temp.collegeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="temp.studentName" />
        </el-form-item>
        <el-form-item label="性别" prop="studentGender">
          <el-select v-model="temp.studentGender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in sexSel" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="年龄" prop="title">
          <el-input v-model="temp.studentAge" />
        </el-form-item>  -->
        <el-form-item label="出生日期" prop="studentBirthday">
          <el-date-picker v-model="temp.studentBirthday" type="datetime" placeholder="Please pick a date" />
        </el-form-item>

        <el-form-item label="宿舍号" prop="studentRoomid">
          <el-input v-model="temp.studentRoomid" />
        </el-form-item>
        <el-form-item label="民族" prop="studentEthnic">
          <el-select v-model="temp.studentEthnic" class="filter-item" placeholder="Please select">
            <el-option v-for="item in minzu" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="入学日期" prop="studentRxrq">
          <el-date-picker v-model="temp.studentRxrq" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="邮箱" prop="studentEmail">
          <el-input v-model="temp.studentEmail" />
        </el-form-item>
        <el-form-item label="联系方式" prop="studentPhone">
          <el-input v-model="temp.studentPhone" />
        </el-form-item>
        <el-form-item label="学生修改标志">
          <el-input v-model="temp.studentXgbz" />
        </el-form-item>
        <el-form-item label="籍贯">
          <el-input v-model="temp.studentHometown" />
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input v-model="temp.studentAddress" />
        </el-form-item>
        <el-form-item label="照片">
          <el-input v-model="temp.studentPic" />
        </el-form-item>

        <!-- <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirmmmm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>

import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

//  ===============================
// 学生管理api
import {
  fetchStudentList,
  updateStudentInfo,
  createStudentInfo,
  deleteStudentInfo,
  getClasses
} from '@/api/student'
import token from '@/store/modules/user'
import { thisExpression } from '@babel/types'
import { fetchShowCollegesList } from '@/api/course'
import user from '@/store/modules/user'
export default {
  name: 'ComplexTable',
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
      // 以下分割线以前是自己需要的
      role:null,
      // selClass: '',//目前选中的班级
      // allClassList: null,//所有的学生数据，包括角色可视的所有班级列表，默认展示第一个班级

      showColleges: [], // 当前用户可以看到的学院列表
      showClasses: [], // 此页面需要展现的班级信息（此教师/管理员可以查看的班级列表 根据班级列表获得学生列表信息）

      list: null, // 目前展示的学生列表
      isChangeInputs: null, // 对话框是否可以修改
      tableKey: 0,
      listQuery: {
        collegeid: '',
        classid: '',
        keyword: '',
        page: 1,
        limit: 10,
        type: undefined,
        sort: '+id'
      },
      listLoading: true,
      total: 0,
      dialogStatus: '', // 用于标记表单中是新建还是更新
      dialogFormVisible: false, // 对话框

      downloadLoading: false,
      // 新建信息
      temp: {
        studentId: '',
        studentIdnumber: '',
        collegeId: '',
        classId: '',
        studentName: '',
        studentGender: '',
        studentAge: '',
        studentPsd: '',
        studentBirthday: new Date(),
        studentRoomid: '',
        studentEthnic: '',
        studentRxrq: new Date(),
        studentHometown: '',
        studentAddress: '',
        studentEmail: '',
        studentPhone: '',
        studentXgbz: '',
        studentPic: ''

      },

      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // 格式化校验
      rules: {

        studentGender: [{ required: true, message: '必须字段', trigger: 'change' }],
        collegeId: [{ required: true, message: '必选字段', trigger: 'change' }],
        classId: [{ required: true, message: '必须字段', trigger: 'change' }],

        // studentBirthday: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // studentRxrq: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],

        title: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentId: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentIdnumber: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentName: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentAge: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentRoomid: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentEthnic: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentHometown: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentAddress: [{ required: true, message: '必须字段', trigger: 'change' }],
        studentEmail: [{ required: true, message: '必须字段', trigger: 'change' }]

      },
      sexSel: ['男', '女'],
      minzu: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族',
        '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
        '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族',
        '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族']

      // =======================
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
      // dialogPvVisible: false,
      // pvData: [],
    }
  },

  computed: {
    computedSiteType() {
      return function(siteType) {
        for (let i = 0; i < this.showColleges.length; i++) {
          if (siteType == this.showColleges[i].value) {
            return this.showColleges[i].label
          }
        }
        // return this.showColleges[siteType]['label']
      }
    }
  },

  /**
   *  自定义vue生命周期create方法
   *  获取此角色所带的学生（班级）列表
   */
  created() {
    this.role = user.state.roles
    fetchStudentList(this.listQuery).then(response => {
      console.log(response)
      // var listdata = response.data
      // var arr = []
      // for ( let i = 0; i　< listdata.length; i++) {
      //   arr[i] = listdata[i].classid
      // }
      // this.showClasses = arr
      // this.allClassList = response.data
      // this.list =  this.allClassList[0].data
      // this.total = this.allClassList[0].total
      // this.selClass = this.allClassList[0].classid
      this.list = response.data.data
      this.total = response.data.total

      this.listLoading = false
    })
    // 和课程里的方法一样 因此调用其方法
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
    getClasses().then(response => {
  
      var arr = []
      let index = 0
      for (let i = 0; i < response.data.length; i++) {
        var obj = {
          label: response.data[i],
          value: response.data[i]
        }
        arr[index++] = (obj)
      }
      this.showClasses = arr
      
      if(this.role == 'teacher'){
        this.listQuery.classid = this.showClasses[0].value
        fetchStudentList(this.listQuery).then(response => {
          console.log(response) 
          this.list = response.data.data
          this.total = response.data.total 
          this.listLoading = false
        })
      }
    }) 
    
  },

  methods: {
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
    // getlist在分页和初始化的时候会使用，和 更新 新增 删除 学生信息后使用
    getList() {
      this.listLoading = true
      fetchStudentList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      // this.listLoading = true
      // fetchStudentList(this.listQuery).then(response => {
      //   var listdata = response.data
      //   var arr = []
      //   for ( let i = 0; i　< listdata.length; i++) {
      //     arr[i] = listdata[i].classid
      //   }
      //   this.showClasses = arr
      //   this.allClassList = response.data
      //   this.list =  this.allClassList[0].data
      //   this.total = this.allClassList[0].total
      //   this.selClass = this.allClassList[0].classid
      //     // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    // 确认搜索按钮逻辑
    handleFilter() {
      console.log(this.listQuery)
      this.getList()
      // this.listQuery.page = 1
      // var calss =  this.selClass//目前选中的班级
      // var alldata = this.allClassList//所有的学生数据，包括角色可视的所有班级列表，默认展示第一个班级
      // for ( let i = 0; i　< alldata.length; i++) {
      //   if(calss === alldata[i].classid){
      //     this.list = alldata[i].data
      //     break
      //   }
      // }
      // this.getList()==》这里不需要重新查询
    },
    // 新建学生信息面板
    handleCreate() {
      this.isChangeInputs = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询学生详细信息面板
    handleGetStudentInfo(row) {
      this.isChangeInputs = true
      // this.resetTemp()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'query'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 更新学生信息面板
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

    // 下载
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '学生姓名',
          '学号',
          '身份证号',
          '学院id',
          '班级',
          '年级',
          '年龄',
          '出生日期',
          '寝室号',
          '民族',
          '入学日期',
          '籍贯',
          '家庭住址',
          '邮箱',
          '联系方式',
          '修改标记',
          '照片'
        ]
        const filterVal = [
          'studentName',
          'studentId',
          'studentIdnumber',
          'collegeId',
          'classId',
          'studentGender',
          'studentAge',
          'studentBirthday',
          'studentRoomid',
          'studentEthnic',
          'studentRxrq',
          'studentHometown',
          'studentAddress',
          'studentEmail',
          'studentPhone',
          'studentXgbz',
          'studentPic'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.selClass
        })
        this.downloadLoading = false
      })
    },

    // 新增学生数据逻辑
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var tempStudentBirthday = this.getTime(this.temp.studentBirthday)
          var tempStudentRxrq = this.getTime(this.temp.studentRxrq)
          this.temp.studentBirthday = tempStudentBirthday
          this.temp.studentRxrq = tempStudentRxrq
          console.log(this.temp)
          createStudentInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('新增学生信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('新增学生信息失败', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    // 更新学生数据逻辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // console.log(tempData)
          var tempStudentBirthday = this.getTime(this.temp.studentBirthday)
          var tempStudentRxrq = this.getTime(this.temp.studentRxrq)
          this.temp.studentBirthday = tempStudentBirthday
          this.temp.studentRxrq = tempStudentRxrq
          console.log(this.temp)

          updateStudentInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('更新学生信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('更新学生信息失败', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      })
    },
    // 删除学生数据逻辑
    handleDelete(row, index) {
      const id = row.studentId
      this.$confirm('确认删除该学生信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStudentInfo(id).then(response => {
          if (response.code === 20000) {
            this.getList()
            this.$alert('删除学生信息成功', '操作提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('删除学生信息失败', '操作提示', {
              confirmButtonText: '确定'
            })
          }
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
      // this.list.splice(index, 1)
    },
    resetTemp() {
      this.temp = {
        studentId: '',
        studentIdnumber: '',
        collegeId: '',
        classId: '',
        studentName: '',
        studentGender: '',
        studentAge: '',
        studentPsd: '',
        studentBirthday: '',
        studentRoomid: '',
        studentEthnic: '',
        studentRxrq: '',
        studentHometown: '',
        studentAddress: '',
        studentEmail: '',
        studentPhone: '',
        studentXgbz: '',
        studentPic: ''
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

