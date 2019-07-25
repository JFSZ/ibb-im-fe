<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <f7-block-title>修改日志模板</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>日志模板名称</f7-label>
        <f7-input type="text" placeholder="请输入日志模板名称" v-model="name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>顺序</f7-label>
        <f7-input type="text" placeholder="请输入排列顺序" v-model="sequence"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>是否有效</f7-label>
        <f7-input type="switch" :checked="check" v-on:click="checkStatue(check)"></f7-input>
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
        name: '',//项目名称
        sequence: '',//顺序
        check: true,
        bh: this.$route.params.id
      }
    },
    mounted: function () {
      if (this.bh !== '0') {
        this.getPeriodDetail(this.bh)
      }
    },
    methods: {
      checkStatue:function(checked){
        let $this = this
        if(!checked){
          $this.check=true
        }else{
          $this.check=false
        }
      },
      //获取项目信息
      getPeriodDetail: function (id) {
        let $this = this
        let envObj = {
          id: id
        }
        util.svcInvoke('service', 'templet/detail', envObj, function (result) {
          $this.name = result.data.name
         // $this.proportion = result.data.proportion
         // $this.branch = result.data.branch
        //  $this.users = result.data.deptPersonVoList
          $this.sequence = result.data.sequence
          if (result.data.statue === 0) {
            $this.check = true
          } else {
            $this.check = false
          }
        })
      },
      updateOrAddPeriod: function () {
        let $this = this
        let statue = 0
        if (!$this.check) {
          statue = 1
        }
        let bh = null
        if ($this.bh > 0) {
          bh = $this.bh
        }
        let period = {
          bh: bh,
          name: $this.name,
          sequence: $this.sequence,
          statue: statue,
        }
        util.svcInvoke('service', 'templet/upTemplet', period, function (result) {
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
