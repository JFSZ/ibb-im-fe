<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-list>
      <f7-list-item v-for="item in departlist" radio :title="item.name" name="demo-radio" @change="checkProject(item.name,item.id)"></f7-list-item>
      <f7-list-item class="error-msg" v-if="departlist.length < 1" title="未查询到部门">
      </f7-list-item>
    </f7-list>

    <!--<f7-list>
      <f7-list-item smart-select smart-select-searchbar title="部门" smart-select-back-text="确定">
        <select name="部门"  v-model="selectUsers">
            <option v-for="item in departlist" :value="item.id">{{item.name}}</option>
        </select>
      </f7-list-item>
    </f7-list>-->
    <f7-toolbar bottom tabbar >
      <f7-link text="确认" @click="doSubmit"></f7-link>
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
        departlist: [],
        departname:'',
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        let paramValue= {
          type:3//获取部门类型为3的部门，即所有树叶节点部门
        }
        util.svcInvoke('service', 'department/departmentList', paramValue, function (result) {
          // 关闭窗口并刷新主页面
          $this.departlist = result.data
        })
      },
      checkProject:function (name,id) {
        let logparam = null
        this.departname = name
        if(util.readCookie('logparam')){
          logparam = JSON.parse(util.readCookie('logparam'))
          logparam.logname = name
          logparam.logid = id
          logparam.type = 1
          util.setCookie('logparam', logparam, 999, '192.168.66.78')
        }
      },
      doSubmit(){
        if(this.departname === ''){
          util.alert('请选择部门')
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
