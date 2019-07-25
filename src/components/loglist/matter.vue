<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title content>我为  {{this.projectName}}  提供了支持?</f7-block-title>
    <f7-block-title content>做了哪些工作</f7-block-title>
    <f7-list >
      <!--<f7-list-button title="选择工作事项" color="red" :href="'/matterList/matterlist/' + projectName + '/' +projectId"></f7-list-button>-->
      <!--<f7-list-item accordion-item   v-for="item in matterList" :title="item.name"  >
        <f7-accordion-content>
          <f7-list>
            <f7-list-item v-for="items in item.matterVoList" radio name="demo-radio" :title="items.name"></f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>-->
      <f7-list-item smart-select smart-select-searchbar title="选择工作事项"  smart-select-back-text="确定">
        <select name="工作事项"   v-model="selectUsers" @change="selectMatter">

          <optgroup :label="item.name" v-for="item in useFulMatterList" >
            <option  v-for="items in item.matterVoList" :value="items.matterId+ ':'+items.name +':a'">{{items.name}}
            </option>
          </optgroup>

          <optgroup :label="item.name" v-for="item in matterList" >
            <option v-for="items in item.matterVoList" :value="items.matterId +':'+ items.name">{{items.name}}
            </option>
          </optgroup>

          <optgroup label="">
            <option>其他事项(请在备注中具体说明)</option>
          </optgroup>
        </select>
      </f7-list-item>

    </f7-list>
    <f7-toolbar bottom tabbar >
      <f7-link text="确认" @click="doSubmit"></f7-link>
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
        projectName: '',
        projectId:0,
        matterList:[],
        useFulMatterList:[],
        selectUsers:[],
        matterName:'',
        matterId:0,
        type:-1,
      }
    },
    mounted: function () {
      this.getmatterList()
    },
    methods: {
      //获取用户列表信息
      getmatterList: function () {
        let logparam = null
        if(util.readCookie('logparam')){
          logparam = JSON.parse(util.readCookie('logparam'))
          this.type = logparam.type
          this.projectName = logparam.logname
          this.projectId =logparam.logid
        }
        let $this = this
        util.svcInvoke('service', 'matter/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.matterList = result.data.list
          console.log($this.matterList)
        })
        util.svcInvoke('service', 'matter/getUseFulMatter', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.useFulMatterList = result.data
          console.log($this.useFulMatterList)
        })
      },
      selectMatter:function () {
        let logparam = JSON.parse(util.readCookie('logparam'))
        logparam.matterId = this.selectUsers.toString().split(':')[0]
        logparam.matterName = this.selectUsers.toString().split(':')[1]
        this.matterName = this.selectUsers.toString().split(':')[1]
        util.setCookie('logparam', logparam, 999, '192.168.66.78')
      },
      doSubmit(){
        if(this.matterName === ''){
          util.alert('请选择事项')
          return
        }
        this.$f7.views.main.router.reloadPage('/loglist/writelog')
      },
    }
  }
</script>
