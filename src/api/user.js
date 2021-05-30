import request from '@/utils/request'

export function login(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/login',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}
export function getAdminList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/user/admin/list', 
    method: 'get' 
  })
}
// 注销操作是不需要修改的 写的不错
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
// import request from '@/utils/request'

// export function login(data) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/login',
//     method: 'post',
//     data
//   })
// }
// export function getInfo(token) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/user/info',
//     method: 'post',
//     params: { token }
//   })
// }
// // 注销操作是不需要修改的 写的不错
// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
// =========================================
// import request from '@/utils/request'

// export function login(data) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/login',
//     method: 'post',
//     data
//   })
// }
// export function getInfo(token) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/user/info',
//     method: 'post',
//     params: { token }
//   })
// }
// // 注销操作是不需要修改的 写的不错
// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
// ============================================
// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
