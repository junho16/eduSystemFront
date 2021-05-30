import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/auth'
import Layout from '@/layout'
import storeState from '@/store/modules/user.js'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    // console.log(JSON.stringify(item))
    // data是后台查询的数据
    const menu = {
      path: item.path === '#' ? item.id + '_key' : item.path,
      // component: item.component === '#' ? Layout : () =>require([`@/views/${item.component}`],resolve)
      //    改为路由懒加载如下所示                         => import(`@/views${item.component}`),
      component: item.component === '#' ? Layout : (resolve) => require([`@/views${item.component}`], resolve),

      hidden: item.hidden,
      redirect: item.redirect,
      children: [],
      name: 'menu_' + item.id,
      meta: item.meta
      // meta: { title: item.name, id: item.id, roles: ['admin'] }
    }

    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {

  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      var token = (storeState.state.token)
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      // getRoutes(state.token).then(response => {
      getRoutes(token).then(response => {
        let data = response
        // console.log(data)
        if (response.code !== 20000) {
          alert(JSON.stringify('菜单数据加载异常'))
          // throw new Error('菜单数据加载异常')
        } else {
          // loadMenuData是后台返回的数据
          // tempAsyncRoutes是从route里获取的数据
          data = response.data
          Object.assign(loadMenuData, data)
          const tempAsyncRoutes = Object.assign([], asyncRoutes)
          // tempAsyncRoutes = asyncRoutes
          generaMenu(tempAsyncRoutes, loadMenuData)
          let accessedRoutes
          console.log(roles)
          if (roles.includes('superadmin')) {
            // alert(JSON.stringify(asyncRoutes))
            accessedRoutes = tempAsyncRoutes || []
          } else {
            accessedRoutes = filterAsyncRoutes(tempAsyncRoutes, roles)
          }

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
        // generaMenu(asyncRoutes, data)
      }).catch(error => {
        console.log(error)
      })
    })
  }
  // 下面这一段是原生的
  //   return new Promise(resolve => {
  //     // 定义一个变量，用来存放可以访问的路由表
  //     let accessedRoutes
  //     // 判断当前的角色列表中，是否有包含admin
  //     if (roles.includes('admin')) {
  //       //如果有说明是admin管理员 则 所有路由都可以被访问，将ansyncRoutes改造成从数据库中获取
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       // 根据角色，过滤掉不能访问的路由表
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     // commit
  //     commit('SET_ROUTES', accessedRoutes)
  //     // 成功返回
  //     resolve(accessedRoutes)
  //   })
  // }

  // TODO--我先写一下后端接口--视频在P10-33min
  // 以下这段是腾讯课堂视频里的
  // 从后台请求所有的路由信息 获取的是一个响应
  // （await + 方法 generateRoutes: async function({ commit }, roles) {XXX} 将此异步方法修改为一个同步方法）
  // generateRoutes: async function({ commit }, roles) {
  //   let res = await getRoutes()
  //   // 定义一个变量，用来存放可以访问的路由表
  //   let dbAsyncRoutes = res.data;
  //   let myAsyncRoutes = dbAsyncRoutes.filter(curr => {
  //     if(curr.children == null || curr.children.length == 0){
  //       delete curr.children
  //     }
  //     return replaceComponent(curr);
  //   })
  //   let accessedRoutes
  //   // 判断当前的角色列表中，是否有包含admin
  //   if (roles.includes('admin')) {
  //     // 所有路由都可以被访问，将ansyncRoutes改造成从数据库中获取
  //     accessedRoutes = myAsyncRoutes || []
  //   } else {
  //     // 根据角色，过滤掉不能访问的路由表
  //     accessedRoutes = filterAsyncRoutes(myAsyncRoutes, roles)
  //   }
  //   // commit
  //   commit('SET_ROUTES', accessedRoutes)
  //   // 成功返回
  //   // resolve(accessedRoutes)
  //   return accessedRoutes

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
