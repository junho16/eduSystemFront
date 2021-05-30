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
import analyScore from './analyScore'
import alyOwnScore from './alyOwnScore'
export default {
  name: 'AnalyScore',
  components: { analyScore, alyOwnScore },
  data() {
    return {
      currentRole: 'analyScore'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if ((this.roles.includes('student')  )) {
      this.currentRole = 'alyOwnScore'
    }else{
      this.currentRole = 'analyScore'
    }
  }
}
</script>
