<template>
  <div class="box">
    <wxc-minibar title='待审核列表'
      background-color="#02b3ed"
      text-color="#ffffff"
      :left-button="getImgPath('icon_back_white.png')"
      :use-default-return="false"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <div class="main" >
      <wxc-tab-page ref="wxc-tab-page"
          :title-use-slot="true"
          :tab-titles="tabTitles"
          :tab-styles="tabStyles"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <div slot="tab-title-0" class="tab_page_left" :class="[num == 0 ? 'bg' : '']"><text class="tab_word" :class="[num == 0 ? 'on' : '']">运动处方</text></div>
        <div slot="tab-title-1" class="tab_page_right" :class="[num == 1 ? 'bg' : '']"><text class="tab_word" :class="[num == 1 ? 'on' : '']">饮食处方</text></div>
        <div :style="dietStyle"><exercisePrescription/></div>
        <div :style="dietStyle"><dietPrescription/></div>
      </wxc-tab-page>
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
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      tabList: [],
      demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tabPageHeight: 1334,
      num: 0
    };
  },
  created() {
    printLog("Message")
    printLog(Utils.env.getPageHeight())
    this.dietStyle = { width: "750px", height: Utils.env.getPageHeight()  + "px" };
    if (WXEnvironment.platform == "Web") {
        this.tabPageHeight = Utils.env.getPageHeight() - 88;
    }else {
        this.tabPageHeight = Utils.env.getPageHeight()+88;
    }
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    Vue.set(this.tabList, 0, this.demoList);
  },
  methods: {
    wxcTabPageCurrentTabSelected (e) {
        const self = this;
        const index = e.page;
        this.num = index
        /* Unloaded tab analog data request */
        if (!Utils.isNonEmptyArray(self.tabList[index])) {
            setTimeout(() => {
                Vue.set(self.tabList, index, self.demoList);
            }, 100);
        }
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
  .tab_page_left, .tab_page_right{
    width: 200px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-color: rgb(2, 179, 237);
  }
  .tab_page_left{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .tab_page_right{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .tab_word{
    color: rgb(2, 179, 237);
  }
  .bg{
    background-color: rgb(2, 179, 237);
  }
  .on{
    color: rgb(255, 255, 255);
  }
.main {
  flex: 1;
  background-color: rgb(238, 238, 238);
}
</style>
