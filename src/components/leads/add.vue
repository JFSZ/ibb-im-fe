<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>录入销售线索</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 客户名称</f7-label>
        <f7-input type="text" placeholder="请输入客户名称" v-model="customName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 客户电话</f7-label>
        <f7-input type="text" placeholder="请输入客户电话" v-model="customPhone"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 客户公司名称</f7-label>
        <f7-input type="text" placeholder="请输入客户公司名称" v-model="customCompanyName"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 客户公司网址</f7-label>
        <f7-input type="text" placeholder="请输入客户公司网址" v-model="customUrl"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 是否是新客户</f7-label>
        <f7-input type="switch" :checked="check"></f7-input>
      </f7-list-item>
      <f7-list-item title="商务" smart-select smart-select-searchbar smart-select-back-text="确定">
        <select name="fruits" v-model="selectList">
          <option v-for="parent in parentList" :value="parent.id">{{parent.name}}（{{parent.companyName}}&nbsp;{{parent.deptName}}&nbsp;{{parent.phone}}）</option>
        </select>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 客户预算</f7-label>
        <f7-input type="text" placeholder="请输入客户预算" v-model="customBudget"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span> 需求描述</f7-label>
        <f7-input type="text" placeholder="请输入需求描述" v-model="customNeed"></f7-input>
      </f7-list-item>
    </f7-list>
    <p>
      <f7-button fill color="green" v-on:click="updateOrAddPeriod">提交</f7-button>
    </p>
  </f7-page>

</template>

<script>

  import {mapState} from 'vuex'
  import util from '../../util'

  export default {
    computed: {
      ...mapState({}),
    },
    data() {
      return {
        customName: '',//项目名称
        customPhone: '',//部门
        customCompanyName:'',
        customUrl:'',
        customBudget:'',
        customNeed:'',
        selectList:[],
        parentList:[],
        type:0,
        check: true,
      }
    },
    mounted: function () {
      this.getParentDetail()
    },
    methods: {
      getParentDetail: function () {
        let $this = this
        util.svcInvoke('service', 'person/allBusinessList', null, function (result) {
          $this.parentList = result.data
          console.log($this.parentList)
        })
      },
      updateOrAddPeriod: function () {
        let $this = this
        let aaa = 0
        if (!$this.state) {
          aaa = 1
        }
        if(!util.checkPhone($this.customPhone)){
          util.alert('请正确填写手机号')
          return
        }
        if(!util.isNumber($this.customBudget)){
          console.log(typeof $this.customBudget)
          util.alert('预算金额必须为数字类型')
          return
        }
        if($this.customBudget.indexOf('.') > -1 && $this.customBudget.substring($this.customBudget.indexOf('.')).length > 3){
          util.alert('输入金额格式不对!最高精确到分')
          return
        }
        if(!$this.customBudget.length > 20){
          util.alert('请输入正确的预算金额')
          return
        }
        let period = {
          businessId: $this.selectList,
          customName: $this.customName,
          customPhone: $this.customPhone,
          customCompanyName: $this.customCompanyName,
          customUrl: $this.customUrl,
          customBudget: $this.customBudget,
          customNeed: $this.customNeed,
          type: aaa,
        }
        util.svcInvoke('service', 'clue/addLeads', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            //$this.$f7.views.main.router.reloadPreviousPage('/leads/list/')
            $this.$f7.views.main.router.loadPage('/leads/list/')
          })
        })
      },
    }
  }
</script>
