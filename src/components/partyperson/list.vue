<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <div style="margin: 20px">
      <button class="button" @click="addPartyPerson" >添加参与人</button>
    </div>
    <div class="data-table card">
      <table>
        <thead>
        <tr>
          <th class="label-cell">姓名</th>
          <th style="text-align: left">类型</th>
          <th style="text-align: left">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in personList">
          <td class="label-cell" >{{item.personName}}</td>
          <td style="text-align: left" v-if="item.type === 0 ">非商务人员</td>
          <td style="text-align: left" v-if="item.type === 1 ">商务人员</td>
          <td style="text-align: left" ><a href="javascript:void(0);" @click="deleteList(item.id)">删除</a></td>
        </tr>
        <tr v-if="personList.length == 0">未查询到相关记录</tr>
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
        personList: [],
        clueId:'',
        isShow:'',
      }
    },
    mounted: function () {
      this.getLogList()
    },
    methods: {
      //获取用户列表信息
      getLogList: function () {
        let $this = this
        //获取传递的参数
        $this.clueId = $this.$route.params.id
        let paramValue = {
          clueId:$this.clueId
        }
        util.svcInvoke('service', '/market/person/list', paramValue, function (result) {
          let list = result.data
          $this.personList = result.data.voList
          $this.isShow = list.isShow
          console.log(list)
        })
      },
      deleteList(id){
        let $this = this
        if($this.isShow !== 1){
          util.alert('没有权限')
          return
        }
        window.f7.confirm('确认删除该条记录吗？','操作提醒',function () {
          let paramValue = {
            id:id
          }
          util.svcInvoke('service','/market/person/delete',paramValue,function (result) {
            let code = result.code
            console.log(code)
            if(code === 0){
              util.alert('删除成功')
              $this.$f7.views.main.router.refreshPage()
            }else {
              util.alert(result.message)
            }
          })
        },function () {
          return
        })
      },
      addPartyPerson(){
        let $this = this
        if($this.isShow !== 1){
          util.alert('没有权限')
          return
        }
        this.$f7.views.main.router.loadPage('/partyperson/add/' + this.clueId)
      },
    }
  }
</script>
