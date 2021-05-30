import request from '@/utils/request'
import token from '@/store/modules/user'

export function getTipList(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tip/list',
    method: 'get',
    params: {data:data}
  })
}

export function updateTipState(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/tip/state',
    method: 'post',
    params: { tipid: id , state: 1 }
  })
}