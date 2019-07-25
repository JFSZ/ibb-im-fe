<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block inner accordion-list>
      <f7-accordion-toggle>客户:&nbsp &nbsp &nbsp{{dtl.customName}}</f7-accordion-toggle>
      <f7-accordion-toggle>客户电话:&nbsp &nbsp &nbsp{{dtl.customPhone}}</f7-accordion-toggle>
      <f7-accordion-toggle>商务:&nbsp &nbsp &nbsp{{dtl.businessName}}</f7-accordion-toggle>
      <f7-accordion-toggle>姓名: &nbsp &nbsp &nbsp {{dtl.psnNm}}({{dtl.psnNumber}})</f7-accordion-toggle>
      <f7-accordion-toggle>部门:&nbsp &nbsp &nbsp{{dtl.deptNm}}</f7-accordion-toggle>
      <f7-accordion-toggle>合同金额:&nbsp &nbsp &nbsp{{dtl.contractAmount}}</f7-accordion-toggle>
      <f7-accordion-toggle>汇款金额:&nbsp &nbsp &nbsp{{dtl.backAmount}}</f7-accordion-toggle>
      <f7-accordion-toggle>贡献率:&nbsp &nbsp &nbsp{{dtl.contributionRate}}</f7-accordion-toggle>
      <f7-accordion-toggle>贡献值:&nbsp &nbsp &nbsp{{dtl.contbtValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>添加时间:&nbsp &nbsp &nbsp{{dtl.createTime}}</f7-accordion-toggle>
    </f7-block>
  </f7-page>
</template>


<style lang="less">
  .accordion-item-toggle{margin-top: 20px}
  .btn_div{    text-align: center; font-size: 20px;}
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
        dtl: [],
      }
    },
    mounted: function () {
      let $this = this
      let contbtValueId = this.$route.params.contbtValueId
      util.ajax2MC('get', 'contbtValueAndSts/queryContValueDetailById?contbtValueId='+contbtValueId, null, function (result) {
        $this.dtl = result.data
      })
    },
    methods: {
    }
  }
</script>
