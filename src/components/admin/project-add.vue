<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>项目添加</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>项目名称</f7-label>
        <f7-input type="text" placeholder="项目名称" v-model="name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>是否是产品</f7-label>
        <f7-input type="switch" :checked="check"></f7-input>
      </f7-list-item>
      <!-- Multiple Smart Select With Searchbar -->
      <f7-list-item smart-select smart-select-searchbar title="部门" smart-select-back-text="确定">
        <select name="部门" multiple="multiple" v-model="branch">
          <!--<optgroup :label="user.deptName" v-for="user in users">
            &lt;!&ndash;:selected="person.check"&ndash;&gt;
            <option v-for="person in user.periodPersonVos" :value="person.id">{{person.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{person.number}}
            </option>
          </optgroup>-->
          <option v-for="parent in users" :value="parent.id">{{parent.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-item>
        <f7-label>各部门所占比例</f7-label>
        <f7-input type="text" placeholder="比例用逗号分割，例：0.3,0.7" v-model="proportion"></f7-input>
      </f7-list-item>
      <!--<f7-list-item v-for="ad in branch">
        <f7-label>{{ad}}的占比</f7-label>
        <f7-input type="text" placeholder="部门所占比例"  v-on:change="savezb(this)"></f7-input>
      </f7-list-item>-->
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
        name: '',//项目名称
        proportion: '',//占比
        branch: [],//部门
        check: true,
        users:[],
        product:'',
        bc:''
      }
    },
    mounted: function () {
      this.loadUserPeriod()
    },
    methods: {
      savezb:function(ta){
      },
      //获取周期信息
      /*getPeriodDetail: function (id) {
        let $this = this
        let envObj = {
          id: id
        }
        util.svcInvoke('service', 'assess/period/detail', envObj, function (result) {
          $this.fName = result.data.assessPeriod.fName
          $this.fIntervalDay = result.data.assessPeriod.fIntervalDay
          $this.fStartDate = result.data.assessPeriod.fStartDate
          $this.fEndDate = result.data.assessPeriod.fEndDate
          $this.fDescription = result.data.assessPeriod.fDescription
          $this.users = result.data.deptPersonVoList
          $this.selectUsers = result.data.selectUsers
          if (result.data.assessPeriod.state === 1) {
            $this.check === true
          } else {
            $this.check === false
          }
        })
      },*/
      updateOrAddPeriod: function () {
        let $this = this
        let product = 0
        if (!$this.state) {
          product = 1
        }
        let bcc=''
       // console.log($this.branch)
        for (let i=0; i<$this.branch.length; i++){
          let  bbb=$this.branch[i]+''
          bcc=bcc+','+bbb
        }
        console.log(bcc)
        let period = {
          name: $this.name,
          proportion: $this.proportion,
          bcc: bcc,
          product: product,
        }

        util.svcInvoke('service', 'project/addProject', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          $this.$f7.views.main.router.reloadPreviousPage('/admin/project-list/')
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
      //加载组织及员工信息
      loadUserPeriod: function () {
        let $this = this
        let type = {
          type: 3,
        }
        util.svcInvoke('service', 'department/departmentList', type, function (result) {
          $this.users = result.data
        })
      },
    }
  }
</script>
