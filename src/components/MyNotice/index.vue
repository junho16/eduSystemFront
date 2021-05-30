<template>
  <div :class="{'show':show}" class="header-search">
    <!-- <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" /> -->
    <svg-icon class-name="search-icon" icon-class="message" @click="drawer = true" />
    <el-drawer
      :append-to-body="true"
      :modal="true"
      size="33%"
      title="消息列表"
      :with-header="true"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose">
      <!-- <span>我来啦!</span>
      <div>asddddddddddd</div> -->
      <template>
        <el-timeline>
          <el-timeline-item    v-for="(item,index) of tipList" :key="index" :timestamp="new Date(+new Date(new Date(item.timestamp).toJSON())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')" placement="top">
            <el-card  style="width:95%">
              <div style="margin:5px;font-size:16px;width:95%;line-height:25px">
                <!-- <el-badge v-if="item.ischeck==0" style="margin-right:10px;" is-dot> </el-badge>  -->
                {{ item.content }} 
                <!-- <p>{{  }}</p> -->
              </div>
              <!-- <div class="actions"> 
                  <ul class="list-inline" style="float:right;margin-right:70px;margin-bottom:7px">  
                      <span @click="check(item.tip.tipId)" class="link-black text-sm" style="margin-left:15px">
                        <i class="el-icon-check" />
                        确认已读
                      </span> 
                  </ul> 
              </div>  -->
            </el-card>
          </el-timeline-item>
        </el-timeline> 
      </template>
        
  
    </el-drawer>

      
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import {
  getTipList,
  updateTipState
} from '@/api/tip'
export default {
  name: 'MyNotice',
  data() {
    return {
      drawer: false,
      direction: 'ltr',

      // 查询条件
      listQuery: { 
        fromTipTime : '', 
        toTipTime : '', 
        page: 1,  
        limit: 100,  
      }, 
      total: null,
      tipList: null,

      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
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
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    shownotice(){

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },


    // ==================================
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
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss"  >
.el-drawer.rtl{
  overflow: scroll;
} 
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
} 
/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar{
    display: none;
} 
 
</style>
