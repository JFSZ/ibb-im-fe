<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>添加工作事项</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>添加父类</f7-label>
        <f7-input type="text" placeholder="请输入父类名称" v-model="parentName"></f7-input>
      </f7-list-item>
    </f7-list>
    <p>
      <f7-button fill color="green" v-on:click="updateOrAddPeriod">提交</f7-button>
    </p>
    <f7-list form>
      <f7-list-item title="父类" smart-select smart-select-searchbar smart-select-back-text="确定">
        <select name="fruits" v-model="selectList">
          <option v-for="parent in parentList" :value="parent.matterParentId">{{parent.name}}</option>
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
      }
    },
    mounted: function () {
      this.getParentDetail()
    },
    methods: {
      getParentDetail: function () {
        let $this = this
        util.svcInvoke('service', 'matter/parent/list', null, function (result) {
          $this.parentList = result.data.list
          console.log($this.parentList)
        })
      },
      updateOrAddPeriod: function () {
        let $this = this
        let period = {
          name: $this.parentName,
        }
        util.svcInvoke('service', 'matter/parent/addMatterParent', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
      updateOrAddMatter: function () {
        let $this = this
        let period = {
          name: $this.matter,
          pid: $this.selectList,
        }
        util.svcInvoke('service', 'matter/addMatter', period, function (result) {
          $this.fId = result.data
          // 关闭窗口并刷新主页面
          util.alert('提交成功!', function () {
            $this.$router.back()
          })
        })
      },
    }
  }
</script>
