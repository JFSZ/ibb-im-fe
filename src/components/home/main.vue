<template>
  <div class="home-main-view">
    <div style="width: 100%;font-size: 20px;text-align: center">贡献值排行榜 <div style="float: right;padding-right: 15px;text-align: center;padding-bottom: 10px"><f7-link style="font-size: 10px" text="更多>>" href="contbtValue/contbtValuePsnAll" ></f7-link></div></div>
    <div class="data-table" style="width: 100%">
      <table>
        <thead style="background: ghostwhite">
        <tr>
          <th class="label-cell">排名</th>
          <th style="text-align: left">姓名</th>
          <th style="text-align: left">贡献值</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in dataList">
          <td class="label-cell"  >{{ index + 1 }}</td>
          <td style="text-align: left" >{{ item.psnNm }}</td>
          <td style="text-align: left" >{{ item.contbtValue }}</td>
        </tr>
        </tbody>
      </table>
    </div>
   <f7-block class="list9-block">
      <ul>
        <f7-list-item v-for="menu in menuList" :title="menu.name" :link="menu.url"
                      :media="'<img src='+menu.icon+'>'" :key="index"></f7-list-item>
      </ul>
    </f7-block>
  </div>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";


  .home-main-view .blank-block1 {
    height: 160px;
    margin-top: 15px;
    background-color: @lightGreyColor;
  }

  .home-main-view .blank-block2 {
    height: 160px;
    margin-top: 15px;
    background-color: @greyColor;
  }

  .home-main-view .blank-block3 {
    height: 160px;
    margin-top: 15px;
    background-color: @mainColor;
  }
</style>

<script>
  import {mapState} from 'vuex'
  import util from '../../util'

  export default {
    data() {
      return {
        menuList: [],
        index: null,
        dataList:[],
      }
    },
    computed: {
      ...mapState({
        env: state => state.env,
      }),
    },
    mounted: function () {
      this.loadMenu()
    },
    methods: {
      loadMenu() {
        let $this = this
        $this.menuList = util.getLocalStorage('menuList')
      },
    }
  }
</script>
