<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>
    <f7-block-title>提交审批</f7-block-title>
    <f7-list v-for="(item,index) in applyContentList" :key="index">
      <f7-list-item v-if="item.dictID != 8 && item.dictID != 12">
        <f7-label>{{item.title}}</f7-label>
        <f7-input type="text" placeholder="item.placeholder" readonly>{{item.val}}</f7-input>
      </f7-list-item>

      <!--图片-->
      <f7-list-item v-if="item.dictID == 8" >
        <div class='finish_room'>
          <div class='finish_room2'>
            <div v-for='(items ,index ) in item.val ':key="index" class='room_img'  @touchend="enlarge(index)"  >
              <img :src="items">
            </div>
          </div>
        </div>
        <!--<div class="imgMask3" v-if="showLicenseImgs" @click.stop="showLicenseImgs=!showLicenseImgs">
          <div class="showImg3" >
            <img class="bigImg3" :src="item.val[num]">
          </div>
        </div>-->
      </f7-list-item>

      <!--附件-->
      <f7-list-item v-if="item.dictID == 12" v-for="(items ,index ) in item.val" :key="index" >
        <f7-label>{{item.title}}</f7-label>
        <a :href="item">{{items}}</a>
      </f7-list-item>

    </f7-list>

    <f7-block-title>审批流程</f7-block-title>

    <f7-list form>
      <!--审批人-->
      <f7-list-item  v-for="(person,index) in persons"  :key="index" accordion-item :title="person.actName  +'&nbsp'+
                         person.name+'&nbsp'+person.taskStatu">
        <f7-accordion-content>
          <f7-block>
            <P> {{person.name}}</P>
            <P> {{person.taskStatu}}</P>
            <P> {{person.remark}}</P>
            <P> {{person.time}}</P>
          </f7-block>
        </f7-accordion-content>
      </f7-list-item>
      <!--抄送人-->
      <f7-list-item title="抄送人">
        <f-span type="text"  placeholder="无" readonly v-model="copyNames" >{{copyNames}}</f-span>
      </f7-list-item>
      <f7-list-item>
        <f7-label>默认抄送</f7-label>
        <f-span type="text"  placeholder="无" readonly v-model="defaultCopyName" >{{defaultCopyName}}</f-span>
      </f7-list-item>

      <f7-list-item>
        <f7-label>审批说明</f7-label>
        <f-span type="text" placeholder="无"  readonly v-model="remarks" ></f-span>
      </f7-list-item>

    </f7-list>

    <f7-list>
      <f7-list-item>
        <f7-label>同意/拒绝说明(非必填)</f7-label>
        <f-input type="textarea" placeholder="请输入内容"  v-model="message" ></f-input>
      </f7-list-item>
    </f7-list>

    <f7-toolbar bottom tabbar >
      <f7-link  v-if="agree != null && agree != ''"  style="color: #24ff47" text="同意"@click="agreeAudit" ></f7-link>
      <f7-link v-if="denial != null && denial != ''" style="color: red" text="驳回" @click="denialAudit"></f7-link>
      <f7-link v-if="copy != null && copy != ''" style="color: #24ff47" text="抄送" @click="copyAudit" ></f7-link>
      <f7-link v-if="recall != null && recall != ''" style="color: red" text="撤回" @click="recallAudit" ></f7-link>
      <f7-link  style="color: red" text="取消" @click="doQX" ></f7-link>
    </f7-toolbar>
  </f7-page>
</template>


