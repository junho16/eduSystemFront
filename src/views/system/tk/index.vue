<template>
  <!-- <article-detail :is-edit="false" /> -->
  
  <!-- <component :is="currentRole" /> -->
  <div>
    <router-view />
  </div>
 
</template>

<script>
import createTkRecord from './createTkRecord'
import analyTkByChart from './analyTkByChart'
import myTkRecord from './myTkRecord'
import tkManage from './tkManage'
export default {
  name: 'TK',
  components: { createTkRecord , analyTkByChart , myTkRecord , tkManage  },
     
  data() {
    return {
      currentRole: 'tkManage' 
    }
  },
}
</script> 