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
      <f7-list-item class="error-msg" v-if="userList.length < 1" title="未查询到记录">
      </f7-list-item>
    </f7-list>

    <!-- Search-through listheader -->
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item  v-for="templet in userList" v-if="templet.businessId>0"
                     :link="'/leads/approve/'+templet.id+'/'+templet.auditState"  :title="'客户：'+templet.customName+'('+templet.customPhone+')'" :after="templet.typeName"  swipeout @swipeout:deleted="deleteProject(templet.id)">
          <f7-swipeout-actions>
        <f7-swipeout-button delete>
            删除
          </f7-swipeout-button>
          </f7-swipeout-actions>
      </f7-list-item>
      <f7-list-item  v-for="templet in userList" v-if="templet.businessId==null||templet.businessId==0||templet.businessId==undefined||templet.businessId==''"
                     :link="'/leads/info/'+templet.id" :title="'客户：'+templet.customName+'('+templet.customPhone+')'" :after="templet.typeName"  swipeout @swipeout:deleted="deleteProject(templet.id)">
        <f7-swipeout-actions>
          <f7-swipeout-button delete>
            删除
          </f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>

    <!--<div class="data-table">
      <table>
        <thead style="background: ghostwhite">
          <tr>
            <th style="width: 44px">客户</th>
            <th style="width: 44px">线索人</th>
            <th style="width: 44px">预算</th>
            <th style="width: 44px">状态</th>
            <th style="width: 44px">操作</th>
          </tr>
        </thead>
      </table>
      <tbody>
      <tr v-for="templet in userList">
        <td style="width: 44px">{{templet.customName}}（{{templet.customPhone}}），{{templet.customTypeName}}</td>
        <td style="width: 44px">{{templet.clueName}}（{{templet.cluePhone}}）</td>
        <td style="width: 44px">{{templet.customBudget}}</td>
        <td style="width: 44px">{{templet.typeName}}</td>
        <td style="width: 44px">{{templet.typeName}}</td>
      </tr>

      </tbody>

    </div>-->

    <!--<f7-toolbar tabbar labels>
      <f7-link href="/admin/templet-add/" text="添加"></f7-link>
    </f7-toolbar>-->
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
        userList: [],
      }
    },
    mounted: function () {
      this.getUserList()
    },
    methods: {
      //获取用户列表信息
      getUserList: function () {
        let $this = this
        util.svcInvoke('service', 'clue/getMyInPersonList', null, function (result) {
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
