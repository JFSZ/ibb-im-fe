<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-list form>

      <f7-list-item>
        <f7-label>申请人:</f7-label>
        <f7-input type="text" readonly>{{bussName}}({{bussDepartName}})</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>客户姓名:</f7-label>
        <f7-input type="text" readonly>{{customName}}</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>合同金额:</f7-label>
        <f7-input type="text"  v-model="contractAmount"  placeholder="请输入合同金额" readonly>{{contractAmount}}</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>回款金额:</f7-label>
        <f7-input type="text" required v-model="backAmount" placeholder="请输入回款金额" readonly>{{backAmount}}</f7-input>
      </f7-list-item>

      <f7-list-item style="background: ghostwhite">
        <f7-label>参与人姓名</f7-label>
        <f7-input type="text" readonly >贡献率</f7-input>
      </f7-list-item>
    </f7-list>

    <div class="data-table">
      <table>
        <thead style="background: ghostwhite">
        <tr>
          <th class="label-cell">参与人姓名</th>
          <th style="text-align: left">贡献率</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in personList">
          <td class="label-cell" v-if="cluePersonId == item.personId" ><f7-span style="color: #ff2d55">*</f7-span>{{item.personName}}(线索人)</td>
          <td class="label-cell" v-if="cluePersonId != item.personId" ><f7-span style="color: #ff2d55">*</f7-span>{{item.personName}}</td>
          <td style="text-align: left" ><input style="height: 25px" type="text"  placeholder="请输入参与人的贡献率"
                                               v-model="modelList[index].model"/></td>
        </tr>
        </tbody>
      </table>
    </div>
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
        modelList:[],//v-model 数组
        customName:'',//客户名称
        bussName:'',
        bussDepartName:'',
        contractAmount:'',//合同金额
        backAmount:'',//回款金额
        cluePersonId:'',//线索人id
        contributionId:'',//贡献率评价id
        isShow:'',
        isConfirm:'',
      }
    },
    mounted: function () {
      this.getContributionList()
    },
    methods: {
      getContributionList(){
        let $this = this
        let id = $this.$route.params.id
        let paramValue = {
          id:id
        }
        util.svcInvoke('service', '/contribution/person/getContributionInfo', paramValue, function (result) {
          if(result != null){
            let clueList = result.data
            $this.personList = result.data
            $this.contractAmount = parseFloat(clueList[0].contractAmount == null ? 0:clueList[0].contractAmount)
            $this.backAmount = parseFloat(clueList[0].backAmount)
            $this.contributionId = clueList[0].contributionId
            $this.customName = clueList[0].customName
            $this.bussName = clueList[0].businessName
            $this.bussDepartName = clueList[0].businessDepartName
            $this.cluePersonId = clueList[0].cluePersonId
            $this.isShow = clueList[0].isShow
            $this.isConfirm = clueList[0].isConfirm
            $this.personList.forEach(function (person) {
              let model = {'model': person.contributionRate}
              $this.modelList.push(model)
            })
          }
        })
      },
      addContribution(){
        let $this = this
        let contributeList = []
        let count = 0
        //填充参数
        for(var i = 0,j = 0; i< $this.personList.length&j< $this.modelList.length; i++,j++){
          let paramList = {
            personId:$this.personList[i].personId,
            contributionRate:$this.modelList[j].model,
          }
          if($this.modelList[j].model === ''){
            util.alert('请输入贡献率!')
            return
          }
          if(!util.isNumber($this.modelList[j].model)){
            util.alert('贡献率必须为数字')
            return
          }
          count+=parseFloat($this.modelList[j].model)
          contributeList.push(paramList)
        }
        if(count > 1.0){
          util.alert('贡献率总和不可大于1')
          return
        }
        let paramValue = {
          id:$this.contributionId,
          contributeList:JSON.stringify(contributeList),
        }
        util.svcInvoke('service', '/contribution/doUpdate', paramValue, function (result) {
          let code = result.code
          if(code === 0){
            $this.$f7.views.main.router.reloadPreviousPage('/contribution/list/')
            util.alert('添加成功',function () {
              $this.$f7.views.main.router.back()
            })
          }else {
            util.alert(result.message)
            return
          }
        })
      },
      doQx(){
        this.$f7.views.main.router.back()
      },
    }
  }
</script>
