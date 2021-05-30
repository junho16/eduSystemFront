<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky> -->

      <div class="createPost-main-container">
        <el-row>
          <el-steps :active="action_step" simple style="margin-top: 20px;">
            <el-step title="完善标题" icon="el-icon-edit"></el-step>
            <el-step title="选择课程" icon="el-icon-thumb"></el-step>
            <el-step title="键入主题" icon="el-icon-tickets"></el-step>
            <el-step title="完善记录" icon="el-icon-edit-outline"></el-step>
            <el-step title="评分" icon="el-icon-medal"></el-step>
            <el-step title="完成" icon="el-icon-upload"></el-step>
          </el-steps>


         
         
        </el-row>
        <el-tabs tab-position="left"  > 
            <el-tab-pane label="基础信息">
              <el-row>
                <!-- <Warning /> --> 
                <el-col :span="24">
                  <el-form-item style="margin-bottom: 40px;" >
                    <MDinput  @focus="step_Title" :disabled="this.isAdminQueryData" v-model="postForm.tk_title" :maxlength="100" name="name" required>
                      听课记录标题
                    </MDinput>
                  </el-form-item>

                  <div class="postInfo-container">
                    <el-row>
                      <el-col :span="24">
                        <el-cascader  
                          :disabled="this.MyisEdit || this.isAdminQueryData"
                          v-model="listQuery.teacherid"
                          :options="teacherOptions"
                          placeholder="选择老师" 
                          clearable 
                          style="width:400px;" 
                          class="filter-item" 
                          > 
                        </el-cascader> 
                        <el-select v-model="listQuery.teachtaskAcademicyear" placeholder="学年" clearable 
                          :disabled="this.MyisEdit|| this.isAdminQueryData"
                          style="width:300px;margin-left:17px" class="filter-item">
                          <el-option v-for="item in teachtaskAcademicyearOptions" :key="item.index" :label="item.label" :value="item.value" />
                        </el-select> 
                        <el-select v-model="listQuery.teachtaskAcademicterm" placeholder="学期" clearable
                          :disabled="this.MyisEdit || this.isAdminQueryData"
                          style="width:150px;margin-left:17px" class="filter-item">
                          <el-option v-for="item in teachtaskAcademictermOptions" :key="item.index" :label="item.label" :value="item.value" />
                        </el-select> 
                        <el-button v-if="!this.MyisEdit && !this.isAdminQueryData" class="filter-item"  style="width:190px; margin-left: 25px;" type="primary" icon="el-icon-search" @click="getcourses">
                          查询教学任务
                        </el-button>
                        <!-- <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                          <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search user">
                            <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                          </el-select>
                        </el-form-item> -->
                      </el-col>

                      <el-col :span="24">
                      
                          <el-select  @focus="step_Course" v-if="!this.MyisEdit && !this.isAdminQueryData" v-model="postForm.tk_teachtaskid" placeholder="选择课程" clearable 
                            style="width:300px;margin-top:17px" class="filter-item">
                            <el-option v-for="item in teachtaskOptions" :key="item.index" :label="item.label" :value="item.value" />
                          </el-select> 
                          <el-input
                            @focus="step_Course"
                            v-if="this.MyisEdit || this.isAdminQueryData" 
                            style="width:300px;margin-top:17px;" 
                            placeholder="课程名"
                            v-model="this.MyisEditShowCourseName"
                            :disabled="true">
                          </el-input>


                          <el-date-picker
                            style="width:300px;margin-top:17px;margin-left:17px;" class="filter-item"
                            :disabled="this.isAdminQueryData" 
                            clearable
                            v-model="postForm.tk_date"
                            align="right"
                            type="date"
                            placeholder="听课日期"
                            :picker-options="pickerOptions">
                          </el-date-picker> 
                          <el-select   :disabled="this.isAdminQueryData"  v-model="postForm.tk_jc" placeholder="听课节次" clearable 
                            style="width:150px;margin-top:17px;margin-left:17px;" class="filter-item">
                            <el-option v-for="item in jcOptions" :key="item.index" :label="item.label" :value="item.value" />
                          </el-select> 
                          <el-select
                            :disabled="this.isAdminQueryData" 
                            style="width:300px;margin-top:17px;margin-left:17px;"
                            v-model="postForm.tk_classes"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请输入任课班级">
                            <el-option
                              v-for="item in classesOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>  
                      </el-col> 
                    </el-row>
                  </div>
      
                </el-col>
              </el-row>  
            </el-tab-pane>
            <el-tab-pane label="随堂记录">
              <el-form-item style="margin-bottom: 40px;margin-top:17px" label-width="100px" label="教学内容主题">
                <el-input @focus="step_ShortTitle" @blur="step_Content" :disabled="this.isAdminQueryData" v-model="postForm.tk_content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter here" />
                <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
              </el-form-item>
              <el-form-item style="margin-bottom: 30px;">
                <Tinymce  @focus="step_Content" ref="editor" v-model="postForm.tk_content" :height="500" />
              </el-form-item> 
            </el-tab-pane>
            <el-tab-pane label="教师评价"> 
              <el-row>
                <el-col :span="24">
                  <el-form-item style="margin-bottom: 40px;margin-top:22px" label-width="61px" label="总评">
                    <el-input
                      :disabled="this.isAdminQueryData"  
                      type="textarea"
                      @input="changeJudge($event)"
                      :autosize="{ minRows: 3, maxRows: 10}"
                      placeholder="请添加总评"
                      v-model="postForm.tk_judge">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-form-item label-width="90px" label="评分" class="postInfo-container-item"> -->
              <el-row>
                <el-col :span="24">
                  <el-form-item   style="margin-bottom: 40px;margin-top:22px" label-width="86px" label="课程评分">
                    <el-rate
                      @change="step_Rate"
                      :disabled="this.isAdminQueryData" 
                      v-model="postForm.tk_rate"
                      :max="10"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9980']"
                      :low-threshold="3"
                      :high-threshold="7"
                      style="display:inline-block;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item style="margin-bottom: 40px;margin-top:22px" label-width="61px" label="标签">
                    <el-tag
                      :key="tag"
                      v-for="tag in tk_tags_dynamicTags"
                      closable
                      :disable-transitions="false"
                      @close="tk_tags_handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      :disabled="this.isAdminQueryData" 
                      v-if="tk_tags_inputVisible"
                      v-model="tk_tags_inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="tk_tags_handleInputConfirm"
                      @blur="tk_tags_handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="tk_tags_showInput">+ New Tag</el-button>

                    <!-- <el-select
                      style="width:300px; margin-left:17px;"
                      v-model="postForm.tk_tags"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请为教师添加标签">
                      <el-option
                        v-for="item in classesOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>   -->
                  </el-form-item>
                </el-col>
              </el-row> 
              <el-row>
                <el-col :span="24">
                  <el-form-item v-if="!this.isAdminQueryData || this.isEdit" style="margin-bottom: 30px;" label-width="140px" label="上传课程记录文件">
                      <!-- <Upload v-model="postForm.image_uri" /> -->
                      <!-- <el-upload
                        class="upload-demo"
                        show-file-list
                        :file-list="fileList"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple
                        list-type="picture-card"
                        limit="2"
                        :on-exceed="onExceed"
                        :on-preview="onPreview"
                        :on-remove="onRemove"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :on-progress="onProgress"
                        :on-change="onChange"  
                        :before-upload="beforeUpload"
                        :before-remove="beforeRemove" 
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload> -->
                      <el-upload
                        class="upload-demo"
                        drag
                        ref="upload"
                        :limit="2" 
                        :before-remove="beforeRemove" 
                        :before-upload="beforeUpload"
                        :on-exceed="onExceed"
                        :on-preview="onPreview"
                        :on-remove="onRemove" 
                        :auto-upload="false"
                        :headers="headers"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        action="http://localhost:9530/tk/upload"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">可上传全文件类型，最大支持100MB</div>
                      </el-upload>
                
                    <el-button type="primary" :loading="uploadLoading"  @click="upload">确认上传</el-button>
                  
                  </el-form-item>
                </el-col>
              </el-row> 

              <el-button 
                v-if="!this.MyisEdit && !this.isAdminQueryData"
                style="margin-bottom:20px; width:90%; margin-left:50px; height:55px" 
                type="success"
                icon="el-icon-check" 
                round
                @click="submitTkForm"
                :loading="loading" 
              >确认提交</el-button>

              <el-button 
                v-if="this.MyisEdit && !this.isAdminQueryData"
                style="margin-bottom:20px; width:90%; margin-left:50px; height:55px" 
                type="success"
                icon="el-icon-check" 
                round
                @click="submitTkForm"
                :loading="loading" 
              >确认更改</el-button>
            </el-tab-pane>
          </el-tabs>
        

       
      </div> 

    
      
     
    </el-form>
  
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import Tinymce from './Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

