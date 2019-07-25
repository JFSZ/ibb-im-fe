<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <div style="margin: 20px">
      <button class="button" @click="addContribution" >添加贡献率评价</button>
    </div>
    <div class="data-table card">
      <table>
        <thead>
        <tr>
          <th class="label-cell">评价人</th>
          <th style="text-align: left">金额</th>
          <th style="text-align: left">参与人</th>
          <th style="text-align: left">状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in contributionList">
          <td class="label-cell">{{item.createName}}</td>
          <td style="text-align: left">合同:{{item.contractAmount}}<br/>回款:{{item.backAmount}}</td>
          <td style="text-align: left">{{item.person}}</td>
          <td style="text-align: left" v-if="item.auditState != '待审核'">{{item.auditState}}&nbsp&nbsp
            <a href="javascript:void(0);" @click="edit(item.auditState,item.clueId,item.id)">修改</a>
            <a :href="'/contribution/detail/' + item.id ">详情</a>
          </td>
          <td style="text-align: left" v-if="item.auditState == '待审核'">
            <a href="javascript:void(0);" @click="doAudit(item.id)">审核</a>&nbsp&nbsp
            <a href="javascript:void(0);" @click="edit(item.auditState,item.clueId,item.id)">修改</a>
            <a :href="'/contribution/detail/' + item.id">详情</a>
          </td>
        </tr>
        <tr v-if="contributionList.length  == 0">未查询到相关记录</tr>
        </tbody>
      </table>
    </div>
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
        contributionList: [],
        clueId:'',
        contributionId:'',
        personId:'',
        isShow:'',
      }
    },
    mounted: function () {
      this.getContributionList()
    },
    methods: {
      getContributionList: function () {
        let $this = this
        $this.clueId = $this.$route.params.id
        let paramValue = {
          clueId:$this.clueId
        }
        util.svcInvoke('service', 'contribution/list', paramValue, function (result) {
          if(result != null) {
            let list = result.data
            console.log(list)
            $this.contributionList = list.voList
            $this.isShow = list.isShow
          }
        })
      },
      addContribution(){
        let $this = this
        if($this.isShow !== 1){
          util.alert('没有权限')
          return
        }
        $this.$f7.views.main.router.loadPage('/contribution/add/' + this.clueId)
      },
      //提交审核
      doAudit(id){
        let $this = this
        if($this.isShow !== 1){
          util.alert('没有权限')
          return
        }
        //是否所有参与人都确认过
        $this.clueId = $this.$route.params.id
        let paramValues = {
          contributionId:id
        }
        util.svcInvoke('service', '/contribution/person/getPersonQxStatus', paramValues, function (result) {
          if(result != null) {
            let code = result.code
            console.log(result)
            if(code !== 0){
              util.alert(result.message)
              return
            }else if(code === 0){
              $this.$f7.views.main.router.loadPage('/contribution/audit/' + id + '/' + $this.clueId)
            }
          }
        })
      },
      edit(auditState,clueId,id){
        let $this = this
        if($this.isShow !== 1){
          util.alert('没有权限')
          return
        }
        if(auditState !== '待审核'){
          util.alert('已提交审核,不可修改')
          return
        }
        $this.$f7.views.main.router.loadPage('/contribution/edit/' + clueId + '/' + id)
      },
    }
  }
</script>
