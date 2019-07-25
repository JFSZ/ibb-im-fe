<template id="audit">
  <f7-page>
    <f7-navbar title="" back-link="返回" no-navbar></f7-navbar>
    <f7-list>

      <f7-list-item>
        <f7-label style="margin-top: 6px;font-size: 16px;color: #444444;font-weight:bold">审批流程</f7-label>
      </f7-list-item>

      <f7-list-item smart-select smart-select-back-text="确定"
                    smart-select-back-on-select smart-select-open-in="popup"   smart-select-page-title="选择审批人"  v-for="(user,index) in applyCandidateVos"  :key="index" :title="user.nameList" :after="user.nameList">
        <select name="流程审批人" @change="changea($event)">
          <option :value="'请选择/' + index">-- 请选择 --</option>
          <option v-for="person in user.staffDatas" :value="person.staffID+'/'+person.ID+'/'+person.staffName+'/'+person.ID_+'/'+person.ind +'/'+person.TYPES">{{person.staffName}}
          </option>
        </select>
      </f7-list-item>
    </f7-list>
    <f7-toolbar bottom tabbar >
      <f7-link  style="color: green" text="提交" @click="submit" ></f7-link>
    </f7-toolbar>
  </f7-page>
</template>

<script>
  import util from '../../util'
  export default {
    data() {
      return {
        approveId :this.$route.params.approveId,//审批模板id
        staffID:this.$route.params.staffID,//申请人id
        applyCandidateVos:{},
        applyID:'',//申请id
        selectUsers:[],
        selectData:[],
        valueId:'',//申请内容id
      }
    },
    mounted: function (){
      this.getAuditTemplateById()
    },
    methods: {
      getAuditTemplateById(){
        let $this = this
        let param={
          approveId:223,
          userId:'515a397f968c46e3a27ac81647812e59',
        }
        util.svcInvoke('service', 'oa/audit/getApprovePersonById', param, function (result) {
          console.log(result)
          if(result != null){
            let env = result.code
            let msg = result.message
            if(env===0){
              $this.applyID = result.data.applyID
              $this.valueId = result.data.valueId
              $this.applyCandidateVos = result.data.applyCandidateVos
              let approveL = result.data.applyCandidateVos.length
              let ss = result.data.applyCandidateVos
              for (let i = 0; i < approveL; i++) {
                let dada=JSON.stringify(ss[i].staffDatas[0])
                $this.selectUsers.push(dada)
                let dataObj = {data:'',type:ss[i].staffDatas[0].TYPES}
                $this.selectData.push(dataObj)
              }
              console.log($this.selectUsers)
            }else{
              util.alert(msg)
            }
          }else {
            util.alert('网络繁忙,请稍后重试')
          }
        })
      },
      changea:function (e) {
        let $this = this
        let eda= e.target.value
        if(JSON.stringify(eda).indexOf('请选择') >= 0){
          $this.selectData[eda.split('/')[1]].data = ''
          return
        }
        let da =eda.split('/')
        let res = {//person.staffID+'/'+person.ID+'/'+person.staffName+'/'+person.ID_+'/'+person.ind
          staffID:da[0],
          ID:da[1],
          staffName:da[2],
          ID_:da[3],
          ind:da[4],
          TYPES:da[5]
        }
        for (let i = 0; i < $this.selectUsers.length; i++) {
          let aa = util.jsonParse($this.selectUsers[i]).ind
          if(Object.is(parseInt(aa), parseInt(res.ind))){
            $this.selectUsers[i]=JSON.stringify(res)
            $this.selectData[i].data = JSON.stringify(res)
          }
        }
      },
      submit(){
        let $this = this
        console.log($this.selectData)
      },
    },
  }

</script>
