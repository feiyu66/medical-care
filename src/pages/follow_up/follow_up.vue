<template>
    <div class="box">
        <div class="header">
            <div class="header-left" @click="toBack">
                <image class="header-item-return" :src="getImgPath('icon_back_white.png')"/>
            </div>
            <div class="header-title"><text class="header-title-text">{{datestr}}随访计划 ({{news}})</text></div>
            <div class="header-right" @click='showCalendarModel'>
                <image class="date" :src="getImgPath('date.png')"/>
            </div>
        </div>
        <div class="main" style="position: relative;">
                <div v-if="isEmptyList" class="reserror">
                  <text class="middle">没有需要随访的用户~</text>
                </div>
                <list :style="listStyle" v-else>
                    <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
              <!-- <div class="indicator-text">
                <image class="down" :src="getImgPath('down.png')"/> 
                <text style="font-size: 30px;color: #999999;">正在刷新...</text>
              </div> -->
              <loading-indicator class="indicator"></loading-indicator>
                    </refresh>
                    <cell class="item-box" v-for="(item, index) in followData" :key='index' style="height: 180px; marginTop: 0;" @click="jump(item.mbrId, item.name, index)">
                        <div class="list" style="width: 712px; marginLeft: 38px;">
                            <div class="item-dl">
                                <image class="logo" :src="getImgPath('logo.png')" alt="" style="position: relative;"></image>
                                <image v-if="item.isPunched" class="isPunched" :src="getImgPath('punched.png')" alt=""></image>                             
                            </div>
                            <div class="item-entry">
                                <div class="entry-border">
                                    <div class="message">
                                        <text class="msg">{{item.name}}</text>
                                        <text class="msg">{{item.sex}}</text>
                                        <text class="msg">{{item.age}}岁</text>
                                    </div>
                                    <text class="record">建档：{{item.mbrCreateTime.split(' ')[0]}}</text>
                                </div>
                                <div class="entry-mark">
                                    <text class="disease">{{item.managerTarget}}</text>
                                    <div class="details">
                                        <text class="ellipsis">{{item.group}}</text>
                                        <image class="emphasis_red" :src="getImgPath('emphasis_red.png')" alt=""></image>
                                    </div>
                                </div>
                                <div class="ols">
                                    <text class="each_item">{{item.weeks}}周/</text>
                                    <text class="span mg-r">{{item.weekCount}}周</text>
                                    <text class="each_item mL">最近：</text>
                                    <text class="span">{{Math.round(item.validTime)}}</text>
                                    <text class="each_item mg-r">/{{item.planTime}}分钟</text>
                                    <text class="each_item">{{item.recentSportsTime.split(' ')[0]}}</text>
                                </div>
                            </div>
                        </div>
                    </cell>
                    <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                <!-- <loading-indicator class="indicator"></loading-indicator> -->
                <div class="indicator-text">
                    <image v-if="downFlag" class="down" :src="getImgPath('upward.png')"/> 
                    <text style="color: #999999;">{{loadingWord}}</text>
                </div>
                    </loading>
                </list>

        </div>
    </div>
