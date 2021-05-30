import request from '@/utils/request'

/**
 * 自定义接口
 * @returns 从后台返回超级管理员的路由信息
 */
export function getRoutes(token) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/routes/roleRoutes',
    method: 'get',
    params: { token }
  })
}

// import request from '@/utils/request'
// /**
//  * 自定义接口
//  * @returns 从后台返回超级管理员的路由信息
//  */
// export function getRoutes(token) {
//   return request({
//     baseURL: 'http://localhost:80',
//     url: '/routes/roleRoutes',
//     method: 'get',
//     params: { token }
//   })
// }
// =============================================
// import request from '@/utils/request'

// /**
//  * 自定义接口
//  * @returns 从后台返回超级管理员的路由信息
//  */
// export function getRoutes(token) {
//   return request({
//     baseURL: 'http://localhost:8080',
//     url: '/routes/roleRoutes',
//     method: 'get',
//     params: { token }
//   })
// }
