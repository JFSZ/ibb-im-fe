<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title content>我为哪个部门 或 项目提供了支持?</f7-block-title>
    <f7-list>
      <f7-list-button title="选择项目" color="red" href="/loglist/projectlist"></f7-list-button>
      <f7-list-button title="选择部门" color="green" href="/loglist/departlist"></f7-list-button>
    </f7-list>
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
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let logparam = {
          logid:'',
          logname:'',
          type:-1,
        }
        console.log(typeof logparam)
        if(!util.readCookie('logparam')){
          util.setCookie('logparam', logparam, 999, '192.168.66.78')
        }else{
          logparam = JSON.parse(util.readCookie('logparam'))
        }
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
