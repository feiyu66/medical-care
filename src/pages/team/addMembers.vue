<template>
  <div class="box">
      <wxc-minibar title='添加成员'
        background-color="#02b3ed"
        text-color="#ffffff"
        :right-text="rightText"
        left-text="取消"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
        @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
      <scroller class="scroller" :style="scrollStyle">
        <div ref="memberBox" class="member" v-for="(item, index) in memberData" :key='index' @click="addMembersData(index)">
          <image v-if="!item.flag" class="radio_img" :src="getImgPath('uncheck_img.png')"/>
          <image v-if="item.flag" class="radio_img" :src="getImgPath('selected.png')"/>
          <div class="img_msg">
            <image class="lg_img" :src="getImgPath('logo.png')"/>
            <text class="name" :class="[item.active ? 'on' : '']">{{item.name}}</text>
            <text class="position">{{item.profession}}</text>
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
export default {
  components: {
    WxcMinibar
  },
  data () {
    return {
      addMembers: 0,
      rightText: '确定',
      mbrId: '',
      baseURL: '',
      teamId: '',
      drId: '13693371465-dr',
      nurseIdData: [], // 护士id
      memberData: [],
      profession: '', //职位
    }
  },
  created () {
    this.rightText += '(' + this.addMembers + ')'
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
    this.teamGetBindableNurses()
  },
  methods: {
    teamGetBindableNurses: async function () {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.teamId = await storage_getItem('teamId')
      let params = {
        drId: this.drId
      }
      api.get(`${this.baseURL}health/team/getBindableNurses/${this.teamId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          this.memberData = data.data
          this.memberData.map(item => {
            item.flag = false
            item.active = false
            if (item.profession == '01') {
              item.profession = '医师'
            } else if (item.profession == '02') {
              item.profession = '健管师'
            } else if (item.profession == '03') {
              item.profession = '运动师'
            } else if (item.profession == '04') {
              item.profession = '营养师'
            } else if (item.profession == '05') {
              item.profession = '康复师'
            } else if (item.profession == '06') {
              item.profession = '心理师'
            }
          })
        }
      })
    },
    addMembersData (index) {
      this.profession = ''
      if (this.memberData[index].active == false && this.memberData[index].flag == false) {
        this.memberData[index].flag = true
        this.memberData.map(item => {
          if (item.profession == this.memberData[index].profession && item.flag == false) {
            item.active = true   
          }
        })
      } else if (this.memberData[index].flag == true) {
        this.memberData.map(item => {
          if (item.profession == this.memberData[index].profession) {
            this.memberData[index].flag = false
            item.active = false   
          }
        })
      }
      this.$forceUpdate()
      this.addMembers = 0
      this.rightText = '确定'
      this.nurseIdData = []
      this.memberData.map(item => {
        if (item.flag) {
          this.addMembers += 1
          this.nurseIdData.push(item.id)
        }
      })
      this.rightText += '(' + this.addMembers + ')'
    },
    minibarRightButtonClick () {
      console.log(this.nurseIdData.join(','))
      let params = {
        drId: this.drId,
        nurseId: this.nurseIdData.join(',')
      }
      api.get(`${this.baseURL}health/team/bindNurse/${this.teamId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          modal.toast({ message: data.msg, duration: 1 });
        } else {
           modal.toast({ message: data.msg, duration: 1 });
        }
      })
      this.$forceUpdate()
    },
    jump (path) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink(path),
        animated: "true"
      })
    },
    minibarLeftButtonClick () {}
  }
}
</script>
<style lang="less" scoped>
  .scroller{
    background-color: #eeeeee;
  }
  .member{
    height: 150px;
    flex-direction: row;
    align-items: center;
    background-color: rgb(255, 255, 255);
  }
  .radio_img{
    width: 36px;
    height: 36px;
    margin-left: 30px;
  }
  .img_msg{
    width: 100%;
    height: 150px;
    margin-left: 20px;
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .lg_img{
    width: 86px;
    height: 86px;
  }
  .name{
    margin-left: 30px;
    font-size: 32px;
    color: rgb(51, 51, 51);
  }
  .position{
    width: 68px;
    height: 30px;
    background-color: rgb(255, 210, 29);
    color: rgb(255, 255, 255);
    font-size: 18px;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    margin-left: 15px;
  }
  .on{
    color: rgb(163, 163, 163);
  }
</style>
