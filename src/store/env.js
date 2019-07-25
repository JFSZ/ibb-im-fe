import _ from 'lodash'

// initial state
const state = {
  appName: '全民营销',
  appEnglishName: 'market',
  appVersion: '1.0.0',
  appCopyright: 'Copyright © 2018 Gainet',
  profile: 'prod',
  apiBaseUrl: 'http://im.ibb.gainet.com:8081',
 /* apiBaseUrl: 'http://192.168.66.78:8080',*/
  mockApiUrl: 'static/mock/api/',
  mockLocalStorageUrl: 'static/mock/localstorage/',
  forceLogin: false,
  debugTag: 'off',
  initPage: 'home.index',
  token: null,
  lastUrl: null,
  nextUrl: null,
  staffId: null,
  username: null,
  name: '未登录',
  number:'未登录',
  img:'../../../static/img/icon/person.png',
  eparchyCode: null,
  menuList:null,
  departId:-1,
  startTime:'',
  endTime:'',
  duration:-1,
}
// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  env(state, payload) {
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) state[key] = payload[key]
    }
  },
  env_delete(state, key) {
    delete state[key]
  },
  env_reset(state) {
    _.forEach(state, function (value, key) {
      delete state[key]
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
