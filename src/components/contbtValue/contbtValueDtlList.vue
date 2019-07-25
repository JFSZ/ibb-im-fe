<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar style="padding-top: 10px" cancel-link="查询" search-list="#search-list" placeholder="查询" :clear-button="true"
                  @searchbar:search="onSearch"
                  @searchbar:disable="onDisable"
                  @searchbar:enable="onEnable"
                  @searchbar:clear="onClear"></f7-searchbar>
    <!-- Will be visible if there is no any results found, defined by "searchbar-not-found" class -->
    <div style="width: 100%;padding-left: 0px;padding-right:15px;padding-top: 5px" >
      <div style="float: left;font-size: 20px;width: 25%;text-align: center">客户</div>
      <div style="float: left;font-size: 20px;width: 25%;text-align: center">商务</div>
      <div style="float: left;font-size: 20px;width: 25%;text-align: center">员工</div>
      <div style="float: left;font-size: 20px;width: 25%;text-align: center">贡献值</div>
    </div>
    <f7-list class="searchbar-not-found">
      <f7-list-item :title='"未查询到"+query+"相关信息"'></f7-list-item>
    </f7-list>
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item  v-for="item in dataList" v-if="":link="'/contbtValue/contbtValuePsnAllDtl/'+item.contbtValueId" >
        <div style="float: left;width: 25%;text-align: center">{{item.customName}}</div>
        <div style="float: left;width: 25%;text-align: center;padding-left: 25px">{{item.businessName}}</div>
        <div style="float: left;width: 25%;text-align: right;padding-left: 10px">{{item.psnNm}}</div>
        <div style="float: left;width: 25%;text-align: right;padding-right: 10px">{{item.contbtValue}}</div>
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
        query: '',
        index: null,
        dataList: []
      }
    },
    mounted: function () {
      let $this = this
      util.ajax2MC('get', 'contbtValueAndSts/queryContValueDetailList', null, function (result) {
        $this.dataList = result.data.list
      })
    },
    methods: {
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
