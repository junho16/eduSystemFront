<template>
  <!-- 选修课程管理==》校外的选修 -->
  <div class="app-container"> 
    <div class = "mydiv">
      
      <!--   :render-content="renderFunc"  @mouseover.native="showDetail"  -->
      <el-transfer 
     
          @left-check-change="handleChange"
          :titles="['可选网课', '已选择']" 
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入课程名称"
          v-model="value"
          :data="data">  
          <span slot-scope="{ option }">  
              <!-- <div class="row">课程:{{ option.label }}+"11111111111111111111"</div>   -->
          
            <el-tag >编号:{{ option.asid }}</el-tag>
            <el-tag  style="margin-left:2px">课程:{{ option.asname }}</el-tag>
            <el-tag  style="margin-left:2px">平台:{{ option.assourse }}</el-tag>
            <el-tag  style="margin-left:2px">类别:{{ option.askind }}</el-tag>
            <el-tag  style="margin-left:2px">学分:{{ option.ascredit }}</el-tag> 
          </span>  
          
      </el-transfer>  
      <div class="btn">
          <el-button type="success" icon="el-icon-check" size="medium"  @click="onSubmit" circle></el-button>
      </div>
    </div>
  </div>
  
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

//  ===============================
 
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
  fetchSZKCList,
  updateXXKCInfo,
  createXXKCInfo,
  deleteXXKCInfo, 
} from '@/api/xxkc'

import {
  selectxxkc
} from '@/api/xk'

import token from '@/store/modules/user'
import { thisExpression } from '@babel/types'

