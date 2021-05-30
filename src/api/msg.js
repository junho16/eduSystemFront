
import request from '@/utils/request'
import token from '@/store/modules/user'

export function fetchMsgList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/msg/list',
    method: 'get',
    params: {}
  })
}
export function huifuMsg(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/msg/huifu',
    method: 'post',
    params: {data:data}
  })
}
export function submitXzxxMsg(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/msg/create',
    method: 'post',
    params: {data:data}
  })
}
