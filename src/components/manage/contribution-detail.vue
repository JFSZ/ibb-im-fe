<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title style="text-align: center">贡献率审批</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>申请人:</f7-label>
        <f7-input type="text" readonly :value="bussName">{{bussName}}({{bussDepartName}})</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>客户名称:</f7-label>
        <f7-input type="text" readonly :value="customName">{{customName}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>合同金额:</f7-label>
        <f7-input type="text"readonly :value="contractAmount">{{contractAmount}}</f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>回款金额:</f7-label>
        <f7-input type="text" readonly :value="backAmount">{{backAmount}}</f7-input>
      </f7-list-item>
      <f7-list-item style="background: ghostwhite">
        <f7-label>参与人姓名</f7-label>
        <f7-input type="text" readonly >贡献率</f7-input>
      </f7-list-item>
      <f7-list-item v-for="item in personList">
        <f7-label v-if="cluePersonId == item.personId">{{item.personName}}(线索人)</f7-label>
        <f7-label v-if="cluePersonId != item.personId">{{item.personName}}</f7-label>
        <f7-input type="text" readonly v-if="item.contributionRate != null">{{item.contributionRate}}</f7-input>
        <f7-input type="text" readonly v-if="item.contributionRate == null">0</f7-input>
      </f7-list-item>
    </f7-list>

    <f7-block-title>审批流程</f7-block-title>
    <f7-list form>
      <!--审批人-->
      <f7-list-item  v-for="person in persons">
        <f-span class='v-actName' >{{person.actName}}</f-span>
        <f-span>{{person.name}}</f-span>
        <f-span>{{person.time}}</f-span>
        <f-span>{{person.taskStatu}}</f-span>
      </f7-list-item>
      <!--抄送人-->
      <f7-list-item title="抄送人">
        <f-span type="text"  placeholder="无" readonly v-model="copyNames" >{{copyNames}}</f-span>
      </f7-list-item>
      <f7-list-item>
        <f7-label>默认抄送</f7-label>
        <f-span type="text"  placeholder="无" readonly v-model="defaultCopyName" >{{defaultCopyName}}</f-span>
      </f7-list-item>

      <f7-list-item>
        <f7-label>审批说明</f7-label>
        <f-span type="text" placeholder="无"  readonly v-model="remarks" >{{remarks}}</f-span>
      </f7-list-item>
    </f7-list>
    <p class="btn">
      <f7-button fill v-on:click="agree" v-if="rights.agree!=null&&rights.agree!=''&&rights.agree!='null'">{{rights.agree}}</f7-button>
      <f7-button fill v-on:click="denial" v-if="rights.denial!=null&&rights.denial!=''&&rights.denial!='null'">{{rights.denial}}</f7-button>
      <f7-button fill v-on:click="copy" v-if="rights.copy!=null&&rights.copy!=''&&rights.copy!='null'">{{rights.copy}}</f7-button>
      <!--<f7-button fill v-on:click="modify" v-if="rights.modify!=null&&rights.modify!=''&&rights.modify!='null'">{{rights.modify}}</f7-button>
      <f7-button fill v-on:click="deleted" v-if="rights.delete!=null&&rights.delete!=''&&rights.delete!='null'">{{rights.delete}}</f7-button>-->
      <f7-button fill v-on:click="recall" v-if="rights.recall!=null&&rights.recall!=''&&rights.recall!='null'">{{rights.recall}}</f7-button>
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
        personList:[],
        customName:'',//客户名称
        bussName:'',//申请人（销售）名称
        bussDepartName:'',//申请人部门名称
        contractAmount:'',//合同金额
        backAmount:'',//回款金额
        cluePersonId:'',//线索人id
        contributionId:'',//贡献率评价id
        auditRemark:'',
        applyCandidateVos:{},
        applyID:'',
        selectUsers:[],
        //审批相关参数
        persons:[],
        copyNames:'',
        defaultCopyName:'',
        remarks: '',//备注
        rights:{},
      }
    },
    mounted: function () {
      this.getLogList()
      this.initAuditFlow()
    },
    methods: {
      getLogList: function () {
        let $this = this
        let id  = $this.$route.params.id
        let paramValue = {
          id:id,
        }
        util.svcInvoke('service', '/contribution/getAuditDetailByApplyId', paramValue, function (result) {
          if(result != null) {
            let clueList = result.data
            console.log(result)
            $this.personList = result.data
            $this.contractAmount = parseFloat(clueList[0].contractAmount)
            $this.backAmount = parseFloat(clueList[0].backAmount)
            $this.contributionId = clueList[0].contributionId
            $this.customName = clueList[0].customName
            $this.cluePersonId = clueList[0].cluePersonId
            $this.bussName = clueList[0].businessName
            $this.bussDepartName = clueList[0].businessDepartName
          }
        })
      },
      initAuditFlow : function (data){
        let $this = this
        let id  = $this.$route.params.id
        let paramValue = {
          id:id,
        }
        util.svcInvoke('service','oa/getApplyInfo',paramValue,function(result){
          let auditFlow= result.data
          $this.persons=auditFlow.persons
          $this.rights=auditFlow.rights
          $this.copyNames=auditFlow.copyNames
          $this.defaultCopyName=auditFlow.defaultCopyName
        })
      },
      agree:function(data) {
        let that = this
        let id  = that.$route.params.id
        console.log(id)
        that.$f7.views.main.router.loadPage('/manage/popup-audit/'+id)
      },
      denial:function() {
        let that = this
        let param = {
          id: that.id,
        }
        window.f7.confirm('确定要拒绝吗?',function(){
          util.svcInvoke('service','oa/denial',param,function(result){
            if (result.code===0){
              util.alert('拒绝成功',function(){
                that.$f7.views.main.router.back()
              })
            }else {
              util.alert('拒绝失败',function(){
                that.$f7.views.main.router.refreshPage()
              })
            }
          })
        })
      },
      recall:function() {
        let that = this
        let param = {
          id: that.id,
        }
        window.f7.confirm('确定要撤回吗?',function(){
          util.svcInvoke('service','oa/recall',param,function(result){
            if (result.code===0){
              util.alert('撤回成功',function(){
                that.$f7.views.main.router.back()
              })
            }else {
              util.alert('撤回失败',function(){
                that.$f7.views.main.router.refreshPage()
              })
            }
          })
        })
      },
      copy(){
        let that = this
        let id  = that.$route.params.id
        that.$f7.views.main.router.loadPage('/manage/copy-person/' + id)
      },
    }
  }
</script>
