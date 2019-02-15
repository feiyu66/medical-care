<template>
    <div class="box">
        <wxc-minibar :title='title'
            background-color="#02b3ed"
            text-color="#ffffff"
            :left-button="getImgPath('icon_back_white.png')"
            :use-default-return="false"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <div class="main" style="position: relative;">
                <div v-if="isEmptyList" class="reserror">
                  <text class="middle">暂无逾期未随访用户~</text>
                </div>
                <list :style="listStyle" v-else>
                    <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
              <!-- <div class="indicator-text">
                <image class="down" :src="getImgPath('down.png')"/> 
                <text style="font-size: 30px;color: #999999;">正在刷新...</text>
              </div> -->
              <loading-indicator class="indicator"></loading-indicator>
                    </refresh>
                    <cell class="item-box" v-for="(item, index) in nofollowData" :key='index' style="height: 180px; marginTop: 0;" @click="jump(item.mbrId, item.name, index)">
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
                                    <text class="record">建档：{{item.mbrCreateTime}}</text>
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
                                    <text class="each_item">{{item.recentSportsTime}}</text>
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
import { WxcMinibar, Utils } from "weex-ui";
import {
  createLink,
  printLog,
  storage_getItem,
  calcWeeksBetween
} from "../../shared/utils";
import api from "../../shared/request";
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  components: { WxcMinibar },
  data() {
    return {
      loadinging: false,
      refreshing: false,
      loadingWord: "加载更多...",
      downFlag: true,
      title: "逾期未随访",
      isEmptyList: false, // 无数据提示
      nofollowData: [],
      pageNum: 1,
      mbrId: "",
      baseURL: ""
    };
  },
  created() {
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
    this.defaultData();
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
    defaultData: async function() {
      this.drId = await storage_getItem("drId");
      this.baseURL = await storage_getItem("newApiBase");
      let params = {
        pageNum: this.pageNum
      };
      api.get(
        `${this.baseURL}health/overdueFollowup/${this.drId}?`,
        params,
        data => {
          console.log(data);
          if (this.pageNum == 1) {
            this.nofollowData = [];
          }
          if (this.loadinging) this.loadinging = false;
          if (this.refreshing) this.refreshing = false;
          let datas = data.data.datas;
          if (datas.length == 0) {
            if (this.pageNum == 1) {
              this.title = "逾期未随访 (0)";
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
              this.nofollowData.push(item);
            });
            this.title = `逾期未随访 (${data.data.total})`;
            this.downFlag = true;
          }
        }
      );
    },
    onloading(event) {
      this.loadinging = true;
      this.pageNum += 1;
      this.defaultData();
    },
    onrefresh(event) {
      this.refreshing = true;
      this.pageNum = 1;
      this.defaultData();
    },
    minibarLeftButtonClick() {
      const msg = new BroadcastChannel("refresh-homepage");
      msg.postMessage("yesterday!");
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  flex: 1;
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



