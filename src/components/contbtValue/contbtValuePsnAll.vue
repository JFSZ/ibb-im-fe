<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="查询" :clear-button="true"
                  @searchbar:search="onSearch"
                  @searchbar:disable="onDisable"
                  @searchbar:enable="onEnable"
                  @searchbar:clear="onClear"></f7-searchbar>
   <div style="width: 100%;padding-left: 10px;padding-top: 5px" >
      <div style="float: left;font-size: 20px;width: 20%;text-align: center">排名</div>
      <div style="float: left;font-size: 20px;width: 40%;text-align: center">姓名</div>
      <div style="float: left;font-size: 20px;width: 40%;text-align: center">贡献值</div>
    </div>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="未查询到"></f7-list-item>
    </f7-list>

<div class="testList">
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item  v-for="(item,index) in dataList" v-if="":link="'/contbtValue/contbtValuePsnAllDtl/'+item.contbtValueId" :title="item.psnNm">
                  <!--   :title="'姓名：'+item.psnNm+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 贡献值：'+item.contbtValue" after="详情"
      >-->
       <div style="float: left;width: 20%;text-align: center">{{index + 1}}</div>
        <div style="float: left;width: 40%;text-align: center;padding-left: 35px">{{item.psnNm}}({{item.deptNm}})</div>
        <div style="float: left;width: 40%;text-align: right;padding-right: 10px">{{item.contbtValue}}</div>
      </f7-list-item>
    </f7-list>
</div>
  </f7-page>
</template>


<style>
  /*.item-content .item-inner .item-title{display: none !important}*/
  .testList  .item-title{display: none}
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
      let aEls = document.getElementsByTagName('item-content')
      console.log('获取dom元素1的长度：'+aEls.length)
      this.getInitList()
    },
    methods: {
      getInitList(){
        let $this = this
        util.ajax2MC('get', 'contbtValueAndSts/queryTop5ContValuePsnList', null, function (result) {
          $this.dataList = result.data.list
          console.log($this.dataList)
        })
        let aEls = document.getElementsByTagName('item-content')
        console.log('获取dom元素2的长度：'+aEls.length)
      },
      onSearch: function (query, found) {
        // console.log('query', query)
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
                                                                                                                                                                                                                                                                                                                                                                                                                     
