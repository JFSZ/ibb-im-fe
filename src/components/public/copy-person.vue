<template>
  <f7-page class="home-main-view"
           infinite
           :infinite-scroll="showPreloader"
           :infinite-distance="50"
           :infinite-preloader="showPreloader"
           @infinite="loadMore">
    <f7-navbar title="员工列表" back-link="">
      <f7-subnavbar :inner="false" class="input-search" v-if="this.tabType===1">
        <f7-searchbar
          search-container=".search-list"
          search-in=".item-title"
          placeholder="输入员工名称"
          :disable-button="!$theme.aurora"
          disable-button-text="取消"
          @searchbar:search="onSearchLike">
        </f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="未查到结果"></f7-list-item>
    </f7-list>

    <div class="search-list searchbar-found m0 no-bac" >
      <ul v-for="user in userList">
        <li>
          <label class="label-checkbox item-content">
            <input type="checkbox" name="my-checkbox" :value="user.userId" v-model="selectUser">
            <div class="item-media">
              <i class="icon icon-form-checkbox"></i>
            </div>
            <div class="item-inner">
              <div class="item-title">{{user.name}}</div>
            </div>
          </label>
        </li>
      </ul>
    </div>
    <f7-toolbar bottom tabbar >
      <f7-link  style="color: green" text="确认" @click="doQr"></f7-link>
      <f7-link  style="color: red" text="取消" @click="doQx" ></f7-link>
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
        userList: [],
        applyId:this.$route.params.applyId,
        selectUser:[],
        allowInfinite: true,
        showPreloader: true,
        //  当前页数
        currentPage: 1,
        //  每页数量
        pageSize:5,
        //   总数据量
        pageTotal: 0,
      }
    },
    mounted: function () {
      this.getUserList()
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
      doQr(){
        let $this = this
        console.log($this.selectUser)
        let copyList = ''
        $this.selectUser.forEach(function (user) {
          copyList = user + ','
        })
        console.log(copyList)
        console.log(typeof $this.id)
        let paramValue = {
          applyId: $this.applyId,
          copyList:copyList,
        }
        console.log(paramValue)
        util.svcInvoke('service', 'oa/audit/doCopy', paramValue, function (result) {
          console.log(result)
          let code = result.code
          if(code === 0){
            util.alert('抄送成功',function () {
              $this.$router.back()
            })
          }else {
            util.alert(result.message)
            return
          }
        })
      },
      doQx(){
        this.$f7.views.main.router.back()
      },
      onSearchLike:  function (query) {
        let $this = this
        $this.query = query
        $this.interviewList = []
        $this.currentPage = 1
        $this.allowInfinite = true
        $this.showPreloader = true
        if($this.tabType===1){
          $this.getProjectList()
        }
      },
      // 下拉自动加载
      loadMore() {
        const self = this
        if(self.tabType!==1){
          return
        }
        if (!self.allowInfinite) {
          return
        }
        self.allowInfinite = false
        if (self.projectList.length >= self.pageTotal) {
          self.showPreloader = false
          return
        }
        self.currentPage += 1
        self.getProjectList()
        self.allowInfinite = true
      },
    }
  }
</script>
