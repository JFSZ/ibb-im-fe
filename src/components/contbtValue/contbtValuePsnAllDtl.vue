<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block inner accordion-list>
      <f7-accordion-toggle>姓名:&nbsp &nbsp &nbsp{{dtl.psnNm}}</f7-accordion-toggle>
      <f7-accordion-toggle>部门:&nbsp &nbsp &nbsp{{dtl.deptNm}}</f7-accordion-toggle>
      <f7-accordion-toggle>贡献值:&nbsp &nbsp &nbsp{{dtl.contbtValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>称号: &nbsp &nbsp &nbsp {{dtl.contbtDesNm}}</f7-accordion-toggle>
      <f7-accordion-toggle>已结算积分贡献值:&nbsp &nbsp &nbsp{{dtl.kmsValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>统计周期:&nbsp &nbsp &nbsp{{dtl.stsYears}}</f7-accordion-toggle>
      <f7-accordion-toggle>统计时间:&nbsp &nbsp &nbsp{{dtl.createTime}}</f7-accordion-toggle>
    </f7-block>
    <div class="btn_div"><f7-link :href="'/contbtValue/contbtValuePsnAllKMS/'+dtl.contbtValueId">G-KMS积分结算</f7-link></div>
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
      util.ajax2MC('get', 'contbtValueAndSts/queryContValueInfoById?contbtValueId='+contbtValueId, null, function (result) {
        $this.dtl = result.data
      })
    },
    methods: {
    }
  }
</script>
