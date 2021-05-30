<template>
  <!-- 课程管理 -->
  <div class="app-container">
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
      <!-- <el-input v-model="selKeyword" placeholder="课程名关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="selCollege" placeholder="选择所属学院" clearable style="width:140px" class="filter-item">
        <el-option v-for="item in showColleges" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selKcxz" placeholder="选择课程性质" clearable style="width:140px" class="filter-item">
        <el-option v-for="item in showKcxz" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selKhfs" placeholder="选择考核方式" clearable style="width:140px" class="filter-item">
        <el-option v-for="item in showKhfs" :key="item" :label="item" :value="item" />
      </el-select>  -->

      <el-button v-waves class="filter-item" style="margin-left:17px" type="primary" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建课程信息
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出课程名单
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
      <el-table-column label="课程编号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.courseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" width="160px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程所属院系" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.collegeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程性质" width="180px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.kcxzName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="课程所属院系" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type">  {{ computedCollegeType(scope.row.collegeId) }} </span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="课程性质" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.classId }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="课程考核方式" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseCheckkind }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="500" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="info" size="medium" @click="handleGetCourseInfo(row)">
            展示课程详情
          </el-button>
          <el-button type="primary" size="medium" @click="handleUpdate(row)">
            更新课程信息
          </el-button>
          <el-button size="medium" type="danger" @click="handleDelete(row,$index)">
            删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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

        <!-- <el-form-item label="课程编号" prop="studentId" v-if="dialogStatus==='create'">
          <el-input v-model="temp.courseId"/>
        </el-form-item> -->
        <el-form-item v-if="dialogStatus!='create'&&dialogStatus!='update'" label="课程编号" prop="courseId">
          <el-input v-model="temp.courseId" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="temp.courseName" />
        </el-form-item>
        <el-form-item label="课程所属院系" prop="collegeId">
          <el-select v-model="temp.collegeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showColleges" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程性质" prop="kcxzId">
          <el-select v-model="temp.kcxzId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKcxz" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程考核方式" prop="courseCheckkind">
          <el-select v-model="temp.courseCheckkind" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKhfs" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程学分" prop="courseCredit">
          <el-input v-model="temp.courseCredit" />
        </el-form-item>
        <el-form-item label="课程理论学时" prop="courseTheoryhours">
          <el-input v-model="temp.courseTheoryhours" />
        </el-form-item>
        <el-form-item label="课程实验学时" prop="courseExperimenthours">
          <el-input v-model="temp.courseExperimenthours" />
        </el-form-item>
        <el-form-item label="课程设计周数" prop="courseDesignweeks">
          <el-input v-model="temp.courseDesignweeks" />
        </el-form-item>
        <el-form-item label="课程描述" prop="courseDescription">
          <el-input v-model="temp.courseDescription" />
        </el-form-item>
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
import token from '@/store/modules/user'
import { thisExpression } from '@babel/types'

