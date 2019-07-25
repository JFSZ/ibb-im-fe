<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-list form>

      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span>客户姓名:</f7-label>
        <f7-input type="text" readonly>{{customName}}</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span>合同金额:</f7-label>
        <f7-input type="text"  v-model="contractAmount" v-if="contractAmountGet === null || contractAmountGet === ''" placeholder="请输入合同金额,保留两位小数"></f7-input>
        <f7-input type="text"  v-if="contractAmountGet !== null && contractAmountGet !== ''"  readonly placeholder="请输入合同金额,保留两位小数">{{contractAmountGet}}</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span>回款金额:</f7-label>
        <f7-input type="text" required v-model="backAmount" placeholder="请输入回款金额,保留两位小数"></f7-input>
      </f7-list-item>
    </f7-list>

   <!-- <div class="data-table">
      <table>
        <thead style="background: ghostwhite">
        <tr>
          <th class="label-cell">参与人姓名</th>
          <th style="text-align: left">贡献率</th>
        </tr>
        </thead>
      </table>
    </div>
    <div id="person">
      <div>
        <select class="select">
          <option selected>选择参与人</option>
          <option v-for="(item,index) in personList" :value="item.personId">{{item.personName}}</option>
        </select>
        <input type="text"  style="height: 25px;margin-left: 40px"  placeholder="请输入参与人的贡献率"/>
        <a style="margin-left: 20px;" @click="add">添加</a>
      </div>
    </div>-->



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
            <td style="text-align: left" >
              <input style="height: 25px" type="text"  placeholder="请输入参与人的贡献率"v-model="modelList[index].model">
            </td>
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
   .select {
     display: inline-block;
     width: 90px;
     height: 30px;
     margin: 10px;
     position: relative;
     vertical-align: middle;
     padding: 0;
     overflow: hidden;
     background-color: #fff;
     color: #555;
     border: 1px solid #aaa;
     text-shadow: none;
     border-radius: 4px;
     transition: box-shadow 0.25s ease;
     z-index: 2;
   }

  .select:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }

  .select:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #ccc;
    top: 14px;
    right: 10px;
    cursor: pointer;
    z-index: -2;
  }
  .select select {
    cursor: pointer;
    padding: 10px;
    width: 100%;
    border: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .select select:focus {
    outline: none;
  }
   .add::after {
     content: '';
     position: absolute;
     left: 50%;
     top: 50%;
     height: 80px;
     margin-left: -5px;
     margin-top: -40px;
     border-left: 10px solid;
   }
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
        contributionList:[],
        modelList:[],//v-model 数组
        personId:'',//参与人id
        marketPersonId:'',
        personName:'',//参与人名称
        clueId:'',//销售线索id
        customName:'',//客户名称
        contractAmountGet:'',//查询后台合同金额
        contractAmount:'',//页面输入合同金额
        backAmount:'',//回款金额
        contributionRate:'',//贡献率
        cluePersonId:'',
      }
    },
    mounted: function () {
      this.getPersonList()
      this.getClueList()
    },
    methods: {
      //获取参与人列表
      getPersonList: function () {
        let $this = this
        $this.clueId = $this.$route.params.clueId
        let paramValue = {
          clueId:$this.clueId
        }
        util.svcInvoke('service', '/market/person/list', paramValue, function (result) {
          if(result != null) {
            // 关闭窗口并刷新主页面
            $this.personList = result.data.voList
            $this.personList.forEach(function (person) {
              let model = {'model': person.personId}
              $this.modelList.push(model)
            })
          }
        })
      },
      getClueList(){
        let $this = this
        $this.clueId = $this.$route.params.clueId
        let paramValue = {
          id:$this.clueId
        }
        util.svcInvoke('service', '/clue/detail', paramValue, function (result) {
          if(result != null) {
            let clueList = result.data
            $this.customName = clueList.customName
            $this.contractAmountGet = clueList.contractAmount
            $this.cluePersonId = clueList.clueId
          }
        })
      },
      addContribution(){
        let $this = this
        $this.clueId = $this.$route.params.clueId
        let contributeList = []
        if($this.contractAmountGet === null || $this.contractAmountGet === ''){
          if(!$this.contractAmount || parseFloat($this.contractAmount) < 0){
            util.alert('请输入正确的合同金额')
            return
          }
          if(!util.isNumber($this.contractAmount)){
            util.alert('合同金额必须为数字类型')
            return
          }
          if($this.contractAmount.indexOf('.') > -1 && $this.contractAmount.substring($this.contractAmount.indexOf('.')).length > 3){
            util.alert('输入金额格式不对!最高精确到分')
            return
          }
          if($this.contractAmount.length > 20){
            util.alert('请输入正确的合同金额')
            return
          }
          if(parseFloat($this.backAmount) > parseFloat($this.contractAmount)){
            util.alert('回款金额不能大于合同金额')
            return
          }
        }else {
          if(parseFloat($this.backAmount) > parseFloat($this.contractAmountGet)){
            util.alert('回款金额不可大于合同金额')
            return
          }
          $this.contractAmount = $this.contractAmountGet
        }
        if(!$this.backAmount || parseFloat($this.backAmount) < 0){
          util.alert('请输入正确的回款金额')
          return
        }
        if(!util.isNumber($this.backAmount)){
          util.alert('请输入数字类型的回款金额')
          return
        }
        if($this.backAmount.indexOf('.') > -1 && $this.backAmount.substring($this.backAmount.indexOf('.')).length > 3){
          util.alert('输入金额格式不对!最高精确到分')
          return
        }
        let count = 0
        //填充参数
        for(var i = 0,j = 0; i< $this.personList.length&j< $this.modelList.length; i++,j++){
          let paramList = {
            personId:$this.personList[i].personId,
            marketPersonId:$this.personList[i].id,
            personName:$this.personList[j].personName,
            contractAmount:$this.contractAmount,
            backAmount:$this.backAmount,
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
        if($this.modelList.length <= 0){
          util.alert('请先添加参与人')
          return
        }
        if(count > 1.0){
          util.alert('贡献率总和不可大于1')
          return
        }
        let paramValue = {
          marketPersonId:$this.marketPersonId,
          personId:$this.personId,
          personName:$this.personName,
          clueId:$this.clueId,
          contractAmount:$this.contractAmount,
          backAmount:$this.backAmount,
          contributeList:JSON.stringify(contributeList),
        }
        util.svcInvoke('service', '/contribution/add', paramValue, function (result) {
          if(result != null) {
            let code = result.code
            if (code === 0) {
              $this.$f7.views.main.router.reloadPreviousPage('/contribution/list/' + $this.clueId)
              util.alert('添加成功',function () {
                $this.$router.back()
              })
            } else {
              util.alert(result.message)
              return
            }
          }
        })
      },
      doQx(){
        let $this = this
        $this.$router.back()
      },
     /* add(){
        let $this = this
        let id = document.getElementById('person')
        let div = document.createElement('div')
        $this.personList =
        div.innerHTML = '<div>\n' +
          '        <select class="select">\n' +
          '          <option selected>选择参与人</option>\n' +
          '          <option v-for="(item,index) in personList" :value="item.personId">{{item.personName}}</option>\n' +
          '        </select>\n' +
          '        <input type="text"  style="height: 25px;margin-left: 40px"  placeholder="请输入参与人的贡献率"/>\n' +
          '      </div>'
        id.appendChild(div)
      },*/
    }
  }
</script>
