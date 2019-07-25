<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-searchbar cancel-link="查询" search-list="#search-list" placeholder="查询" :clear-button="true"
                  @searchbar:search="onSearch"
                  @searchbar:disable="onDisable"
                  @searchbar:enable="onEnable"
                  @searchbar:clear="onClear"></f7-searchbar>
    <!-- Will be visible if there is no any results found, defined by "searchbar-not-found" class -->
    <f7-list class="searchbar-not-found">
      <f7-list-item title="未查询到"></f7-list-item>
    </f7-list>

    <!-- Search-through list -->
    <f7-list form class="searchbar-found" id="search-list">
     <f7-list-item accordion-item   v-for="item in logList" :title="item.name"  after="父类">
        <f7-accordion-content>
          <f7-list>
            <f7-list-item v-for="items in item.matterVoList" radio name="demo-radio" :title="items.name" :link="'/admin/matter-up/'+items.matterId"></f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
      <!--<f7-list-item smart-select smart-select-searchbar smart-select-back-text="确定">
        <select name="具体事项" multiple="multiple" v-model="selectUsers">
          <optgroup :label="item.name" v-for="item in logList">
            &lt;!&ndash;:selected="person.check"&ndash;&gt;
            <option v-for="items in item.matterVoList" :value="items.id">{{items.name}}
            </option>
          </optgroup>
        </select>
      </f7-list-item>-->
      <!--<f7-list>
        <f7-list-item radio title="其他事项(请在备注中具体说明)"></f7-list-item>
      </f7-list>-->
    </f7-list>

    <f7-toolbar bottom tabbar >
      <f7-link href="admin/matter-add" text="添加" ></f7-link>
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
        logList:[],
        projectName: '',
        projectId:0,
        selectUsers:[]
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        this.projectName = $this.$route.params.projectName
        this.projectId =$this.$route.params.projectId
        console.log(this.projectName)
        console.log(this.projectId)
        let  period={
          name:'',
        }
        util.svcInvoke('service', 'matter/list', period, function (result) {
          // 关闭窗口并刷新主页面
          $this.logList = result.data.list
          console.log($this.logList)
        })
      },
      onSearch: function (query, found) {
        //console.log('search', query)
      },
      onClear: function (event) {
        //console.log('clear')
      },
      onEnable: function (event) {
        //console.log('enable')
      },
      onDisable: function (event) {
        //console.log('disable',event)
      },
    }
  }
</script>
