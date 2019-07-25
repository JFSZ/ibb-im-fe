<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <form data-search-list=".list-block-search" data-search-in=".item-title" class="searchbar searchbar-init">
      <div class="searchbar-input">
        <input type="search" placeholder="请输入员工姓名"><a href="#" class="searchbar-clear"></a>
      </div><a href="#" class="searchbar-cancel">Cancel</a>
    </form>
    <div class="searchbar-overlay"></div>

    <div class="content-block searchbar-not-found">
      <div class="content-block-inner">未查询到相关员工</div>
    </div>

    <div class="list-block list-block-search searchbar-found " >
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
        applyID:this.$route.params.id,
        selectUser:[],
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
        let paramValue = {
          applyID:$this.applyID,
          copyList:copyList,
        }
        console.log(paramValue)
        util.svcInvoke('service', '/oa/doCopy', paramValue, function (result) {
          console.log(result)
          let code = result.code
          if(code === 0){
            $this.$f7.views.main.router.reloadPreviousPage('leads/list')
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
