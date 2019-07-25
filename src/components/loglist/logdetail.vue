<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block inner accordion-list>
      <f7-accordion-toggle>姓名:&nbsp &nbsp &nbsp{{logList.userName}}</f7-accordion-toggle>
      <f7-accordion-toggle>支持:&nbsp &nbsp &nbsp{{this.logname}}</f7-accordion-toggle>
      <f7-accordion-toggle>工作事项:&nbsp &nbsp &nbsp{{logList.matterName}}</f7-accordion-toggle>
      <f7-accordion-toggle>时长: &nbsp &nbsp &nbsp {{this.duration}}小时</f7-accordion-toggle>
      <f7-accordion-toggle>添加时间:&nbsp &nbsp &nbsp{{logList.creatTime}}</f7-accordion-toggle>
      <f7-accordion-toggle>备注:&nbsp &nbsp &nbsp{{logList.remark}}</f7-accordion-toggle>
    </f7-block>

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
        logList: [],
        logname:'',
        duration:0,
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        let detailId = {
          detailId:$this.$route.params.id
        }
        util.svcInvoke('service', 'detail/getLogDetailById', detailId, function (result) {
          // 关闭窗口并刷新主页面
          $this.logList = result.data
          if($this.logList.projectName){
            $this.logname = $this.logList.projectName
          }else {
            $this.logname = $this.logList.branchName
          }
          console.log($this.logList.duration)
          if($this.logList.duration){
            $this.duration = 0
          }
          console.log($this.logList)
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
