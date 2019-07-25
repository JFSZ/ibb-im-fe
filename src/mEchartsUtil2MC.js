export default {
  getOneBarOption(yData,xData){
    let barColorList = ['#3c9bd3','#3dc0e4','#66dede','#9aeb2','#fdd65d','#fb9479','#f6658b','#d956a5','#e085ca','#e3b4f0']//柱图色值
    let barGridInfo = {   //绘图区调整
      x:80,  //左留白
      y:10,   //上留白
      x2:80,  //右留白
      y2:10   //下留白
    }
    //横向单柱图option
    return{
      tooltip : {
        trigger: 'item'  //悬浮提示框不显示
      },
      grid:barGridInfo,
      xAxis : [
        {
          show:false,
          type : 'value',
          boundaryGap : [0, 0],
          position: 'top'
        }
      ],
      yAxis : [
        {
          type : 'category',
          data :yData,
          axisLine:{
            show:false,
            textStyle: {
              code:function(params) {
                return barColorList[params.dataIndex]
              }
            }
          },     //坐标轴
          axisTick:[{    //坐标轴小标记
            show:false
          }],
          axisLabel:{
            textStyle:{
              fontSize:'15',
              color: '#3dc0e4'
            }
          }
        }
      ],
      series : [
        {
          name:'',
          type:'bar',
          tooltip:{show:false},
          barMinHeight:10,  //最小柱高
          barWidth: 20,  //柱宽度
          barMaxWidth:100,   //最大柱宽度
          data:xData,
          itemStyle:{
            normal:{    //柱状图颜色
              color:function(params) {
                return barColorList[params.dataIndex]
              },
              label:{
                show: true,   //显示文本
                position: 'right',  //数据值位置
                textStyle:{
                  color:function(params) {
                    return barColorList[params.dataIndex]
                  },
                  fontSize:'15'
                }
              }
            }
          }
        }
      ]
    }
  },
  getPieOption(btData){
    return{
      color:['#3c9bd3','#e085ca','#e3b4f0','#3dc0e4','#66dede','#9aeb2','#fdd65d','#fb9479','#f6658b','#d956a5'],
      /*tooltip : {
        trigger: 'item',
        showDelay: 20,   // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        hideDelay: 20,   // 隐藏延迟，单位ms
        backgroundColor: 'rgba(255,0,0,0.7)',  // 提示框背景颜色
        textStyle: {
          fontSize: '16px',
          color: '#000'  // 设置文本颜色 默认#FFF
        },
        // formatter设置提示框显示内容
        // {a}指series.name  {b}指series.data的name
        // {c}指series.data的value  {d}%指这一部分占总数的百分比
        formatter: '{a} <br/>{b} : {c}个 ({d}%)'
      },*/
      series : [
        {
          name: '',
          type: 'pie',
          radius : '75%',
          center: ['50%', '50%'],
          label: {
            normal: {
              show: true,
              formatter:'{b}: {c}({d}%)'
            }
          },
          data:btData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  },
  getNowDate() {
    let timeStamp = new Date()
    let year = new Date(timeStamp).getFullYear()
    let month =new Date(timeStamp).getMonth() + 1 < 10? '0'+(new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1
    let date =new Date(timeStamp).getDate() < 10? '0'+ new Date(timeStamp).getDate(): new Date(timeStamp).getDate()
    /*let hh =new Date(timeStamp).getHours() < 10? '0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
    let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();*/
    // let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
    // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
    return  year + '年' + month + '月' + date + '日'
  },
  getNowFromartDate() {
    let timeStamp = new Date()
    let year = new Date(timeStamp).getFullYear()
    let month =new Date(timeStamp).getMonth() + 1 < 10? '0'+(new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1
    let date =new Date(timeStamp).getDate() < 10?  '0'+new Date(timeStamp).getDate(): new Date(timeStamp).getDate()
    /*let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
    let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();*/
    // let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
    // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
    return  year + '-' + month + '-' + date
  },
  getNowMonth(){
    let timeStamp = new Date()
    let year = new Date(timeStamp).getFullYear()
    let month =new Date(timeStamp).getMonth() + 1 < 10? '0' + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1
    return  year + '年' + month + '月'
  },
  getNowYear(){
    let timeStamp = new Date()
    let year = new Date(timeStamp).getFullYear()
    return  year + '年'
  },
  getTopDay(nowDay){ //获取上一天
    let year = nowDay.substring(0,4)
    let month = nowDay.substring(5,7)
    let day = nowDay.substring(8,10)
    day = this.chuliDay(day)
    month = this.chuliDay(month)
    let duibiDay = parseInt(day)-1
    if(duibiDay === 0){
      month = month-1
      if(month === 0){
        year = parseInt(year) -1
        month = 12
      }
      if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12){
        day = 31
      }else if(month === 2){
        day = 28
      }else{
        day = 30
      }
    }else {
      day = parseInt(day) -1
    }
    month = month < 10?'0'+month:month
    day = day < 10?'0'+day:day
    return year + '年' + month + '月' + day + '日'
  },
  getLastDay(nowDay){ //获取下一天
    let year = nowDay.substring(0,4)
    let month = nowDay.substring(5,7)
    let day = nowDay.substring(8,10)
    day = this.chuliDay(day)
    month = this.chuliDay(month)
    let duibiDay = parseInt(day)+1
    if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12){
      if(duibiDay > 31){
        day = 1
        if(month === 12){
          month = parseInt(month) + 1
          year = parseInt(year) + 1
        }else{
          month = parseInt(month) + 1
        }
      }else{
        day = parseInt(day) + 1
      }
    }else if(month === 2){
      if(duibiDay > 28){
        day = 1
        month = parseInt(month) + 1
      }else{
        day = parseInt(day) + 1
      }
    }else{
      if(duibiDay > 30){
        day = 1
        month = parseInt(month) + 1
      }else{
        day = parseInt(day) + 1
      }
    }
    month = month < 10?'0'+month:month
    day = day < 10?'0'+day:day
    return year + '年' + month + '月' + day + '日'
  },
  getTopMonth(nowDay){ //获取上一月
    let year = nowDay.substring(0,4)
    let month = nowDay.substring(5,7)
    month = this.chuliDay(month)
    let duibiDay = parseInt(month)-1
    if(duibiDay === 0){
      year = parseInt(year) -1
      month = 12
    }else{
      month = parseInt(month) - 1
    }
    month = month < 10?'0'+month:month
    return year + '年' + month + '月'
  },
  getLastMonth(nowDay){ //获取下一月
    let year = nowDay.substring(0,4)
    let month = nowDay.substring(5,7)
    month = this.chuliDay(month)
    let duibiDay = parseInt(month)+1
    if(duibiDay > 12){
      year = parseInt(year) + 1
      month = 1
    }else{
      month = parseInt(month) + 1
    }
    month = month < 10?'0'+month:month
    return year + '年' + month + '月'
  },
  getTopYear(nowDay){ //获取上一年
    let year = nowDay.substring(0,4)
    year = parseInt(year) - 1
    return year + '年'
  },
  getLastYear(nowDay){ //获取下一年
    let year = nowDay.substring(0,4)
    year = parseInt(year)+1
    return year + '年'
  },
  chuliDay(day){
    if(day === '01'){
      day = 1
    }else if(day === '02'){
      day = 2
    }else if(day === '03'){
      day = 3
    }else if(day === '04'){
      day = 4
    }else if(day === '05'){
      day = 5
    }else if(day === '06'){
      day = 6
    }else if(day === '07'){
      day = 7
    }else if(day === '08'){
      day = 8
    }else if(day === '09'){
      day = 9
    }
    return day
  },
  formarteDay(day){
    let year = day.substring(0,4)
    let month = day.substring(5,7)
    let dayl = day.substring(8,10)
    return year + '-' + month + '-' + dayl
  }
}


