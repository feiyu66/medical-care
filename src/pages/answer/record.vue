<template>
  <div class="box">
      <wxc-minibar :title='title'
        background-color="#02b3ed"
        text-color="#ffffff"
        left-button="http://p87909xfg.bkt.clouddn.com/icon_back.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
      <div class="main">
        <div class="switch_box">
            <div class="switch_title">
                <text @click="lastWeek">上一周</text>
                <text @click="nextWeek">下一周</text>
            </div>
            <div class="details_box">
                <!-- <text>前七天记录{{recordTimes}}次</text> -->
                <div class="items" v-for="(item, index) in detailsData" :key='index'>
                    <text>{{item.publishTime.split('-')[1] + '-' + item.publishTime.split('-')[2]}}答题记录</text>
                    <text class="unrecorded" @click="openDialog" v-if="item.words == '未答题'">{{item.words}}</text>
                    <text class="recorded" @click="jump('recordDetails', item.datas.id)" v-if="item.words == '已答题'">{{item.words}}</text>
                </div>
            </div>
        </div>
      </div>
      <wxc-dialog title="提示"
        content="该用户当天未记录饮食日志。"
        :show="show"
        :single="true"
        :show-no-prompt="false"
        confirm-text="好的"
        main-btn-color="#02b3ed"
        @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
      </wxc-dialog>
  </div>
</template>
<script>
import { WxcMinibar, WxcDialog, Utils } from 'weex-ui';
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const storage = weex.requireModule('storage')
export default {
  components: { WxcMinibar, WxcDialog },
  data () {
    return {
      show: false,
      name: '丽丽',
      title: '的答题记录',
      pages: null,
      articlesList: [], // 答题记录
      result: [], // 所有的时间
      resultData: [], // 所有时间的记录
      endTime: '', // 今日日期
      detailsData: [], // 每周数据
      currentPage: 1,
      pagesize: 7,
      totalWeek: 0, // 共周数
      recordTimes: 0, // 记录次数
    }
  },
  created () {
    this.title = this.name + this.title
    this.gethistory()
  },
  methods: {
    gethistory: async function() {
      this.pages = null
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.birth = await storage_getItem('birth')
      console.log(this.mbrId)
      this.endTime = new Date(new Date().setDate(new Date().getDate()) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      this.getBetweenDateStr(this.birth, this.endTime)
      this.result.map(item => {
        let obj = {}
        obj.publishTime = item
        obj.datas = []
        obj.words = '未答题'
        this.resultData.push(obj)
      })
      let paramsA = {
        userId: this.mbrId,
        pageNum: 1
      };
      api.get(`${this.baseURL}health/articles/4?`, paramsA, data => {
        if (data.code == 200) {
          this.pages = data.data.pages
        }
        for(let i = 1; i <= this.pages; i++) {
          let params = {
            userId: this.mbrId,
            pageNum: i
          };
          api.get(`${this.baseURL}health/articles/4?`, params, data => {
            if (data.code == 200) {
              data.data.datas.map(item => {
                if (item.publishTime == null) { item.publishTime = ''}
                this.articlesList.push(item)
              })
              for(let i=0; i<this.resultData.length; i++) {
                let temTime = this.resultData[i].publishTime
                for(let j=0; j< this.articlesList.length; j++){
                  // console.log(this.articlesList)
                  if (temTime == this.articlesList[j].publishTime.split(' ')[0]) {
                      this.resultData[i]['datas'] = this.articlesList[j]
                      this.resultData[i]['words'] = '已答题'
                      break;
                  }
                }
              }
            }
          })
        }
        this.$forceUpdate();
        this.totalWeek = (Math.ceil(this.resultData.length / this.pagesize)) // 总周数
        this.detailsData = this.resultData.slice(this.resultData.length - this.pagesize * this.currentPage, this.resultData.length - this.pagesize * (this.currentPage - 1))
        this.detailsData = this.detailsData.reverse()
        console.log(this.detailsData)
      });
    },
    lastWeek () { // 上周
      if (this.currentPage >= this.totalWeek) {
        this.currentPage = this.totalWeek
      }
      this.currentPage += 1
      this.gethistory()
    },
    nextWeek () { // 下一周
      this.currentPage -= 1
      if (this.currentPage < 1) {
        this.currentPage = 1
      }
      this.gethistory()
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
    openDialog () {
      this.show = true
    },
    wxcDialogConfirmBtnClicked () {
      //此处必须设置，组件为无状态组件，自己管理
      this.show = false;
    },
    jump (path, id) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
          url: createLink(path),
          animated: "true"
      })
      storage.setItem('readId', id)
    },
    minibarLeftButtonClick () {},
  }
}
</script>
<style lang="less" scoped>
  .switch_title{
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 20px;
  }
  .items{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 10px;
  }
  .unrecorded{
    color: rgb(153, 153, 153);
  }
  .recorded{
    color: rgb(55, 199, 52);
  }
</style>
