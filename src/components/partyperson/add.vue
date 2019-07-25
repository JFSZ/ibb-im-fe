<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-list form>

      <f7-list-item smart-select smart-select-searchbar title="选择员工"  smart-select-back-text="确定" smart-select-back-on-select>
        <f7-label>员工</f7-label>
        <select name="员工"   v-model="selectUsers" required @change="doQuery">
          <optgroup>
            <option  v-for="item in departList" :value="item.id">{{item.name}}</option>
          </optgroup>
        </select>
      </f7-list-item>

      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span>员工编号:</f7-label>
        <f7-input type="text"  readonly>{{personNumber}}</f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label><f7-span style="color: #ff2d55">*</f7-span>类型:</f7-label>
        <f7-input type="select" required v-model="type">
          <option value="0" selected>非商务人员</option>
          <option value="1">商务人员</option>
        </f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>备注:</f7-label>
        <f7-input type="textarea"  v-model="remark" placeholder="请输入备注内容,长度不超过150字"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-toolbar bottom tabbar >
      <f7-link  style="color: green" text="添加" @click="addPartPerson"></f7-link>
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
        departList:[],
        selectUsers:'',
        personName:'',
        personNumber:'请输入员工工号',
        type:'',
        remark:'',
        clueId:'',//销售线索id
        personDepartId:'',
        personPhone:'',
      }
    },
    mounted: function () {
      this.getDepartList()
    },
    methods: {
      //获取用户列表信息
      getDepartList: function () {
        let $this = this
        $this.clueId = $this.$route.params.clueId
        util.svcInvoke('service', 'person/list', null, function (result) {
          // 关闭窗口并刷新主页面
          $this.departList = result.data.list
        })
      },
      doQuery(){
        let $this = this
        let paramValue = {
          id:$this.selectUsers
        }
        util.svcInvoke('service', 'person/detail', paramValue, function (result) {
          console.log(result.data)
          let person = result.data
          $this.personNumber = person.number
          $this.personName = person.name
          $this.personDepartId = person.deptId
          $this.personPhone = person.phone
        })
      },
      addPartPerson(){
        let $this = this
        $this.clueId = $this.$route.params.clueId
        if(!$this.selectUsers || $this.selectUsers === ''){
          util.alert('请选择员工')
          return
        }
        if(!$this.type || $this.type === ''){
          util.alert('请选择员工类型')
          return
        }
        if($this.remark.length > 150){
          util.alert('输入备注内容过长')
          return
        }
        let paramValue = {
          personId:$this.selectUsers,
          personName:$this.personName,
          personNumber:$this.personNumber,
          type:$this.type,
          remark:$this.remark,
          clueId:$this.clueId,
          personDepartId:$this.personDepartId,
          personDepartName:$this.personDepartName,
        }
        util.svcInvoke('service', '/market/person/add', paramValue, function (result) {
          let code = result.code
          if(code === 0){
            $this.$f7.views.main.router.reloadPreviousPage('/partyperson/list/' + $this.clueId)
            util.alert('添加成功',function () {
              $this.$router.back()
            })
          }else {
            util.alert(result.message)
            $this.$f7.views.main.router.refreshPage()
          }
        })
      },
      doQx(){
        this.$f7.views.main.router.back()
      },
    }
  }
</script>
