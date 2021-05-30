<template>

  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>

</template>

<script>
import jyqxChart from '@/views/system/student/visual/cpt/jyqx/jyqxChart'

export default {
  name: 'JyqxChart',
  components: { jyqxChart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

// {
//   "children": [
//     {
//       "alwaysShow": true,
//       "component": "/system/user/create/index",
//       "hidden": false,
//       "id": 27,
//       "meta": {
//         "icon": "#",
//         "status": true,
//         "title": "添加用户"
//       },
//       "name": "添加用户",
//       "path": "/system/user/create",
//       "pid": 2,
//       "url": "/user/create"
//     },
//     {
//       "component": "/system/user/list/index",
//       "hidden": false,
//       "id": 28,
//       "meta": {
//         "icon": "#",
//         "status": true,
//         "title": "用户列表"
//       },
//       "name": "用户列表",
//       "path": "/system/user/list",
//       "pid": 2,
//       "url": "/user/index"
//     },
//     {
//       "alwaysShow": true,
//       "component": "/system/user/edit/index",
//       "hidden": true,
//       "id": 29,
//       "meta": {
//         "icon": "#",
//         "status": true,
//         "title": "用户编辑"
//       },
//       "name": "用户编辑",
//       "path": "/system/user/edit/:id(\\d+)",
//       "pid": 2,
//       "url": "/user/edit"
//     }
//   ],
//   "component": "/system/user/index",
//   "hidden": false,
//   "id": 2,
//   "meta": {
//     "icon": "#",
//     "status": true,
//     "title": "用户管理"
//   },
//   "name": "用户管理",
//   "path": "/system/user",
//   "pid": 1,
//   "url": "/user"
// }

// {
//   "children": [
//     {
//       "alwaysShow": true,
//       "component": "/system/student/visual/index",
//       "hidden": false,
//       "id": 22,
//       "meta": {
//         "icon": "#",
//         "status": true,
//         "title": "学生统计面板"
//       },
//       "name": "学生统计面板",
//       "path": "/system/student/visual",
//       "pid": 2,
//       "url": "/student/visual"
//     },
//     {
//       "component": "/system/student/list/index",
//       "hidden": false,
//       "id": 23,
//       "meta": {
//         "icon": "#",
//         "status": true,
//         "title": "学生列表"
//       },
//       "name": "学生列表",
//       "path": "/system/student/list",
//       "pid": 2,
//       "url": "/student/index"
//     }
//   ],
//   "component": "/system/student/list/index",
//   "hidden": false,
//   "id": 2,
//   "meta": {
//     "icon": "#",
//     "status": true,
//     "title": "学生管理"
//   },
//   "name": "学生管理",
//   "path": "/system/student",
//   "pid": 1,
//   "url": "/student"
// }
</script>

