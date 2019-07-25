<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title>提交审批</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>申请人:</f7-label>
        <f7-input type="text" readonly :value="businessName">{{businessName}}</f7-input>
      </f7-list-item>
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
      <f7-input type="text" readonly>{{auditName}}&nbsp<a v-show="auditName!='待提交审核'" :href="'/manage/audit-detail/'+applyID">点击详情</a> </f7-input>
    </f7-list-item>
      <f7-list-item v-show="isBusiness==1">
        <f7-label>备注</f7-label>
        <f7-input type="text" placeholder="请输入备注信息" v-model="auditRemark"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list v-show="isBusiness==1&&auditName=='待提交审核'">
      <f7-list-item>
        <f7-label style="margin-top: 6px;font-size: 16px;color: #444444;font-weight:bold">审批流程</f7-label>
      </f7-list-item>
      <f7-list-item smart-select smart-select-back-on-select smart-select-open-in="popup"   smart-select-page-title="选择审批人"  v-for="user in applyCandidateVos" :title="user.nameList" :after="user.nameList">
        <select name="流程审批人" @change="changea($event)">
          <option v-for="person in user.staffDatas" :value="person.staffID+'/'+person.ID+'/'+person.staffName+'/'+person.ID_+'/'+person.ind">{{person.staffName}}
          </option>
        </select>
      </f7-list-item>
    </f7-list>
    <p v-show="isBusiness==1&&auditName=='待提交审核' ">
      <f7-button fill color="green" v-on:click="clickSave">提交</f7-button>
      <f7-button fill color="rad" v-on:click="reject">驳回</f7-button>
    </p>
    <f7-toolbar bottom tabbar v-if="auditCode!='0'">
      <f7-link  style="color: green" text="贡献率评价列表"  @click="toContributionList"></f7-link>
      <f7-link  style="color: green" text="参与人列表"  @click="toPartypersonList"></f7-link>
    </f7-toolbar>
    <f7-toolbar bottom tabbar v-if="auditCode=='0'">
      <f7-link  style="color: green" text="贡献率评价列表"  :href="'/contribution/list/'+ id"></f7-link>
      <f7-link  style="color: green" text="参与人列表"  :href="'/partyperson/list/' + id"></f7-link>
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
        auditCode:this.$route.params.auditState,
        auditName:'',
        parentList:[],
        auditRemark:'',
        applyCandidateVos:{},
        applyID:'',
        selectUsers:[],
        isBusiness:0,
      }
    },
    mounted: function () {
      let $this = this
      this.getLogList()
      if($this.auditCode==='1'){
        this.getApprovePerson()
      }
      this.getBusiness()
    },
    methods: {

      clickSave() {
        let $this = this
        let payload = {
          approveData: JSON.stringify(this.selectUsers),
          applyID: $this.applyID,
          businessName:$this.businessName,
          clueName:$this.clueName,
          customName:$this.customName,
          customPhone:$this.customPhone,
          customCompanyName:$this.customCompanyName,
          customUrl:$this.customUrl,
          customType:$this.customType,
          customBudget:$this.customBudget,
          customNeed:$this.customNeed,
          createTime:$this.createTime,
          auditRemark:$this.auditRemark,
          id:$this.id,
        }
        if($this.auditName !== '待提交审核'){
          util.alert('已提交,请勿重复提交!')
          return
        }
        util.svcInvoke('service', 'clue/toApprove', payload, function (result) {
          let env = result.code
          let msg = result.message
          if (env === 0) {
            util.alert('申请提交成功', function () {
              $this.$f7.views.main.router.reloadPage('leads/list')
            })
          } else {
            util.alert(msg)
          }
        })
      },
      getBusiness: function () {
        let $this = this
        util.svcInvoke('service', 'clue/isBusiness', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.isBusiness = result.data
        })
      },
      //
      getLogList: function () {
        let $this = this
        let paramValue = {
          id:$this.id,
        }
        util.svcInvoke('service', 'clue/detail', paramValue, function (result) {
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
            $this.auditName = '待提交审核'
          }else if($this.clueList.auditState === 2){
            $this.auditName = '已驳回'
          }else if($this.clueList.auditState === 0){
            $this.auditName = '审核通过'
          }else if($this.clueList.auditState === 4){
            $this.auditName = '审核中'
          }
          $this.applyID=$this.clueList.applyId
          $this.auditRemark=$this.clueList.auditRemark
        })
      },
      getApprovePerson: function () {
        let $this = this
        util.svcInvoke('service', 'clue/getApprovePerson', null, function (result) {
          console.log(result)
          let env = result.code
          let msg = result.message
          if(env===0){
            $this.applyID = result.data.applyID
            $this.applyCandidateVos = result.data.applyCandidateVos
            let approveL = result.data.applyCandidateVos.length
            let ss = result.data.applyCandidateVos
            for (let i = 0; i < approveL; i++) {
              let dada=JSON.stringify(ss[i].staffDatas[0])
              $this.selectUsers.push(dada)
            }
          }else{
            util.alert(msg)
          }
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
      },
      changea:function (e) {
        let $this = this
        let eda= e.target.value
        let da =eda.split('/')
        let res = {//person.staffID+'/'+person.ID+'/'+person.staffName+'/'+person.ID_+'/'+person.ind
          staffID:da[0],
          ID:da[1],
          staffName:da[2],
          ID_:da[3],
          ind:da[4]
        }
        for (let i = 0; i < $this.selectUsers.length; i++) {
          let aa = util.jsonParse($this.selectUsers[i]).ind
          if(Object.is(parseInt(aa), parseInt(res.ind))){
            $this.selectUsers[i]=JSON.stringify(res)
          }
        }
      },
      toContributionList(){
        let $this = this
        if($this.auditCode!=='0'){
          util.alert('销售线索未审核！')
          return
        }
        //$this.$f7.views.main.router.loadPage('/contribution/list/' + $this.id)
      },
      toPartypersonList(){
        let $this = this
        if($this.auditCode!=='0'){
          util.alert('销售线索未审核！')
          return
        }
        //$this.$f7.views.main.router.loadPage('/partyperson/list/' + $this.id)
      }
    }
  }
</script>
