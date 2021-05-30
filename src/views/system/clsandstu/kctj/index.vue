<template>
  <el-tabs type="card"  v-model="tapName"  >
    <el-tab-pane label="我想搜课~" name="first">
      <span slot="label"><i class=" el-icon-aim "></i> 我想搜课~</span> 
      <div class="dashboard-container">
     
        <div class="body">
         
          <div class="table">
            <div class="top">
              <span class="span-top">网络课程:</span>
              <el-input
                style="width:66%;margin-top:30px;border-radius: 30px"
                placeholder="请输入检索关键字"
                v-model="keyword"
                clearable>
              </el-input> 
              <el-button style="margin-left:20px;" type="primary" round icon="el-icon-thumb" @click="search"> 确认搜索</el-button>
            </div>
            <el-table
              v-loading="listLoading"
              :data="searchdata"
              stripe 
              style="width: 100%; height:90%; margin-left:20px">
              <el-table-column
                fixed
                prop="date"
                label="#"
                width="50">
                  <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="400">
                  <template slot-scope="{row}">
                    <span>{{ row.kctjTitle }}</span>
                  </template>
              </el-table-column>
              <!-- <el-table-column
                prop="province"
                label="来源"
                width="180">
                  <template slot-scope="{row}">
                    <span>{{ row.link }}</span>
                  </template>
              </el-table-column> -->
              <el-table-column
                prop="city"
                label="评分"
                width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.kctjScore }}</span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="难度"
                width="100">
                  <template slot-scope="{row}">
                    <span>{{ row.kctjHard }}难度</span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="zip"
                label="学习人数"
                width="100">
                  <template slot-scope="{row}">
                    <span>{{ row.kctjBooknum }}</span>
                  </template>
              </el-table-column> 
              <el-table-column 
                label=""
                width="180">
                <template slot-scope="scope">
                  <el-button @click="showcontent(scope.row)"   size="small">看简介</el-button>
              
                  <el-button @click="link(scope.row)"  size="small">我想学 
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="list">
            <el-table 
                :data="rankdata"
                style="margin-left:30px"> 
                <el-table-column align="center" label="课程热榜：他们在看~">
                  <el-table-column
                    prop="name"
                    label="排名"
                    align="center"
                    width="55">
                    <template slot-scope="{row}">
                
                      <div v-if="row.id===1">
                        <svg-icon class-name="" icon-class="No1"/>
                      </div>
                      <div v-else-if="row.id===2">
                        <svg-icon class-name="" icon-class="No2" />
                      </div>
                      <div v-else-if="row.id===3">
                        <svg-icon class-name="" icon-class="No3"/>
                      </div>
                      <div v-else>
                        {{row.id}}
                      </div> 
                      
                    </template> 
                  </el-table-column> 
                  <el-table-column
                    prop="province"
                    label="名称"
                    width="300">
                    <template slot-scope="{row}">
                      <el-link :underline="false" :href="row.kctjLink">{{ row.kctjTitle }}</el-link>
                      <!-- <span>{{ row.title }}</span> -->
                    </template>
                  </el-table-column> 
                </el-table-column>
              </el-table>
          </div>
        </div> 
      </div>
    </el-tab-pane>
    <el-tab-pane label="猜你喜欢~" name="second">
      <span slot="label"><i class="el-icon-star-off"></i> 猜你喜欢~</span>  
      <div style="width:100%;height:100%;margin-left:30px;margin-bottom:30px">
        <el-table 
          :data="recommenddata"
          style="width:100%;height:100%;argin-left:30px"> 
          <el-table-column align="center" label="猜你喜欢这些，有你喜欢的课程么？点进去看看吧~">
            <el-table-column
              prop="name"
              label="排名"
              align="center"
              width="55">
              <template slot-scope="{row}">
          
                <div v-if="row.id===1">
                  <svg-icon class-name="" icon-class="No1"/>
                </div>
                <div v-else-if="row.id===2">
                  <svg-icon class-name="" icon-class="No2" />
                </div>
                <div v-else-if="row.id===3">
                  <svg-icon class-name="" icon-class="No3"/>
                </div>
                <div v-else>
                  {{row.id}}
                </div>  
              </template> 
            </el-table-column> 
            <el-table-column
              prop="province"
              label="名称" 
              width="500">
              <template slot-scope="{row}">
                <span>{{ row.kctjTitle }}</span>
              </template>
            </el-table-column> 
            <el-table-column
              prop="city"
              label="评分"
              align="center"
              width="80">
                  <template slot-scope="{row}">
                  <span>{{ row.kctjScore }}</span>
                  </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="难度"
              align="center"
              width="150">
                <template slot-scope="{row}">
                  <span>{{ row.kctjHard }}难度</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="zip"
              label="学习人数"
              align="center"
              width="180">
                <template slot-scope="{row}">
                  <span>{{ row.kctjBooknum }}</span>
                </template>
            </el-table-column> 
            <el-table-column 
              label=""
              width="180">
              <template slot-scope="scope">
                  <el-button @click="showcontent(scope.row)"   size="small">看简介</el-button>
              
                  <el-button @click="link(scope.row)"  size="small">我想学 
                  </el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table> 
      </div>
    </el-tab-pane> 
  </el-tabs>

