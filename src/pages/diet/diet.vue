<template>
  <div class="box">
    <wxc-minibar :title='title'
        background-color="#02b3ed"
        text-color="#ffffff"
        left-button="http://doctor.dlcaring.com/icon_back_white.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <div class="main">
        <div class="records_box">
            <text>{{todayTime.split('-')[1] + '-' + todayTime.split('-')[2]}}(今日)饮食记录</text>
            <text class="unrecorded" @click="openDialog" v-if="recordWord == '未记录'">{{recordWord}}</text>
            <text class="recorded" @click="jump('dieteticDiary', todayTime)" v-if="recordWord == '已记录'">{{recordWord}}</text>
        </div>
        <div class="switch_box">
            <div class="switch_title">
                <text @click="lastWeek">上一周</text>
                <text @click="nextWeek">下一周</text>
            </div>
            <div class="details_box">
                <text>前七天记录{{recordTimes}}次</text>
                <div class="items" v-for="(item, index) in detailsData" :key='index'>
                    <text>{{item.recordTime.split('-')[1] + '-' + item.recordTime.split('-')[2]}}饮食记录</text>
                    <text class="unrecorded" @click="openDialog" v-if="item.words == '未记录'">{{item.words}}</text>
                    <text class="recorded" @click="jump('dieteticDiary', item.recordTime)" v-if="item.words == '已记录'">{{item.words}}</text>
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
        title: '的饮食记录',
        baseURL: "",
        mbrId: "",
        birth: '',
        todayTime: '',
        recordWord: '', // 是否记录
        result: [],
        resultData: [],
        detailsData: [], // 每周数据
        currentPage: 1,
        pagesize: 7,
        totalWeek: 0, // 共周数
        recordTimes: 0, // 记录次数
      }
  },
  created () {
    this.title = this.name + this.title
    this.dietaryRecords()
  },
  methods: {
      dietaryRecords: async function () {
        this.todayTime = ''
        this.resultData = []
        this.detailsData = []
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("newApiBase");
        this.birth = await storage_getItem('birth')
        console.log(this.mbrId)
        this.todayTime = new Date(new Date().setDate(new Date().getDate()) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
        this.getBetweenDateStr(this.birth, this.todayTime)
        let params = {
            pageNum: 1,
            userId: this.mbrId
        };
        this.result.map(item => {
            let obj = {}
            obj.recordTime = item
            obj.questions = []
            obj.words = '未记录'
            this.resultData.push(obj)
        })
        api.get(`${this.baseURL}health/diet/list?`, params, data => {
            console.log(data);
            for(let i=0; i<this.resultData.length; i++) {
                let temTime = this.resultData[i].recordTime
                for(let j=0; j<data.data.datas.length; j++){
                    if (temTime == data.data.datas[j].recordTime) {
                        this.resultData[i]['questions'] = data.data.datas[j]['questions']
                        this.resultData[i]['words'] = '已记录'
                        break;
                    }
                }
            }
            this.$forceUpdate();
        })
        this.totalWeek = (Math.ceil(this.resultData.length / this.pagesize)) // 总周数
        this.startTime = (this.resultData[this.resultData.length - 1]).recordTime // 今日饮食记录时间
        this.recordWord = (this.resultData[this.resultData.length - 1]).words // 今日饮食记录状态
        this.detailsData = this.resultData.slice(this.resultData.length - this.pagesize * this.currentPage, this.resultData.length - this.pagesize * (this.currentPage - 1))
        this.detailsData = this.detailsData.reverse()
      },
      lastWeek () { // 上一周
        if (this.currentPage >= this.totalWeek) {
            this.currentPage = this.totalWeek
        }
        this.currentPage += 1
        this.dietaryRecords()
      },
      nextWeek () { // 下一周
        this.currentPage -= 1
        if (this.currentPage < 1) {
            this.currentPage = 1
        }
        this.dietaryRecords()
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
      jump (path, data) {
        if(!path) return;
        const navigator = weex.requireModule('navigator')
        navigator.push({
            url: createLink(path),
            animated: "true"
        })
        storage.setItem('dataTime', data)
      },
      minibarLeftButtonClick () {},
  }
}
</script>
<style lang="less" scoped>
    .records_box{
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
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
