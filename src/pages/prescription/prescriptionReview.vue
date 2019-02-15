<template>
  <div class="box">
    <wxc-minibar title='待审核列表'
      background-color="#02b3ed"
      text-color="#ffffff"
      :left-button="getImgPath('icon_back_white.png')"
      :use-default-return="false"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
     <div class="main" style="position: relative;">
      <div v-if="!reviewlist.length" class="reserror" :style="scrollStyle">
          <text class="tootipWord">暂无处方待审核用户~</text>
      </div>
      <list v-else :style="scrollStyle">
        <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'"> 
          <!-- <div class="indicator-text">
              <image class="down" :src="getImgPath('down.png')"/> 
              <text style="font-size: 30px;color: #999999;">正在刷新...</text>
          </div> -->
          <loading-indicator class="indicator"></loading-indicator>
        </refresh>
        <cell class="items_box" v-for="(item, index) in reviewlist" :key='index' @click="jump(item.id, item.mbrId, item.mbrName)">
          <div class="items">
            <image class="logo_img" :src="getImgPath('logo.png')" style="position: relative;"/>
            <image class="red_dot" :src="getImgPath('red_dot.png')" v-if="item.unread"/>
            <div class="message">
              <div class="msg">
                <div class="name_sex_age">
                  <text class="name">{{item.mbrName}}</text>
                  <text class="sex">{{item.mbrSex}}</text>
                  <text class="ages">{{item.mbrAge}}岁</text>
                </div>
                <text class="tooltip">待审核</text>
              </div>
              <text class="data_time">处方生成时间：{{item.createdTime.split(' ')[0]}}</text>
            </div>
          </div>
        </cell>
      </list>
    </div>
  </div>
</template>
<script>
import { WxcMinibar, WxcTabPage, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from "../../shared/utils";
//  运动处方
import exercisePrescription from '../../components/toExamine/exercisePrescription.vue'
// 饮食处方
import dietPrescription from '../../components/toExamine/dietPrescription.vue'
import api from "../../shared/request";
import Config from '../../shared/toExamine'
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const messaging = weex.requireModule("MessagingModule");
const globalEvent = weex.requireModule("globalEvent");
export default {
  components: {
    WxcMinibar, WxcTabPage, exercisePrescription, dietPrescription
  },
  data() {
    return {
      refreshing: false,
      oldApiBase: "",
      orgId: "",
      reviewlist: [],
      reviewedDic: {},
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      tabList: [],
      demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tabPageHeight: 1334,
      num: 0
    };
  },
  created() {
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
    this.appemrserviceData();
    printLog("Message")
    printLog(Utils.env.getPageHeight())
    this.dietStyle = { width: "750px", height: Utils.env.getPageHeight()  + "px" };
    if (WXEnvironment.platform == "Web") {
        this.tabPageHeight = Utils.env.getPageHeight() - 88;
    }else {
        this.tabPageHeight = Utils.env.getPageHeight()+88;
    }
    this.appemrserviceData();

    const refresh = new BroadcastChannel("refresh-reviewlist");
    refresh.onmessage = event => {
      printLog(event.data); // Assemble!
      this.appemrserviceData();
    };
    globalEvent.addEventListener("refresh_review", res => {
      printLog(res);
      printLog("refresh_review");
      this.appemrserviceData();
    });
  },
  methods: {
    jump(pId, mbrId, mbrName) {
      this.reviewedDic[pId] = true
      console.log(this.reviewedDic)
      storage.setItem(this.drId + "reviewedDic", JSON.stringify(this.reviewedDic) , (res)=>{
        if (res.result == "success") {
          messaging.navPrescription(pId, mbrId, mbrName);
          this.appemrserviceData();       
        }
      });
    },
    onrefresh(event) {
      this.refreshing = true;
      setTimeout(() => {
        this.appemrserviceData();
        this.refreshing = false;
      }, 2000);
    },
    appemrserviceData: async function() {
      this.oldApiBase = await storage_getItem("oldApiBase");
      this.orgId = await storage_getItem("orgId");
      this.drId = await storage_getItem("drId");
      try {
        let reviewedstr = await storage_getItem(this.drId + "reviewedDic");
        this.reviewedDic = JSON.parse(reviewedstr);
      } catch (e) {
        this.reviewedDic = {};
      }
      console.log("before request")
      console.log(this.reviewedDic)
      console.log(this.orgId, this.oldApiBase);
      api.get(
        `${this.oldApiBase}appemrservice/getauditsportprescriptionlist.json?`,
        { orgId: this.orgId },
        data => {
          console.log(data);
          let reviewlist = data.sportPrescription2QueryList;
          if (!reviewlist) {
            this.reviewlist = []
          }else {
            reviewlist.map(item => {
            if (item.mbrSex == "01") {
              item.mbrSex = "男";
            } else {
              item.mbrSex = "女";
            }
            let key = item.id
            if (this.reviewedDic[key] == true) {
              item.unread = false
            }else {
              item.unread = true
            }
          });
          this.reviewlist = reviewlist
          }
        })
    },
    minibarLeftButtonClick() {
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
  .tab-title-list {
    justify-content: center;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
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
.items_box {
  background-color: rgb(255, 255, 255);
}
.items {
  margin-left: 30px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
  margin-top: 38px;
  padding-bottom: 38px;
}
.logo_img {
  width: 90px;
  height: 90px;
}
.red_dot {
  position: absolute;
  left: 65px;
  top: 5px;
  width: 20px;
  height: 20px;
}
.message {
  flex: 1;
  height: 90px;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
}
.msg {
  flex-direction: row;
  justify-content: space-between;
}
.name_sex_age {
  flex-direction: row;
  align-items: center;
}
.name,
.sex,
.ages {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.sex {
  margin-left: 50px;
}
.ages {
  margin-left: 20px;
}
.tooltip {
  font-size: 28px;
  margin-right: 20px;
  color: rgb(2, 179, 237);
}
.data_time {
  font-size: 26px;
  color: rgb(102, 102, 102);
}
</style>
