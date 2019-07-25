<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <div class="list-block ">
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
        let paramValue = {
          applyID:$this.applyID,
          copyList:JSON.parse($this.selectUser),
        }
        console.log(paramValue)
        util.svcInvoke('service', '/oa/doCopy', paramValue, function (result) {
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
    }
  }
</script>
