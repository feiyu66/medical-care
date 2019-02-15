<template>
    <div class="box">
        <wxc-minibar title='异常预警'
            background-color="#02b3ed"
            text-color="#ffffff"
            :left-button="getImgPath('icon_back_white.png')"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <div class="main">
            <div class="data">
                <div class="date">
                    <text @click="switchTag(index)" :class="[arrayIndex[0].selected == index ? 'on' : '']" v-for="(item, index) in datetag"  :key="index" class="wordData">{{item}}</text>
                </div>
                <div class="main-date">
                    <text class="calendar" @click='showCalendarModel'>{{date}}</text>
                </div>
            </div>
            <div style="height: 20px; backgroundColor: #eeeeee;"></div>
            <list class="warning" :style="listStyle">
                <cell style="position: relative;" class="item" @click="jumpExcessLimit()">
                    <image class="heart" :src="getImgPath('heart.png')"/>
                    <text style="position: absolute; top: 0; left: 0;" class="warningWord">心率超警戒（{{EXCESS_LIMIT.length}}）</text>
                </cell>
                <cell style="position: relative;" class="item" @click="jumpTimeTooMuch()">
                    <image class="heart" :src="getImgPath('exercise.png')"/>
                    <text style="position: absolute; top: 0; left: 0;" class="warningWord">运动过量（{{TIME_TOOMUCH.length}}）</text>
                </cell>
                <cell style="position: relative;" class="item" @click="jumpBloodExcess()">
                    <image class="heart" :src="getImgPath('bp.png')"/>
                    <text style="position: absolute; top: 0; left: 0;" class="warningWord">血压异常（{{BLOOD_EXCESS.length}}）</text>
                </cell>
                <cell style="position: relative;" class="item" @click="jumpBloodSugar()">
                    <image class="heart" :src="getImgPath('glu.png')"/>
                    <text style="position: absolute; top: 0; left: 0;" class="warningWord">血糖异常（{{BLOOD_SUGAR.length}}）</text>
                </cell>
                <cell style="position: relative;" class="item" @click="jumpBloodFat()">
                    <image class="heart" :src="getImgPath('lipid.png')"/>
                    <text style="position: absolute; top: 0; left: 0;" class="warningWord">血脂异常（{{BLOOD_FAT.length}}）</text>
                </cell>
            </list>
        </div>
    </div>
</template>
<script>
import { Utils, WxcMinibar } from "weex-ui";
import api from "../../shared/request";
import {
  createLink,
  calcAge,
  printLog,
  storage_getItem
} from "../../shared/utils";
const DatePicker = weex.requireModule("datepicker");
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  components: { WxcMinibar },
  data() {
    return {
      datetag: ["今天", "昨天"],
      arrayIndex: [{ selected: 0 }, { selected: 0 }],
      EXCESS_LIMIT: [], // 心率超警戒上限
      TIME_TOOMUCH: [], // 运动时间过量
      BLOOD_EXCESS: [], // 血压指标超上限
      BLOOD_SUGAR: [], // 血糖指标超上限
      BLOOD_FAT: [], // 血脂指标异常
      mbrId: "",
      baseURL: "",
      date: ""
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
    this.dataTime(0);
  },
  watch: {
    date(value) {
      printLog("date changed");
      this.getOverview(0);
    }
  },
  methods: {
    showCalendarModel() {
      DatePicker.pickDate(this.date, res => {
        if (res != null) {
          if (new Date(res) > new Date()) {
            modal.toast({ message: "不能选择未来的日期", duration: 1 });
          } else {
            this.date = res;
          }
        }
      });
    },
    switchTag(index) {
      printLog("switchtag");
      this.arrayIndex[0].selected = index;
      this.dataTime(index);
    },
    getOverview: async function(index) {
      this.drId = await storage_getItem("drId");
      this.baseURL = await storage_getItem("oldApiBase");
      console.log("index");
      console.log(index);
      console.log("arrayIndex:" + this.arrayIndex[0].selected);
      if (index == 0) {
        let params = {
          date: this.date,
          drId: this.drId
        };
        api.get(
          `${this.baseURL}appehrservice/getanomalyoverviewbydate.json?`,
          params,
          data => {
            this.EXCESS_LIMIT = data.EXCESS_LIMIT;
            this.TIME_TOOMUCH = data.TIME_TOOMUCH;
            this.BLOOD_EXCESS = data.BLOOD_EXCESS;
            this.BLOOD_SUGAR = data.BLOOD_SUGAR;
            this.BLOOD_FAT = data.BLOOD_FAT;
          }
        );
      } else if (index == 1) {
        let params = {
          date: this.date,
          drId: this.drId
        };
        api.get(
          `${this.baseURL}appehrservice/getyesterdayanomalyoverview.json?`,
          params,
          data => {
            this.EXCESS_LIMIT = data.EXCESS_LIMIT;
            this.TIME_TOOMUCH = data.TIME_TOOMUCH;
            this.BLOOD_EXCESS = data.BLOOD_EXCESS;
            this.BLOOD_SUGAR = data.BLOOD_SUGAR;
            this.BLOOD_FAT = data.BLOOD_FAT;
          }
        );
      }
    },
    dataTime(index) {
      if (index == 0) {
        printLog("index0");
        // yyyy-MM-dd
        let today = new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);
        this.date = today;
      } else if (index == 1) {
        printLog("index1");
        let yesterday = new Date(
          new Date().setDate(new Date().getDate() - 1) -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);
        this.date = yesterday;
      }
    },
    minibarLeftButtonClick() {},
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    },
    jumpExcessLimit() {
      if (this.EXCESS_LIMIT.length > 0) {
        messaging.navWarning(this.EXCESS_LIMIT, 0);
      } else {
        modal.toast({ message: "无用户", duration: 1 });
      }
    },
    jumpTimeTooMuch() {
      if (this.TIME_TOOMUCH.length > 0) {
        messaging.navWarning(this.TIME_TOOMUCH, 1);
      } else {
        modal.toast({ message: "无用户", duration: 1 });
      }
    },
    jumpBloodExcess() {
      if (this.BLOOD_EXCESS.length > 0) {
        messaging.navWarning(this.BLOOD_EXCESS, 2);
      } else {
        modal.toast({ message: "无用户", duration: 1 });
      }
    },
    jumpBloodSugar() {
      if (this.BLOOD_SUGAR.length > 0) {
        messaging.navWarning(this.BLOOD_SUGAR, 3);
      } else {
        modal.toast({ message: "无用户", duration: 1 });
      }
    },
    jumpBloodFat() {
      if (this.BLOOD_FAT.length > 0) {
        messaging.navWarning(this.BLOOD_FAT, 4);
      } else {
        modal.toast({ message: "无用户", duration: 1 });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  flex: 1;
}
.data {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.date {
  margin-top: 30px;
  flex-direction: row;
}
.main-date {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}
.calendar {
  font-size: 24px;
  border-width: 1px;
  border-color: #02b3ed;
  border-style: solid;
  padding: 5px 20px;
  border-radius: 25px;
}
.wordData {
  font-size: 34px;
  color: rgb(102, 102, 102);
  margin-left: 76px;
  padding-bottom: 12px;
  padding-left: 5px;
  padding-right: 5px;
}
.on {
  border-bottom-width: 1px;
  border-bottom-color: rgb(2, 179, 237);
  color: rgb(2, 179, 237);
}
.warning {
  width: 720px;
  margin-left: 15px;
}
.heart {
  width: 720px;
  height: 200px;
}
.warningWord {
  width: 720px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 34px;
  color: rgb(255, 255, 255);
}
</style>



