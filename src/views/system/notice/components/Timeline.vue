<template>
  <div class="block">
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
          @click="fetchTipList">
          确定
        </el-button> 
     
      </el-col>
    </el-row>
    <el-timeline>
      <el-timeline-item v-for="(item,index) of tipList" :key="index" :timestamp="new Date(+new Date(new Date(item.timestamp).toJSON())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')" placement="top">
        <el-card>
          <div style="margin:10px;font-size:16px">
            <el-badge v-if="item.ischeck==0" style="margin-right:10px;" is-dot> </el-badge> 
            {{ item.content }} 
            <!-- <p>{{  }}</p> -->
          </div>
          <div class="actions"> 
              <ul class="list-inline" style="float:right;margin-right:70px;margin-bottom:7px">  
                  <span @click="check(item.tip.tipId)" class="link-black text-sm" style="margin-left:15px">
                    <i class="el-icon-check" />
                    确认已读
                  </span> 
              </ul> 
          </div> 
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {
  getTipList,
  updateTipState
} from '@/api/tip'
export default {
  data() {
    return { 
      queryDate:null, 
      // 查询条件
      listQuery: { 
        fromTipTime : '', 
        toTipTime : '', 
        page: 1,  
        limit: 100,  
      }, 
      total: null,
      tipList: null,
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


      timeline: [
        {
          timestamp: '2019/4/20',
          title: 'Update Github template',
          content: 'PanJiaChen committed 2019/4/20 20:46'
        },
        {
          timestamp: '2019/4/21',
          title: 'Update Github template',
          content: 'PanJiaChen committed 2019/4/21 20:46'
        },
        {
          timestamp: '2019/4/22',
          title: 'Build Template',
          content: 'PanJiaChen committed 2019/4/22 20:46'
        },
        {
          timestamp: '2019/4/23',
          title: 'Release New Version',
          content: 'PanJiaChen committed 2019/4/23 20:46'
        }
      ]
    }
  },
  created() {   
    if(this.queryDate != null){
      if(this.queryDate[0] != null)
        this.listQuery.fromTipTime = this.dateFormat(this.queryDate[0])
      if(this.queryDate[1] != null)
        this.listQuery.toTipTime = this.dateFormat(this.queryDate[1])
    } 
    var param = {
      fromTipTime:this.listQuery.fromTipTime,
      toTipTime:this.listQuery.toTipTime,
      page:this.listQuery.page,
      limit:this.listQuery.limit
    }
    console.log(param)

    // init tip列表 
    getTipList(param).then(response => {    
      console.log(response)
      var dataArr = []
      for(let i = 0 ; i < response.data.data.length ; i++){
        dataArr.push({
          timestamp: response.data.data[i].tipTime, 
          content: response.data.data[i].tipContent,
          ischeck: response.data.data[i].tipIscheck,
          tip: response.data.data[i]
        })
      } 
      this.tipList = dataArr
      this.total = response.data.total   
      this.listLoading = false  
    }) 

   
  },
  methods: {
    fetchTipList(){ 
      this.listLoading = true  
      if(this.queryDate != null){
        if(this.queryDate[0] != null)
          this.listQuery.fromTipTime = this.dateFormat(this.queryDate[0])
        if(this.queryDate[1] != null)
          this.listQuery.toTipTime = this.dateFormat(this.queryDate[1])
      } 
      var param = {
        fromTipTime:this.listQuery.fromTipTime,
        toTipTime:this.listQuery.toTipTime,
        page:this.listQuery.page,
        limit:this.listQuery.limit
      }
      console.log(param) 
      getTipList(param).then(response => {    
        console.log(response) 
        var dataArr = []
        for(let i = 0 ; i < response.data.data.length ; i++){
          dataArr.push({
            timestamp: response.data.data[i].tipTime, 
            content: response.data.data[i].tipContent,
            ischeck: response.data.data[i].tipIscheck,
            tip: response.data.data[i]
          })
        } 
        this.tipList = dataArr
        this.total = response.data.total   
        this.listLoading = false  
      })
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
    check(id){
      // var id = this.tipList[index].tipId
      console.log(id)
      updateTipState(id).then(response => {   
        console.log(response)  
        if (response.code === 20000) {  
          this.$notify({
            title: '成功',
            message: '已确认通知',
            type: 'success',
            duration: 2000
          })   
          this.fetchTipList()
        } else {
          this.$alert('确认通知失败！', '提示', {
            confirmButtonText: '确定', 
          })
        }  
      }) 
    },

    
  }
}
</script>
<style>
.el-card__body{
  padding:10px;
  margin-left: 5px;
}
</style> 