<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title>项目列表</f7-block-title>
    <f7-list>
      <f7-list-item v-for="item in projectList" radio :title="item.name" name="demo-radio"  @change="checkProject(item.name,item.projectId)"></f7-list-item>
      <f7-list-item class="error-msg" v-if="projectList.length < 1" title="未查询到项目">
      </f7-list-item>
    </f7-list>

    <f7-toolbar bottom tabbar >
      <f7-link text="确认" @click="doSubmit" ></f7-link>
    </f7-toolbar>



  </f7-page>
</template>


<style lang="less">

</style>

<script>
  import {mapState} from 'vuex'
  import util from '../../util'

  export default {
    computed: {
      ...mapState({}),
    },
    data() {
      return {
        projectList: [],
        projectname:'',
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        util.svcInvoke('service', 'project/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.projectList = result.data.list
          console.log($this.projectList)
        })
      },
      checkProject:function (name,id) {
        this.projectname = name
        let logparam = null
        if(util.readCookie('logparam')){
          logparam = JSON.parse(util.readCookie('logparam'))
          logparam.logname = name
          logparam.logid = id
          logparam.type = 1
          util.setCookie('logparam', logparam, 999, '192.168.66.78')
        }
      },
      doSubmit(){
        if(this.projectname === ''){
          util.alert('请选择项目')
          return
        }
        this.$f7.views.main.router.reloadPage('/loglist/matter')
      },
      onSearch: function (query, found) {
        //console.log('search', query)
      },
      onClear: function (event) {
        //console.log('clear')
      },
      onEnable: function (event) {
        //console.log('enable')
      },
      onDisable: function (event) {
        //console.log('disable',event)
      },
    }
  }
</script>
