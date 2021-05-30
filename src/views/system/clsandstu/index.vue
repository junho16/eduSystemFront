<template>
  <div>
    <router-view />
  </div>
  <!-- <div class="dashboard-container">
    <component :is="currentRole" />
  </div> -->
</template>

<script>
import { mapGetters } from 'vuex'  
import xxkcManage from './xxkcManage'
import selxxkc from './selxxkc'
import myselbytree from './myselbytree'
import myselkctable from './myselkctable'
import kctj from './kctj'
 
export default {
  name: 'xxkc',
  components: { kctj , myselbytree , xxkcManage , selxxkc ,myselkctable },
  data() {
    return {
      currentRole: 'kctj'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  } 
}
</script>
 
   