import request from '@/utils/request'
import token from '@/store/modules/user'

export function fetchProfessionList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/profession/list',
    method: 'get',
    params: { token: token.state.token }
  })
}
