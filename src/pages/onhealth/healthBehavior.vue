<template>
  <div class="box">
    <wxc-minibar :title='title'
        background-color="#02b3ed"
        text-color="#ffffff"
        left-button="http://doctor.dlcaring.com/icon_back_white.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
        <div class="behavior_boxs">
            <text class="behavior_num">健康行为得分</text>
        </div>
        <div class="echarts">
            <bmchart :options="$format(polar)" @finish='finish' ref="chartVm" style="width: 750px; height: 400px;"></bmchart>
        </div>
        <div class="behavior_items">
          <text class="data_time">{{selectedDate[0]}}</text>
          <div class="score_boxs">
            <image class="one_sports" :src="getImgPath('one_sports.png')"/>
            <text class="score_word">运动得分：{{Math.round(100 * sportWeekSum / 7)}}</text>
          </div>
          <div class="score_boxs">
            <image class="one_sports" :src="getImgPath('two_diet.png')"/>            
            <text class="score_word">饮食得分：{{100 * dietWeekSum / 7}}</text>
          </div>
          <div class="score_boxs">
            <image class="one_sports" :src="getImgPath('three_monitor.png')"/>            
            <text class="score_word">运动监测得分：{{100 * measureWeekSum / 7}}</text>
          </div>
          <div class="score_boxs">
            <image class="one_sports" :src="getImgPath('four_book.png')"/>            
            <text class="score_word">今日必读得分：{{100 * mustreadWeekSum / 7}}</text>
          </div>
        </div>
    </scroller>
  </div>
