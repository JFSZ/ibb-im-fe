<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-list form>

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
      <f7-list-item v-for="item in personList">
        <f7-label v-if="cluePersonId == item.personId">{{item.personName}}(线索人)</f7-label>
        <f7-label v-if="cluePersonId != item.personId">{{item.personName}}</f7-label>
        <f7-input type="text" readonly v-if="item.contributionRate != null">{{item.contributionRate}}</f7-input>
        <f7-input type="text" readonly v-if="item.contributionRate == null">0</f7-input>
      </f7-list-item>
    </f7-list>
    <f7-toolbar bottom tabbar >
      <f7-link  style="color: green" text="确认" v-if="isShow == 1" @click="doQr"></f7-link>
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
            $this.cluePersonId = clueList[0].cluePersonId
            clueList.forEach(function (person) {
              if(person.loginPersonId === person.personId){
                $this.isShow = person.isShow
                $this.isConfirm = person.isConfirm
              }
            })
          }
        })
      },
      doQr(){
        let $this = this
        if($this.isConfirm === 1){
          util.alert('已确认,无需重复确认!')
          return
        }
        window.f7.confirm('确认该贡献率吗？','操作提醒',function () {
          let paramValue = {
            contributionId: $this.contributionId
          }
          util.svcInvoke('service', '/contribution/person/doQx', paramValue, function (result) {
            if (result != null) {
              util.alert('确认成功')
            }
          })
        },function () {
          return
        })
      },
      doQx(){
        this.$f7.views.main.router.back()
      },
    }
  }
</script>
