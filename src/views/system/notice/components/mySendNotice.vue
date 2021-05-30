<template>
  <div class="user-activity">
    <el-row> 
      <el-col :span="9">
        <div style=" margin-top:15px ; margin-left:20px ; margin-bottom:25px ;   "> 
          <el-date-picker
            v-model="queryDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="15">
        <el-button 
          class="filter-item" 
          style="width:190px; margin-top:15px ;  margin-bottom:25px ; margin-left:40px" 
          type="primary" 
          icon="el-icon-check" 
          @click="fetchMySendNoticeList">
          确定
        </el-button> 
        <el-button 
          class="filter-item" 
          style="width:190px; margin-left: 20px; margin-top:15px ; margin-bottom:25px ; "
          type="primary" 
          icon="el-icon-plus"
          @click="create_notice_dialogFormVisible = true">
          发起
        </el-button>   
      </el-col>
    </el-row>
    <div v-for="(noticeItem,index) in noticeList">
      <div class="post">
        <div class="user-block">
          <img class="img-circle" :src="noticeItem.notice_fromPic">
          <span class="username text-muted">{{noticeItem.notice_fromUserRole+' - '+noticeItem.notice_fromUserName}}</span>
          <span class="description">
            {{ 
              new Date(+new Date(new Date(noticeItem.noticeTime).toJSON())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            }}  
          </span>
        </div>
        <el-collapse>
          <el-collapse-item style="margin-left:25px;margin-top:5px">
          <template style="margin-right:10px" slot="title" > 
            主题：{{noticeItem.noticeTitle}} 
          </template>
          <!-- <el-collapse-item 
            style="margin-left:25px;margin-top:10px"
            :title="<el-badge is-dot>数据查询</el-badge>" name="1"> --> 
            <!-- :title="'主题：'+noticeItem.noticeTitle" name="1"> -->

            <el-card style="width:100%;margin-bottom:5px">  
              <div style="font-size:18px">{{noticeItem.noticeContent}} </div>
              <div class="actions"> 
                  <ul class="list-inline" style="float:right;margin-right:70px">
                    <li>
                      <span @click="comment(index)" class="link-black text-sm" style="margin-left:10px">
                        <i class="el-icon-chat-square" />
                        回复列表
                      </span>
                    </li>
                    <!-- <li>
                      <span @click="check(index)" class="link-black text-sm" style="margin-left:15px">
                        <i class="el-icon-check" />
                        确认已读
                      </span>
                    </li>
                    -->
                    <li>
                      <span @click="transmit(index)" class="link-black text-sm" style="margin-left:15px">
                        <i class="el-icon-top-right" />
                        转发
                      </span>
                    </li> 
                  </ul> 
              </div> 
            </el-card>
            <div class="hf" style="margin-left:0px;">
              <el-row :span="24">
                <el-col :span="22">
                  <el-input 
                    v-model="noticeItem.notice_hf"
                    type="textarea"
                    :rows="2"
                    placeholder="请键入您的回复"
                    >
                   
                  </el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    @click="hf(index)"
                    style="margin-left:15px;margin-top:5px"
                    type="info"
                    icon="el-icon-message" 
                    round
                  ></el-button>
                </el-col> 
              </el-row> 
            </div>  
            <!-- <el-card v-if="noticeItem.isShowComments" style="width:91.6%; margin-top:5px"  >  -->
              <!-- <el-card v-if="noticeItem.isShowComments" style="width:91.6%; margin-top:5px"  >  -->
              <!-- <div v-if="getIsShowComments(index)">  -->
              <div v-if="isShowComments"> 
                <div v-for="(commentItem,index2) in noticeItem.notice_comments" class="coments" style="margin-left:0px;margin-top:10px;">
                  <el-card style="width:100%;">  
                    <div class="user-block-comments">
                      <img class="img-circle" :src="commentItem.notice_fromPic">
                      <span class="username text-muted">
                        {{commentItem.notice_fromUserName+': '+commentItem.noticeContent}}  
                      </span>
                      <span style="float:right;margin-right:30px">
                        {{   
                          '回复时间：'+new Date(+new Date(new Date(commentItem.noticeTime).toJSON())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                        }}  
                      </span>
                    </div> 
                  </el-card>
                </div> 
              </div>   
          </el-collapse-item> 
        </el-collapse> 
      </div>
    </div>
    

    <el-dialog title="发起留言" :visible.sync="create_notice_dialogFormVisible">
      <el-form :model="create_notice_form">
        <el-form-item label="对象 " label-width="60px">
          <el-cascader
              v-model="create_notice_form.to_user"
              :options="userOptions"
              placeholder="选择留言对象" 
              clearable 
              style="width:100%;" 
              class="filter-item" > 
          </el-cascader> 
        </el-form-item>
        <el-form-item label="主题" label-width="60px">
          <el-input v-model="create_notice_form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="60px">
          <el-input
            :rows="4"
            type="textarea"
            v-model="create_notice_form.content"
          ></el-input>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="create_notice_dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNoticeInfo">确 定</el-button>
      </div>
    </el-dialog>  

    <el-dialog title="转发" :visible.sync="zf_notice_dialogFormVisible">
      <el-form :model="zf_notice_form">
        <el-form-item label="对象 " label-width="60px">
          <el-cascader
              v-model="zf_notice_form.to_user"
              :options="userOptions"
              placeholder="选择转发对象" 
              clearable 
              style="width:100%;" 
              class="filter-item" > 
          </el-cascader> 
        </el-form-item>
        <el-form-item label="主题" label-width="60px">
          <el-input v-model="zf_notice_form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="60px">
          <el-input
            :rows="4"
            type="textarea"
            v-model="zf_notice_form.content"
          ></el-input>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="zf_notice_dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="zfNoticeInfo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

import {  
  fetchNoticeList,
  createNoticeInfo,
  createNoticeCommentInfo,
  updateNoticeState,

  fetchMySendNoticeList
  
} from '@/api/notice'
import {
  fetchTeacherList, 
  fetchTeachTaskList, 
  handleTeachtaskStatus, 
  createTeachTaskInfo, 
} from '@/api/teachtask'
import {
  getAdminList
} from '@/api/user'
import userInfo from '@/store/modules/user' 
 
export default {
  computed: { 
  },
  data() { 
    return {
      /**
        noticeContent: null
        noticeFromid: "222222"
        noticeId: "1"
        noticeIsseen: 0
        noticeKind: "0"
        noticeTime: "2021-04-25T01:15:45.000+00:00"
        noticeTitle: "testtitle"
        noticeToid: "123123"
        notice_fromPic: "http://m.qpic.cn/psc?/V545Fi2B3ZX6uf2jmOrM0jJkaz4OqBvd/45NBuzDIW489QBoVep5mcdFxf.B*O85st7QQII.snPsnGQ1qXBxtPFR8f1bjs10iFI8wc4aR5Qc1pcalAN0QUVNmu3343jpin*OSdGovRB0!/b&bo=LAEsAQAAAAABFzA!&rf=viewer_4"
        notice_fromUserName: "吴健"
        notice_fromUserRole: "教师"
       */
      queryDate:null, 
      // 查询条件
      listQuery: { 
        fromNoticeTime : '', 
        toNoticeTime : '', 
        page: 1,  
        limit: 100,  
      }, 
      total: null,
      noticeList: null,
      listLoading: null,  
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },  

      // 发起转发留言使用的
      userOptions: [],

      // 发起留言
      create_notice_dialogFormVisible: false,
      create_notice_form: {
        to_user: [],
        title: null,
        content: null 
      },

      // 转发留言 
      zf_notice_dialogFormVisible: false,
      zf_notice_form: {
        to_user: [],
        title: null,
        content: null 
      },


      // 是否展示留言的回复列表
      // 这里我是确实不会了 这里是一次变值 所有的留言跟着变（一起显示回复 一起不显示回复）
      // isShowComments: [],
      isShowComments:false,


      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  },
  created() {  
    // 获取初始的 自己发起的所有的留言信息
    this.listLoading = true  
    if(this.queryDate != null){
      if(this.queryDate[0] != null)
        this.listQuery.fromNoticeTime = this.dateFormat(this.queryDate[0])
      if(this.queryDate[1] != null)
        this.listQuery.toNoticeTime = this.dateFormat(this.queryDate[1])
    } 
    var param = {
      fromNoticeTime:this.listQuery.fromNoticeTime,
      toNoticeTime:this.listQuery.toNoticeTime,
      page:this.listQuery.page,
      limit:this.listQuery.limit
    }
    console.log(param)
    fetchMySendNoticeList(param).then(response => {  
      console.log(response) 
      this.total = response.data.total 
      this.noticeList = response.data.data 
      // for(let i = 0 ; i < this.noticeList.length ;i++)
      //   this.isShowComments.push(false)
      this.listLoading = false  
    })

    // 获取发布时的选择对象数据
    this.getToUserOption()
    
  }, 
 
  methods: { 
 
    async getToUserOption() {
      // 0代表superadmin 1代表admin 2代表教师
      var superAdminArr = []
      var adminArr = []
      var teacherArr = []

      // 获取发布时的选择对象数据
      await fetchTeacherList().then(response => {    
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
        teacherArr = collegeArr
        // this.teacherOptions = collegeArr 
        
      })  
      await getAdminList().then(response =>{
        // console.log(response)
        var data = response.data.data
        var arr = []
        for(let i = 0 ; i < data.length ;i++){ 
          arr.push( {
            label:data[i].collegeName+'管理员',
            value:data[i].sysadminId
          }) 
        }
        adminArr = arr
      })

      // 不要笑 嘞是目前就一个超管 懒得写接口而已55555555555
      superAdminArr.push({
        label: '学校超级管理员',
        value: '123123'
      })
      this.userOptions.push({
        label: '超级管理员',
        value: '0',
        children: superAdminArr  
      },{
        label: '学院管理员',
        value: '1',
        children: adminArr 
      },{
        label: '教师',
        value: '2',
        children: teacherArr  
      }) 
      console.log(this.userOptions)
      
    }, 
  
    fetchMySendNoticeList() {
      this.listLoading = true  
      if(this.queryDate != null){
        if(this.queryDate[0] != null)
          this.listQuery.fromNoticeTime = this.dateFormat(this.queryDate[0])
        if(this.queryDate[1] != null)
          this.listQuery.toNoticeTime = this.dateFormat(this.queryDate[1])
      } 
      var param = {
        fromNoticeTime:this.listQuery.fromNoticeTime,
        toNoticeTime:this.listQuery.toNoticeTime,
        page:this.listQuery.page,
        limit:this.listQuery.limit
      }
      console.log(param)
      fetchMySendNoticeList(param).then(response => {  
        console.log(response) 
        this.total = response.data.total 
        this.noticeList = response.data.data
        // for(let i = 0 ; i < this.noticeList.length ;i++)
        //   this.isShowComments.push(false)
        this.listLoading = false  
      })
    },
  
    createNoticeInfo(){
      // this.create_notice_dialogFormVisible  = true
      console.log(this.create_notice_form)
      var param = new Object()
      var userType  = this.create_notice_form.to_user[0]
      switch(userType){
        case "0":{
          // 0超级管理员
          param.to_user =  this.create_notice_form.to_user[1] 
          break
        }
        case "1":{
          // 1管理员
          param.to_user =  this.create_notice_form.to_user[1] 
          break
        }
        case "2":{
          // 2教师
          param.to_user =  this.create_notice_form.to_user[2] 
          break
        }
      }
      param.title = this.create_notice_form.title
      param.content = this.create_notice_form.content
      console.log(param) 
      if(param.to_user == null){
        this.$message({
            showClose: true,
            message: '对不起，需要选择留言对象！',
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
          console.log(response) 
          if (response.code === 20000) {  
            this.$notify({
              title: '成功',
              message: '已留言',
              type: 'success',
              duration: 2000
            })  
            this.create_notice_dialogFormVisible = false
            this.fetchMySendNoticeList()
          } else {
            var that = this
            this.$alert('留言失败！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                that.create_notice_dialogFormVisible = false
              }
            })
          }  
        })
      }

    },
 
    zfNoticeInfo(){ 
      console.log(this.zf_notice_form)
      var param = new Object()
      
      var userType  = this.zf_notice_form.to_user[0]
      switch(userType){
        case "0":{
          // 0超级管理员
          param.to_user =  this.zf_notice_form.to_user[1] 
          break
        }
        case "1":{
          // 1管理员
          param.to_user =  this.zf_notice_form.to_user[1] 
          break
        }
        case "2":{
          // 2教师
          param.to_user =  this.zf_notice_form.to_user[2] 
          break
        }
      }
      param.title = this.zf_notice_form.title
      param.content = this.zf_notice_form.content
      console.log(param) 
      if(param.to_user == null){
        this.$message({
            showClose: true,
            message: '对不起，需要选择转发对象！',
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
          console.log(response) 
          if (response.code === 20000) {  
            this.$notify({
              title: '成功',
              message: '已转发',
              type: 'success',
              duration: 2000
            })  
            this.zf_notice_dialogFormVisible = false
            this.fetchMySendNoticeList()
          } else {
            var that = this
            this.$alert('转发留言失败！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                that.zf_notice_dialogFormVisible = false
              }
            })
          }  
        })
      }

    },
    
    // 把获取到的日期传进来
    dateFormat(dateData) {
      const date = new Date(dateData)
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
    } ,
    hf(id){
      console.log(this.noticeList[id])
      var param = Object.assign({}, this.noticeList[id]) 
      param.notice_comments = null
      createNoticeCommentInfo(param).then(response => {   
        console.log(response) 

        if (response.code === 20000) {  
          this.$notify({
            title: '成功',
            message: '已回复留言',
            type: 'success',
            duration: 2000
          })   
          this.fetchMySendNoticeList()
        } else {
          this.$alert('回复留言失败！', '提示', {
            confirmButtonText: '确定', 
          })
        }  
      })
    },
    comment(index){  
      this.isShowComments = !this.isShowComments
      // console.log(index) 
      // this.isShowComments[index] = !this.isShowComments[index]
      // // this.noticeList[index].isShowComments = !this.noticeList[index].isShowComments
      // // console.log( this.noticeList[index].isShowComments)
      // console.log(this.isShowComments)
    },
    check(index){
      var id = this.noticeList[index].noticeId
      updateNoticeState(id).then(response => {   
        console.log(response)  
        if (response.code === 20000) {  
          this.$notify({
            title: '成功',
            message: '已确认查看',
            type: 'success',
            duration: 2000
          })   
          this.fetchMySendNoticeList()
        } else {
          this.$alert('确认查看失败！', '提示', {
            confirmButtonText: '确定', 
          })
        }  
      }) 
    },
    transmit(index){
      this.zf_notice_dialogFormVisible = true 
      this.zf_notice_form.title = this.noticeList[index].noticeTitle,
      this.zf_notice_form.content = this.noticeList[index].noticeContent  
  
    }
  } 
}
</script>

<style lang="scss" scoped>
.badge {
  margin-top: 5px;
  margin-right: 100px;
}
.user-activity {
  .user-block {
    margin-bottom: 10px;
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
  .user-block-comments {
    margin-bottom: 0px;
    .username,
    .description {
      display: block;
      margin-left: 40px;
      padding: 2px 0;
    }

    .username{
      font-size: 15px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 10px;
    padding-bottom: 10px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

// ===================
 


</style>
