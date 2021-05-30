<template>
  <div class="app-container">
  <!-- <div class="dashboard-editor-container"> -->
    <div class="filter-container">
    <el-row> 
        <el-col :span="24">
            <el-cascader
                v-model="listQuery.tkTeacher"
                :options="teacherOptions"
                placeholder="选择听课教师" 
                clearable 
                style="width:400px;" 
                class="filter-item" > 
            </el-cascader> 
            <el-cascader
                v-model="listQuery.btkTeacher"
                :options="teacherOptions"
                placeholder="选择被听课教师" 
                clearable 
                style="width:400px;margin-left:17px" 
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
            <el-button class="filter-item"  style="width:190px; margin-left: 25px;" type="primary" icon="el-icon-search" @click="fetchTkListWithAdmin">
              查询记录
            </el-button> 
            <el-button class="filter-item"  style="width:210px; margin-left: 25px;" type="primary" icon="el-icon-notebook-2" @click="fetchNewTkList">
              生成教学质量教师名单
            </el-button> 
        </el-col> 
    </el-row>
    </div>
    <el-collapse @change="handleChange" accordion>  
      <div v-for="tkItem in tkArr" style="margin-left:30px;">
        <!-- <el-collapse-item :title="tkItem.title">  -->
        <el-collapse-item>
          <template slot="title"> 
 
            <el-form :inline="true" style="margin-top:15px" >
 
              <el-form-item label="序号: ">
                <div style="width:50px;margin-top:6px">{{tkItem.index}}</div>
              </el-form-item> 
              <el-form-item label="听课教师: ">
                <div style="width:90px;margin-top:6px">{{tkItem.data.tk_tkTeacherName}}</div>
              </el-form-item>    
              <el-form-item label="被听课教师: ">
                <div style="width:90px;margin-top:6px">{{tkItem.data.tk_btkTeacherName }}</div>   
              </el-form-item>  
              <el-form-item label="课程: ">
                <div style="width:140px;margin-top:6px">{{tkItem.data.tk_CourseName }}</div>    
              </el-form-item>        
              <el-form-item label="结果: ">
                <div style="width:160px;margin-top:6px">
                  打出了{{tkItem.data.tkScore}}分的{{getGrade(tkItem.data.tkScore)}}评价
                </div> 
              </el-form-item> 
               <el-form-item label="时间: ">
                <div style="width:250px;margin-top:6px">
                  {{ tkItem.data.tkTime }}
                </div> 
              </el-form-item> 
            </el-form>
           
          </template>
          <div class="mycollapse">
            <div>听课教师：{{tkItem.data.tk_tkTeacherName}}</div>
            <div>被听课教师：{{tkItem.data.tk_btkTeacherName}}</div>
            <div>听课时间：{{tkItem.data.tkTime}}</div>
            <div>课程名：{{tkItem.data.tk_CourseName}}</div>
            <div>评分：{{tkItem.data.tkScore}}</div>
            <div>评价：{{tkItem.data.tkJudge}}</div> 
            <div style="margin-top:10px"> 
      
              <router-link :to="{path:'/system/tk/createTkRecord/' , query:{tk_id:tkItem.data.tkId , isAdminQuery:true}}">
               <el-button   size="mini" type="primary" icon="el-icon-s-order">查看详情</el-button>
              </router-link>
    
             
              <el-button @click="msg_tk_dialogFormVisible = true;msg_tk_form.content = ''" style="margin-left:10px"  size="mini" type="info" icon="el-icon-message" >点击对听课教师留言</el-button>
              <!-- <el-button   size="mini" type="primary" icon="el-icon-thumb">提示该教师</el-button> -->
              <el-button @click="msg_btk_dialogFormVisible = true;msg_btk_form.content = ''"  size="mini" type="info" icon="el-icon-message">点击对被听课教师留言</el-button>
              <!-- <el-button   size="mini" type="primary" icon="el-icon-thumb">提示该教师</el-button> -->
      
              <el-dialog :modal-append-to-body='false' :title="'给听课教师'+tkItem.data.tk_tkTeacherName+'留言'" :visible.sync="msg_tk_dialogFormVisible">
                <el-form :model="msg_tk_form">
                  <el-form-item label="留言内容" :label-width="formLabelWidth"> 
                    <el-input type="textarea" :rows="3" placeholder="请键入留言" v-model="msg_tk_form.content" autocomplete="off"></el-input>
                  </el-form-item> 
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <template >
                    <el-popover  
                      placement="top"
                      width="400"  
                      :v-model="msg_tk_popover_visible"
                      >
                      <p>听课教师需要再接再厉，听课记录尽量丰富点。</p>
                      <div style="text-align: right; margin: 0">
                        <!-- <el-button size="mini" type="text">取消</el-button> -->
                        <el-button type="primary" size="mini"   @click="msg_tk_form.content = '教师需要再接再厉，课程尽量丰富多彩。'">确定</el-button>
                      </div>
                      <hr>
                      <p>听课教师做的很好，听课记录丰富。</p>
                      <div style="text-align: right; margin: 0">
                        <!-- <el-button size="mini" type="text" @click="msg_tk_popover_visible = false">取消</el-button> -->
                        <el-button type="primary" size="mini" @click="msg_tk_form.content = '听课教师做的很好，听课记录丰富。'">确定</el-button>
                      </div>
                      <hr>
                      <p>来我办公室一趟</p>
                      <div style="text-align: right; margin: 0">
                        <!-- <el-button size="mini" type="text" @click="msg_tk_popover_visible = false">取消</el-button> -->
                        <el-button type="primary" size="mini" @click="msg_tk_form.content = '来我办公室一趟'">确定</el-button>
                      </div>
                      <el-button slot="reference" >常用留言</el-button>
                    </el-popover> 
                  </template>
                  <el-button style="margin-left:15px" @click="msg_tk_dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="msg_tk_dialogFormVisible_submit(tkItem)">确 定</el-button>
                </div>
              </el-dialog>
              <!-- append-to-body  -->
              <el-dialog :modal-append-to-body='false' :title="'给被听课教师'+tkItem.data.tk_btkTeacherName+'留言'" :visible.sync="msg_btk_dialogFormVisible">
                <el-form :model="msg_btk_form">
                  <el-form-item label="留言内容" :label-width="formLabelWidth"> 
                    <el-input type="textarea" :rows="3" placeholder="请键入留言" v-model="msg_btk_form.content" autocomplete="off"></el-input>
                  </el-form-item> 
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-popover
                    placement="top"
                    width="400"
                    :v-model="msg_btk_popover_visible">
                    <p>教师需要再接再厉，课程尽量丰富多彩。</p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="msg_btk_popover_visible = false">取消</el-button> -->
                      <el-button type="primary" size="mini" @click="msg_btk_form.content = '教师需要再接再厉，课程尽量丰富多彩。'">确定</el-button>
                    </div>
                    <hr>
                     <p>教师课程教授的很好，内容丰满。</p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="msg_btk_popover_visible = false">取消</el-button> -->
                      <el-button type="primary" size="mini"  @click="msg_btk_form.content = '教师课程教授的很好，内容丰满。'">确定</el-button>
                    </div>
                    <hr>
                    <p>来我办公室一趟</p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="msg_btk_popover_visible = false">取消</el-button> -->
                      <el-button type="primary" size="mini" @click="msg_btk_form.content = '来我办公室一趟'">确定</el-button>
                    </div>
                    <el-button slot="reference" >常用留言</el-button>
                  </el-popover> 
                  <el-button style="margin-left:15px" @click="msg_btk_dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="msg_btk_dialogFormVisible_submit(tkItem)">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-collapse-item>
      </div> 
    </el-collapse> 

    <el-dialog title="需完成新教学质量任务教师名单" :visible.sync="newTkList_dialogTableVisible">
      <el-table :data="newTkList">
        <el-table-column
          label=""
          width="100">
          <template slot-scope="scope"> 
            <div class="block"><el-avatar :size="35" :src="scope.row.teacherPic"></el-avatar></div>
            <!-- <span style="margin-left: 10px">{{ scope.row.teacherPic }}</span> -->
          </template>
        </el-table-column>
         <el-table-column property="teacherId" label="职工号" width="120"></el-table-column>
        <el-table-column property="teacherName" label="姓名" width="120"></el-table-column>
        <el-table-column property="collegeName" label="学院"  width="200"></el-table-column>
        <el-table-column property="teacherEducation" label="学历"  width="120"></el-table-column>
        <el-table-column property="teacherJobtitle" label="职称" width="120"></el-table-column>
        
      </el-table>
    </el-dialog>

