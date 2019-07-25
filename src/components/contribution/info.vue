<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title>贡献率评价</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>申请人:</f7-label>
        <f7-input type="text" readonly :value="businessName">{{businessName}}({{businessDepartName}})</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>线索人:</f7-label>
        <f7-input type="text" readonly :value="clueName">{{clueName}}({{clueDepartName}})</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户名称:</f7-label>
        <f7-input type="text" readonly :value="customName">{{customName}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户电话:</f7-label>
        <f7-input type="text"readonly :value="customPhone">{{customPhone}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>公司名称:</f7-label>
        <f7-input type="text" readonly :value="customCompanyName">{{customCompanyName}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>公司网址:</f7-label>
        <f7-input type="text" readonly :value="customUrl">{{customUrl}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户类型:</f7-label>
        <f7-input type="text" readonly>{{customType}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户预算:</f7-label>
        <f7-input type="text" readonly>{{customBudget}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户需求:</f7-label>
        <f7-input type="textarea" readonly :value="customNeed">{{customNeed}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>创建时间:</f7-label>
        <f7-input type="text" readonly>{{createTime}}</f7-input>
      </f7-list-item><f7-list-item>
      <f7-label>当前状态:</f7-label>
      <f7-input type="text" readonly>{{auditState}}</f7-input>
    </f7-list-item>
    </f7-list>
    <a class="link" style="margin-left: 10px" :href="'/contribution/list/' + id">贡献率评价列表</a>
    <a class="link" style="margin-left: 200px" :href="'/partyperson/list/' + id">参与人列表</a>
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
        id :'2',
        businessName :'',
        businessDepartName:'',
        clueName :'',
        clueDepartName:'',
        customName :'',
        customPhone :'',
        customCompanyName :'',
        customUrl :'',
        customType :'',
        customBudget :'',
        customNeed :'',
        createTime :'',
        auditState :'',
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //
      getLogList: function () {
        let $this = this
        let paramValue = {
          id:$this.id,
        }
        util.svcInvoke('service', 'clue/detail', paramValue, function (result) {
          if(result != null) {
            // 关闭窗口并刷新主页面
            let list = result.data
            $this.businessName = list.businessName
            $this.businessDepartName = list.businessDepartName
            $this.clueName = list.clueName
            $this.clueDepartName = list.clueDepartName
            $this.customName = list.customName
            $this.customPhone = list.customPhone
            $this.customCompanyName = list.customCompanyName
            $this.customUrl = list.customUrl
            $this.customType = list.customType == null ? '' : (list.customType === 0 ? '新客户' : '老客户')
            $this.customBudget = list.customBudget
            $this.customNeed = list.customNeed
            $this.createTime = list.createTime
            if (list.auditState === 1) {
              $this.auditState = '销售线索待审核'
            } else if (list.auditState === 2) {
              $this.auditState = '销售线索被驳回'
            } else if (list.auditState === 0) {
              $this.auditState = '销售线索审核通过'
            }
          }
        })
      },
    }
  }
</script>
