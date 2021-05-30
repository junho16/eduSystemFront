<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
// import kyqxChart from '@/views/system/student/qxtj/cpt/kyqx/kyqxChart'
import studentHome from './studentHome'
import adminHome from './adminHome'
export default {
  name: 'score',
  components: { studentHome, adminHome },
  data() {
    return {
      currentRole: 'adminHome'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if ((this.roles.includes('student')  )) {
      this.currentRole = 'studentHome'
    }else{
      this.currentRole = 'adminHome'
    }
  }
}
</script>
