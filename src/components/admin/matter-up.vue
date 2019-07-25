<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>修改工作事项</f7-block-title>
    <f7-list form>
      <f7-list-item title="父类" smart-select smart-select-searchbar smart-select-back-text="确定":after="parentName">
        <select name="fruits" v-model="selectList">
          <option v-for="parent in parentList" :value="parent.matterParentId" >{{parent.name}}</option>
        </select>
      </f7-list-item>
      <!--<f7-list-item title="父类" smart-select :smart-select-params="{openIn: 'sheet'}">
        <select name="fruits" v-model="selectList">
          <option v-for="parent in parentList" :value="parent.id">{{parent.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-item title="Mac or Windows" smart-select :smart-select-params="{openIn: 'sheet'}">
        <select name="mac-windows">
          <option value="mac" selected>Mac</option>
          <option value="windows">Windows</option>
        </select>
      </f7-list-item>-->
      <!-- Multiple Smart Select With Searchbar -->
      <f7-list-item>
        <f7-label>工作事项名称</f7-label>
        <f7-input type="text" placeholder="请输入工作事项名称" v-model="matter"></f7-input>
      </f7-list-item>
    </f7-list>
    <p>
      <f7-button fill color="green" v-on:click="updateOrAddMatter">提交</f7-button>
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
        parentName: '',//项目名称
        sequence: '',//部门
        matter:'',
        parentList:[],
        selectList:[],
        bh: this.$route.params.id
      }
    },
    mounted: function () {
      if (this.bh !== '0') {
        this.getPeriodDetail(this.bh)
      }
      this.getParentList()
    },
    methods: {
      //获取项目信息
      getPeriodDetail: function (id) {
        let $this = this
        let envObj = {
          bh: id
        }
        util.svcInvoke('service', 'matter/matterDetail', envObj, function (result) {
          $this.parentName = result.data.parentName
          $this.matter = result.data.name
        })
      },
      getParentList: function () {
        let $this = this
        util.svcInvoke('service', 'matter/parent/list', null, function (result) {
          $this.parentList = result.data.list
          console.log($this.parentList)
        })
      },
      updateOrAddMatter: function () {
        let $this = this
        let bh = null
        if ($this.bh > 0) {
          bh = $this.bh
        }
        let period = {
          bh: bh,
          name: $this.matter,
          pid: $this.selectList,
        }
        util.svcInvoke('service', 'matter/upMatter', period, function (result) {
          $this.bh = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
    }
  }
</script>
