import request from '@/utils/request'
import token from '@/store/modules/user'


export function fetchXXKCList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xxkc/list',
    method: 'get',
    params: { query, token: token.state.token }
  })
} 
export function fetchSZKCList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xxkc/szkclist',
    method: 'get',
    params: { query, token: token.state.token }
  })
} 

export function createXXKCInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xxkc/create',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}

export function deleteXXKCInfo(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xxkc/delete',
    method: 'post',
    params: { courseId: id, token: token.state.token }
  })
}
export function updateXXKCInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/xxkc/update',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}


// export function getKyjymydData() {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/student/kyjymyd',
//     method: 'get',
//     params: { token: token.state.token }
//   })
// }

// export function getSnKyjyData() {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/student/snkyjy',
//     method: 'get',
//     params: { token: token.state.token }
//   })
// }

// export function getKyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/student/kyqx',
//     method: 'get',
//     params: { token: token.state.token, classid: classId }
//   })
// }
// export function getJyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/student/jyqx',
//     method: 'get',
//     params: { token: token.state.token, classid: classId }
//   })
// }
// export function getClasses() {
//   return request({
//     baseURL: 'http://localhost:9530',
//     url: '/student/classes',
//     method: 'get',
//     params: { token: token.state.token }
//   })
// }
 