<template>
  <div>
    <router-view />
  </div>
  <!-- <div class="dashboard-container">
 
    <component :is="currentRole" />
    <h1>教学任务管理</h1>
    <a href="https://github.com/Heeexy/SpringBoot-Shiro-Vue" target="_blank"><img style="margin: 40px"
      src="http://img.heeexy.com/github.png"></a>  
  </div> -->
</template>
<script>

import { mapGetters } from 'vuex'
import adminTeacherTaskBoard from './admin'
import editorTeacherTaskBoard from './editor'
import myapplyBoard from './myapply'

export default {
  name: 'TeachTask',
  components: { adminTeacherTaskBoard, editorTeacherTaskBoard ,myapplyBoard },
  data() {
    return {
      currentRole: 'adminTeacherTaskBoard'
      // currentRole: 'myapplyBoard' 
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  // created() {
  //   if (!(this.roles.includes('admin') || this.roles.includes('superadmin'))) {
  //     this.currentRole = 'editorTeacherTaskBoard'
  //   }
  // }
}
</script>
