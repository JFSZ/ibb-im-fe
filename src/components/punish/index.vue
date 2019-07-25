<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="查询" :clear-button="true"
                  @searchbar:search="onSearch"
                  @searchbar:disable="onDisable"
                  @searchbar:enable="onEnable"
                  @searchbar:clear="onClear"></f7-searchbar>
    <!-- Will be visible if there is no any results found, defined by "searchbar-not-found" class -->
    <f7-list class="searchbar-not-found">
      <f7-list-item title="未查询到"></f7-list-item>
    </f7-list>

    <!-- Search-through list -->
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item v-for="item in punishList" :title="item.userName + '&nbsp' + '&nbsp' +'&nbsp' + item.creatTime  +  '&nbsp' + '&nbsp' +'&nbsp'+item.punishContent    " ></f7-list-item>
      <f7-list-item class="error-msg" v-if="punishList.length < 1" title="未查询到处罚记录">
      </f7-list-item>
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
        punishList: []
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        util.svcInvoke('service', 'punish/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.punishList = result.data.list
          console.log($this.punishList)
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
