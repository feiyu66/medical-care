<template>
  <div class="box">
        <wxc-minibar title='饮食日志'
            background-color="#02b3ed"
            text-color="#ffffff"
            left-button="http://doctor.dlcaring.com/icon_back_white.png"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
        <div class="main">
            <div class="main-title">
                <div class="explain">
                    <image class="icon_record" :src="getImgPath('icon_record.png')"/>
                    <text class="word">已记录</text>
                </div>
                <text class="data">记录时间：{{createTime}}</text> 
            </div>
            <scroller class="subject" :style="scrollStyle">
                <div style="width: 712px; marginLeft: 38px;">
                    <div class="diet" v-for="(item, index) in questions" :key='index'>
                        <text class="title">{{item.questionNum}}.{{item.questionName}}</text>
                        <div class="radio">
                            <div v-for="(list, index) in item.dietAnswers" :key='index' class="radio-box">
                                <div class='yes'>
                                    <image v-if="item.chose == list.id" class="gray_box" :src="getImgPath('select_gray.png')"/>   
                                    <image v-else class="selectImg" :src="getImgPath('gray_box.png')"/> 
                                </div>
                                <text class="text-on">{{list.value}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>
  </div>
</template>
<script>
import { WxcMinibar, Utils } from 'weex-ui';
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const storage = weex.requireModule('storage')
export default {
  components: { WxcMinibar },
  data () {
      return {
        mbrId: '',
        baseURL: '',
        data: '',
        createTime: '',
        questions: []
      }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 220 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 120 + "px"
      };
    }
    this.getquestions()
  },
  methods: {
    getquestions: async function () {
        this.mbrId = await storage_getItem("mbrId")
        this.baseURL = await storage_getItem("newApiBase")
        this.data = await storage_getItem("dataTime")
        console.log(this.data)
        let params = {
            userId: this.mbrId,
            date: this.data
        };
        api.get(`${this.baseURL}health/diet/one?`, params, data => {
            console.log(data.data);
            if (data.code == 200) {
                this.questions = data.data.questions;
                this.createTime = data.data.createTime
            }
        });
    },
    minibarLeftButtonClick () {},
  }
}
</script>
<style lang="less" scoped>
.main {
  flex: 1;
  background-color: #eeeeee;
}
.main-title {
  height: 120px;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: space-around;
}
.explain {
  flex-direction: row;
  align-items: center;
  margin-left: 40px;
}
.icon_record {
  width: 44px;
  height: 50px;
}
.word {
  font-size: 30px;
  color: rgb(2, 179, 237);
  margin-left: 12px;
}
.data {
  font-size: 24px;
  color: rgb(51, 51, 51);
  margin-left: 40px;
}
.subject {
  margin-top: 10px;
  background-color: #ffffff;
}
.diet {
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
  flex-direction: column;
}
.diet:last-child {
  border: none;
}
.title {
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 22px;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.radio {
  flex-direction: row;
  margin-left: 20px;
  margin-bottom: 30px;
}
.radio-box {
  flex-direction: row;
  align-items: center;
  margin-right: 120px;
}
.yes {
  margin-right: 20px;
}
.gray_box,
.selectImg {
  width: 35px;
  height: 35px;
}
.text-on {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
</style>
