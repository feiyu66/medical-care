<template>
    <div class="box">
        <div class="statusbar" v-if="androidFakeStatusbar"></div>
        <div class="header">
            <div class="header-left"></div>
            <div class="header-title"><text class="header-title-text">工作台</text></div>
            <div class="header-right" @click="jump('message')">
                <image style="position: relative;" class="icon_news" :src="getImgPath('icon_news.png')"/>
                <Unread :num="news" style="left: 60px; top: 20px; border-width: 0px;"/>
            </div>
        </div>
        <div class="main">
            <div class="title">
                <div style="width: 712px; marginLeft: 20px;">
                    <div class="information">
                        <div class="Head_portrait">
                            <image class="icon_answer" :src="headImage"/>
                        </div>
                        <div class="information_right">
                            <text class="hospital">{{orgName}}</text>
                            <div class="name_position"><text class="name">{{name}}</text><text class="position">{{profession}}</text></div>
                        </div>
                    </div>
                    <div class="service">
                        <div class="people"><text style="font-weight: bold; font-size: 50px; color: rgb(153, 153, 153);">{{serverPeople}}</text><text class="explain">服务人数</text></div>
                        <div class="people" @click="jump('follow_up')"><text class="num">{{followupToday}}</text><text class="follow-up">今日随访</text></div>
                        <div class="people" @click="jump('no_follow_up')"><text class="num">{{overdueFollowup}}</text><text class="no_follow-up">逾期未随访</text></div>
                    </div>
                </div>
            </div>
            <div class="total">
                <div style="width: 690px; marginLeft: 30px; flex-direction: row; justify-content: space-between; flex-wrap: wrap;">
                    <div class="term" style="marginTop: 60px; background-color: rgb(227, 242, 254)" @click="jumpReview()"> 
                        <image style="position: relative;" class="recipe" :src="getImgPath('recipe.png')"/>
                        <Unread :num="review_unread" style="left: 100px;top: 10px;"/>
                        <text class="word">处方审核</text>
                    </div>
                    <div class="term" style="marginTop: 60px; background-color: rgb(255, 231, 231)" @click="jumpAssign()">
                        <image style="position: relative;" class="recipe" :src="getImgPath('allocation.png')"/>
                        <Unread :num="assign_unread" style="left: 100px;top: 10px;"/>
                        <text class="word">分配会员</text>
                    </div>
                    <div class="term" style="background-color: rgb(251, 235, 219)" @click="jump('warning')">
                        <image style="position: relative;" class="recipe" :src="getImgPath('anomaly.png')"/>
                        <Unread :num="warning_unread" style="left: 100px;top: 10px;"/>
                        <text class="word">异常预警</text>
                    </div>
                    <div class="term" style="background-color: rgb(224, 249, 231)" @click="jumpFocus()">
                        <image class="recipe" :src="getImgPath('emphasis.png')"/>
                        <text class="word">重点关注</text>
                    </div>
                    <!--<div class="term" style="background-color: rgb(239, 236, 255)" @click="tooltipData">
                        <image class="recipe" :src="getImgPath('invite.png')"/>
                        <text class="word">邀请复诊</text>
                    </div>
                    <div class="term" style="background-color: rgb(253, 239, 255)" @click="tooltipData">
                        <image class="recipe" :src="getImgPath('mass.png')"/>
                        <text class="word">群发消息</text>
                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Utils, WxcLoading } from "weex-ui";