<style lang="less">
  .list-block{
    margin: 0px 0;
  }

  .imgMask3{
    position: absolute;
    height: 100%;
    width:100%;
    top:80%;
    left:0;
    z-index: 100;
    background:rgba(0,0,0,.1);
  }
  .showImg3{
    height:70%;
    width:90%;
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    border:10px solid #fff;
  }
  .bigImg3{
    width:100%;
    height:75%;
  }
  .finish_room{
    width: 100%;
    height: auto;
  }
  .finish_room2{
    width: 100%;
    height: auto;
    padding-top: 15px;
    padding-bottom: 15px;
    display: block;
    align-items: center;
    //border-bottom: 2px solid #e1e1e1;
  }
  .finish_room2 .room_img{
    width: 50%;
    height: 100px;
    position: relative;
    overflow: hidden;
    float: left;
  }
  .finish_room2 .room_img img{
    width: 100%;
    height: 100%;
  }
  .finish_room2>.room_img span{
    position: absolute;
    width: auto;
    height: auto;
    right: 5px;
    bottom:3px;
  }
  .big{
    width: 100%;
    height: 100%;
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
        //草稿 20545 审批中 20539 审批完 20457
        applyId :'20545',
        userId:'515a397f968c46e3a27ac81647812e59',
        //审批相关参数
        persons:[],
        applyContentList:[],//审批内容
        copyNames:'',
        defaultCopyName:'',
        remarks: '',//备注
        rights:{},
        agree:'',
        denial:'',
        copy:'',
        recall:'',
        showLicenseImgs:false,
        message:'',
      }
    },
    mounted: function () {
      this.initAuditFlow()
    },
    methods: {
      initAuditFlow : function (){
        let $this = this
        let param = {
          applyId: $this.applyId,
          userId:$this.userId,
        }
        util.svcInvoke('service','oa/audit/getApplyInfo',param,function(result){
          console.log(result)
          let auditFlow= result.data
          $this.persons=auditFlow.persons
          $this.rights=auditFlow.rights
          $this.copyNames=auditFlow.copyNames
          $this.defaultCopyName=auditFlow.defaultCopyName
          $this.applyContentList = auditFlow.applyContentList
          if(auditFlow.rights !== null && auditFlow.rights !== ''){
            $this.agree = auditFlow.rights.agree
            $this.denial = auditFlow.rights.denial
            $this.copy = auditFlow.rights.copy
            $this.recall = auditFlow.rights.recall
          }
        })
      },
      /*//点击查看图片
      enlarge(item,event) {
        this.showLicenseImgs = true
        this.num = item
      },*/
      //通过
      agreeAudit:function(data) {
        let that = this
        let param = {
          applyId: that.applyId,
          userId:that.userId,
          view:'agree',
          message: that.message,
        }
        util.svcInvoke('service','oa/audit/doAuditOperate',param,function(result){
          if (result.code===0){
            util.alert('审批完成',function(){
              that.$f7.views.main.router.refreshPage()
            })
          }else {
            util.alert('审批失败',function(){
              return
            })
          }
        })
      },
      //撤回
      recallAudit:function() {
        let that = this
        let param = {
          applyId: that.applyId,
          userId:that.userId,
          view:'recall',
        }
        window.f7.confirm('确定要撤回吗?',function(){
          util.svcInvoke('service','oa/audit/doAuditOperate',param,function(result){
            if (result.code===0){
              util.alert('撤回成功',function(){
                that.$f7.views.main.router.refreshPage()
              })
            }else {
              util.alert('撤回失败',function(){
                return
              })
            }
          })
        })
      },
      //驳回
      denialAudit:function() {
        let $this = this
        let param = {
          applyId: $this.applyId,
          userId:$this.userId,
          view:'denial',
          message: $this.message,
        }
        util.svcInvoke('service','oa/audit/doAuditOperate',param,function(result){
          if (result.code === 0){ //审核通过
            $this.$f7.views.main.router.refreshPreviousPage()
            util.alert('驳回成功',function(){
              $this.$f7.views.main.router.refreshPage()
            })
          } else {
            util.alert('驳回失败',function(){
              return
            })
          }
        })
      },
      //抄送
      copyAudit(){
        let that = this
        that.$f7.views.main.router.loadPage('/public/copy-person/' + that.applyId)
      },
      doQX(){
        let $this = this
        $this.$f7.views.main.router.back()
      },
    }
  }
</script>
