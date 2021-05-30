import request from '@/utils/request'
import token from '@/store/modules/user'
/**
 * 选课是指学生选课操作触发的存其选课数据与查询其选课数据
 * xxkc是选修课程 针对课程的
 * @param {} data 
 * @returns 
 */
export function es_getcourse(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/es/es_getcourse',
    method: 'get',
    params: { data:data  }
  })
} 
export function fetchrecommendlist() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/es/recommend',
    method: 'get',
    params: {}
  })
}  
export function updateHitBehavior(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/es/hit/update',
    method: 'post',
    params: {data:data}
  })
} 