import Unread from "../../components/Unread.vue";
import api from "../../shared/request";
import {
  getImgPath,
  createLink,
  printLog,
  storage_getItem,
  differenceOfArrays
} from "../../shared/utils";
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
const navigator = weex.requireModule("navigator");
const globalEvent = weex.requireModule("globalEvent");
export default {
  components: {
    Unread
  },
  data() {
    return {
      followupToday: 0, // 今日随访
      overdueFollowup: 0, // 逾期未随访
      serverPeople: 0, // 服务人数
      news: 0, // 消息
      mbrId: "",
      headImage: "",
      imageId: null,
      birth: "",
      oldApiBase: "",
      newApiBase: "",
      review: [],
      reviewNew: [],
      review_unread: 0,
      assign: [],
      assignNew: [],
      assign_unread: 0,
      warning: {},
      warning_unread: 0
    };
  },
  created() {
    printLog("PageHeight");
    printLog(Utils.env.getPageHeight());
    if (WXEnvironment.platform === "android") {
      this.androidFakeStatusbar = true;
      //this.listStyle = { height: Utils.env.getPageHeight() - 200 + "px" };
      //this.headerStyle = { height: 120 + 36 + "px" };
      //this.listStyle["margin-top"] = "130px";
    } else {
      this.androidFakeStatusbar = false;
      //this.listStyle = { height: Utils.env.getPageHeight() - 200 + "px" };
      //this.headerStyle = { height: 120 + "px" };
      //this.listStyle["margin-top"] = "94px";
    }

    this.drId = weex.config.drId ? weex.config.drId : "13900000009-dr"; //"13164228483-dr"; ////
    this.mbrId = weex.config.mbrId ? weex.config.mbrId : "13900000009-dr"; //"13164228483-dr"; ////
    this.name = weex.config.name ? weex.config.name : "秦美玲护士"; //"扁鹊"; ////
    this.imageId = weex.config.imageId ? weex.config.imageId : "0001-154193363244614"; //"秦美玲护士"; ////
    this.orgId = weex.config.orgId ? weex.config.orgId : "0018"; //"0001";
    this.birth = weex.config.birth ? weex.config.birth : "1988-07-08";
    this.orgName = weex.config.orgName
      ? weex.config.orgName
      : "中国人民解放军总医院";
    let profession = weex.config.profession ? weex.config.profession : "03";
    switch (profession) {
      case "01":
        this.profession = "医师";
        break;
      case "02":
        this.profession = "健管师";
        break;
      case "03":
        this.profession = "运动师";
        break;
      case "04":
        this.profession = "营养师";
        break;
      case "05":
        this.profession = "康复师";
        break;
      case "06":
        this.profession = "心理师";
        break;
      default:
        this.profession = "健管师";
    }
    this.accessOptions = weex.config.accessOptions
      ? weex.config.accessOptions
      : "01;02;03;04;05;06;07;08;09;10";
    this.oldApiBase = weex.config.oldApiBase
      ? weex.config.oldApiBase
      : "http://47.93.97.118:8088/dl_biz/rest/";
    this.newApiBase = weex.config.newApiBase
      ? weex.config.newApiBase
      : "http://m.dlcaring.com/";
    printLog(weex.config.mbrId);
    printLog(weex.config.drId);
    storage.setItem("mbrId", this.mbrId);
    storage.setItem("drId", this.drId);
    storage.setItem("orgId", this.orgId);
    storage.setItem("birth", this.birth);
    storage.setItem("accessOptions", this.accessOptions);
    storage.setItem("oldApiBase", this.oldApiBase);
    storage.setItem("newApiBase", this.newApiBase);

    printLog("this.headImage")
    this.headImage = getImgPath('logo.png')
    printLog(this.headImage)
    this.getHeadImage();
    

    this.workbenchInfoData();

    const refresh = new BroadcastChannel("refresh-homepage");
    refresh.onmessage = event => {
      printLog(event.data); // Assemble!
      this.workbenchInfoData();
    };
    globalEvent.addEventListener("refresh_homepage", res => {
      printLog(res);
      printLog("refresh_homepage");
      this.workbenchInfoData();
    });
    globalEvent.addEventListener("refresh_review", res => {
      printLog(res);
      printLog("refresh_review");
      const msg = new BroadcastChannel("refresh-reviewlist");
      msg.postMessage("yesterday!");
    });
  },
  methods: {
    getHeadImage() {
      api.get(
        `${this.oldApiBase}appdoctorservice/getheadimage.json?`,
        {
          imageId: this.imageId,
          isThumbnail: "0"
        },
        data => {
          printLog("getHeadImage")
          if(!data) {
            this.headImage = data.RESULT
          }
          printLog(data);
          
        }
      );
    },
    workbenchInfoData() {
      printLog(`${this.newApiBase}health/workbenchInfo`);
      api.get(
        `${this.newApiBase}health/workbenchInfo/1/${this.mbrId}`,
        {},
        data => {
          console.log(data);
          let datas = data.data;
          this.news = datas.news;
          this.serverPeople = datas.serverPeople;
          this.followupToday = datas.followupToday;
          this.overdueFollowup = datas.overdueFollowup;
        }
      );

      if (this.accessOptions.indexOf("06") > 0) {
        //审核权限
        this.getReview()
      }

      if (this.accessOptions.indexOf("05") > 0) {
        //分配权限
        this.getAssign()
      }

      this.getWarning()
    },
    getReview() {
      api.get(
        `${this.oldApiBase}appemrservice/getauditsportprescriptionlist.json?`,
        { orgId: this.orgId },
        data => {
          let reviewlist = data.sportPrescription2QueryList;
          printLog(this.reviewNew);
          if (reviewlist != null && reviewlist.length > 0) {
            this.review_unread = reviewlist.length;
          }else {
            this.review_unread = 0
          }
        }
      );
    },
    getAssign() {
      api.get(
        `${this.oldApiBase}iapptsmservice/getdistributegroupmembers.json?`,
        { orgId: this.orgId },
        data => {
          printLog(data.NOTDIS_LIST)
          let needAssignList = data.NOTDIS_LIST;
          if (needAssignList != null && needAssignList.length > 0) {
            printLog(needAssignList.length)
            this.assign_unread = needAssignList.length;
          }else {
            this.assign_unread = 0
          }
        }
      );
    },
    getWarning() {
      let params = {
          mbrId: this.mbrId
      };
      api.get(
        `${this.oldApiBase}appehrservice/getanomalyoverviewbydate.json?`,
        params,
        data => {
          let unread = data.EXCESS_LIMIT.length
            + data.TIME_TOOMUCH.length
            + data.BLOOD_EXCESS.length
            + data.BLOOD_SUGAR.length 
            + data.BLOOD_FAT.length;

            let warning = [];
            warning = warning.concat(data.EXCESS_LIMIT, data.TIME_TOOMUCH, data.BLOOD_EXCESS, data.BLOOD_SUGAR, data.BLOOD_FAT)
            //去重复
            warning = warning.filter((value, index, self) => self.indexOf(value) === index)
            this.warning_unread = warning.length
        }
      );
    },
    tooltipData() {
      modal.toast({ message: "模块建设中，敬请期待。", duration: 1 });
    },
    jumpReview() {
      if (this.accessOptions.indexOf("06") > 0) {
        navigator.push({
        url: createLink('review'),
        animated: "true"
      });
      } else {
        modal.toast({ message: "您没有审核权限", duration: 1 });
      }
    },
    jumpAssign() {
      if (this.accessOptions.indexOf("05") > 0) {
        messaging.navAssign();
      } else {
        modal.toast({ message: "您没有分配权限", duration: 1 });
      }
    },
    jumpFocus() {
      messaging.navFocus();
    },
    jump(path) {
      printLog("jumppath");
      printLog(createLink(path));
      if (!path) return;
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.statusbar {
  width: 750px;
  height: 36px;
  background-color: #02b3ed;
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
.icon_news {
  width: 40px;
  height: 46px;
}
.msg_unread {
  width: 30px;
  height: 30px;
  background-color: #ff2a2a;
  border-width: 3px;
  border-color: #ffffff;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.msg_unread_text {
  color: #ffffff;
  font-size: 18px;
}
.main {
  flex: 1;
  background-color: rgb(238, 238, 238);
}
.title {
  background-color: rgb(255, 255, 255);
}
.information {
  flex-direction: row;
  align-items: center;
  margin-top: 48px;
  padding-bottom: 48px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
}
.Head_portrait {
  margin-left: 50px;
}
.icon_answer {
  width: 130px;
  height: 130px;
  border-radius: 999px;
}
.information_right {
  flex-direction: column;
  margin-left: 30px;
}
.hospital {
  font-size: 36px;
  color: rgb(51, 51, 51);
}
.name_position {
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
}
.name {
  font-size: 36px;
  color: rgb(51, 51, 51);
}
.position {
  margin-left: 10px;
  padding: 3px 10px;
  // width: 80px;
  // height: 28px;
  font-size: 20px;
  // text-align: center;
  // line-height: 28px;
  color: rgb(255, 255, 255);
  background-image: linear-gradient(to right, #895000, #e9a23f);
  border-radius: 10px;
}
.service {
  flex-direction: row;
  justify-content: space-between;
  height: 180px;
}
.people {
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  border-right-color: rgb(238, 238, 238);
  border-right-width: 2px;
}
.people:last-child {
  border: none;
}
.num {
  font-size: 50px;
  color: rgb(2, 179, 237);
  font-weight: bold;
}
.explain,
.follow-up,
.no_follow-up {
  font-size: 30px;
  margin-top: 10px;
}
.explain {
  color: rgb(153, 153, 153);
}
.follow-up,
.no_follow-up {
  color: rgb(2, 179, 237);
}
.total {
  height: 690px;
  margin-top: 20px;
  background-color: rgb(255, 255, 255);
}
.term {
  width: 335px;
  height: 150px;
  margin-top: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.recipe {
  width: 94px;
  height: 94px;
}
.menu_unread {
  width: 40px;
  height: 40px;
  background-color: #ff2a2a;
  color: #ffffff;
  border-width: 3px;
  border-color: #ffffff;
  border-radius: 999px;
  font-size: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.menu_unread_text {
  color: #ffffff;
  font-size: 18px;
}
.word {
  font-size: 36px;
  margin-left: 20px;
  color: rgb(51, 51, 51);
}
</style>


