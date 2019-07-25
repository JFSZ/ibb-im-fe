<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title>分配商务</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>线索人:</f7-label>
        <f7-input type="text" readonly :value="clueName">{{clueName}}</f7-input>
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
      <f7-list-item title="商务" smart-select smart-select-searchbar smart-select-back-text="确定">
        <select name="fruits" v-model="selectList">
          <option v-for="parent in parentList" :value="parent.id">{{parent.name}}（{{parent.companyName}}&nbsp;{{parent.deptName}}&nbsp;{{parent.phone}}）</option>
        </select>
      </f7-list-item>
      <f7-list-item>
        <f7-label>备注</f7-label>
        <f7-input type="text" placeholder="请输入备注信息" v-model="auditRemark"></f7-input>
      </f7-list-item>
    </f7-list>
    <p>
      <f7-button fill color="green" v-on:click="agree">分配</f7-button>
      <f7-button fill color="rad" v-on:click="reject">驳回</f7-button>
    </p>
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
        clueList: [],
        id :this.$route.params.id,
        businessName :'',
        clueName :'',
        customName :'',
        customPhone :'',
        customCompanyName :'',
        customUrl :'',
        customType :'',
        customBudget :'',
        customNeed :'',
        createTime :'',
        auditState :'',
        selectList:[],
        parentList:[],
        auditRemark:'',
        isBusiness:0,
      }
    },
    mounted: function () {
      this.getLogList()
      this.getParentDetail()
      this.getBusiness()
    },
    methods: {
      //
      getLogList: function () {
        let $this = this
        let paramValue = {
          id:$this.id,
        }
        util.svcInvoke('service', 'clue/detail', paramValue, function (result) {
          console.log(result)
          // 关闭窗口并刷新主页面
          $this.clueList = result.data
          $this.businessName = $this.clueList.businessName
          $this.clueName = $this.clueList.clueName
          $this.customName = $this.clueList.customName
          $this.customPhone = $this.clueList.customPhone
          $this.customCompanyName = $this.clueList.customCompanyName
          $this.customUrl = $this.clueList.customUrl
          $this.customType = $this.clueList.customType == null ? '': ($this.clueList.customType === 0 ? '新客户':'老客户')
          $this.customBudget = $this.clueList.customBudget
          $this.customNeed = $this.clueList.customNeed
          $this.createTime = $this.clueList.createTime
          if($this.clueList.auditState === 1){
            $this.auditState = '待提交审核'
          }else if($this.clueList.auditState === 2){
            $this.auditState = '已驳回'
          }else if($this.clueList.auditState === 0){
            $this.auditState = '审核通过'
          }else if($this.clueList.auditState === 4){
            $this.auditState = '审核中'
          }
          $this.selectList=$this.clueList.businessId
        })
      },
      getParentDetail: function () {
        let $this = this
        util.svcInvoke('service', 'person/allBusinessList', null, function (result) {
          $this.parentList = result.data
        })
      },
      getBusiness: function () {
        let $this = this
        util.svcInvoke('service', 'clue/isBusiness', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.isBusiness = result.data
          console.log($this.isBusiness)
        })
      },
      agree:function(){
        let $this = this
        let period = {
          id:$this.id,
          businessId: $this.selectList,
          auditRemark:$this.auditRemark,
        }
        util.svcInvoke('service', 'clue/upBusiness', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
      reject:function(){
        let $this = this
        let period = {
          id:$this.id,
          auditRemark:$this.auditRemark,
        }
        util.svcInvoke('service', 'clue/reject', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      }
    }
  }
</script>
