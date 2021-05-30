import request from '@/utils/request'
import token from '@/store/modules/user'

export function fetchNoticeList(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/notice/list',
    method: 'get',
    params: { data: data }
  })
}
export function createNoticeInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/notice/create',
    method: 'post',
    params: { data: data }
  })
} 
export function createNoticeCommentInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/notice/comment',
    method: 'post',
    params: { data: data }
  })
}
export function updateNoticeState(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/notice/state',
    method: 'post',
    params: { noticeid: id , state: 1 }
  })
}
export function fetchMySendNoticeList(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/notice/mysendlist',
    method: 'get',
    params: { data: data }
  })
}
