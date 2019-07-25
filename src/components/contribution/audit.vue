<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title style="text-align: center">贡献率提交审批</f7-block-title>
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
    <f7-list>
      <f7-list-item>
        <f7-label style="margin-top: 6px;font-size: 16px;color: #444444;font-weight:bold">审批流程</f7-label>
      </f7-list-item>
      <f7-list-item smart-select smart-select-back-on-select smart-select-open-in="popup"
                    smart-select-page-title="选择审批人"  v-for="user in applyCandidateVos" :title="user.nameList" :after="user.nameList" >
        <select name="流程审批人" @change="changea($event)">
          <option v-for="person in user.staffDatas" :value="person.staffID+'/'+person.ID+'/'+person.staffName+'/'+person.ID_+'/'+person.ind">{{person.staffName}}
          </option>
        </select>
      </f7-list-item>
    </f7-list>

    <f7-toolbar bottom tabbar >
      <f7-link  style="color: green" text="提交" @click="addContribution"></f7-link>
      <f7-link  style="color: red" text="取消" @click="doQx" ></f7-link>
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
      }
    },
    mounted: function () {
      this.getLogList()
      this.getApprovePerson()
    },
    methods: {
      getLogList: function () {
        let $this = this
        let id = $this.$route.params.id
        let paramValue = {
          id:id
        }
        util.svcInvoke('service', '/contribution/person/getContributionInfo', paramValue, function (result) {
          if(result != null) {
            if(result != null){
              let clueList = result.data
              $this.personList = result.data
              $this.contractAmount = parseFloat(clueList[0].contractAmount == null ? 0:clueList[0].contractAmount)
              $this.backAmount = parseFloat(clueList[0].backAmount)
              $this.contributionId = clueList[0].contributionId
              $this.customName = clueList[0].customName
              $this.cluePersonId = clueList[0].cluePersonId
              $this.bussName = clueList[0].businessName
              $this.bussDepartName = clueList[0].businessDepartName
            }
          }
        })
      },
      getApprovePerson: function () {
        let $this = this
        util.svcInvoke('service', '/contribution/getApprovePerson', null, function (result) {
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
              if(Object.is(parseInt(ss[i].types), 0)){
                $this.selectUsers.push(dada)
              }else {
                let huoxuan = ss[i].staffDatas[0]
                huoxuan.staffName=''
                huoxuan.staffID=''
                $this.selectUsers.push(JSON.stringify(huoxuan))
              }
            }
          }else{
            util.alert(msg)
          }
        })
      },
      changea:function (e) {
        let $this = this
        let eda= e.target.value
        let da =eda.split('/')
        let res = {
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
      //提交审核
      addContribution(){
        let $this = this
        let clueId = $this.$route.params.clueId
        let id = $this.$route.params.id
        let paramValue = {
          approveData: JSON.stringify(this.selectUsers),
          applyID: $this.applyID,
          id:id,
          contractAmount : $this.contractAmount,
          backAmount : $this.backAmount,
          customName: $this.customName,
          ibbMarketContributionPersonVoString : JSON.stringify($this.personList),
          createName : $this.createName,
        }
        console.log(paramValue)
        util.svcInvoke('service', '/contribution/doAudit', paramValue, function (result) {
          let code = result.code
          if(code === 0){
            $this.$f7.views.main.router.reloadPreviousPage('/contribution/list/' + clueId)
            util.alert('审核成功',function () {
              $this.$router.back()
            })
          }else {
            util.alert(result.message)
            return
          }
        })
      },
      doQx(){
        this.$router.back()
      },
    }
  }
</script>
