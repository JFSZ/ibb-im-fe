<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>添加日志模板</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>日志模板名称</f7-label>
        <f7-input type="text" placeholder="请输入日志模板名称" v-model="name"></f7-input>
      </f7-list-item>
      <!-- Multiple Smart Select With Searchbar -->
      <f7-list-item>
        <f7-label>顺序</f7-label>
        <f7-input type="text" placeholder="请输入排列顺序" v-model="sequence"></f7-input>
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
        name: '',//项目名称
        sequence: ''//部门
      }
    },
    mounted: function () {
    },
    methods: {
      //获取周期信息
      /*getPeriodDetail: function (id) {
        let $this = this
        let envObj = {
          id: id
        }
        util.svcInvoke('service', 'assess/period/detail', envObj, function (result) {
          $this.fName = result.data.assessPeriod.fName
          $this.fIntervalDay = result.data.assessPeriod.fIntervalDay
          $this.fStartDate = result.data.assessPeriod.fStartDate
          $this.fEndDate = result.data.assessPeriod.fEndDate
          $this.fDescription = result.data.assessPeriod.fDescription
          $this.users = result.data.deptPersonVoList
          $this.selectUsers = result.data.selectUsers
          if (result.data.assessPeriod.state === 1) {
            $this.check === true
          } else {
            $this.check === false
          }
        })
      },*/
      updateOrAddPeriod: function () {
        let $this = this
        let period = {
          name: $this.name,
          sequence: $this.sequence,
        }
        util.svcInvoke('service', 'templet/addTemplet', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
    }
  }
</script>
