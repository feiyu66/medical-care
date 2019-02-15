<template>
  <div class="box">
    <wxc-minibar title='管理团队'
        background-color="#02b3ed"
        text-color="#ffffff"
        right-text="创建团队"
        left-button="http://doctor.dlcaring.com/icon_back_white.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
        @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
      <div class="team_box">
        <div v-for="(item, index) in teamData" :key='index' class="team" @click="jump('doctorTeam', item.id)">
          <div class="message">
            <image class="logoImg" :src="getImgPath('logo.png')"/>
            <text class="msg_word">{{item.teamName}}</text>
          </div>
          <image class="icon_back" :src="getImgPath('icon_back2.png')"/>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { WxcMinibar, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
const storage = weex.requireModule('storage')
const messaging = weex.requireModule("MessagingModule");
export default {
  components: {
    WxcMinibar
  },
  data () {
    return {
      mbrId: '',
      baseURL: '',
      teamData: []
    }
  },
  created () {
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
    this.teamGetManagerPatients()
  },
  methods: {
    teamGetManagerPatients: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let drId = '13693371465-dr'
      let params = {
        // teamId: 9162,
        // nurseId: '13164228483-dr'
      }
      api.get(`${this.baseURL}health/team/getTeams/${drId}`, params, data => {
        console.log(data)
        if (data.code == 200) {
          this.teamData = data.data
        }
      })
    },
    jump (path, id) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink(path),
        animated: "true"
      })
      storage.setItem('teamId', id)
    },
    minibarLeftButtonClick () {},
    minibarRightButtonClick () {
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink('createTeam'),
        animated: "true"
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .scroller{
    background-color: rgb(238, 238, 238);
  }
  .team_box{
    padding-left: 30px;
    background-color: rgb(255, 255, 255);
  }
  .team{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .message{
    flex-direction: row;
    align-items: center;
  }
  .logoImg{
    width: 75px;
    height: 75px;
  }
  .msg_word{
    margin-left: 15px;
    font-size: 30px;
    color: rgb(51, 51, 51);
  }
  .icon_back{
    width: 22px;
    height: 34px;
    margin-right: 30px;
  }
</style>

