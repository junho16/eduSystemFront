import qs from 'qs'
import request from '@/utils/request'
import token from '@/store/modules/user'
export function createTeachTaskInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/teachtask/create',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
} 
export function fetchTeachTaskList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/teachtask/list',
    method: 'get',
    //  qs.stringify(this.cond, { arrayFormat: 'repeat' })
    // qs.stringify(query, { query: 'repeat' })
    params: { query:query , token: token.state.token }
  })
} 
export function fetchTeacherList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/teachtask/teacherlist',
    method: 'get', 
    params: {  token: token.state.token }
  })
} 
export function handleTeachtaskStatus(id,status) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/teachtask/status',
    method: 'post', 
    params: { id:id, status:status, token: token.state.token }
  })
} 
 