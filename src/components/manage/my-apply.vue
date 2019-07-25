<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="查询" :clear-button="true"
                  @searchbar:search="onSearch"
                  @searchbar:disable="onDisable"
                  @searchbar:enable="onEnable"
                  @searchbar:clear="onClear"></f7-searchbar>
    <!-- Will be visible if there is no any results found, defined by "searchbar-not-found" class -->
    <f7-list class="searchbar-found">
      <f7-list-item class="error-msg" v-if="auditList.length < 1" title="未查询到记录">
      </f7-list-item>
    </f7-list>


    <!-- Search-through list -->
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item v-for="audit in auditList" :title="audit.auditName"  v-if="audit.approveId==483"  :link="'/manage/audit-detail/'+audit.auditId">
        <span>{{audit.createTime}}</span>
        {{audit.status}}
      </f7-list-item>
      <f7-list-item v-for="audit in auditList" :title="audit.auditName"  v-if="audit.approveId==484"  :link="'/manage/contribution-detail/'+audit.auditId">
        <span>{{audit.createTime}}</span>
        {{audit.status}}
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>


<style lang="less">
  .list-block {
    font-size: 13px;
  }
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
        auditList: []
      }
    },
    mounted: function () {
      this.getAuditList()
    },
    methods: {
      //获取审批人的审批列表
      getAuditList: function () {
        let $this = this
        let param = {
          state :this.$route.params.state
        }
        util.svcInvoke('service', 'oa/getAuditListByState', param, function (result) {
          // 关闭窗口并刷新主页面
          $this.auditList = result.data
          console.log(result.data)
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
