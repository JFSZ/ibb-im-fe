<template>
  <f7-login-screen id="login-screen">
    <f7-view>
      <f7-pages>
        <f7-page login-screen>
          <f7-login-screen-title>{{env.appName}}</f7-login-screen-title>
          <f7-list form>
            <f7-list-item>
              <f7-label>用户名:</f7-label>
              <f7-input name="username" type="text" placeholder="请输入用户名" v-model="username" @focus="hidfocus" @blur="showfocus"></f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>密码:</f7-label>
              <f7-input name="current-password" type="password" placeholder="请输入密码" id="password" @focus="hidfocus" @blur="showfocus"></f7-input>
            </f7-list-item>
          </f7-list>
          <f7-block>
            <f7-button id="btn-next" class="button-big button-half active" @click="clickLogin">登录</f7-button>
          </f7-block>
          <f7-block class="bottom-block" v-if="(!this.env.forceLogin) && this.isShow===1">
            <f7-list form>
              <f7-list-button title="返回" close-login-screen></f7-list-button>
            </f7-list>
          </f7-block>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-login-screen>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";

  #login-screen {
    border-radius: 0;

  .login-screen-title {
    font-weight: bold;
    margin-bottom: 20%;
  }

  .content-block {
    margin-top: 15%;

  }

  .list-block {

  .item-content {
    padding-left: 10%;
    padding-right: 10%;
  }

  }
  .bottom-block {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0;
    margin-bottom: 0;
    text-align: center;
    width: 100%;

  a {
    color: @greyColor;
    font-size: 14px;
  }

  }
  }
</style>


<script>
  import util from '../../util'
  import {mapState} from 'vuex'
  import sha1 from 'sha1'
  export default {
    data() {
      return {
        username: '',
        password: '',
        isShow:1
      }
    },
    computed: {
      ...mapState({
        env: state => state.env,
      }),
    },
    methods: {
      clickLogin() {
        let that = this
        let password = document.getElementById('password').value
        let payload = {
          username: this.username,
          password: sha1(password)
        }
        util.svcInvoke('service', 'person/login', payload, function (result) {
          // 保存环境变量
          let envObj = {
            token: result.data.password,
            username: result.data.username,
            name: result.data.name,
            number: result.data.number,
          }
          that.$store.commit('env', envObj)
          util.svcInvoke('service', 'menu/get_menu_list_by_user', null, function (result) {
            if (result) {
              util.setLocalStorage('menuList',result.data)
              console.log(result.data)
            }
          })
          util.setCookie('userInfo', envObj.token, 999, '192.168.66.78')
          // 关闭窗口并刷新主页面
          util.alert('登录成功，欢迎您:' + result.data.name, function () {
            that.$f7.closeModal()
            that.$f7.views.main.router.refreshPage()
          })
        })
      },
      showfocus(){
        this.isShow=1
      },
      hidfocus(){
        this.isShow=0
      }
    }
  }
</script>
