<template>
  <f7-page :name="$route.route.name" :class="$route.route.name">
    <navbar :title="$route.route.title"></navbar>

    <ul class="tabs">
      <li class="li-tab" v-for="(item,index) in tabsParam"
          @click="toggleTabs(index)"
          :class="{active:index!=nowIndex}">{{item}}</li>
    </ul>
    <ul class="tabs1">
      <li class="li-tab1" ><button id="zuotian" @click="topDayClick()"></button></li>
      <li class="li-tab2"><label id="nowDateTime"></label></li>
      <li class="li-tab1"><button id="mingtian" @click="lastDayClick()"></button></li>
    </ul>
    <div class="divTab" v-show="nowIndex===0">
      <div id="chart_pie0"> </div>
      <div id="chart_example0"></div>
    </div>
    <div class="divTab" v-show="nowIndex===1">
      <div id="chart_pie1"></div>
      <div id="chart_example1"></div>
    </div>
    <div class="divTab" v-show="nowIndex===2">
      <div id="chart_pie2"></div>
      <div id="chart_example2"></div>
    </div>
  </f7-page>
</template>
<style scoped>
  #chart_example0,#chart_example1,#chart_example2,#chart_example3,#chart_example4{
    width: 100%;
    height:60%;
  }
  #chart_pie0,#chart_pie1,#chart_pie2,#chart_pie3,#chart_pie4{
    width: 100%;
    height:40%;
  }
  .active{
    background: #3dc0e4;
  }
  .tabs{
    width: 100%;
    height: 20px;
    padding:0;
    margin-top: 0px;
    margin-bottom: 0px;
    background: #c3e3fa;
  }
  .tabs1{
    width: 100%;
    height: 20px;
    padding:0;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .li-tab{
    width: 33.33%;
    height: 100%;
    display:inline-block;
    text-align: center;

  }
  .li-tab1{
    width: 30%;
    height: 100%;
    display:inline-block;
    text-align: center;

  }
  .li-tab2{
    width: 37%;
    height: 100%;
    display:inline-block;
    text-align: center;

  }
  .divTab{
    width: 100%;
    height:60%;
    margin-top: 70px;
  }
  #zuotian,#mingtian{
    background: #00b1fd;
  }
</style>

