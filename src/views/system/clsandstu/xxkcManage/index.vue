<template>
  <!-- 选修课程管理==》校外的选修 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="课程名关键字" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sourse" placeholder="选择平台" clearable style="width:140px;margin-left:15px" class="filter-item">
        <el-option v-for="item in showSourse" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.kinds" placeholder="选择类别" clearable style="width:140px;margin-left:15px" class="filter-item">
        <el-option v-for="item in showKinds" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>

      <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable style="width:120px;margin-left:15px" class="filter-item">
        <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
      <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable style="width:80px;margin-left:15px;margin-right:5px"  class="filter-item">
        <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
      <!-- <el-select v-model="listQuery.teachtaskStarttime" placeholder="开课时间" clearable style="width:110px;margin-left:15px" class="filter-item">
        <el-option v-for="item in teachtaskStarttimeOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.teachtaskEndtime" placeholder="截止时间" clearable style="width:110px;margin-left:15px" class="filter-item">
        <el-option v-for="item in teachtaskEndtimeOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>  -->
      <!-- <el-select v-model="listQuery.teachtaskGradelimit" placeholder="限制年级" clearable style="width:110px;margin-left:15px;margin-right:5px" class="filter-item">
        <el-option v-for="item in teachtaskGradelimitOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> -->
 
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        引入选修课程
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出课程名单
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
      <el-table-column label="网课编号" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.xxkcId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网课名称" width="160px" align="left">
        <template slot-scope="{row}">
          <span>{{ row.xxkcName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网课来源" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xxkcSourse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程分类" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xxkcKind }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="已选人数" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xxkcSelnum }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="Actions" align="center" width="500" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="info" size="medium" @click="handleGetCourseInfo(row)">
            展示网课详情
          </el-button>
          <el-button type="primary" size="medium" @click="handleUpdate(row)">
            更新网课信息
          </el-button>
          <el-button size="medium" type="danger" @click="handleDelete(row,$index)">
            取消此网课
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

       
        <el-form-item v-if="dialogStatus!='create'&&dialogStatus!='update'"
            label="网课编号" prop="xxkcId">
          <el-input v-model="temp.xxkcId" />
        </el-form-item>
        <el-form-item label="网课名称" prop="xxkcName">
          <el-input v-model="temp.xxkcName" />
        </el-form-item>
     
    
        <el-form-item label="网课来源" prop="xxkcSourseid">
          <el-select v-model="temp.xxkcSourseid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showSourse" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类" prop="xxkcKindid">
          <el-select v-model="temp.xxkcKindid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in showKinds" :key="item.index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> 
        <el-form-item label="学分" prop="xxkcCredit">
          <el-input v-model="temp.xxkcCredit" />
        </el-form-item>
        <el-form-item label="学时" prop="xxkcLearnHours">
          <el-input v-model="temp.xxkcLearnHours" />
        </el-form-item>
         <el-form-item label="人数限制" prop="xxkcMaxlimit">
          <el-input v-model="temp.xxkcMaxlimit"/>
        </el-form-item>
        <el-form-item label="已选人数" prop="xxkcSelnum">
          <el-input v-model="temp.xxkcSelnum"  :disabled="true"/>
        </el-form-item>

        <!-- <el-form-item label="选课年级限制" prop="xxkcGradelimit" > 
          <el-select v-model="temp.xxkcGradelimit" multiple placeholder="请选择年级限制" style="width: 300px; "> 
            <el-option
              v-for="item in teachtaskGradelimitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="学年" prop="xxkcAcademicyear">
          <el-select v-model="temp.xxkcAcademicyear" clearable placeholder="请选择学年" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskAcademicyearOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="学期" prop="xxkcAcademicterm"> 
          <el-select v-model="temp.xxkcAcademicterm" clearable placeholder="请选择学期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskAcademictermOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="课程开始日期" prop="xxkcStarttime"> 
          <el-select v-model="temp.xxkcStarttime" clearable placeholder="请选择课程开始日期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskStarttimeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="课程结束日期" prop="xxkcEndtime"> 
          <el-select v-model="temp.xxkcEndtime" clearable placeholder="请选择课程结束日期" style="width: 300px; "> 
            <el-option 
              v-for="item in teachtaskEndtimeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item> 
          <el-form-item label="每周上几节课" prop="xxkcNumlimit">
          <el-input v-model="temp.xxkcNumlimit"/>
        </el-form-item>            
 
        <!-- <el-form-item label="排课状态" prop="xxkcIsrank">
          <el-input v-model="temp.xxkcIsrank"  :disabled="true"/>
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
import token from '@/store/modules/user'
import { thisExpression } from '@babel/types'

export default {
  name: 'xxkcManage',
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

      },

      // 查询条件
      listQuery: {
        keyword: null, // 课程名关键字
        sourse: null, 
        kinds: null, 
        teachtaskAcademicyear: null, 
        teachtaskAcademicterm: null, 
        teachtaskStarttime: null, 
        teachtaskEndtime: null, 
        teachtaskGradelimit: null,  
        page: 1,
        limit: 10, 
      }, 
      list: null, // 展示的选修课程列表
      total: 0,
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
    fetchXXKCList((this.listQuery)).then(response => {   
      console.log(response)
      this.list =  response.data.data
      this.total = response.data.total
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
        value : i
      }  
      this.teachtaskAcademictermOptions.push(obj)
    } 
    for(let i = 1 ; i <=20 ; i++){ 
      var obj = {
        label : "第"+i+"周",
        value : i
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
      fetchXXKCList((this.listQuery)).then(response => {   
        console.log(response)
        this.list =  response.data.data
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
          '学分',
          '学时',
          '最大可选人数',
          '已选人数',
          '年级限制',
          '学年',
          '学期',
          '开始周数',
          '结束周数',
          '每周课数',
        ]
        const filterVal = [
           'xxkcId',
           'xxkcName',  
           'xxkcCredit',
           'xxkcLearnHours',
           'xxkcMaxlimit',
           'xxkcSelnum',
           'xxkcGradelimit',
           'xxkcAcademicyear',
           'xxkcAcademicterm',
           'xxkcStarttime',
           'xxkcEndtime',
           'xxkcNumlimit'
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

