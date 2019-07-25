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

      <f7-list-button title="精确搜索" link="/loglist/query"></f7-list-button>
      <f7-list-item v-for="log in logcountlist" :title="log.username + '&nbsp' + '&nbsp' +'&nbsp' + log.departname  +  '&nbsp' + '&nbsp' +'&nbsp'+log.createtime  + '&nbsp' + '&nbsp' +'&nbsp'+ log.duration + '小时'"></f7-list-item>

      <f7-list-item class="error-msg" v-if="logcountlist.length < 1" title="未查询到相关日志记录">
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
      ...mapState({
        env: state => state.env,
      }),
    },
    data() {
      return {
        logcountlist:[],
        userName:'',
        type:0,
      }
    },
    mounted: function () {
      this.getLogList()
    },
    updated(){
    },
    methods: {
      //获取日志统计信息
      getLogList: function () {
        let $this = this
        let paramValue = {
          userName:$this.userName,
        }
        if(util.readCookie('paramList')){
          let that =JSON.parse(util.readCookie('paramList'))
          paramValue.departId = that.departId
          console.log(that)
          paramValue.startDate = util.fomatDate(that.startTime)
          paramValue.endDate = util.fomatDate(that.endTime)
          paramValue.duration = that.duration
        }else {
          paramValue.departId = -1
          paramValue.startDate = ''
          paramValue.endDate = ''
          /*.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')*/
          paramValue.duration = -1
        }
        util.deleteCookie('paramList')
        console.log(paramValue)
        util.svcInvoke('service', 'detail/getLogDetailCount', paramValue, function (result) {
          // 关闭窗口并刷新主页面
          $this.logcountlist = result.data
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