<script>
  import echarts from 'echarts'
  import echatrsMC from '../../mEchartsUtil2MC'
  import util from '../../util'

  export default {
    data() {
      return {
        // tabsParam:['按天统计','按周统计','按月统计','按季统计','按年统计'],//（这个也可以用对象key，value来实现）
        tabsParam:['按天统计','按月统计','按年统计'],//（这个也可以用对象key，value来实现）
        nowIndex:0,//默认第一个tab为激活状态
      }
    },
    mounted(){
      /*setTimeout(function(){
        document.getElementById('nowDateTime').innerText = echatrsMC.getNowDate()
        document.getElementById('zuotian').innerText = '昨天'
        document.getElementById('mingtian').innerText = '明天'
      },1000)*/
      document.getElementById('nowDateTime').innerText = echatrsMC.getNowDate()
      document.getElementById('zuotian').innerText = '昨天'
      document.getElementById('mingtian').innerText = '明天'
      let mURL = 'contbtValueAndSts/queryMarketContValueStsList?type=1&nowData='+echatrsMC.getNowFromartDate()
      this.setEchartInfo(mURL,0)
    },
    methods: {
      toggleTabs:function(index){
        this.nowIndex=index
        let type = 1 //查询类型标记
        let year = echatrsMC.getNowDate().substring(0,4)
        let month = echatrsMC.getNowDate().substring(5,7)
        let mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+echatrsMC.getNowFromartDate()
        if(index === 0){
          document.getElementById('nowDateTime').innerText = echatrsMC.getNowDate()
          document.getElementById('zuotian').innerText = '昨天'
          document.getElementById('mingtian').innerText = '明天'
          type = 1
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+echatrsMC.getNowFromartDate()
        }else if(index === 1){
          document.getElementById('nowDateTime').innerText = echatrsMC.getNowMonth()
          document.getElementById('zuotian').innerText = '上个月'
          document.getElementById('mingtian').innerText = '下个月'
          type = 3
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsMonth='+month+'&stsYear='+ year
        }else if(index === 2){
          document.getElementById('nowDateTime').innerText = echatrsMC.getNowYear()
          document.getElementById('zuotian').innerText = '上一年'
          document.getElementById('mingtian').innerText = '下一年'
          type = 5
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsYear='+ year
        }
        this.setEchartInfo(mURL,index)
      },
      setEchartInfo:function(mURL,index){
        // let myChart = echarts.init(document.getElementById('chart_example'))
        let yData = ['我','叫','冒','菜','AND','我','L','O','V','E','景','安']
        let xData = [1314, 521, 215, 125, 111, 55,16,10,5,3,2,1]
        util.ajax2MC('get',mURL, null, function (result) {
          if(result.data){
            yData = []
            xData = []
            let btData = []
            for (let i = 0; i < result.data.psnList.length; i++) {
              yData.push(result.data.psnList[i].psnNm)
              xData.push(result.data.psnList[i].contbtValue)
            }
            let option = echatrsMC.getOneBarOption(yData,xData)
            var myChart = echarts.init(document.getElementById('chart_example'+index))
            myChart.clear()
            myChart.setOption(option,true)
            for (let i = 0; i < result.data.deptList.length; i++) {
              let btInfo = {value:result.data.deptList[i].contbtValue,name:result.data.deptList[i].deptNm}
              btData.push(btInfo)
            }
            let btoption = echatrsMC.getPieOption(btData)
            var btChart = echarts.init(document.getElementById('chart_pie'+index))
            btChart.clear()
            btChart.setOption(btoption,true)
          }
        })
      },
      topDayClick:function(){
        let date =  document.getElementById('nowDateTime').innerText
        let type = 1
        let mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+date
        if(this.nowIndex === 0){
          let ddd = echatrsMC.getTopDay(date)
          document.getElementById('nowDateTime').innerText = ddd
          let dt = echatrsMC.formarteDay(echatrsMC.getTopDay(date))
          type = 1
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+dt
        }else if(this.nowIndex === 1){
          type = 3
          let monthd = echatrsMC.getTopMonth(date)
          document.getElementById('nowDateTime').innerText = monthd
          let year = monthd.substring(0,4)
          let month = monthd.substring(5,7)
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsMonth='+month+'&stsYear='+ year
        }else if(this.nowIndex === 2){
          document.getElementById('nowDateTime').innerText = echatrsMC.getTopYear(date)
          let year = echatrsMC.getTopYear(date).substring(0,4)
          type = 5
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsYear='+ year
        }
        this.setEchartInfo(mURL,this.nowIndex)
      },
      lastDayClick:function () {
        let date =  document.getElementById('nowDateTime').innerText
        let type = 1
        let mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+date
        if(this.nowIndex === 0){
          let ddd = echatrsMC.getLastDay(date)
          document.getElementById('nowDateTime').innerText = ddd
          let dt = echatrsMC.formarteDay(echatrsMC.getLastDay(date))
          type = 1
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&nowData='+dt
        }else if(this.nowIndex === 1){
          type = 3
          let monthd = echatrsMC.getLastMonth(date)
          document.getElementById('nowDateTime').innerText = monthd
          let year = monthd.substring(0,4)
          let month = monthd.substring(5,7)
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsMonth='+month+'&stsYear='+ year
        }else if(this.nowIndex === 2){
          document.getElementById('nowDateTime').innerText = echatrsMC.getLastYear(date)
          let year = echatrsMC.getLastYear(date).substring(0,4)
          type = 5
          mURL = 'contbtValueAndSts/queryMarketContValueStsList?type='+type+'&stsYear='+ year
        }
        this.setEchartInfo(mURL,this.nowIndex)
      }
    },
    watch: {},
    created() {
    }
  }
</script>
