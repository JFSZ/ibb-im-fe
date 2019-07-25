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
      <f7-list-item :title='"未查询到"+query+"相关信息"'></f7-list-item>
    </f7-list>

    <!-- Search-through listheader -->
    <f7-list class="searchbar-found" id="search-list">
      <f7-list-item v-for="project in userList" :title="project.name"
                    :link="'/admin/project-up/'+project.projectId" :after="project.departmentAndProportion" swipeout @swipeout:deleted="deleteProject(project.projectId)">
          <f7-swipeout-actions>
        <f7-swipeout-button delete>
            删除
          </f7-swipeout-button>
          </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>

    <f7-toolbar tabbar labels>
      <f7-link href="/admin/project-add/" text="添加"></f7-link>
    </f7-toolbar>
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
        userList: []
      }
    },
    mounted: function () {
      this.getUserList()
    },
    methods: {
      deleteProject: function (fId) {
        let $this = this
        if (fId > 0) {
          window.f7.confirm('确认删除该项目吗?', '操作提醒', function () {
            let period = {
              bh: fId
            }
            util.svcInvoke('service', 'project/deProject', period, function (result) {
              util.alert('删除成功!')
            })
          },function () {
            $this.$f7.views.main.router.refreshPage()
          })
        }
      },
      //获取用户列表信息
      getUserList: function () {
        let $this = this
        util.svcInvoke('service', 'project/seProject', null, function (result) {
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
