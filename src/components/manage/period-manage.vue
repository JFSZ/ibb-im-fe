<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="查询周期" :clear-button="true"
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
      <f7-list-item v-for="period in periodList" :title="period.fName"
                    :link="'/manage/period-manage-edit/'+period.fId"></f7-list-item>

      <f7-list-item v-if="periodList.length < 1" title="未查询到"></f7-list-item>

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
        periodList: []
      }
    },
    mounted: function () {
      this.getPeriodList()
    },
    methods: {
      //获取所有周期
      getPeriodList: function () {
        let $this = this
        util.svcInvoke('service', 'assess/period/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.periodList = result.data.list
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
