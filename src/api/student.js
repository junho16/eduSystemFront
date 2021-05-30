import request from '@/utils/request'
import token from '@/store/modules/user'

export function fetchStudentList(query) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/list',
    method: 'get',
    params: { query, token: token.state.token }
  })
}

export function updateStudentInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/update',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}
export function createStudentInfo(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/create',
    method: 'post',
    params: { data: data, token: token.state.token }
  })
}

export function deleteStudentInfo(id) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/delete',
    method: 'post',
    params: { studentId: id, token: token.state.token }
  })
}

export function getKyjymydData() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/kyjymyd',
    method: 'get',
    params: { token: token.state.token }
  })
}

export function getSnKyjyData() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/snkyjy',
    method: 'get',
    params: { token: token.state.token }
  })
}

export function getKyqxData(classId) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/kyqx',
    method: 'get',
    params: { token: token.state.token, classid: classId }
  })
}
export function getJyqxData(classId) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/jyqx',
    method: 'get',
    params: { token: token.state.token, classid: classId }
  })
}
/**
 * 找到教师教授的做班主任的那个班级
 * @returns 
 */
export function getClasses() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/classes',
    method: 'get',
    params: { token: token.state.token }
  })
}
/**
 * 找到教师教授的所有班级 并不止是自己做班主任的那个班级
 * @returns 
 */
export function getClassesForEveryTsk() {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/student/classes/foreverytsk',
    method: 'get',
    params: {}
  })
}
// import request from '@/utils/request'
// import token from '@/store/modules/user'

// export function fetchStudentList(query) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/list',
//     method: 'get',
//     params: {query,token:token.state.token}
//   })
// }

// export function updateStudentInfo(data) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/update',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }
// export function createStudentInfo(data) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/create',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }

// export function deleteStudentInfo(id) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/delete',
//     method: 'post',
//     params: {studentId:id,token:token.state.token}
//   })
// }

// export function getKyjymydData() {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/kyjymyd',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }

// export function getSnKyjyData() {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/snkyjy',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }

// export function getKyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/kyqx',
//     method: 'get',
//     params: {token:token.state.token , classid: classId}
//   })
// }
// export function getJyqxData(classId) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/jyqx',
//     method: 'get',
//     params: {token:token.state.token , classid: classId}
//   })
// }
// export function getClasses() {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/student/classes',
//     method: 'get',
//     params: {token:token.state.token}
//   })
// }
// ===========================================
// import request from '@/utils/request'
// import token from '@/store/modules/user'

// export function fetchStudentList(query) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/list',
//     method: 'get',
//     params: {query,token:token.state.token}
//   })
// }

// export function updateStudentInfo(data) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/update',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }
// export function createStudentInfo(data) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/create',
//     method: 'post',
//     params: {data:data,token:token.state.token}
//   })
// }

// export function deleteStudentInfo(id) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/student/delete',
//     method: 'post',
//     params: {studentId:id,token:token.state.token}
//   })
// }

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
// ====================================================
// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