import token from '@/store/modules/user'
import {
  tk_getocurses,
  createTkRecord,
  fetchTkInfo,
  updateTkRecord
} from '@/api/tk'
import { 
  fetchTeacherList, 
  fetchTeachTaskList, 
  handleTeachtaskStatus, 
} from '@/api/teachtask'



const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0,

  tk_title: '',
  tk_teachtaskid: '',
  tk_date: '',
  tk_jc: '',
  tk_classes: '',
  tk_content_short: '',
  tk_content: '',
  tk_rate: 0,
  tk_id: "",
}

export default {
  name: 'TK',
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必填字段',
          type: 'error'
        })
        callback(new Error(rule.field + '为必填字段'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      // 此听课记录id create时根据编辑或新建赋值
      tk_id: null, 

      // 是否为修改状态 如果是修改状态 则一些东西是不可进行修改的 默认是新建
      MyisEdit: false,
      MyisEditShowCourseName:null,//如果是修改状态 则不再显示让用户选择听哪一个教学任务的课 而是显示课程名

      // 是否是管理员查看状态
      isAdminQueryData:false,

      action_step:0,//目前进行到哪一步了

      // 查询条件
      listQuery: { 
        teacherid: null,   
        teachtaskAcademicterm : null,
        teachtaskAcademicyear : null, 
      },  
      teachtaskAcademictermOptions:[],
      teachtaskAcademicyearOptions:[],
      teacherOptions:[],
      teachtaskOptions:[],
      jcOptions:[],
      classesOptions:[],

      // 上传文件
      // fileList:[], 
      uploadLoading:false,
      
      headers: null,
      // headers: {
      //   'token': token.state.token,
      //   'tk_id': this.tk_id
      // },
      filename: '',

      // 时间选择
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },

      // 给老师添加标签
      tk_tags_dynamicTags: ['示例'],
      tk_tags_inputVisible: false,
      tk_tags_inputValue: '',


      // 原生的富文本编辑器
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        // title: [{ validator: validateRequire }],
        // content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    console.log("this.$route.query.tk_id")
    console.log(this.$route.query.tk_id)
    
    // 先判断是否是admin进行的查看 若是则进入查看模式
    if(this.$route.query.isAdminQuery != null && this.$route.query.isAdminQuery == true){
      this.isAdminQueryData = true  
      //说明是跳转过来的 则需要将数据还原 
      this.tk_id = this.$route.query.tk_id  
      var that = this
      fetchTkInfo(this.tk_id).then(response => {  
        that.postForm.tk_content = decodeURIComponent(response.data.tkComments)
        that.postForm.tk_content_short = response.data.tkContentShort
        that.postForm.tk_date = response.data.tkTime
        that.postForm.tk_jc = response.data.tkJc
        that.postForm.tk_rate = response.data.tkScore 
         
        that.postForm.tk_teachtaskid = response.data.teachtaskId
        that.MyisEditShowCourseName = response.data.tk_CourseName
        that.listQuery.teacherid = [ response.data.tk_College , response.data.tkBtkjsid ]
        that.listQuery.teachtaskAcademicterm = (response.data.tk_AcaTerm)
        that.listQuery.teachtaskAcademicyear = (response.data.tk_AcaYear) 

        that.postForm.tk_title = response.data.tkTitle,
        that.postForm.tk_judge = response.data.tkJudge

        that.tk_tags_dynamicTags = []
        if( response.data.tkTags != "" &&  response.data.tkTags != null){
          var tags = response.data.tkTags.split(";")
          for(let i = 0; i < tags.length; i++ ){
            that.tk_tags_dynamicTags.push(tags[i])
          }
        } 
        if( response.data.tkClasses != "" &&  response.data.tkClasses != null){
          var clses = response.data.tkClasses.split(";")
          for(let i = 0; i < clses.length; i++ ){
            that.classesOptions.push( { value: clses[i], label: clses[i] } )
            that.postForm.tk_classes.push(clses[i])
          } 
        } 
      })  
    }else if(this.$route.query.tk_id != null){
      this.MyisEdit = true
      //说明是跳转过来的 则需要将数据还原
      /**
        teachtaskId: "44cd79ee"
        tkBtkjsid: "222222"
        tkClasses: "123"
        tkComments: "<p>123<img class="wscnph" src="data:image/jpeg;bas"
        tkContentShort: "231"
        tkId: "bB4k9kln"
        tkJc: "1"
        tkJudge: "123"
        tkNeednum: null
        tkRealnum: null
        tkScore: 5
        tkTags: "示例;123"
        tkTime: "2021-04-25T01:15:45.000+00:00"
        tkTitle: "123"
        tkTkjsid: "123123"
        tk_AcaTerm: "1"
        tk_AcaYear: "2021"
        tk_CourseName: "计算机科学导论"
        tk_btkTeacherName: "吴健"
       */
      this.tk_id = this.$route.query.tk_id  
      var that = this
      fetchTkInfo(this.tk_id).then(response => {   
        console.log(response) 
       
        // console.log((response.data.tkComments))
        // console.log(decodeURIComponent(response.data.tkComments)) 
        // that.postForm.tk_id: response.tk_id,
        that.postForm.tk_content = decodeURIComponent(response.data.tkComments)
        that.postForm.tk_content_short = response.data.tkContentShort
        that.postForm.tk_date = response.data.tkTime
        that.postForm.tk_jc = response.data.tkJc
        that.postForm.tk_rate = response.data.tkScore


        // 判断是否是修改状态 修改状态则不修改这个参数且不可修改此参数
        that.postForm.tk_teachtaskid = response.data.teachtaskId
        that.MyisEditShowCourseName = response.data.tk_CourseName
        that.listQuery.teacherid = [ response.data.tk_College , response.data.tkBtkjsid ]
        that.listQuery.teachtaskAcademicterm = (response.data.tk_AcaTerm)
        that.listQuery.teachtaskAcademicyear = (response.data.tk_AcaYear)
          
     

        that.postForm.tk_title = response.data.tkTitle,
        that.postForm.tk_judge = response.data.tkJudge

        that.tk_tags_dynamicTags = []
        if( response.data.tkTags != "" &&  response.data.tkTags != null){
          var tags = response.data.tkTags.split(";")
          for(let i = 0; i < tags.length; i++ ){
            that.tk_tags_dynamicTags.push(tags[i])
          }
        }

        if( response.data.tkClasses != "" &&  response.data.tkClasses != null){
          var clses = response.data.tkClasses.split(";")
          for(let i = 0; i < clses.length; i++ ){
            that.classesOptions.push( { value: clses[i], label: clses[i] } )
            that.postForm.tk_classes.push(clses[i])
          } 
        }
  
      })  
   
    }else{
      // 如果是一个新的听课记录--为其创建一个uuid 以方便其上传文件（8位64进制）
      this.tk_id = this.getuuid(8, 64)
    }
    
    var headerObj = {
      'token': token.state.token,
      'tk_id': this.tk_id
    }
    this.headers = headerObj

    fetchTeacherList().then(response => {   
      console.log('fetchTeacherList') 
      console.log(response) 
      // console.log(response) 
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
      console.log('fetchTeacherList collegeArr') 
      console.log(collegeArr) 
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
    for(let i = 1 ; i <=11 ; i++){ 
      var obj = {
        label : "第"+i+"节次",
        value : i+""
      }  
      this.jcOptions.push(obj)
    } 

    //如果是编辑 则提前写入数据
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    tk_tags_handleClose(tag) {
      this.tk_tags_dynamicTags.splice(this.tk_tags_dynamicTags.indexOf(tag), 1);
    }, 
    tk_tags_showInput() {
      this.tk_tags_inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }, 
    tk_tags_handleInputConfirm() {
      let tk_tags_inputValue = this.tk_tags_inputValue;
      if (tk_tags_inputValue) {
        this.tk_tags_dynamicTags.push(tk_tags_inputValue);
      }
      this.tk_tags_inputVisible = false;
      this.tk_tags_inputValue = '';
    },

    changeJudge(e) {
      this.postForm.tk_judge = e 
      this.$forceUpdate()
    }, 
    getcourses(){
      if(this.listQuery.teacherid == null){
        this.$message({
            showClose: true,
            message: '对不起，需要选择教师！',
            type: 'error'
          });
      }else if(this.listQuery.teachtaskAcademicyear == null){
        this.$message({
          showClose: true,
          message: '对不起，需要选择学年！',
          type: 'error'
        });
      }else if(this.listQuery.teachtaskAcademicterm == null){
        this.$message({
          showClose: true,
          message: '对不起，需要选择学期！',
          type: 'error'
        });
      }else{ 
        this.listQuery.teacherid = this.listQuery.teacherid[1]
        this.listQuery.page = 1
        this.listQuery.limit = 1000
        fetchTeachTaskList(this.listQuery).then(response => {  
          /**
            classId: "172051"
            collegeId: "1"
            collegeName: "计算机学院"
            courseId: "1"
            courseName: "计算机科学导论"
            professionId: "4"
            professionName: "物联网工程"
            teacherId: "222222"
            teacherName: "吴健"
            teachtaskAcademicterm: 1
            teachtaskAcademicyear: 2021
            teachtaskEndtime: 7
            teachtaskGradelimit: ""
            teachtaskId: "b16555e1"
            teachtaskIseveryweek: 0
            teachtaskIsrank: 0
            teachtaskMaxnum: 0
            teachtaskNumlimit: 1
            teachtaskPriority: null
            teachtaskRemaerk: ""
            teachtaskSelnum: 0
            teachtaskStarttime: 1
          */ 
          this.teachtaskOptions = []
          for(let i = 0 ; i < response.data.data.length ; i++ ){
            var obj = {
              value : response.data.data[i].teachtaskId,
              label : response.data.data[i].courseName
            }
            this.teachtaskOptions.push(obj)
          }
        })   
      } 
    },
    submitTkForm(){
      console.log(this.postForm)
      if(this.postForm.tk_title == null || this.postForm.tk_title == ""){
        this.$message({
          showClose: true,
          message: '对不起，请输入标题！',
          type: 'error'
        });
      }else if(this.postForm.tk_teachtaskid == null || this.postForm.tk_teachtaskid == ""){
        this.$message({
          showClose: true,
          message: '对不起，请选择教学任务！',
          type: 'error'
        });
      }else if(this.postForm.tk_date == null || this.postForm.tk_date == ""){
        this.$message({
          showClose: true,
          message: '对不起，需要选择听课日期！',
          type: 'error'
        });
      }else if(this.postForm.tk_jc == null || this.postForm.tk_jc == ""){
        this.$message({
          showClose: true,
          message: '对不起，需要选择听课节次！',
          type: 'error'
        });
      }else if(this.postForm.tk_content_short == null || this.postForm.tk_content_short == ""){
        this.$message({
          showClose: true,
          message: '对不起，需要键入课程主题！',
          type: 'error'
        });
      }else if(this.postForm.tk_content == null || this.postForm.tk_content == ""){
        this.$message({
          showClose: true,
          message: '请编辑内容！',
          type: 'error'
        });
      }else if(this.postForm.tk_rate == null || this.postForm.tk_rate == ""){
        this.$message({
          showClose: true,
          message: '请评分',
          type: 'error'
        });
      }else if(this.tk_tags_dynamicTags == null || this.tk_tags_dynamicTags == ""){
        this.$message({
          showClose: true,
          message: '请键入个标签',
          type: 'error'
        });
      } else if(this.postForm.tk_judge == null || this.postForm.tk_judge == ""){
        this.$message({
          showClose: true,
          message: '请总评',
          type: 'error'
        });
      }else{ 
        this.loading = true

       

        this.postForm.tk_id = this.tk_id

        if( this.postForm.tk_classes != null ){
          var tk_classes = this.postForm.tk_classes[0]
          for(let i = 1 ; i < this.postForm.tk_classes.length ;i++ ){
            tk_classes += (';'+this.postForm.tk_classes[i])
          }
          this.postForm.tk_classes = tk_classes
        }else{
          this.postForm.tk_classes = null
        }

        this.postForm.tk_date = this.getTime(this.postForm.tk_date)
        
        console.log(this.postForm.tk_content)
        this.postForm.tk_content = encodeURIComponent(this.postForm.tk_content)
        // this.postForm.tk_content = "encodeURIComponent(this.postForm.tk_content)"
 
      

        if( this.tk_tags_dynamicTags != null ){
          var tags = this.tk_tags_dynamicTags[0]
          for(let i = 1 ; i < this.tk_tags_dynamicTags.length ;i++ ){
            tags += (';'+this.tk_tags_dynamicTags[i])
          }
          this.postForm.tk_tags_dynamicTags = tags
        }else{
          this.postForm.tk_tags_dynamicTags = null
        } 
 
        var param = {
          tk_classes: this.postForm.tk_classes,
          tk_content: this.postForm.tk_content,
          tk_content_short: this.postForm.tk_content_short,
          tk_date: this.postForm.tk_date,
          tk_id: this.postForm.tk_id,
          tk_jc: this.postForm.tk_jc,
          tk_rate: this.postForm.tk_rate,
          tk_teachtaskid: this.postForm.tk_teachtaskid,
          tk_title: this.postForm.tk_title,
          tk_tags: this.postForm.tk_tags_dynamicTags,
          tk_judge: this.postForm.tk_judge 
        }
        console.log(param) 
        if( this.MyisEdit ){
          updateTkRecord( param ).then(response => {
            if (response.code === 20000) {  
              this.$notify({
                title: '成功',
                message: '已更改教师教学质量管理记录',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false 
            } else {
              this.$alert('更改教师教学质量管理记录失败！', '提交提示', {
                confirmButtonText: '确定'
              })
            } 
          })
        }else{
          createTkRecord( param ).then(response => {
            if (response.code === 20000) { 
              // this.$alert('已存储教师教学质量管理记录!', '提交提示', {
              //   confirmButtonText: '确定'
              // })
              this.$notify({
                title: '成功',
                message: '已存储教师教学质量管理记录',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false 
            } else {
              this.$alert('存储教师教学质量管理记录失败！', '提交提示', {
                confirmButtonText: '确定'
              })
            } 
          })
        }
       
        /**
          tk_classes: Array(0)
          tk_content: "<p>123</p>"
          tk_content_short: "123qqq"
          tk_date: Sat Apr 24 2021 16:38:27 GMT+0800 (中国标准时间)
          tk_jc: "1"
          tk_rate: 8
          tk_teachtaskid: "44cd79ee"
          tk_title: "123"
         */
     
      }
    },



    // ==========
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    step_Title(e){
      this.action_step = 0 
    },
    step_Course(e){
      this.action_step = 1 
    },
    step_ShortTitle(e){
      this.action_step = 2 
    },
    step_Content(e){
      this.action_step = 3
    },
    step_Rate(e){
      this.action_step = 4
    },
    // ===============
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
    getuuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;  
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]; 
        return uuid.join('');
    },
    upload() {
      this.uploadLoading = true
      this.$refs.upload.submit()
    },
    beforeUpload(file) { 
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.filename = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.$notify({
        title: '上传成功！',
        type: 'success',
        duration: 3500
      })
      this.uploadLoading = false
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: '对不起，上传失败！',
        duration: 3500
      })
      this.uploadLoading = false
    }, 
    beforeRemove(file, fileList){ 
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    onExceed(files, fileList){ 
      this.$message.warning(
        `当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    onPreview(file){ 
      console.log(file); 
    },
    onRemove(file, fileList) {
      console.log(file, fileList);
    },
    // onSuccess(res, file) { 
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    // onError(){

    // },
    // onProgress(){

    // },
    // onChange(file, fileList) {
    //   this.fileList = fileList.slice(-3);
    // },
    // beforeUpload(file) {
    //   const isJPG = file.type === 'image/jpeg/jpg/png/ppt/doc/docx/txt/xls/xlsx/pptx';
    //   const isLt2M = file.size / 1024 / 1024 < 10;
    //   if (!isJPG) {
    //     this.$message.error('上传文件错误! 对不起，系统补接受此类型的文件');
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传文件大小不能超过 10MB!');
    //   }
    //   return isJPG && isLt2M;
    // },
  
    // beforeRemove(file, fileList){ 
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
  }
}
 
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 0px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
