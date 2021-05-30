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
import student from './student'
import admin from './admin'
export default {
  name: 'score',
  components: { student, admin },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if ((this.roles.includes('student')  )) {
      this.currentRole = 'student'
    }else{
      this.currentRole = 'admin'
    }
  }
}
</script>
