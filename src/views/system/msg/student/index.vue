<template> 
  <div class="app-container">
  <!-- <div class="dashboard-editor-container"> -->
    <div class="filter-container">
    
      <el-select v-model="bumen" placeholder="部门" clearable style="width:200px;margin-left:17px" class="filter-item">
        <el-option v-for="item in bumenOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select> 
      <!-- <el-select v-model="state" placeholder="状态" clearable style="width:180px;margin-left:17px" class="filter-item">
        <el-option v-for="item in stateOptions" :key="item.index" :label="item.label" :value="item.value" />
      </el-select>  -->
         
      <el-button v-waves class="filter-item"  style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        确认搜索
      </el-button> 
      <el-button v-waves class="filter-item"  style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleTiwen" >     
        我要提问
      </el-button>
    </div>
                        
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="showmsglist" 
      fit
      highlight-current-row
      style="width: 100%;" 
    >
      <el-table-column label="编号" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.msgId }}</span>
        </template>
      </el-table-column>
       
      <el-table-column label="部门" align="center" width="120px"  >
        <template slot-scope="{row}">
          <span>{{ row.bumen }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提问主题" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.msgTitle }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="提问内容" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.msgContent }}</span>
        </template>
      </el-table-column>  
 
        
      <el-table-column label="提问时间" width="200px" align="center"  >
        <template slot-scope="{row}">
          <span>{{ row.msgCreatetime }}</span>
        </template>
      </el-table-column>  
     
      <el-table-column label="提问状态" width="180px" align="center"> 
        <template slot-scope="{row}">
          <el-button type="danger" disabled v-if="row.msgIsreply == 0" >未回复</el-button>
          <el-button type="success" disabled v-if="row.msgIsreply == 1" >已回复</el-button> 
        </template>
      </el-table-column> 



      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  width="200"  type="info"  size="medium" @click="showMsgInfo(row)">
            详情
          </el-button> 
      
        </template>
      </el-table-column>
    </el-table> 


    <el-dialog title="详情" :visible.sync="info_dialogTableVisible"> 
      <el-form  
        label-position="left"
        label-width="200px" 
        style="width: 500px; margin-left:50px;"
      > 
        <el-form-item label="编号" prop="courseId">
          <el-input v-model="selobj.msgId"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="部门" prop="courseId">
          <el-input v-model="selobj.bumen"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="主题" prop="courseName">
          <el-input v-model="selobj.msgTitle" :disabled="true"/>
        </el-form-item>
        <el-form-item label="提问者学号" prop="professionId" >
          <el-input v-model="selobj.studentId"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="提问者姓名" prop="professionName" >
          <el-input v-model="selobj.studentName"  :disabled="true"/>
        </el-form-item> 
        <el-form-item label="提问内容" prop="teacherId">
          <el-input v-model="selobj.msgContent"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="提问时间" prop="teacherName">
          <el-input v-model="selobj.msgCreatetime" :disabled="true"/>
        </el-form-item> 
        <el-form-item label="回复状态" prop="classId" >
          <el-input v-model="selobj.msgIsreply==0?'未回复':'已回复'"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="回复内容" prop="teachtaskRemaerk" >
          <el-input v-model="selobj.msgReplycontent"  :disabled="true"/>
        </el-form-item> 
        <el-form-item label="回复时间" prop="teachtaskMaxnum">
          <el-input v-model="selobj.msgReplytime"  :disabled="true"/>
        </el-form-item>  
      </el-form> 
  
    </el-dialog>  
    <el-dialog title="提问" :visible.sync="tiwen_dialogFormVisible">
      <el-form >
        <el-form-item label="部门">
          <el-select v-model="tiwen_bumen" placeholder="部门" clearable style="width:200px;margin-left:17px" class="filter-item">
            <el-option v-for="item in bumenOptions" :key="item.index" :label="item.label" :value="item.value" />
          </el-select> 
        </el-form-item> 
        <el-form-item label="主题">
          <el-input 
            placeholder="请输入主题"
            v-model="tiwen_title">
          </el-input> 
        </el-form-item> 
        <el-form-item label="问题">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="tiwen_text">
          </el-input> 
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tiwen_dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tiwen">确 定</el-button>
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
  fetchMsgList,
  huifuMsg,
  submitXzxxMsg
} from '@/api/msg'
 

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
  name: 'student',
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
      
      // 查看是否已回复
      state:'',
      stateOptions:[{
        label:'已回复',
        value:'1'
      },{
        label:'未回复',
        value:'0'
      }],

      // 查看部门
      bumen:'',
      bumenOptions:
      [
        { 
          label:'软件学院',
          value:'软件学院',
        },{
          label:'计算机学院',
          value:'计算机学院',
        },{
          label:'网络空间安全学院',
          value:'网络空间安全学院',
        },{
          label:'自动化学院',
          value:'自动化学院',
        },{
          label:'材料科学与工程学院',
          value:'材料科学与工程学院',
        },{
          label:'环境与化学工程学院',
          value:'环境与化学工程学院',
        },{
          label:'航空制造工程学院',
          value:'航空制造工程学院',
        },{
          label:'外国语学院',
          value:'外国语学院',
        },{
          label:'信息工程学院',
          value:'信息工程学院',
        },{
          label:'飞行器工程学院',
          value:'飞行器工程学院',
        },{
          label:'经济管理学院',
          value:'经济管理学院',
        },{
          label:'土木建筑学院',
          value:'土木建筑学院',
        },{
          label:'文法学院',
          value:'文法学院',
        },{
          label:'音乐学院',
          value:'音乐学院',
        }
      ],
      msglist: [],//总的请求出的数据
      showmsglist: [], //显示出的
      
     
      tableKey: 0,
      listLoading: true, 

      //当前选择的是哪个
      selobj : {
        bumen: null,
        msgContent: null,
        msgCreatetime: null,
        msgId: null,
        msgIsreply: null,
        msgReplycontent: null,
        msgReplytime: null,
        msgTitle: null,
        studentId: null,
        studentName: null
      },
      info_dialogTableVisible:false,
      tiwen_dialogFormVisible:false,
      tiwen_text:null,
      tiwen_title:null,
      tiwen_bumen:null
    
    }
  },
  
  created() {  
    var that = this
    fetchMsgList().then(response => {   
      console.log(response)  
      
      var listTmp = response.data
      var tmp = []
      for(let i = 0 ;i < listTmp.length ;i++){
        listTmp[i].msgCreatetime = new Date(new Date(listTmp[i].msgCreatetime ) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        var title = listTmp[i].msgTitle
        listTmp[i].msgTitle = title.split("---")[1]
        listTmp[i].bumen = title.split("---")[0] 
        if(listTmp[i].msgIsreply == "1")
          tmp.push(listTmp[i])
      }    
      that.showmsglist = tmp 
      that.msglist = tmp
      that.listLoading = false 
      console.log(that.msgList)
    })    
  },
  
  methods: { 
    handleFilter(){
      console.log(this.bumen+this.state)
      var tmp = []
      if(this.bumen == '' ){
        this.showmsglist = this.msglist 
      } 
      if(this.bumen != ''  ){
        for(let i = 0 ; i < this.msglist.length ; i++){ 
          if(this.msglist[i].bumen == this.bumen)
            tmp.push(this.msglist[i])
        }
        this.showmsglist = tmp 
      } 
    },
    showMsgInfo(row){
      this.selobj = Object.assign({}, row)
      console.log(this.selobj)
      this.info_dialogTableVisible = true
    },
    handleTiwen(row){
      this.tiwen_dialogFormVisible = true
    },
    tiwen(){ 
      console.log(this.tiwen_bumen)
      var that = this
      var param = {
        xxzx_content: this.tiwen_text,
        xzxx_title: this.tiwen_bumen+'---'+this.tiwen_title
      }
      submitXzxxMsg(param).then(response => {   
        console.log(response)
        if(response.code == 20000){  
          this.$notify({
            title: '成功',
            message: '校长信箱提问成功',
            type: 'success',
            duration: 4000
          }) 
          that.tiwen_text = null
          that.tiwen_bumen = null
          that.tiwen_title = null

          that.info_dialogTableVisible = false
          that.tiwen_dialogFormVisible = false 
        }else{
          this.$notify({
            title: '失败',
            message: '校长信箱提问失败，请重试！',
            type: 'fail',
            duration: 4000
          }) 
          that.tiwen_text = null
          that.tiwen_bumen = null
          that.tiwen_title = null

          that.info_dialogTableVisible = false
          that.tiwen_dialogFormVisible = false 
        } 
      })
      // var param = {
      //   id: this.selobj.msgId,
      //   fromid: this.selobj.studentId,
      //   huifutext: this.huifu_text,
      // }
      // var that = this
      // huifuMsg(param).then(response => {   
      //   console.log(response) 
      //   if(response.code == 20000) {
      //     this.$notify({
      //       title: '成功',
      //       message: '回复校长信箱提问成功',
      //       type: 'success',
      //       duration: 4000
      //     }) 
      //     that.huifu_text = null
      //     that.info_dialogTableVisible = false
      //     that.huifu_dialogFormVisible = false 
      //   } else{
      //     this.$notify({
      //       title: '失败',
      //       message: '回复校长信箱提问失败，请重试！',
      //       type: 'fail',
      //       duration: 4000
      //     }) 
      //     that.huifu_text = null
      //     that.info_dialogTableVisible = false
      //     that.huifu_dialogFormVisible = false 
      //   }
      // })    
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
 