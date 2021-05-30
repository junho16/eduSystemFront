import qs from 'qs'
import request from '@/utils/request'
import token from '@/store/modules/user'

export function downLoadMuban(){
  window.location.href="http://localhost:9530/score/muban/down?token="+token.state.token;
  // return request({
  //   baseURL: 'http://localhost:9530',
  //   url: '/score/muban/down',
  //   method: 'get',
  //   params: { token: token.state.token  }
  // })
}
export function getStudentScoreByTeachtaskid(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/student/data/withteachtaskid',
    method: 'get',
    params: { data: data  }
  })
} 
export function getStudentScoreForChart(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/data/chart',
    method: 'get',
    params: { data: data  }
  })
} 

export function getOwnScoreForChart(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/data/own/chart',
    method: 'get',
    params: { query: data  }
  })
} 

export function saveScoreWithHand(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/save/hand',
    method: 'post',
    params: { data: data  }
  })
} 
export function getScoreData(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/data',
    method: 'get',
    params: { data: data  }
  })
} 
export function updateScoreWithHand(data) {
  return request({
    baseURL: 'http://localhost:9530',
    url: '/score/update/hand',
    method: 'post',
    params: { data: data  }
  })
} 
