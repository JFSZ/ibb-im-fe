<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-list form>
      <f7-list-item smart-select smart-select-searchbar title="选择部门:"  smart-select-back-text="确定">
        <f7-label> 部门</f7-label>
          <select name="部门"   v-model="selectUsers" >
            <optgroup   >
              <option  v-for="item in departList" :value="item.id">{{item.name}}
              </option>
            </optgroup>
          </select>
      </f7-list-item>

      <f7-list-item>
        <f7-label>开始日期:</f7-label>
        <f7-input type="datetime-local" placeholder="请选择开始日期"  :value="startTime" v-model="startTime"></f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>结束日期:</f7-label>
        <f7-input type="datetime-local" placeholder="请选择结束日期" :value="endTime" v-model="endTime" > </f7-input>
      </f7-list-item>

      <f7-list-item>
        <f7-label>工作时长:</f7-label>
        <f7-input type="text"  v-model="duration" placeholder="请输入时长"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-toolbar bottom tabbar >
      <f7-link  text="确认" @click="doSubmit"></f7-link>
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
        departId:'',
        startTime:'',
        endTime:'',
        duration:'',
        departList:[],
        selectUsers:'',
      }
    },
    mounted: function () {
      this.getDepartList()
    },
    methods: {
      //获取用户列表信息
      getDepartList: function () {
        let $this = this
        let paramValue= {
          type:3
        }
        util.svcInvoke('service', 'department/departmentList', paramValue, function (result) {
          // 关闭窗口并刷新主页面
          $this.departList = result.data
        })
      },
      doSubmit(){
        let $this = this
        let paramValue = {
          departId:$this.selectUsers,
          startTime:$this.startTime,
          endTime:$this.endTime,
          duration:$this.duration,
        }
        if($this.duration < -1){
          util.alert('工时不可为负数')
          return
        }
        util.setCookie('paramList', paramValue, 999, '192.168.66.78')
        $this.$f7.views.main.router.reloadPreviousPage('/loglist/logcount/')
        util.alert('提交成功!', function () {
          $this.$f7.views.main.router.back()
        })
      },
    }
  }
</script>