</template>
<script>
import { Utils } from "weex-ui";
import {
  createLink,
  calcWeeksBetween,
  printLog,
  storage_getItem
} from "../../shared/utils";
import api from "../../shared/request";
const DatePicker = weex.requireModule("datepicker");
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  data() {
    return {
      loadinging: false,
      refreshing: false,
      loadingWord: "加载更多...",
      downFlag: true,
      news: 0,
      date: "",
      datestr: "今日",
      isEmptyList: false,
      followData: [],
      pageNum: 1,
      startTime: "",
      mbrId: "",
      baseURL: ""
    };
  },
  created() {
    //
    if (WXEnvironment.platform == "Web") {
      this.listStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 90 + "px"
      };
    } else {
      this.listStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.dataTime();
  },
  watch: {
    date(value) {
      printLog("date changed");
      let today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      if (this.date == today) {
        this.datestr = "今日";
      } else {
        this.datestr = this.date + " ";
      }
      this.news = 0;
      this.defaultData();
    }
  },
  methods: {
    jump(mbrId, mbrName, index) {
      if (WXEnvironment.platform != "Web") {
        messaging.navHealthFile(mbrId, mbrName);
      }
      api.get(
        `${this.baseURL}/health/punch/${this.drId}/${mbrId}?`,
        {},
        data => {
          printLog(data);
        }
      );
      setTimeout(() => {
        //提交之后立刻请求不会有变化，要等等服务器
        console.log("getnewlist");
        this.pageNum = 1;
        this.defaultData();
      }, 2000);
    },
    onrefresh(event) {
      this.refreshing = true;
      this.pageNum = 1;
      this.defaultData();
    },
    onloading(event) {
      this.loadinging = true;
      this.pageNum += 1;
      this.defaultData();
    },
    defaultData: async function() {
      this.drId = await storage_getItem("drId");
      this.baseURL = await storage_getItem("newApiBase");
      let params = {
        date: this.date,
        pageNum: this.pageNum
      };
      api.get(`${this.baseURL}health/followup/${this.drId}?`, params, data => {
        console.log(data);
        printLog(this.pageNum);
        if (this.pageNum == 1) {
          this.followData = [];
        }
        if (this.loadinging) this.loadinging = false;
        if (this.refreshing) this.refreshing = false;
        let datas = data.data.datas;
        if (datas.length == 0) {
          if (this.pageNum == 1) {
            this.isEmptyList = true;
          } else {
            this.pageNum -= 1;
            this.downFlag = false;
            this.loadingWord = "已加载完毕 ~";
          }
        } else {
          this.isEmptyList = false;
          datas.map(item => {
            if (item.managerTarget == "" || item.managerTarget == null) {
              item.managerTarget = "无";
            }
            if (item.recentSportsTime == null) {
              item.recentSportsTime = "";
            } else {
              item.recentSportsTime = item.recentSportsTime.split(" ")[0];
            }
            if (item.mbrCreateTime == null) {
              item.mbrCreateTime = "";
              item.weeks = "";
            } else {
              item.mbrCreateTime = item.mbrCreateTime.split(" ")[0];
              let created = new Date(item.mbrCreateTime);
              item.weeks = calcWeeksBetween(new Date(), created);
            }
            this.followData.push(item);
          });
          this.news = data.data.total;
          this.downFlag = true;
        }
      });
    },
    dataTime() {
      // yyyy-MM-dd
      let today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      this.date = today;
    },
    showCalendarModel() {
      DatePicker.pickDate(this.date, res => {
        if (res != null) {
          printLog(res);
          if (new Date(res) > new Date()) {
            modal.toast({ message: "不能选择未来的日期", duration: 1 });
          } else {
            this.date = res;
          }
        }
      });
    },
    toBack() {
      const msg = new BroadcastChannel("refresh-homepage");
      msg.postMessage("yesterday!");
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    }
  }
};
</script>
<style>
.weex-list-inner,
.weex-scroller-inner,
.weex-waterfall-inner {
  height: 1244px;
}
</style>

<style lang="less" scoped>
.main {
  flex: 1;
  background-color: #eeeeee;
}
.header {
  width: 750px;
  height: 100px;
  background-color: #02b3ed;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-left {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-title {
  flex: 4;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-right {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-title-text {
  font-size: 36px;
  color: #fff;
}
.header-item-return {
  width: 50px;
  height: 50px;
}
.date {
  width: 42px;
  height: 42px;
}
.scroller {
  background-color: #eeeeee;
}
.tootipWord {
  color: rgb(153, 153, 153);
  font-size: 30px;
}
.refresh {
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.loading {
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.indicator {
  width: 50px;
  height: 50px;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #000; /*android 默认红色 ios 默认白色*/
}
.indicator-text {
  height: 50px;
  margin-top: 15px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.down {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.item-box {
  background-color: rgb(255, 255, 255);
  flex-direction: row;
}
.list {
  border-bottom-color: rgb(238, 238, 238);
  border-bottom-width: 1px;
  flex-direction: row;
}
.item-box:last-child .list {
  border: none;
}
.item-dl {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 110px;
  height: 110px;
}
.isPunched {
  position: absolute;
  right: 20px;
  top: 40px;
  width: 28px;
  height: 28px;
}
.item-entry {
  flex: 4;
  height: 180px;
  display: -webkit-flex;
  flex-direction: column;
  margin-left: 0;
}
.entry-border {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.message {
  flex-direction: row;
  align-items: center;
}
.msg {
  font-size: 30px;
  margin-right: 15px;
  color: rgb(51, 51, 51);
}
.record {
  font-size: 26px;
  color: rgb(102, 102, 102);
  margin-right: 30px;
}
.entry-mark {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.disease {
  width: 300px;
  overflow: hidden;
  lines: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 26px;
  color: rgb(2, 179, 237);
}
.details {
  flex-direction: row;
  align-items: center;
  margin-right: 30px;
}
.ellipsis {
  width: 120px;
  font-size: 22px;
  color: rgb(102, 102, 102);
  margin-right: 10px;
  overflow: hidden;
  lines: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.emphasis_red {
  width: 55px;
  height: 55px;
}
.ols {
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.each_item {
  font-size: 24px;
  color: rgb(153, 153, 153);
}
.mL {
  padding-left: 24px;
  border-left-width: 1px;
  border-left-color: rgb(153, 153, 153);
}
.span {
  font-size: 30px;
  color: rgb(21, 186, 255);
}
.mg-r {
  margin-right: 24px;
}
.reserror {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.middle {
  color: #999999;
  font-size: 32px;
}
</style>

