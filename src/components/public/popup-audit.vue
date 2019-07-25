<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <p class="inputArea">
      <f7-input  type="textarea" placeholder="请输入驳回理由(非必填)" v-model="remarks"></f7-input>
    </p>
    <p class="inputBtn">
      <f7-button fill v-on:click="doDenial">驳回</f7-button>
      <f7-button fill v-on:click="doCancel">取消</f7-button>
    </p>
  </f7-page>
</template>

<style lang="less">
  textarea{
   width: 100%;
   height: 10em;
  }
.inputBtn{
  position: absolute;
  bottom: 1em;
  width: 100%;
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
        remarks: '',
        auditId:this.$route.params.id,
      }
    },
    methods: {
      doDenial:function(){
        let $this = this
        let param = {
          applyId: $this.id,
          userId:$this.userId,
          view:'denial',
          message: $this.remarks
        }
        util.svcInvoke('service','oa/audit/doAuditOperate',param,function(result){
          if (result.code === 0){ //审核通过
            $this.$f7.views.main.router.refreshPreviousPage()
            util.alert('审核通过',function(){
              $this.$f7.views.main.router.back()
            })
          } else {
            util.alert('审核失败',function(){
              $this.$f7.views.main.router.back()
            })
          }
        })
      },
      doCancel:function(){
        let that = this
        that.$f7.views.main.router.back()
      }
    }
  }
</script>
