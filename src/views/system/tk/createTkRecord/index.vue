<template>
  <!-- <article-detail :is-edit="false" /> -->
  
  <component :is="currentRole" />
 
 
</template>

<script>
import ArticleDetail from './components/ArticleDetail' 

export default {
  name: 'createTkRecord',
  components: { ArticleDetail  },
     
  data() {
    return {
      currentRole: 'ArticleDetail'
      // currentRole: 'myapplyBoard' 
    }
  },
}
</script> 