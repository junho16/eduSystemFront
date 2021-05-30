
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" /> 
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { treedata } from '@/api/xk'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  
  data() {
    return { 
      showdata: [],
      chart: null
    }
  },
  
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      var that = this
      const xData = (async function() {
        await treedata().then(response => {
          console.log(response)
          var xxkc = []
          var kc = []
          var datalist = response.data
          for(let i = 0 ; i < datalist.length ;i++){
            if(datalist[i].teachtaskId.startsWith("0-")){
              // xxkc
              xxkc.push(datalist[i])
            }else{
              // kc
              kc.push(datalist[i])
            }
          }
          var root = {
            name : "您的课程",
            children : []
          }
          var xxRoot = {
            name :"校外网课",
            children : []
          }
          var kcRoot = {
            name :"校内课程",
            children : []
          } 
 
          //  统计选修课有哪些学年的
          for(let i = 0 ; i < xxkc.length ;i++){
            var flag = true
            // 遍历所有的选修课程==》返回值（ courseName teachtaskAcademicyear teachtaskId）
            for(let j = 0 ; j < xxRoot.children.length ;j++ ){
              if(xxkc[i].teachtaskAcademicyear == xxRoot.children[j].name ){  
                flag = false
              } 
            } 
            if(flag){
              // 如果都没有 新建一个
              var objtmp = new Object()
              objtmp.name = xxkc[i].teachtaskAcademicyear 
              objtmp.children = [] 
              xxRoot.children.push(objtmp)
            }   
          }
          // console.log(xxRoot)  
          //  统计网课
          for(let i = 0 ; i < xxkc.length ;i++){
            // var flag = true
            // 遍历所有的选修课程==》返回值（ courseName teachtaskAcademicyear teachtaskId）
            for(let j = 0 ; j < xxRoot.children.length ;j++ ){ 
              // 对每一个值 看看xxRoot的children里有没有（year)
              if(xxkc[i].teachtaskAcademicyear == xxRoot.children[j].name  ){  
                var objtmp = new Object()
                objtmp.name = xxkc[i].courseName
                objtmp.value = "教学任务编号："+xxkc[i].teachtaskId.slice(2)
                xxRoot.children[j].children.push(objtmp)  
              } 
            } 
          } 
          console.log(kc)





          //  统计校内课程有哪些学年的
          for(let i = 0 ; i < kc.length ;i++){
            var flag = true
            // 遍历所有的选修课程==》返回值（ courseName teachtaskAcademicyear teachtaskId）
            for(let j = 0 ; j < kcRoot.children.length ;j++ ){
              if(kc[i].teachtaskAcademicyear == kcRoot.children[j].name ){  
                flag = false
              } 
            } 
            if(flag){
              // 如果都没有 新建一个
              var objtmp = new Object()
              objtmp.name = kc[i].teachtaskAcademicyear 
              objtmp.children = [] 
              kcRoot.children.push(objtmp)
            }   
          } 
          console.log(kcRoot)  
          //  统计校内课程
          for(let i = 0 ; i < kc.length ;i++){
            // var flag = true
            // 遍历所有的选修课程==》返回值（ courseName teachtaskAcademicyear teachtaskId）
            for(let j = 0 ; j < kcRoot.children.length ;j++ ){
                // console.log(kc[i].teachtaskAcademicyear +"==="+ kcRoot.children[j].name) 
              // 对每一个值 看看xxRoot的children里有没有（year)
              if(kc[i].teachtaskAcademicyear == kcRoot.children[j].name ){  
                var objtmp = new Object()
                objtmp.name = kc[i].courseName
                objtmp.value = "教学任务编号："+kc[i].teachtaskId
                kcRoot.children[j].children.push(objtmp)  
              } 
            } 
          } 
          root.children.push(xxRoot)
          root.children.push(kcRoot) 
  
          that.showdata.push(root)
          console.log(JSON.stringify(root))

          that.chart.setOption({
            backgroundColor: '#d9d9d9',
            title: {
              text: '您的选课情况',
              x: '5',
              top: '5',
              textStyle: {
                color: '#000000',
                fontSize: '18'
              }, 
              subtextStyle: {
                color: '#90979c',
                fontSize: '16'
              }
            },
            tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove'
            },
            toolbox: {
              feature: { 
                saveAsImage: { show: true }
              }
            },
            legend: {}, 
            series: 
            [
              {
                  type: 'tree',

                  data: that.showdata,

                  top: '1%',
                  left: '7%',
                  bottom: '1%',
                  right: '20%',

                  symbolSize: 10,

                  label: {
                      position: 'left',
                      verticalAlign: 'middle',
                      align: 'right',
                      fontSize: 17
                  }, 
                  leaves: {
                      label: {
                          position: 'right',
                          verticalAlign: 'middle',
                          align: 'left'
                      }
                  }, 
                  emphasis: {
                      focus: 'descendant'
                  }, 
                  expandAndCollapse: true,
                  animationDuration: 550,
                  animationDurationUpdate: 750,
                  roam:true
              }
            ]
      

          })
        })
      }())
    }
  }
}
</script>

