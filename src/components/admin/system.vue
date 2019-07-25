<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <div class="block">
      <p class="row">
        <f7-list-button class="col button button-big button-fill" style="margin-left: 130px;width: 158px" link="/admin/project-list/">项目管理</f7-list-button>
      </p>
      <p class="row">
        <f7-list-button class="col button button-big button-raised button-fill" style="margin-left: 130px;width: 158px" link="/admin/matter-list/">工作事项管理</f7-list-button>
      </p>
      <p class="row">
        <f7-list-button class="col button button-big button-raised button-fill" style="margin-left: 130px;width: 158px" link="/admin/templet-list/">日志模板配置管理</f7-list-button>
      </p>
    </div>
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
        userList: []
      }
    },
    mounted: function () {
      //this.getUserList()
    },
    methods: {
      //获取用户列表信息
      getUserList: function () {
        let $this = this
        util.svcInvoke('service', 'person/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.userList = result.data.list
          console.log($this.userList)
        })
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
