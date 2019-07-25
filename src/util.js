import _ from 'lodash'
import axios from 'axios'
import * as copy from 'copy-to-clipboard'
import store from './store'
import routes from './routes.js'
import base64url from 'base64-url'
import cookie from 'js-cookie'
import qs from 'qs'

const env = store.state.env

export default {
  /**
   * 复制到剪贴板
   * @param msg 文本信息
   */
  copyToClipboard(msg) {
    copy(msg)
  },
  /**
   * 获取URL参数
   * @param key 键。若传空则返回全部键值对。
   * @returns {*}
   */
  getUrlParam(key) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'),
      sParameterName, i
    let paramObj = {}
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=')
      paramObj[sParameterName[0]] = sParameterName[1]
    }
    if (key) {
      return paramObj[key]
    } else {
      return paramObj
    }
  },
  /**
   * 格式化路由名称
   * 将URL传参中的initPage参数，由foo.bar的形式转换为/foo/bar/。同时校验页面是否存在，若不存在，返回默认页面。
   * @param initPage 初始页
   * @returns {*}
   */
  formatRoute(initPage) {
    let defaultPage = '/home/index/'
    if (!initPage) {
      initPage = defaultPage
    } else {
      initPage = '/' + initPage.replace('.', '/') + '/'
      let isRouteExist = _.find(routes, function (o) {
        return o.path === initPage
      })

      if (isRouteExist === undefined) {
        this.log('initPage不存在，跳转至主页')
        initPage = defaultPage
      }
    }
    return initPage
  },
  /**
   * 服务调用
   * @param proxyType 代理类型 可选值：common/openapi
   * @param method 方法名
   * @param payload 请求内容
   * @param callback 回调函数
   */
  svcInvoke(proxyType, method, payload, callback) {
    let httpUrl, httpMethod
    if (env.profile === 'dev') {
      //当profile为dev时，调用mock-api
      httpMethod = 'get'
      httpUrl = env.mockApiUrl + method + '.resp.json'
    } else {
      // 当profile为test或prd时，调用代理服务
      httpMethod = 'post'
      if (proxyType === 'common') {
        // CommonService公共服务
        if (!payload.hasOwnProperty('method')) payload.method = method
        if (!payload.hasOwnProperty('staffId')) payload.staffId = env.staffId
        if (!payload.hasOwnProperty('eparchyCode')) payload.eparchyCode = env.eparchyCode
        if (!payload.hasOwnProperty('accessToken')) payload.accessToken = env.token
        httpUrl = env.apiBaseUrl + '?method=common&env=' + env.profile  // 调用CommonService公共接口
      } else if (proxyType === 'service') {
        // Service
        httpUrl = env.apiBaseUrl + '/' + method
      } else {
        // OpenAPI开放服务
        httpUrl = env.apiBaseUrl + '?method=openapi&env=' + env.profile + '&api=' + method // 调用OpenApi接口
      }
    }
    this.log('请求接口的参数：' + payload)

    window.f7.showIndicator()
    let that = this
    axios({
      method: httpMethod,
      url: httpUrl,
      timeout: 1000 * 60, // 创建axios实例,设定超时时间是12s
      data: qs.stringify(payload),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(function (response) {
        window.f7.hideIndicator()
        let returnFlag = response.data.code
        let returnInfo = response.data.message
        if (returnFlag === 0) {
          callback(response.data)
        } else if (returnFlag === 10) {
          window.f7.confirm('<p>用户登录已失效</p><p>点击确定重新登录</p>', function () {
            window.f7.loginScreen()
          })
        } else {
          window.f7.alert('<p>错误代码: ' + returnFlag + '</p><p>原因: ' + returnInfo + '</p>')
        }
      })
      .catch(function (error) {
        window.f7.hideIndicator()
        that.log(error)
        window.f7.alert('服务调用失败，请检查网络连接')
      })
  },
  /**
   * 异步请求调用
   * @param type 请求类型 post/get
   * @param method 方法名
   * @param payload 请求内容
   * @param callback 回调函数
   */
  ajax2MC(type, method, payload, callback) {
    let httpUrl, httpMethod
    if(type === 'get'){
      httpMethod = 'get'
    } else {
      httpMethod = 'post'
    }
    httpUrl = env.apiBaseUrl + '/' + method
    this.log('调用参数' + payload)
    this.log('请求URL：' + httpUrl)
    window.f7.showIndicator()
    let that = this
    axios({
      method: httpMethod,
      url: httpUrl,
      timeout: 1000 * 12, // 创建axios实例,设定超时时间是12s
      data: qs.stringify(payload),
      withCredentials:true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(function (response) {
        window.f7.hideIndicator()
        let returnFlag = response.data.code
        let returnInfo = response.data.message
        if (returnFlag === 0) {
          callback(response.data)
        } else if (returnFlag === 10) {
          window.f7.confirm('<p>用户登录已失效</p><p>点击确定重新登录</p>', function () {
            window.f7.loginScreen()
          })
        } else {
          window.f7.alert('<p>错误代码: ' + returnFlag + '</p><p>原因: ' + returnInfo + '</p>')
        }
      })
      .catch(function (error) {
        window.f7.hideIndicator()
        that.log(error)
        window.f7.alert('服务调用失败，请检查网络连接')
      })
  },
  /**
   * 跳转原生界面
   * 首先将指定的vuex状态保存到原生的LocalStorage中，以实现参数传递。成功后跳转至原生UIBOX。
   * @param uibox 原生UIBOX名称
   * @param stateKey vuex的状态名
   */
  openUiBox(uibox, stateKey) {
    if (uibox === undefined) {
      window.f7.alert('UIBOX名不能为空！')
      return
    }
    if (typeof OpenNativeUiBox !== 'undefined') {
      this.log('UIBOX真机跳转 - ' + uibox + ' - ' + stateKey)
      if (typeof stateKey === 'string') {
        // 先存入LocalStorage，然后跳转
        let stateObj = _.get(store.state, stateKey)
        this.setLocalStorage('hybird_' + stateKey, stateObj, function () {
          OpenNativeUiBox.open(uibox)  // eslint-disable-line
        })
      } else {
        // 直接跳转
        OpenNativeUiBox.open(uibox)  // eslint-disable-line
      }
    } else {
      this.log('UIBOX模拟跳转: ' + uibox)
      window.f7.alert('UIBOX模拟跳转: ' + uibox)
    }
  },
  /**
   * 调试参数打印
   * 用于替代console.log()，可以在DEBUG模式里查看日志。
   * @param msg
   */
  log(msg) {
    console.log(msg)
    if (env.debugTag === 'on') {
      store.commit('log', msg)
    }
  },
  /**
   * 显示提示框
   * 可传入一个字符串或对象
   * @param msg
   * @param callback
   */
  alert(msg, callback) {
    msg = (typeof msg === 'string') ? msg : JSON.stringify(msg)
    if (typeof callback === 'function') {
      window.f7.alert(msg, '提示', callback)
    } else {
      window.f7.alert(msg, '提示')
    }
  },
  /**
   * 读取APP本地变量（LocalStorage）
   * @param key 变量名
   * @param callback 回调
   */
  getLocalStorage(key) {
    if (typeof localStorage !== 'undefined' && key) {
      return JSON.parse(localStorage.getItem(key))
    } else {
      this.log('读取失败:' + key)
    }
  },
  /**
   * 写入APP本地变量（LocalStorage）
   * @param key 键
   * @param value 值
   */
  setLocalStorage(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    if (typeof localStorage !== 'undefined' && key && value) {
      localStorage.setItem(key, value)
    } else {
      this.log('写入失败:' + key)
    }
  },
  /**
   * 删除指定本地变量（LocalStorage）
   * @param key 键
   */
  removeLocalStorage(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    } else {
      this.log('删除失败:' + key)
    }
  },
  /**
   * 删除所有本地变量（LocalStorage）
   */
  removeAllLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    } else {
      this.log('删除失败')
    }
  },
  /**
   * 读取Vuex状态
   * @param module 模块名
   * @param key 状态名
   */
  getState(module, key) {
    let stateObj = store.state
    let moduleObj = _.get(stateObj, module)
    return _.get(moduleObj, key)
  },
  /**
   * 写入Vuex状态
   * @param module 模块名
   * @param obj 键值对对象
   */
  setState(module, obj) {
    store.commit(module, obj)
  },
  /**
   * 检查对象中的无效键
   * @param obj
   * @returns {boolean}
   */
  checkUndefined(obj) {
    let that = this
    let result = true
    _.forEach(obj, function (value, key) {
      if (value === undefined) {
        let errMsg = '错误：参数[' + key + ']不存在'
        that.alert(errMsg)
        result = false
      }
    })
    return result
  },
  /**
   * 取当前时间（替代moment以减小体积）
   * @returns {string}
   */
  getDateTime() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    if (month.toString().length === 1) month = '0' + month
    if (day.toString().length === 1) day = '0' + day
    if (hour.toString().length === 1) hour = '0' + hour
    if (minute.toString().length === 1) minute = '0' + minute
    if (second.toString().length === 1) second = '0' + second
    return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
  },
  /**
   * 格式化日期
   * @returns {string}
   */
  fomatDate(date) {
    if(date){
      let now = new Date((date+':00'))//时间插件支持到分钟,不包含秒
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hour = now.getHours()
      let minute = now.getMinutes()
      let second = now.getSeconds()
      if (month.toString().length === 1) month = '0' + month
      if (day.toString().length === 1) day = '0' + day
      if (hour.toString().length === 1) hour = '0' + hour
      if (minute.toString().length === 1) minute = '0' + minute
      if (second.toString().length === 1) second = '0' + second
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  },
  /**
   * JSON Parse
   * @param str
   * @returns {*}
   */
  jsonParse(str) {
    return _.attempt(JSON.parse.bind(null, str))
  },
  /**
   * JSON格式验证
   * @param str
   * @returns {boolean|*}
   */
  jsonValid(str) {
    return !_.isError(this.jsonParse(str))
  },
  /**
   * base64 URL编码
   * @param buffer
   * @returns {string}
   */
  encode(rawStr) {
    return base64url.encode(rawStr)
  },
  /**
   * base64 URL解码
   * @param base64
   */
  decode(b64Str) {
    return base64url.decode(b64Str)
  },
  /***
   *读取指定的Cookie值 readCookie('id');
   *@param {string} cookieName Cookie名称
   */
  readCookie(cookieName) {
    return cookie.get(cookieName)
  },
  /***
   * 设置Cookie值 setCookie('id',1);
   * @param {string} cookieName Cookie名称
   * @param {string} cookieValue Cookie值
   * @param {number} nDays Cookie过期天数
   * @param {path} path 设置域名的地址
   */
  setCookie(cookieName, cookieValue, nDays, path) {
    if (cookieName && cookieValue && path) {
      if (nDays) {
        cookie.set(cookieName, cookieValue, {expires: nDays, path: path})
      } else {
        cookie.set(cookieName, cookieValue, {path: path})
      }
      return true
    } else {
      return false
    }
  },
  /***
   * 删除cookie中指定变量函数
   * @param {string} $name Cookie名称
   */
  deleteCookie(name) {
    cookie.remove(name)
  },
  /**
   * 判断是否是数字
   * @param obj
   * @returns {boolean}
   */
  isNumber(obj) {
    try{
      let res = obj.toString()
      var reg
      if(res.indexOf('.') > 0){
        reg=/^[0-9]+.?[0-9]*$/
      }else{
        reg=/^[1-9]+[0-9]*]*$/
      }
      if(reg.test(res)){
        return true
      }
      return false
    }catch (e){
      return false
    }
  },
  isInteger(obj){
    try{
      let res = obj.toString()
      var reg=/^[1-9]+[0-9]*]*$/
      if(reg.test(res)){
        return true
      }
      return false
    }catch(e){
      return false
    }
  },
  /**
   * 校验手机号
   * @param phone
   * @returns {boolean}
   */
  checkPhone(phone){
    if(!(/^1\d{10}$/.test(parseInt(phone)))){
      return false
    }else {
      return true
    }
  },
  /**
   * 邮箱校验
   * @param email
   * @returns {boolean}
   */
  checkEmail(email){
    if(!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email))){
      return false
    }else {
      return true
    }
  },
}
