import request from '@/utils/request'
import token from '@/store/modules/user'

export function zdpk(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/classplan/paike',
    method: 'post',
    params: { data: data }
  })
}

export function fetchClassPlan(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/classplan/data',
    method: 'get',
    params: { data: data }
  })
}
export function fetchClassPlanWithRole(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/classplan/data/role',
    method: 'get',
    params: { data: data }
  })
}

export function rePk(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/classplan/repk',
    method: 'post',
    params: { data: data }
  })
}
export function updateClassPlan(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/classplan/update',
    method: 'post',
    params: { data: data }
  })
}

