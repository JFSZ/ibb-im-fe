<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block inner accordion-list>
      <f7-accordion-toggle>总贡献值:&nbsp &nbsp &nbsp{{dtl.contbtValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>已结算贡献值:&nbsp &nbsp &nbsp{{dtl.kmsValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>剩余可用贡献值:&nbsp &nbsp &nbsp{{dtl.nowValue}}</f7-accordion-toggle>
      <f7-accordion-toggle>结算贡献值:&nbsp &nbsp &nbsp<input type="text"/></f7-accordion-toggle>
      <f7-accordion-toggle>结算规则&nbsp &nbsp &nbsp1000贡献值=1积分(不足1积分不计)</f7-accordion-toggle>
      <f7-accordion-toggle>结算积分&nbsp &nbsp &nbsp<span>325</span></f7-accordion-toggle>
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
      util.ajax2MC('get', 'contbtValueAndSts/queryContValueInfoById?contbtValueId='+contbtValueId, null, function (result) {
        $this.dtl = result.data
      })
    },
    methods: {
    }
  }
</script>
