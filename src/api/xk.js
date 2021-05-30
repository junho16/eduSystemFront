
import request from '@/utils/request'
import token from '@/store/modules/user'
/**
 * 选课是指学生选课操作触发的存其选课数据与查询其选课数据
 * xxkc是选修课程 针对课程的
 * @param {} data 
 * @returns 
 */
export function selectxxkc(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xk/selectxxkc',
    method: 'post',
    params: { data, token: token.state.token }
  })
} 
export function tabledata(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xk/tabledata',
    method: 'get',
    params: { query,  token: token.state.token }
  })
} 
export function treedata() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xk/treedata',
    method: 'get',
    params: {  token: token.state.token }
  })
} 
export function xktest() {
  return request({
    baseURL: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/flare.json',
    method: 'get'
  })
}  