</template>
<script>  
import {
  es_getcourse,
  fetchrecommendlist,
  updateHitBehavior
} from '@/api/es_course'
export default {
  name: 'kctj',
  data() {
    return {
      tapName: 'first',
      listLoading: false,
      keyword:null,
      searchdata:[],
      rankdata:[] ,
      recommenddata:[]
    }
  },
  created() {
    this.listLoading = true   
       
    var param = {
      keyword:'spring'
    }
    es_getcourse((param)).then(response => {   
      console.log(response)  
      if(response.code == 20000){  
        this.listLoading = false 
        
        var tmp = response.data
        for(let i = 0 ;i < tmp.length; i++){
          tmp[i].id = i+1 
          if(i == 0){
            tmp.icon = 'No1'
          }else if(i == 1){
            tmp.icon = 'No2'
          }else if(i == 2){
            tmp.icon = 'No3'
          }else{
            tmp.icon = ''
          }
        }
        this.rankdata = tmp
        this.$notify({
          title: '提示',
          message: '已成功获取热榜列表！',
          type: 'success',
          duration: 2000
        }) 
        
      }else{
        this.listLoading = false 
        this.$notify({
          title: '错误',
          message: '发生错误,获取热榜失败！',
          type: 'error',
          duration: 2000
        })  
      }   
    }) 
    fetchrecommendlist().then(response => {   
      console.log(response)  
      if(response.code == 20000){  
        this.listLoading = false  
        var tmp = response.data 
        for(let i = 0 ;i < tmp.length; i++){
          tmp[i].id = i+1 
          if(i == 0){
            tmp.icon = 'No1'
          }else if(i == 1){
            tmp.icon = 'No2'
          }else if(i == 2){
            tmp.icon = 'No3'
          }else{
            tmp.icon = ''
          } 
          if(this.confirmEnding(tmp[i].kctjBooknum,"k")){
            tmp[i].kctjBooknum+="人报名"
          }
          if( tmp[i].kctjHour == null){
            tmp[i].kctjHour = "连载更新"
          }
          if( tmp[i].kctjScore < 5 ){
            tmp[i].kctjScore *= 2
          }
          if(tmp[i].kctjHard == 'Advanced'){
            tmp[i].kctjHard = '高级'
          }else if(tmp[i].kctjHard == 'Mixed'){
            tmp[i].kctjHard = '中高级'
          }else if(tmp[i].kctjHard == 'Intermediate'){
            tmp[i].kctjHard = '中级'
          }else if(tmp[i].kctjHard == 'Beginner'){
            tmp[i].kctjHard = '低级'
          }
        }
        this.recommenddata = tmp
        this.$notify({
          title: '提示',
          message: '已成功获取推荐课程列表！',
          type: 'success',
          duration: 2000
        })  
      }else{
        this.listLoading = false 
        this.$notify({
          title: '错误',
          message: '发生错误,获取推荐课程失败！',
          type: 'error',
          duration: 2000
        })  
      }   
    }) 
  }, 
  methods: { 
 
    showcontent(row){
      console.log(row)
      if(row.content != null){
        this.$alert('<strong>'+row.content+'</strong>', '课程简介', {
          dangerouslyUseHTMLString: true
        }); 
      }else{
        this.$alert('<strong>'+row.kctjContent+'</strong>', '课程简介', {
          dangerouslyUseHTMLString: true
        }); 
      } 
    },
    link(row){
      console.log(row)
      var param = {
        kctjId: row.kctjId
      }
      updateHitBehavior((param)).then(response => {   
        console.log(response)  
        if(response.code == 20000){  
          console.log("点击我想看，此点击操作已记录成功！") 
        }else{
          console.log("点击我想看，此点击操作记录失败！")  
        }   
      })
      if(row.link != null){
        window.location.href=row.link;
      }else if(row.kctjLink != null){
        window.location.href=row.kctjLink; 
      }else{
        this.$alert('<strong>对不起，此课程为国外课程，请您换一个。</strong>', 'WARING', {
          dangerouslyUseHTMLString: true
        }); 
      } 
     
    },
    search() {   
      this.listLoading = true      
      var param = {
        keyword:this.keyword
      }
      es_getcourse((param)).then(response => {   
        console.log(response)  
        if(response.code == 20000){  
          this.listLoading = false 
          if(response.data == null || response.data.length == 0 ){
            this.$notify({
              title: '提示',
              message: '未搜索的您想看的课程！',
              type: 'success',
              duration: 2000
            })
          }else{
            var tmp = response.data
            for(let i = 0 ;i < tmp.length; i++){
              tmp[i].id = i+1
            }
            this.searchdata = tmp
            this.$notify({
              title: '提示',
              message: '已成功获取搜索的课程列表！',
              type: 'success',
              duration: 2000
            }) 
          }  
        }else{
          this.listLoading = false 
          this.$notify({
            title: '错误',
            message: '发生错误,获取搜索的课程列表失败！',
            type: 'error',
            duration: 2000
          })  
        }   
      })
    },
    confirmEnding(str, target) { 
      var start = str.length-target.length;
      var arr = str.substr(start,target.length);
      if(arr == target){
        return true;
      }
      return false;
    }
  }
}
</script>
<style>
.top{
  height: 20%; 
  margin-bottom: 5px;
}
.span-top{
  margin-left: 40px;
  margin-right: 20px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.body{
  display: inline-block;
  width: 100%;  
  height: 100%;  
  margin-top: 10px;
}
.table{
  display: inline-block ; 
  width: 68%; 
  
  /* background-color: black */
}
.list{
  /* display:  inline-block;  */
  float: right;
  width: 32%; 
  margin-bottom:30px;
  /* background-color: pink */
}
</style>

