<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="请输入员工名称" :clear-button="true"
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
      <f7-list-item v-for="item in rewardList" :title="item.personName + '&nbsp&nbsp' + '奖励金额:' + item.rewardMoney  +
      '&nbsp&nbsp' + '贡献:'+item.contributionNumber  + '<br/>总值:' + item.contributionGrossValue +'&nbsp&nbsp' +'G-KMS积分:'  + item.gKmsPoint +
      '<br/> 年份:' + item.dataTime+ '&nbsp&nbsp' + '统计时间:' + item.createTime" ></f7-list-item>
      <f7-list-item class="error-msg" v-if="rewardList.length < 1" title="未查询到奖励记录">
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
        rewardList: []
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        util.svcInvoke('service', '/person/reward/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.rewardList = result.data.list
          console.log($this.rewardList)
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