export default {
  name: 'Course',
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
      // 新建信息
      temp: {
        courseId: '',
        courseName: '',
        kcxzId: '',
        kcxzName: '',
        courseCredit: null,
        courseTheoryhours: null,
        courseExperimenthours: null,
        courseDesignweeks: null,
        courseDescription: '',
        courseCheckkind: '',
        collegeId: '',
        collegeName: ''
      },

      // 查询条件
      listQuery: {
        collegeid: null, // 所属学院
        kcxzid: null, // 课程性质
        khfs: null, // 考核方式
        keyword: null, // 课程名关键字

        page: 1,
        limit: 10,
        type: undefined,
        sort: '+id'
      },
      // selKeyword: null,
      // selCollege: null,
      // selKcxz: null,
      // selKhfs: null,
      list: null, // 展示的课程列表
      total: 0,
      tableKey: 0,

      showColleges: null, // 此页面需要展现的院系信息（超管：所有学院 ，管理员：一个学院）
      showKcxz: null,
      showKhfs: null,

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
        courseId: [{ required: true, message: '必须字段', trigger: 'change' }],
        courseName: [{ required: true, message: '必选字段', trigger: 'change' }],
        kcxzId: [{ required: true, message: '必须字段', trigger: 'change' }],
        kcxzName: [{ required: true, message: '必须字段', trigger: 'change' }],
        courseCredit: [{ required: true, message: '必须字段', trigger: 'change' }],
        courseTheoryhours: [{ required: true, message: '必须字段', trigger: 'change' }],
        // courseExperimenthours: [{ required: true, message: '必须字段', trigger: 'change' }],
        // courseDesignweeks: [{ required: true, message: '必须字段', trigger: 'change' }],
        // courseDescription: [{ required: true, message: '必须字段', trigger: 'change' }],
        courseCheckkind: [{ required: true, message: '必须字段', trigger: 'change' }],
        collegeId: [{ required: true, message: '必须字段', trigger: 'change' }],
        collegeName: [{ required: true, message: '必须字段', trigger: 'change' }]

      },
      showKhfs: [{
        value: '考试',
        label: '考试'
      }, {
        value: '考查',
        label: '考查'
      }
      ],
      collegeMap: [
        {
          value: 0,
          label: 'XX学院'
        },
        {
          value: 1,
          label: '计算机学院'
        }, {
          value: 2,
          label: '软件学院'
        }, {
          value: 3,
          label: '网络空间安全学院'
        }, {
          value: 4,
          label: '自动化学院'
        }
      ]

    }
  },

  computed: {
    computedCollegeType() {
      return function(collegeType) {
        return this.collegeMap[collegeType]['label']
      }
    }
  },

  /**
   *  自定义vue生命周期create方法
   *  获取此角色可视的课程列表
   */
  created() {
    fetchCourseList(this.listQuery).then(response => {
      this.list = response.data.data
      this.total = response.data.total
      this.listLoading = false
    })
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
    fetchShowKcxzList().then(response => {
      var arr = []
      let index = 0
      for (let i = 0; i < response.data.length; i++) {
        var obj = {
          label: response.data[i].kcxzName,
          value: response.data[i].kcxzId + ''
        }
        arr[index++] = (obj)
      }
      this.showKcxz = arr
    })
  },

  methods: {

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
      fetchCourseList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 确认搜索按钮逻辑
    handleFilter() {
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
          for (let i = 0; i < this.showColleges.length; i++) {
            if (this.temp.collegeId === this.showColleges[i].value) {
              this.temp.collegeName = this.showColleges[i].label
            }
            if (this.temp.kcxzId === this.showKcxz[i].value) {
              this.temp.kcxzName = this.showKcxz[i].label
            }
          }
          this.temp.courseCredit = this.temp.courseCredit + ''
          this.temp.courseDesignweeks = this.temp.courseDesignweeks + ''
          this.temp.courseExperimenthours = this.temp.courseExperimenthours + ''
          this.temp.courseTheoryhours = this.temp.courseTheoryhours + ''
          console.log(this.temp)
          updateCourseInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('更新课程信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('更新课程信息失败', '操作提示', {
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
          for (let i = 0; i < this.showColleges.length; i++) {
            if (this.temp.collegeId === this.showColleges[i].value) {
              this.temp.collegeName = this.showColleges[i].label
            }
            if (this.temp.kcxzId === this.showKcxz[i].value) {
              this.temp.kcxzName = this.showKcxz[i].label
            }
          }
          this.temp.courseCredit = this.temp.courseCredit + ''
          this.temp.courseDesignweeks = this.temp.courseDesignweeks + ''
          this.temp.courseExperimenthours = this.temp.courseExperimenthours + ''
          this.temp.courseTheoryhours = this.temp.courseTheoryhours + ''
          console.log(this.temp)
          createCourseInfo(this.temp).then(response => {
            if (response.code === 20000) {
              this.getList()
              this.$alert('新增课程信息成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('新增课程信息失败', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      })

      // if (valid) {

      //   var tempStudentBirthday = this.getTime(this.temp.studentBirthday)
      //   var tempStudentRxrq = this.getTime(this.temp.studentRxrq)
      //   this.temp.studentBirthday = tempStudentBirthday
      //   this.temp.studentRxrq = tempStudentRxrq
      //   console.log(this.temp)
      //   createStudentInfo(this.temp).then(response => {
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
      //   // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //   // this.temp.author = 'vue-element-admin'
      //   // createArticle(this.temp).then(() => {
      //   //   this.list.unshift(this.temp)
      //   //   this.dialogFormVisible = false
      //   //   this.$notify({
      //   //     title: 'Success',
      //   //     message: 'Created Successfully',
      //   //     type: 'success',
      //   //     duration: 2000
      //   //   })
      //   // })
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
      const id = row.courseId
      this.$confirm('确认删除该课程信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourseInfo(id).then(response => {
          if (response.code === 20000) {
            this.getList()
            this.$alert('删除课程信息成功', '操作提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('删除课程信息失败', '操作提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
          '课程性质',
          '学分',
          '课程理论学时',
          '课程实验学时',
          '课程设计周数',
          '课程描述',
          '课程考核方式',
          '所属学院'
        ]
        const filterVal = [
          'courseId',
          'courseName',
          'kcxzName',
          'courseCredit',
          'courseTheoryhours',
          'courseExperimenthours',
          'courseDesignweeks',
          'courseDescription',
          'courseCheckkind',
          'collegeName'
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
        courseId: '',
        courseName: '',
        kcxzId: '',
        kcxzName: '',
        courseCredit: null,
        courseTheoryhours: null,
        courseExperimenthours: null,
        courseDesignweeks: null,
        courseDescription: '',
        courseCheckkind: '',
        collegeId: '',
        collegeName: ''
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

