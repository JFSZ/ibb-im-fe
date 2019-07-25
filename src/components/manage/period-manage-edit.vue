<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>周期修改</f7-block-title>

    <f7-list form>
      <f7-list-item>
        <f7-label>名称</f7-label>
        <f7-input type="text" placeholder="Name">{{fName}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>间隔天数</f7-label>
        <f7-input type="text" placeholder="Name">{{fIntervalDay}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>周期开始</f7-label>
        <f7-input type="date" placeholder="Birth date" :value="fStartDate"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>周期结束</f7-label>
        <f7-input type="date" placeholder="Birth date" :value="fEndDate"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>是否启用</f7-label>
        <f7-input type="switch" :checked="check"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>描述</f7-label>
        <f7-input type="textarea" placeholder="Textarea" :value="fDescription"></f7-input>
      </f7-list-item>
    </f7-list>

    <p>
      <f7-button fill v-on:click="updatePeriod">提交</f7-button>
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
        fName: '',
        fIntervalDay: null,
        fStartDate: null,
        fEndDate: null,
        fDescription: null,
        check: true
      }
    },
    mounted: function () {
      this.getPeriodDetail()
    },
    methods: {
      //获取周期信息
      getPeriodDetail: function () {
        let $this = this
        let envObj = {
          id: $this.$route.params.id
        }
        util.svcInvoke('service', 'assess/period/detail', envObj, function (result) {
          // 关闭窗口并刷新主页面
          $this.fName = result.data.fName
          $this.fIntervalDay = result.data.fIntervalDay
          $this.fStartDate = result.data.fStartDate
          $this.fEndDate = result.data.fEndDate
          $this.fDescription = result.data.fDescription
          if (result.data.state === 1) {
            $this.check === true
          } else {
            $this.check === false
          }
        })
      },
      updatePeriod: function () {
        let $this = this
        let period = {
          name: $this.fName,
          fIntervalDay: $this.fIntervalDay,
          fStartDate: $this.fStartDate,
          fEndDate: $this.fEndDate,
          fDescription: $this.fDescription,
          state: $this.state,
        }
        util.svcInvoke('service', 'assess/period/update', period, function (result) {
          // 关闭窗口并刷新主页面
          $this.fName = result.data.fName
          $this.fIntervalDay = result.data.fIntervalDay
          $this.fStartDate = result.data.fStartDate
          $this.fEndDate = result.data.fEndDate
          $this.fDescription = result.data.fDescription
          $this.state = result.data.state
        })
      }
    }
  }
</script>
