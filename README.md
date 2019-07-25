

基于Webpack + Vue + Framework7构建的移动端单页应用脚手架



进入到工程目录，执行：
```
npm install
```



访问 [http://127.0.0.1:3000](http://127.0.0.1:3000) 可以看到应用首页


开发完成后，如果需要在本机构建工程，需要执行：
```
npm run build
```
编译好的文件会生成在`dist`目录中



###  主要依赖
- webpack `^2.2.1` - 资源打包
- vue `^2.2.2` - 数据-视图绑定，组件化
- vuex `^2.2.1` - 状态管理
- framework7 `^1.6.5`  - 移动端UI框架
- framework7-vue `^0.9.4`  - f7的vue整合
- lodash `^4.17.4`  - 通用工具库
- moment `^2.17.1`  - 时间工具库
- axios  `^0.15.3`  - 网络请求
- eslint `^3.14.1`  - 代码质量管理
- babel-core `^6.22.1` - ES6转译

### 目录及用途
- src/entry/index.js - 应用入口
- src/entry/index.html - 空白HTML模板
- src/routes.js - APP路由
- src/util.js - 工具封装
- src/assets/fonts - 图标字体，使用IconFont生成
- src/assets/style - 样式，使用LESS编写
- src/components - 存放后缀为.vue的组件
- src/components/index.html - 基础HTML页面结构，不需要改动
- src/components/index.vue - 初始化空白页面组件，不需要改动
- src/components/public - 公共组件
- src/components/console - 控制台相关组件
- src/components/home - 主界面
- src/components/manage - 系统管理
- src/components/playground - 功能展示
- src/components/showcase - 组件展示
- src/store - vuex状态
- static/img - 图片
- static/mock/api - 后台服务mock
- static/mock/localstorage - 原生APP中本地变量（LocalStorage）的mock


### 基础工具封装
util.js 中封装了一些基础功能，请直接使用，不要再进行重复开发。

- 复制到剪贴板 - copyToClipboard(msg) 
- 获取URL参数 - getUrlParam(key) 
- 格式化路由名称 - formatRoute(initPage) 
- 服务调用 - svcInvoke(payload, callback) 
- 调试参数打印 - log(msg) 
- 读取APP本地变量 - getLocalStorage(key, callback)
- 写入APP本地变量 - setLocalStorage(key, value, callback)
- 读取Vuex状态 - getState(module, key)
- 写入Vuex状态 - setState(module, obj)
- 检查对象中的无效键 - checkUndefined(obj)

### Eslint代码检测
ESLint 是一个开源的 JavaScript 代码检查工具。  

Eslint的规则已经配置好，在WebStorm这样的IDE中可以自动识别，直接使用即可。


### Vuex状态管理
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

### 环境变量
使用Vuex的env模块来存放环境变量：
```
const state = {
  appName: '应用名称',  // 应用名称
  appVersion: '1.0.0', // 版本号
  appCopyright: 'Copyright © 2017 公司名称',  // 版权信息
  profile: 'dev',  // 服务环境，可以传入dev/test/prod，以区分开发、测试、生产
  apiBaseUrl: '/path/to/proxy',  // 服务调用地址
  mockApiUrl: 'static/mock/api/',  // API Mock的路径
  mockLocalStorageUrl: 'static/mock/localstorage/',  // LocalStorage Mock的路径
  debugTag: 'off',  // DEBUG模式的开关
  initPage: null,  // 初始化页面，中间以.分割，例如传入manage.about，则首页会渲染成/manage/about/。如果不传入，或路由不存在，则渲染默认首页。
  staffId: null,  // 工号
  eparchyCode: null, // 地市
  token: null,  // 调用后台服务的token
  lastUrl: null,  // 原生与HTML5混合功能点中，点击左上角返回按钮，将要返回的UIBOX名
  nextUrl: null,  // 原生与HTML5混合功能点中，点击下一步将要跳到的UIBOX名
}
```
### 页面路由
页面路由，使用了Framework7中集成的routes。  

路由信息配置在`src/routes.js`中，已经做了简单的封装，示例：
```
export default [
  staticRoute('/home/index', '主页'),
  staticRoute('/manage/about', '关于'),
  staticRoute('/playground/localstoragesave', 'LocalStorage存取'),
  staticRoute('/playground/routeparam', '页面间传值'),
  staticRoute('/playground/routeparamsub/:id', '页面间传值接收'),
]
```

每当新增了一个.vue的单文件组件后，仅需要在routes.js中新增一行，写明路由名称与页面标题即可。

路由名称与真实的文件路径是对应的，建议使用二级目录。  

.vue组件中，<f7-page>与<navbar>节点，不需要手工录入标题、class等信息，直接复制下面的模板即可：
```
<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
  </f7-page>
</template>
```

### 图标字体
页面中的图标，统一封装为字体文件，方便加载。

这里使用了阿里巴巴的iconfont来进行制作，网址为： http://www.iconfont.cn/

### 静态资源
静态资源：例如图片和Mock文件，不会被WebPack打包，需要统一存放在 `static` 目录。


### LESS样式
使用LESS进行样式的开发，WebPack打包后会转译为CSS。  




## 本机调试
### 测试URL
运行`npm run dev`后，默认的测试URL是：  

http://127.0.0.1:3000/

也可以在URL中以键值对的方式传入环境变量，例如：

http://127.0.0.1:3000/?debugTag=on&profile=test

PC调试中，一般都会传入debugTag和profile两个环境变量，前者是默认开启DEBUG模式，后者决定REST服务调用是开发、测试、还是生产环境。

所有传入的参数，都会存入名为env的状态中，作为系统环境变量。  

请注意，URL传递环境变量的的优先级最高。例如，已经通过URL方式传入了一个staffId的环境变量，那么通过LocalStorage传入的staffId环境变量则不会生效。

## 下面是开发时需要用到的工具 以及 新技术
> chrome-devtools 调试工具

> vue-devtools 调试工具

> ES2015

> NPM

> Webpack

> Framework7 & F7-VUE

> vuex

> eslint

> lodash

谷歌浏览器调试方式 
进入谷歌浏览安装目录
1.Cd C:\Program Files (x86)\Google\Chrome\Application

2.chrome.exe --disable-web-security --user-agent="Android" --user-data-dir="C:/temp-chrome-eng

