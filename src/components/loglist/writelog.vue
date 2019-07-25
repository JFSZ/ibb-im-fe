<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>设置时长</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label v-if="flag1 == true">我为  {{projectName}} 提供了支持</f7-label>
        <f7-label v-if="flag2 == true">我为  {{branchName}} 提供了支持</f7-label>
      </f7-list-item>

      <f7-list-item>
        <f7-label>做了 {{matterName}}  工作</f7-label>
      </f7-list-item>

      <f7-list-item>
        <f7-label>开始日期</f7-label>
        <f7-input type="datetime-local"  placeholder="请选择开始日期" :value="startDate" v-model="startDate" required></f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>结束日期</f7-label>
        <f7-input type="datetime-local"  placeholder="请选择结束日期" :value="endDate" v-model="endDate" @change="getTime" required> </f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>时长:</f7-label>
        <f7-input type="text" readonly >{{duration}}</f7-input>
      </f7-list-item>

    </f7-list>
    <p>
      <f7-button fill color="green" v-on:click="updateOrAddPeriod">提交</f7-button>
    </p>
  </f7-page>

</template>

<script>

  import {mapState} from 'vuex'
  import util from '../../util'

  export default {
    computed: {
      ...mapState({}),
    },
    data() {
      return {
        startDate: null,
        endDate:null,
        projectId:0,
        projectName:'',
        branchId:0,
        branchName:'',
        matterId:'',
        matterName:'',
        content:'',
        remark:'',
        duration:null,
        flag1:false,
        flag2:false,
      }
    },
    mounted: function () {
      this.getParam()
    },
    methods: {
      getParam(){
        let $this = this

        let logparam = null
        if(util.readCookie('logparam')){
          logparam = JSON.parse(util.readCookie('logparam'))
          if(logparam.type === 0){
            $this.flag1 = true
            $this.projectId = logparam.logid
            $this.projectName = logparam.logname
          }else if(logparam.type === 1){
            $this.flag2 = true
            $this.branchId = logparam.logid
            $this.branchName = logparam.logname
          }
          $this.matterName = logparam.matterName
          $this.matterId = logparam.matterId
        }
      },
      getTime:function () {
        let $this = this
        let diffTime = new Date($this.endDate).getTime() - new Date($this.startDate).getTime()
        $this.duration = Math.floor(diffTime / (3600 * 1000))//计算出小时数
      },
      updateOrAddPeriod: function () {
        let $this = this
        let period = {
          startTime: util.fomatDate($this.startDate),
          endTime: util.fomatDate($this.endDate),
          projectId: $this.projectId,
          projectName: $this.projectName,
          branchId: $this.branchId,
          branchName: $this.branchName,
          matterId: $this.matterId,
          matterName: $this.matterName,
          content:$this.content,
          remark:$this.content,
          duration:$this.duration
        }
        util.deleteCookie('logparam')
        console.log(period)
        util.svcInvoke('service', 'detail/add', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$f7.views.main.router.reloadPage('/home/index/')
          })
        })
      },
    }
  }
</script>
