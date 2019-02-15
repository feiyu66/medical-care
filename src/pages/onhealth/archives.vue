<template>
  <div class="box">
    <wxc-minibar :title='title'
        background-color="#02b3ed"
        text-color="#ffffff"
        left-button="http://doctor.dlcaring.com/icon_back_white.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <div class="main">
        <wxc-tab-page ref="wxc-tab-page"
            :tab-titles="tabTitles"
            :tab-styles="tabStyles"
            :tab-page-height="tabPageHeight"
            @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
            <div :style="dietStyle"><MedicalHistory/></div>
            <div :style="dietStyle"><FamilyHistory/></div> 
        </wxc-tab-page> 
    </div>
  </div>
</template>
<script>
import { WxcMinibar, WxcTabPage, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../shared/utils'
// 既往史
import MedicalHistory from '../../components/Disease/medicalHistory.vue'
// 家族史
import FamilyHistory from '../../components/Disease/familyHistory.vue' 
import Config from '../../shared/medicalHistory'
export default {
  components: {
    WxcMinibar,
    WxcTabPage,
    MedicalHistory,
    FamilyHistory
  },
  data () {
      return {
        tabTitles: Config.tabTitles,
        tabStyles: Config.tabStyles,
        tabList: [],
        demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tabPageHeight: 1334,
        name: '许嵩'
      }
  },
  created () {
    this.title = this.name + '的健康档案'
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
    minibarLeftButtonClick () {}
  }
}
</script>

