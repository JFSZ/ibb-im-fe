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
      <f7-input type="text" readonly>{{auditState}}</f7-input>
    </f7-list-item>
      <f7-list-item v-show="isBusiness==1">
        <f7-label>备注</f7-label>
        <f7-input type="text" placeholder="请输入备注信息" v-model="auditRemark"></f7-input>
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
        parentList:[],
        auditRemark:'',
        applyCandidateVos:{},
        applyID:'',
        selectUsers:[],
        isBusiness:0,
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
      //this.getParentDetail()
      //this.getApprovePerson()
      //this.getBusiness()
      this.initAuditFlow(this.id)
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
        util.svcInvoke('service', 'clue/toApprove', payload, function (result) {
          let env = result.code
          let msg = result.message
          if (env === 0) {
            util.alert('申请提交成功', function () {
              // $this.$f7.views.main.router.reloadPage('/manage/my-pr-record/'+$this.$route.params.userId+'/'+$this.$route.params.relationId)
            })
          } else {
            util.alert(msg)
          }
        })
      },
      initAuditFlow : function (data){
        let $this = this
        let param = {
          id: data,
        }
        util.svcInvoke('service','oa/getApplyInfo',param,function(result){
          let auditFlow= result.data
          $this.persons=auditFlow.persons
          $this.rights=auditFlow.rights
          $this.copyNames=auditFlow.copyNames
          $this.defaultCopyName=auditFlow.defaultCopyName
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
      //
      getLogList: function () {
        let $this = this
        let paramValue = {
          id:$this.id,
        }
        util.svcInvoke('service', 'clue/GetDetailByApplyId', paramValue, function (result) {
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
        })
      },
      getParentDetail: function () {
        let $this = this
        util.svcInvoke('service', 'person/allBusinessList', null, function (result) {
          $this.parentList = result.data
        })
      },
      getApprovePerson: function () {
        let $this = this
        util.svcInvoke('service', 'clue/getApprovePerson', null, function (result) {
          let env = result.code
          let msg = result.message
          if(env===0){
            $this.applyID = result.data.applyID
            $this.applyCandidateVos = result.data.applyCandidateVos
            let approveL = result.data.applyCandidateVos.length
            let ss = result.data.applyCandidateVos
            for (let i = 0; i < approveL; i++) {
              let dada=JSON.stringify(ss[i].staffDatas[0])
              if(Object.is(parseInt(ss[i].types), 0)){
                $this.selectUsers.push(dada)
              }else {
                let huoxuan = ss[i].staffDatas[0]
                huoxuan.staffName=''
                huoxuan.staffID=''
                $this.selectUsers.push(JSON.stringify(huoxuan))
              }
            }
            console.log($this.selectUsers)
          }else{
            util.alert(msg)
          }
        })
      },
      agree:function(data) {
        let that = this
        that.$f7.views.main.router.loadPage('/manage/popup-audit/'+that.id)
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
      copy(){
        let that = this
        let id  = that.$route.params.id
        that.$f7.views.main.router.loadPage('/manage/copy-person/' + id)
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
    }
  }
</script>
