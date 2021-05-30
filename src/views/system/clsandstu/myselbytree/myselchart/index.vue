<template>
  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
import myselChart from '@/views/system/clsandstu/myselbytree/myselchart/myselChart' 

export default {
  name: 'myselChart',
  components: { myselChart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>