<!-- 
  //   详情==》show  对听课教师点击留言：   对听课教师点击留言   提示此教师（弹出框） 
  详情==》show  对听课教师点击留言：   对听课教师点击留言   提示此教师（弹出框） 
-->
 
      
    <!-- <el-table  :key="tableKey"  v-loading="listLoading" :data="showTkList"       fit highlight-current-row style="width: 100%;" >
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
          <router-link :to="{path:'/system/tk/createTkRecord/' , query:{tk_id:row.tkId}}">
            <el-button type="primary" size="medium" icon="el-icon-edit">
              更改听课记录
            </el-button>  
          </router-link>
        </template> 
      </el-table-column>
    </el-table> 
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
   
 
    
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
    
  fetchTkListWithAdmin,
  createTkRecord,
  fetchNewTkList
} from '@/api/tk'

import userInfo from '@/store/modules/user' 
import { thisExpression } from '@babel/types'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import qs from 'qs'
import {  
  fetchNoticeList,
  createNoticeInfo,
  createNoticeCommentInfo,
  updateNoticeState, 
  fetchMySendNoticeList 
} from '@/api/notice'

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
      //管理员点击生成新的需要听课的名单
      newTkList_dialogTableVisible: false,
      newTkList:null,

      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      
      teacherOptions:[],
      teachtaskAcademictermOptions:[],
      teachtaskAcademicyearOptions:[], 
 
      // 查询条件
      listQuery: { 
        tkTeacher : null, 
        btkTeacher : null, 
        teachtaskAcademicterm : null,
        teachtaskAcademicyear : null,  
      },  
      // 听课记录的数组
      tkArr:[],

      // 给听课教师和被听课教师留言
      formLabelWidth:'120px', 
      msg_tk_popover_visible:false,
      msg_tk_dialogFormVisible:false,
      msg_tk_form:{
        content: null
      },
      msg_btk_popover_visible:false,
      msg_btk_dialogFormVisible:false,
      msg_btk_form:{
        content: null
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
    this.fetchTkListWithAdmin()
    
  },
  
  methods: {   
    //后台获取新的听课名单，给听课教师和被听课教师发送邮件通知
    fetchNewTkList(){  
      var that = this
      fetchNewTkList().then(response => {  
        console.log(response)  
        if (response.code === 20000) {  
          that.newTkList = response.data
          that.newTkList_dialogTableVisible = true
          this.$notify({
            title: '成功',
            message: '已给名单中教师发送邮件通知~',
            type: 'success',
            duration: 16000
          })   
        } else { 
          that.$alert('获取新需完成新教学质量任务教师名单失败！', '提示', {
            confirmButtonText: '确定' 
          })
        }   
      })
       
    },
    msg_tk_dialogFormVisible_submit(obj){
      console.log(obj)
      var content = this.msg_tk_form.content
      this.createNoticeInfo(obj.data.tkTkjsid,content)
      //突然觉得这个有点emm鸡肋 那就不写了吧 给个假的笑一个 
      // this.$notify({
      //   title: '成功',
      //   message: '已留言成功',
      //   type: 'success'
      // });
    },
    msg_btk_dialogFormVisible_submit(obj){
      console.log(obj)
      var content = this.msg_btk_form.content
      this.createNoticeInfo(obj.data.tkBtkjsid,content)
       //突然觉得这个有点emm鸡肋 那就不写了吧 给个假的笑一个 
      // this.$notify({
      //   title: '成功',
      //   message: '已留言成功',
      //   type: 'success'
      // });
    },
    fetchTkListWithAdmin(){
      var param = {
        tkTeacher : this.listQuery.tkTeacher,
        btkTeacher: this.listQuery.btkTeacher,
        teachtaskAcademicterm : this.listQuery.teachtaskAcademicterm,
        teachtaskAcademicyear : this.listQuery.teachtaskAcademicyear 
      } 
      if(this.listQuery.tkTeacher != null){
        param.tkTeacher = this.listQuery.tkTeacher[1]
      }
      if(this.listQuery.btkTeacher != null){
        param.btkTeacher = this.listQuery.btkTeacher[1]
      }
      console.log(param)
      var that = this
      fetchTkListWithAdmin(param).then(response => { 
        this.tkArr = []
        console.log(response)  
        var data =  response.data.data
        console.log(data.length)
        for(let i = 0; i < data.length ; i++){
          var index = (i+1)+"" 
          var title = index+". "+data[i].tk_tkTeacherName+" 在"+"对 "+data[i].tk_btkTeacherName+" 教师教授的 "+data[i].tk_CourseName+" 课程打出了 "+data[i].tkScore+" 分的"+this.getGrade(data[i].tkScore)+"评价"
          var content = data[i].tkJudge
          var data2 = data[i]
          this.tkArr.push({index:index , title:title , content:content , data:data2 }) 
        }
       

        //   详情==》show  对听课教师点击留言：   对听课教师点击留言   提示此教师（弹出框） -->
        // tkArr:[{
        //   tkteacher:"wj",
        //   btkteacher:"wa1j",
        //   tktime:"2021-1-1"
        // }], 
 
          this.listLoading = false  
      })
    },
    handleChange(val) {
      console.log(val);
    },
    getGrade(tkScore){
      if(tkScore<=3) return "低分"
      else if( (tkScore)<=7 && tkScore>3) return "一般"
      else if( (tkScore)>7) return "极高" 
    },
    createNoticeInfo(userid,content){ 
      var param = new Object() 
      param.to_user = userid
      param.title = '管理员留言'
      param.content = content
      console.log(param)
      if(param.to_user == null){
        this.$message({
            showClose: true,
            message: '对不起，出现错误！',
            type: 'error'
          });
      }else if(param.title == null){
        this.$message({
            showClose: true,
            message: '对不起，需要键入主题！',
            type: 'error'
          });
      }else if(param.content == null){
        this.$message({
            showClose: true,
            message: '对不起，需要键入留言内容！',
            type: 'error'
          });
      }else{
        createNoticeInfo(param).then(response => {  
         
          if (response.code === 20000) {  
            this.$notify({
              title: '成功',
              message: '已留言',
              type: 'success',
              duration: 2000
            })   
          } else {
            var that = this
            this.$alert('留言失败！', '提示', {
              confirmButtonText: '确定' 
            })
          }  
        })
      }

    },
 
  }
}
</script>

<style lang="scss" scoped>
  .mycollapse{
    margin-left: 25px;
    font-size: 	16px;
    // font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    
  }
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