export default {
  name: 'selxxkc',
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
    const generateData = _ => {
      // const data = [];

      // var datatmp = this.showdata
      // var that = this
      // datatmp.forEach((row, index) => {
      //     data.push({ 
      //         label: row,
      //         key: index,
      //         asname: that.asdata[index]
      //     });
      // });
      // this.data = datatmp;
      // console.log(datatmp)

      // const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
      // const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      // cities.forEach((city, index) => {
      //   data.push({
      //     label: city,
      //     key: index,
      //     pinyin: pinyin[index]
      //   });
      // });
      // return data;
    };
    return { 
      // 素质选修课程（校内的 需要先查出 和网课合并选课）
      /**
        credit: 1
        classId: null
        collegeId: null
        collegeName: "计算机学院"
        courseId: "12"
        courseName: "中华诗词之美"
        professionId: null
        professionName: null
        teacherId: "222222"
        teacherName: null
        teachtaskAcademicterm: 1
        teachtaskAcademicyear: 2020
        teachtaskEndtime: 5
        teachtaskGradelimit: "2019"
        teachtaskId: "75af0477"
        teachtaskIseveryweek: 0
        teachtaskIsrank: 0
        teachtaskMaxnum: 0
        teachtaskNumlimit: 0
        teachtaskPriority: null
        teachtaskRemaerk: "人文社科"
        teachtaskSelnum: 0
        teachtaskStarttime: 7
       */
      szkcList: [],

      list:[], 
      showdata:[],
      asdata:[], 
         
      asname:[], 
      asid:[], 
      assourse:[], 
      askind:[], 
      ascredit:[], 

      data: generateData(),
      value: [],
      filterMethod(query, item) {
        return item.asname.indexOf(query) > -1;
      } 
    }; 
  }, 
  /**
   *  自定义vue生命周期create方法
   *  获取此角色可视的课程列表
   */
  created() {
    this.initData()
    
  }, 
  methods: {
    async initData(){
      this.$confirm('欢迎选课，亲，这边建议您收起边框进行操作~~~', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });

      var listQuery = {page:1,limit:10000}

      // 更新：除了校外选修课程 还需加上校内的素质 拓展课程
      // 需要：id name sourse（学院） kind credit
      await fetchSZKCList((listQuery)).then(response => {   
        console.log(response)
        this.szkcList = response.data.data
      })

      // 课程名-平台来源-课程类别-学分
      // 课程编号 
      await fetchXXKCList((listQuery)).then(response => {   
        // console.log(response)
        this.list =  response.data.data
        // this.total = response.data.total 
        var listtmp =  response.data.data

        var showdata = []
        var asdata = [] //别名--用于快速搜索
        var askind = []
        var asname = []
        var asid = []
        var assourse = []
        var ascredit = []

        for(let i = 0;i < listtmp.length;i++){
          var showrow =
            listtmp[i].xxkcName + "\t-\t-\t-\t"   
            + listtmp[i].xxkcSourse +  "\t-\t-\t-\t" 
            + listtmp[i].xxkcKind +  "\t-\t-\t-\t" 
            + listtmp[i].xxkcCredit;

          showdata.push(showrow)
          asdata.push(listtmp[i].xxkcName)
          asname.push(listtmp[i].xxkcName)
          asid.push(listtmp[i].xxkcId)
          assourse.push(listtmp[i].xxkcSourse)
          askind.push(listtmp[i].xxkcKind)
          ascredit.push(listtmp[i].xxkcCredit)
        }
        // 更新：除了校外选修课程 还需加上校内的素质 拓展课程
        // 需要：id name sourse（学院） kind credit
        for(let i = 0;i < this.szkcList.length;i++){
          var showrow =
            this.szkcList[i].courseName + "\t-\t-\t-\t"   
            + this.szkcList[i].collegeName +  "\t-\t-\t-\t" 
            + this.szkcList[i].teachtaskRemaerk +  "\t-\t-\t-\t" 
            + this.szkcList[i].credit;

          showdata.push(showrow)
          asdata.push(this.szkcList[i].courseName)
          asname.push(this.szkcList[i].courseName)
          asid.push(this.szkcList[i].teachtaskId)
          assourse.push(this.szkcList[i].collegeName)
          askind.push(this.szkcList[i].teachtaskRemaerk)
          ascredit.push(this.szkcList[i].credit)
        }
        this.showdata = showdata
        this.asdata = asdata
        this.asname = asname
        this.asid = asid
        this.assourse = assourse
        this.askind = askind
        this.ascredit = ascredit
        // console.log(  this.showdata)
        // console.log(  this.asdata)
        // ================================ 
        const data2 = []; 
        var datatmp = this.showdata
        var that = this
        datatmp.forEach((row, index) => {
          data2.push({ 
              label: row,
              key: index,
              asname: that.asdata[index],  
              asid: that.asid[index], 
              assourse: that.assourse[index], 
              askind: that.askind[index], 
              ascredit: that.ascredit[index], 
          });
        });
        
        this.data = data2;
      // console.log(this.data)
      //   const data = [];
      //   // const cities = ['阿萨德', '北京', '广州', '深圳', '南京', '西安', '成都','上海', '北京', '广州', '深圳', '南京', '西安', '成都','上海', '北京', '广州', '深圳', '南京', '西安', '成都','shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      //   // const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu','shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu','shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu','shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
    
      //   var datatmp = this.showdata
      //   var that = this
      //   datatmp.forEach((row, index) => {
      //       data.push({ 
      //           label: row,
      //           key: index,
      //           asname: that.asdata[index]
      //       });
      //   });
      //   this.data = datatmp;
      })
    },
    // renderFunc(h, option) {
    //    return  <span title={option.label}>{option.label}</span>
            //   <span title={option.label}>{option.label}</span>
            //   <span title={option.asid}>{option.asid}</span>
            // <div><span title={option.label}>  </span> 
 
      //  <span title={option.label}>{option.label}</span>
      //         <span title={option.asid}>{option.asid}</span>
      //      <div><span title={option.label}>   
      //       <el-tag type="success">编号:{ option.asid }</el-tag>
      //       <el-tag type="success">课程:{ option.asname }</el-tag>
      //       <el-tag type="success">平台:{ option.assourse }</el-tag>
      //       <el-tag type="success">类别:{ option.askind }</el-tag>
      //       <el-tag type="success">学分:{ option.ascredit }</el-tag> 
      //     </span> </div>;
       
    // },
    handleChange(value, direction, movedKeys) {
        // console.log(value);
        // console.log(direction);
        // console.log( movedKeys);
        // console.log( "========================");
        // this.$message('你选中了'+direction[0]);
        var rowdata = 
          "{ 编号:"+this.asid[direction[0]]
          +" } --- { 名称："+this.asname[direction[0]]
          +" } --- { 平台："+this.assourse[direction[0]]
          +" } --- { 类别："+this.askind[direction[0]]
          +" } --- { 学分: "+this.ascredit[direction[0]]+" }"
       
        this.$message({
          message: rowdata,
          type: 'success'
        });

      // var showdata = []
      // var asdata = [] //别名--用于快速搜索
      // var  = []
      // var  = []
      // var  = []
      // var  = []
      // var  = []
    },
    showDetail(e) { 
      console.log(e)
      //手动给鼠标划过的元素添加一个title
      let target_el = e.title;
      if (target_el.title) return;
        console.log(target_el.innerText)
      target_el.title = "target_el.innerText";
           console.log(target_el.title)
    }, 

    onSubmit(){ 
      // console.log( this.value)
      if( this.value.length > 3 ){
        this.$alert('对不起，您最多可选3门课程', '选课提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'warning',
              message: `action: ${ action }`
            });
          }
        });
      }else{
        
        for(let i = 0 ;i < this.value.length ;i++){
          // 0,1,2,3
          // console.log(this.asid[this.value[i]])
          // console.log(this.asid)
          selectxxkc(this.asid[this.value[i]]).then(response => {
            if (response.code === 20000) { 
              var that = this
              this.$alert('选课'+that.asname[that.value[i]]+'成功', '操作提示', {
                confirmButtonText: '确定'
              })
            } else {
              this.$alert('对不起，选课失败，您可能已选过此课 ~', '操作提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      } 
     
    }
  }
   
    
}
</script>
<style>
.row{
  width: 100%;
  height: 100%;
  border: 1px 1px 1px 1px black
}
.mydiv{
    display:flex; 
}
.btn{
    margin-top: 290px;
    margin-left: 15px;
    /* width: 80px;
    height: 50px;
    display:flex;  */
}
.el-transfer-panel__list.is-filterable{
    width:550px !important;
    height:630px !important;
}
 
.el-transfer-panel{
    width: 550px !important;
    height: 630px !important;
}
</style>

