import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
/**
 * 这是原生的auth.js 我也不知道干啥用的
 * @returns
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
