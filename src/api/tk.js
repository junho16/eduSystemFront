import qs from 'qs'
import request from '@/utils/request'
import token from '@/store/modules/user'
export function createTkRecord(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/create',
    method: 'post',
    params: { data: data }
  })
} 
export function updateTkRecord(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/update',
    method: 'post',
    params: { data: data }
  })
} 

//获取新的需要听课的教师信息--10条以内的 三个月以内的 评分最低的教师--以及次数最少的教师
export function fetchNewTkList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/newtklist',
    method: 'get' 
  })
}  

// 获取听课数据--用于echarts
export function getTkData(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/tkdata',
    method: 'get',
    params: { data: data }
  })
}  

// 获取听课数据--用于表格
export function fetchTkList(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/tklist',
    method: 'get',
    params: { data: data }
  })
}
// 获取听课数据--用于手风琴--管理员视角
export function fetchTkListWithAdmin(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/tklistwithadmin',
    method: 'get',
    params: { data: data }
  })
}
// 获取听课数据详情
export function fetchTkInfo(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tk/tkinfo',
    method: 'get',
    params: { id: id }
  })
}
// export function fetchTeachTaskList(query) {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/teachtask/list',
//     method: 'get',
//     //  qs.stringify(this.cond, { arrayFormat: 'repeat' })
//     // qs.stringify(query, { query: 'repeat' })
//     params: { query:query , token: token.state.token }
//   })
// } 
// export function fetchTeacherList(query) {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/teachtask/teacherlist',
//     method: 'get', 
//     params: {  token: token.state.token }
//   })
// } 
// export function handleTeachtaskStatus(id,status) {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/teachtask/status',
//     method: 'post', 
//     params: { id:id, status:status, token: token.state.token }
//   })
// } 
 