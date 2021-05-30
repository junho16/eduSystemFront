import request from '@/utils/request'
import token from '@/store/modules/user'

export function fetchCourseList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/list',
    method: 'get',
    params: { query, token: token.state.token }
  })
}
export function fetchShowCollegesList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/showcolleges',
    method: 'get',
    params: { token: token.state.token }
  })
}
export function fetchShowKcxzList() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/showkcxz',
    method: 'get',
    params: { token: token.state.token }
  })
}

export function updateCourseInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/update',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}
export function createCourseInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/create',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}

export function deleteCourseInfo(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/course/delete',
    method: 'post',
    params: { courseId: id, token: token.state.token }
  })
}
// import request from '@/utils/request'
// import token from '@/store/modules/user'

// export function fetchCourseList(query) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/course/list',
//     method: 'get',
//     params: {query,token:token.state.token}
//   })
// }
// export function fetchShowCollegesList() {
//     return request({
//       baseURL: 'http://localhost:80',
//       url: '/course/showcolleges',
//       method: 'get',
//       params: {token:token.state.token}
//     })
// }
// export function fetchShowKcxzList() {
//     return request({
//         baseURL: 'http://localhost:80',
//         url: '/course/showkcxz',
//         method: 'get',
//         params: {token:token.state.token}
//     })
// }

// export function updateCourseInfo(data) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/course/update',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }
// export function createCourseInfo(data) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/course/create',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }

// export function deleteCourseInfo(id) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/course/delete',
//     method: 'post',
//     params: {courseId:id,token:token.state.token}
//   })
// }
// ======================================
// import request from '@/utils/request'
// import token from '@/store/modules/user'

// export function fetchCourseList(query) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/course/list',
//     method: 'get',
//     params: {query,token:token.state.token}
//   })
// }
// export function fetchShowCollegesList() {
//     return request({
//       baseURL: 'http://localhost:8080',
//       url: '/course/showcolleges',
//       method: 'get',
//       params: {token:token.state.token}
//     })
// }
// export function fetchShowKcxzList() {
//     return request({
//         baseURL: 'http://localhost:8080',
//         url: '/course/showkcxz',
//         method: 'get',
//         params: {token:token.state.token}
//     })
// }

// export function updateCourseInfo(data) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/course/update',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }
// export function createCourseInfo(data) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/course/create',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }

// export function deleteCourseInfo(id) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/course/delete',
//     method: 'post',
//     params: {courseId:id,token:token.state.token}
//   })
// }
// ===============================================
// export function getKyjymydData() {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/kyjymyd',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }

// export function getSnKyjyData() {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/snkyjy',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }

// export function getKyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/kyqx',
//     method: 'get',
//     params: {token:token.state.token , classid: classId}
//   })
// }
// export function getJyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/jyqx',
//     method: 'get',
//     params: {token:token.state.token , classid: classId}
//   })
// }
// export function getClasses() {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/classes',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }
