<template>
    <div class="box">
         <wxc-minibar title='消息'
            background-color="#02b3ed"
            text-color="#ffffff"
            :left-button="getImgPath('icon_back_white.png')"
            :use-default-return="false"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <div class="main">
                <div v-if="isEmptyList" class="reserror">
                    <text class="tootipWord">暂无消息~</text>
                </div>
                <list class="scroller" :style="listStyle" v-else>
                    <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'"> 
                    <!-- <div class="indicator-text">
                        <image class="down" :src="getImgPath('down.png')"/> 
                        <text style="font-size: 30px;color: #999999;">正在刷新...</text>
                    </div> -->
                    <loading-indicator class="indicator"></loading-indicator>
                    </refresh>
                    <cell class="message" v-for="(item, index) in messageData" :key="index">
                        <div class="msg_left">
                            <image v-if="item.isOpened == 0" class="unread" :src="getImgPath('unread.png')"/>
                            <image v-if="item.isOpened == 1" class="unread" :src="getImgPath('read.png')"/>  
                        </div>
                        <div class="mas_right">
                            <div class="remind-data">
                                <text class="tooltip">{{item.title}}</text>
                                <text class="data">{{item.createTime}}</text>
                            </div>
                            <div class="specific">
                                <text class="too">{{item.mbrName}}{{item.content}}</text>
                            </div>
                            <div class="come">
                                <text class="word" @click="jump(item.msgId, item.mbrId, item.mbrName)">去看看</text>
                                <image class="return" :src="getImgPath('arrow_right_blue.png')"/>
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
import { Utils, WxcMinibar } from "weex-ui";
import { createLink, printLog, storage_getItem } from "../../shared/utils";
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
      isEmptyList: false,
      messageData: [],
      pageNum: 1,
      downFlag: true
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
    jump(msgId, mbrId, mbrName) {
      if (WXEnvironment.platform != "Web") {
        messaging.navHealthFilePrescription(mbrId, mbrName);
      }
      api.get(`${this.baseURL}/health/news/1?`, { msgId: msgId }, data => {
        printLog(data);
      });
      setTimeout(() => {
        //提交之后立刻请求不会有变化，要等等服务器
        printLog("getnewlist");
        this.pageNum = 1;
        this.defaultData();
      }, 1000);
    },
    onrefresh(event) {
      this.refreshing = true;
      this.pageNum = 1;
      this.defaultData();
    },
    onloading(event) {
      printLog("onloading");
      this.loadinging = true;
      this.pageNum += 1;
      this.defaultData();
    },
    defaultData: async function() {
      this.drId = await storage_getItem("drId");
      this.baseURL = await storage_getItem("newApiBase");
      // this.date = await storage_getItem("date");
      let params = {
        pageNum: this.pageNum
      };
      api.get(`${this.baseURL}health/news/1/${this.drId}?`, params, data => {
        //console.log(data);
        printLog(this.pageNum);
        if (this.pageNum == 1) {
          this.messageData = [];
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
            let newDate = new Date(item.createTime);
            // 开始时间
            let Month = newDate.getMonth() + 1;
            let Data = newDate.getDate();
            if (Month < 10) {
              // 月
              Month = "0" + Month;
            }
            if (Data < 10) {
              // 日
              Data = "0" + Data;
            }
            item.createTime = newDate.getFullYear() + "-" + Month + "-" + Data;
            this.messageData.push(item);
          });
          this.downFlag = true;
        }
      });
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
      //modal.toast({ message: "click rightButton!", duration: 1 });
    }
  }
};
</script>
<style>
.left-button {
  width: 40px;
  height: 40px;
}
.weex-list-inner,
.weex-scroller-inner,
.weex-waterfall-inner {
  height: 1244px;
}
</style>
<style lang="less" scoped>
.main {
  flex: 1;
  background-color: rgb(238, 238, 238);
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
.message {
  flex-direction: row;
  background-color: rgb(255, 255, 255);
  padding-top: 20px;
}
.msg_left {
  flex: 1;
  flex-direction: row;
  justify-content: center;
}
.unread {
  width: 75px;
  height: 75px;
}
.mas_right {
  flex: 4;
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
}
.remind-data {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.tooltip {
  font-size: 32px;
  color: rgb(51, 51, 51);
}
.data {
  font-size: 26px;
  color: rgb(102, 102, 102);
  margin-right: 30px;
}
.specific {
  width: 550px;
  margin-top: 30px;
  flex-wrap: wrap;
}
.too {
  font-size: 26px;
  color: rgb(102, 102, 102);
}
.come {
  margin-top: 30px;
  padding-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
}
.word {
  font-size: 28px;
  color: rgb(2, 179, 237);
}
.return {
  width: 20px;
  height: 24px;
  margin-left: 20px;
}
.reserror {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tootipWord {
  color: rgb(153, 153, 153);
  font-size: 30px;
}
</style>