</template>
<script>
import bmchart from "../../components/bmchart.vue";
import { WxcMinibar, WxcTabPage, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
import vueplugin from "../../shared/vueplugin";
Vue.use(vueplugin);
export default {
  components: {
    WxcMinibar, bmchart
  },
  data () {
      return {
        baseURL: "",
        mbrId: "",
        startData:'',
        endData: '',
        page: 1,
        pageNum: 6,
        name: '许嵩',
        title: '',
        selectedDate: [],
        result: [],
        evaluations: [],
        sportWeekSum: null, // 运动
        dietWeekSum: null, // 饮食
        measureWeekSum: null, // 体重检测
        mustreadWeekSum: null, // 今日必读
        polar: {
          xAxis: {
              type: 'category',
              // axisLine: {
              //   show: false 
              // },
              axisTick: {
                  show: false
              },
              boundaryGap: false,
              // splitLine: {
              //   show: true  
              // },
              data: []
          },
          yAxis: {
              type: 'value',
              axisLine: { // 是否显示坐标轴轴线
                  show: false
              },
              axisTick: { // 是否显示刻度
                  show: false
              },
          },
          dataZoom: [
            {
              type: 'slider',
              show: false,
              realtime: false,
              start: 0,
              end: 10,
              handleSize: 8,
              height: 0,
            },
            {
              type: 'inside',
              realtime: false,
            },
          ],
          series: []
        }
      }
  },
  created () {
    this.title = this.name + '的健康行为'
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 90 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    if (WXEnvironment.platform == "Web") {
      this.selectedDate = ["2018-09-02"]; // // ["2018-5-15"];
    } else {
      this.selectedDate = [today];
    }
    printLog(this.selectedDate);
  },
  watch: {
    selectedDate (value) {
        this.getChartData();
    }
  },
  methods: {
    getChartData: async function () {
      printLog("getChartData");
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.startData = new Date(new Date().setDate(new Date().getDate() - this.pageNum * (this.page + 1)) - new Date().getTimezoneOffset() * 60000)
        .toISOString().slice(0, 10);
      this.endData = new Date(new Date().setDate(new Date().getDate() - this.pageNum * this.page) - new Date().getTimezoneOffset() * 60000)
        .toISOString().slice(0, 10);
      this.getBetweenDateStr(this.startData, this.endData)
      console.log(this.mbrId, this.baseURL)
      this.evaluations = []
      let mbrId = '13690000000-mbr'
      let params = {
        start: this.startData,
        end: this.endData
      }
      this.result.map(item => {
        let obj = {
          createTime: item,
          score: 0
        }
        this.evaluations.push(obj)
      })
      let xAxisData = []
      let seriesData = []
      api.get(`${this.baseURL}health/evaluations/${mbrId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          this.evaluations.map((list, i) => {
            let time = list.createTime
            data.data.map(item => {
              if (item.createTime == time) {
                this.evaluations[i]['score'] = item.score
              }
            })
            xAxisData.push(list.createTime)
            seriesData.push(list.score)
          })
          this.polar.xAxis.data = xAxisData
          this.polar.series = [
            {
                data: seriesData,
                type: 'line',
                smooth: true,
                itemStyle : { // 显示数据
                  normal: {
                      color:'#02B3ED'
                  }
                }
            }
          ]
          let datas = data.data[data.data.length -1 ]
          console.log(datas, 'daaa')
          for(let i in datas) {
            if (i == 'sportWeekSum') {
              this.sportWeekSum = datas[i] // 运动
            } else if (i == 'dietWeekSum') {
              this.dietWeekSum = datas[i] // 饮食
            } else if (i == 'measureWeekSum') {
              this.measureWeekSum = datas[i] // 体重检测
            } else if (i == 'mustreadWeekSum') {
              this.mustreadWeekSum = datas[i] // 今日必读
            }
          }
          if (WXEnvironment.platform == "Web") {
            this.$refs.chartVm.setOption(this.$format(this.polar), true)
          }
          if (WXEnvironment.platform == "Web") {
            //web环境当图表被点击
              this.$refs.chartVm.myChart.on("click", params => {
                console.log(1111111111111)
                data.data.map(item => {
                  console.log(item, 'item')
                  if (params.name == item.createTime) {
                    this.sportWeekSum = item.sportWeekSum // 运动
                    this.dietWeekSum = item.dietWeekSum // 饮食
                    this.measureWeekSum = item.measureWeekSum // 体重检测
                    this.mustreadWeekSum = item.mustreadWeekSum // 今日必读
                    console.log(item.dietWeekSum)
                  }
                })
              })
          }
        }
      })
    },
    getBetweenDateStr (start,end){
      this.result = []
      var beginDay = start.split("-");
      var endDay = end.split("-");
      var diffDay = new Date();
      var dateList = new Array;
      var i = 0;
      diffDay.setDate(beginDay[2]);
      diffDay.setMonth(beginDay[1]-1);
      diffDay.setFullYear(beginDay[0]);
      this.result.push(start);
      while(i == 0){
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
        if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
        this.result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
        if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;}
      };
    },
    minibarLeftButtonClick () {}
  }
}
</script>
<style lang="less" scoped>
  .scroller{
    background-color: rgb(238, 238, 238);
  }
  .behavior_boxs{
    flex-direction: row;
    justify-content: center;
    background-color: rgb(255, 255, 255);
  }
  .behavior_num{
    font-size: 32px;
    color: rgb(2, 179, 237);
    margin-top: 50px;
    margin-bottom: 10px;
  }
  .echarts{
    height: 400px;
    background-color: rgb(255, 255, 255);
  }
  .behavior_items{
    margin-top: 20px;
    background-color: rgb(255, 255, 255);
  }
  .data_time{
    margin-top: 25px;
    padding-bottom: 25px;
    padding-left: 30px;
    font-size: 30px;
    color:rgb(2, 179, 237);
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .score_boxs{
    margin-left: 30px;
    margin-right: 30px;
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    margin-top: 30px;
    padding-bottom: 30px;
  }
  .score_boxs:last-child{
    border-bottom: none;
  }
  .one_sports{
    width: 47px;
    height: 47px;
  }
  .score_word{
    font-size: 28px;
    color:rgb(51, 51, 51);
    margin-left: 30px;
  }
</style>
