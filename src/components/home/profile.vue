<template>
  <div class="home-mine-view">
    <f7-block class="mine-block">
      <div class="logo"><img src="static/img/help.png"/></div>
      <div class="staff">
        <div class="staff-info">工号: {{env.number}}</div>
        <div>姓名: {{env.name}}</div>
      </div>
    </f7-block>
    <f7-block class="list9-block">
      <ul>
        <f7-list-item link="/manage/my-apply/2" title="我的审批" media='<img src="static/img/message.png"/>'></f7-list-item>
        <f7-list-item link="/manage/my-apply/1" title="提交给我" media='<img src="static/img/message.png"/>'></f7-list-item>
        <f7-list-item link="/manage/my-apply/3" title="抄送给我" media='<img src="static/img/message.png"/>'></f7-list-item>
        <f7-list-item link="#" title="退出" media='<img src="static/img/help.png"/>'
                      @click="exitApp"></f7-list-item>
      </ul>
    </f7-block>
  </div>
</template>

<style lang="less">

  .home-mine-view .mine-block {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 30px;
    padding-bottom: 30px;
    background-color: antiquewhite;
  }

  .home-mine-view .mine-block .logo {
    width: 120px;
    height: 120px;
    background: url("../../../static/img/icon/person.png") center no-repeat;
    text-indent: -9999px;
    border-radius: 5px;
    margin: 0 auto;
  }

  .home-mine-view .mine-block .staff {
    margin: 20px auto;
    text-align: center;
    font-size: 18px;
    line-height: 18px;
  }

  .home-mine-view .mine-block .staff-info {
    margin: 10px auto;
  }
</style>


<script>
  import util from '../../util'
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState({
        env: state => state.env,
      }),
    },
    mounted: function () {
      this.clickLogin()
    },
    methods: {
      clickLogin() {
        let that = this
        if (that.env.number === '未登录') {
          util.svcInvoke('service', 'person/get_user_info', null, function (result) {
            if(result.data !== null){
              //获取用登录信息
              let envObj = {
                token: result.data.password,
                username: result.data.username,
                name: result.data.name,
                number: result.data.number,
              }
              that.$store.commit('env', envObj)
              if(result.data.name){
                util.svcInvoke('service', 'menu/get_menu_list_by_user', null, function (result) {
                  if (result) {
                    let getData = result.data
                    util.setLocalStorage('menuList',getData)
                    that.menuList = JSON.parse(JSON.stringify(getData))
                  }
                })
              }
            }
          })
        }
      },
      exitApp() {
        let that = this
        if(that.env.number !== '未登录'){
          window.f7.confirm('确认退出吗？','操作提醒',function () {
            util.svcInvoke('service', 'person/logout', null, function (result) {
              //成功后清除本地缓存
              let envObj = {
                token: null,
                username: '未登录',
                name: '未登录',
                number: '未登录',
              }
              util.deleteCookie(that.env.appEnglishName + '-login-Status')
              that.$store.commit('env', envObj)
              util.removeLocalStorage('menuList')
            })
          },function () {
            return
          })
        }
      }
    }
  }
</script>
