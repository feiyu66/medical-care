<template>
  <div class="box">
      <wxc-minibar :title='title'
        background-color="#02b3ed"
        text-color="#ffffff"
        left-button="http://doctor.dlcaring.com/icon_back_white.png"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
        <div @click="jump('addMembers')" style="height: 90px; flex-direction: row; align-items: center;" slot="right">
          <image class="add_img" :src="getImgPath('add_img.png')"/>
        </div>
      </wxc-minibar>
      <scroller class="scroller" :style="scrollStyle">
        <div class="member_box"
            style="position: relative;"
            v-for="(item, index) in doctorsData"
            :key="index"
            data-type='0'>
          <div class="member"
            @touchstart="touchstartData"
            @touchmove='touchmoveData'
            @touchend='touchendData'
            @click="editInformation(item.id)"
            >
            <image class="logoImg" :src="getImgPath('logo.png')"/>
            <div class="message">
                <div class="name_pos">
                  <text class="name">{{item.name}}</text>
                  <text class="position">{{item.profession}}</text>
                </div>
                <text class="duty">擅长：{{item.professional}}</text>
            </div>
            <div class="remove" ref="remove" :data-index='index' @click="removeData(item.id)">
              <text class="remove_word">删除</text>
            </div>
          </div>
        </div>
      </scroller>
      <wxc-dialog
          content="确定要删除成员吗？"
          :show="show"
          :single="false"
          :show-no-prompt="false"
          confirm-text="删除"
          main-btn-color="rgb(255, 0, 0)"
          second-btn-color="rgb(2, 179, 237)"
          @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
          @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
      </wxc-dialog>
      <!-- 编辑信息 -->
      <wxc-popup popup-color="rgb(238, 238, 238)"
        :show="isRightShow"
        pos="right"
        :height="popupHeight">
        <div class="demo-box">
          <div class="demo-title">
            <div class="icon_block" @click="showCalendarModel"><image class="icon_back_white" :src="getImgPath('icon_back_white.png')"/></div>
            <text class="title_content">编辑信息</text>
            <text class="preservation" @click="submissionData">保存</text>
          </div>
          <div class="demo-content">
            <div class="headPortrait">
              <image class="logo_img" :src="getImgPath('logo.png')"/>
              <text class="headPortrait_name">{{name}}</text>
            </div>
            <div class="message_box">
              <image class="gender_msg" :src="getImgPath('gender.png')"/>           
              <text class="msg_introduce">性别：</text>
              <text class="msg_position">{{sex}}</text>
            </div>
            <div class="message_box">
              <image class="gender_msg" :src="getImgPath('role.png')"/>              
              <text class="msg_introduce">角色：</text>
              <text class="msg_position">{{profession}}</text>
            </div>
            <div class="message_box">
              <image class="gender_msg" :src="getImgPath('phone.png')"/>              
              <text class="msg_introduce">手机号：</text>
              <text class="msg_position">{{phoneId}}</text>
            </div>
          </div>
          <div class="Be_good_at">
            <div class="be_good_cent">
              <div class="be_title">
                <image class="gender_msg" :src="getImgPath('intro.png')"/>                
                <text class="be_word">个人擅长简介</text>
              </div>
              <textarea v-model="professional" class="textarea" @input="inputTextWord"></textarea>
              <div class="tooltip">
                <text class="number_tip">字数限制：0/1000字</text>
              </div>
            </div>
          </div>
        </div>
      </wxc-popup>
  </div>
</template>
<script>
import { WxcMinibar, WxcDialog, WxcPopup, Utils } from "weex-ui";
import { createLink, printLog , storage_getItem} from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcMinibar, WxcDialog, WxcPopup
  },
  data () {
    return {
      mbrId: '',
      baseURL: '',
      teamId: '', //团队id
      nurseId: '', // 护士id
      drId: "13693371465-dr", // 医生id
      doctorsData: [],
      show: false,
      isRightShow: null,
      popupHeight: 0,
      title: '医生团队(',
      num: 0,
      startX: 0,
      moveX: 0,
      endX: 0,
      disX: 0, // 移动距离
      deleteSlider: '', // 滑动时的效果,使用v-bind:style="deleteSlider"
      name: '',
      profession: '', // 职位
      sex: '', // 性别
      phoneId: '', //手机号
      professional: '', // 擅长项
    }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 90 + "px"
      };
      this.popupHeight = Utils.env.getPageHeight();
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
      this.popupHeight = Utils.env.getPageHeight() + 88;
    }
    printLog(this.popupHeight);
    this.teamInfo()
  },
  methods: {
    teamInfo: async function () {
      this.num = 0
      this.title = '医生团队('
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.teamId = await storage_getItem('teamId')
      let params = {
        drId: this.drId
      }
      api.get(`${this.baseURL}health/team/info/${this.teamId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          this.doctorsData = data.data.doctors
          this.num = this.doctorsData.length
          this.title = this.title + this.num + ')'
          this.doctorsData.map(item => {
            if (item.professional == '') {
              item.professional = '无'
            }
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
    removeData (id) {
      this.show = true
      this.nurseId = id
    },
    editInformation (userId) {
      this.isRightShow = true
      api.get(`${this.baseURL}health/doctor/${userId}`, {}, data => {
        console.log(data)
        let datas = data.data
        if (data.code == 200) {
          this.name = datas.name
          this.phoneId = datas.mobile
          this.sex = datas.sex
          if (datas.profession == '01') {
            this.profession = '医师'
          } else if (datas.profession == '02') {
            this.profession = '健管师'
          } else if (datas.profession == '03') {
            this.profession = '运动师'
          } else if (datas.profession == '04') {
            this.profession = '营养师'
          } else if (datas.profession == '05') {
            this.profession = '康复师'
          } else if (datas.profession == '06') {
            this.profession = '心理师'
          }
          this.professional = datas.professional
        }
      })
    },
    inputTextWord (event) {
      // let drId = '13693371465-dr'
      this.professional = event.value
    },
    submissionData () {
      let params = {
        goodAt: this.professional
      }
      api.get(`${this.baseURL}health/doctor/modifyGoodAt/${this.nurseId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          modal.toast({ message: data.msg, duration: 1 });
        } else {
          modal.toast({ message: data.msg, duration: 1 });
        }
      })
    },
    showCalendarModel () {
      this.isRightShow = false
    },
    wxcDialogCancelBtnClicked () { // 取消
    //此处必须设置，组件为无状态组件，自己管理
      this.show = false;
    },
    wxcDialogConfirmBtnClicked () { // 确定
      //此处必须设置，组件为无状态组件，自己管理
      this.title = '医生团队('
      let params = {
        drId: this.drId,
        nurseId: this.nurseId
      }
      api.get(`${this.baseURL}health/team/deleteNurse/${this.teamId}?`, params, data => {
        console.log(data)
        if (data.code == 200) {
          this.show = false
          this.doctorsData = data.data.doctors
          this.num = this.doctorsData.length
          this.title = this.title + this.num + ')'
          this.doctorsData.map(item => {
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
          modal.toast({ message: "删除成功！", duration: 1 });
        } else {
          modal.toast({ message: "该会员不能删除！", duration: 1 });
          this.title = this.title + this.num + ')'
          this.show = false;
        }
      })
      this.$forceUpdate();
    },
    touchstartData (event) { //开始滑动
      this.startX = event.touches[0].clientX
    },
    touchmoveData (event) { // 滑动中
      //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
      let w = this.$refs.remove[0].offsetWidth
      // 滑动时距离浏览器左侧实时距离
      this.moveX = event.touches[0].clientX
      //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
      this.disX = this.startX - this.moveX
      // if (this.disX <= 0) {
      //   this.deleteSlider = 'transform:translateX(0px)'
      // } else {
      //   //具体滑动距离我取的是 手指偏移距离*5。
      //   this.deleteSlider = "transform:translateX(-" + this.disX * 5 + "px)";
      //   if (this.disX * 5 > w) {
      //     this.deleteSlider = "transform:translateX(-" + w + "px)";
      //   }
      // }
    },
    touchendData (event) { // 结束
      let w = this.$refs.remove[0].offsetWidth
      this.endX = event.changedTouches[0].clientX
      this.disX = this.startX - this.endX
      let parentElement = event.currentTarget.parentElement
      if (parentElement.dataset.type == 0 && this.disX * 5 >  w/2) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      if (parentElement.dataset.type == 1 && this.disX * 5 < - w/2) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      // if ((this.disX * 5) < w/2) {
      //   this.deleteSlider = 'transform:translateX(0px)'
      // } else {
      //   //大于一半 滑动到最大值
      //   this.deleteSlider = "transform:translateX(-"+ w + "px)";
      // }
      this.startX = 0
      this.moveX = 0
      this.endX = 0
      this.disX = 0 // 移动距离
    },
    //判断当前是否有滑块处于滑动状态
    checkSlide () {
      let memberBox = document.querySelectorAll('.member_box');
      for(let i = 0; i < memberBox.length; i++) {
        if(memberBox[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    // 复位滑动状态
    restSlide () {
      let memberBox = document.querySelectorAll('.member_box')
      for(let i=0; i < memberBox.length; i++) {
        memberBox[i].dataset.type = 0
      }
    },
    minibarLeftButtonClick () {},
    jump(path) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
          url: createLink(path),
          animated: "true"
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .add_img{
    width: 48px;
    height: 40px;
  }
  .scroller{
    background-color: rgb(238, 238, 238);
  }
  .member_box{
    height: 180px;
    flex-direction: row;
    background-color: rgb(255, 255, 255);
  }
  .member_box[data-type="0"] {
    transform: translate3d(0, 0, 0);
  }
  .member_box[data-type="1"] {
    transform: translate3d(-120px, 0, 0);
  }
  .member{
    width: 750px;
    flex-direction: row;
    align-items: center;
  }
  .logoImg{
    width: 120px;
    height: 120px;
    margin-left: 30px;
  }
  .message{
    height: 180px;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .name_pos{
    flex-direction: row;
    align-items: center;
  }
  .name{
    font-size: 32px;
    color:rgb(51, 51, 51); 
  }
  .position{
    width: 68px;
    height: 30px;
    color:rgb(255, 255, 255);
    font-size: 18px;
    background-color: rgb(255, 210, 29);
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    margin-left: 15px;
  }
  .duty{
    width: 600px;
    flex-wrap: wrap;
    font-size: 26px;
    color: rgb(153, 153, 153);
    margin-top: 30px;
  }
  .remove{
    position: absolute;
    top: 0;
    right: -139px;
    width: 139px;
    height: 180px;
    background-color: rgb(244, 35, 35);
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .remove_word{
      font-size: 32px;
      color: rgb(255, 255, 255);
  }
  // ------------编辑信息-------
  .demo-title{
    height: 100px;
    background-color: #02b4ed;
    flex-direction: row;
    align-items: center;
  }
  .icon_block{
    flex: 1;
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .title_content{
    flex: 4;
  }
  .preservation{
    flex: 1;
  }
  .title_content, .preservation{
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: rgb(255, 255, 255);
  }
  .icon_back_white{
    width: 40px;
    height: 40px;
  }
  .demo-content{
    background-color: rgb(255, 255, 255);
  }
  .headPortrait{
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .logo_img{
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
  }
  .headPortrait_name{
    font-size: 34px;
    color:rgb(51, 51, 51);
  }
  .message_box{
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    margin-left: 30px;
    padding-bottom: 20px;
    border-bottom-color: rgb(240, 240, 240);
    border-bottom-width: 1px;
  }
  .gender_msg{
    width: 42px;
    height: 44px;
  }
  .msg_introduce{
    margin-left: 15px;
    font-size: 30px;
    color:rgb(102, 102, 102);
  }
  .msg_position{
    font-size: 26px;
    color:rgb(102, 102, 102);
  }
  .Be_good_at{
    margin-top: 20px;
    background-color: rgb(255, 255, 255);
  }
  .be_good_cent{
    margin: 20px;
  }
  .be_title{
    flex-direction: row;
    align-items: center;
  }
  .be_word{
    margin-left: 20px;
    font-size: 28px;
    color:rgb(51, 51, 51);
  }
  .textarea{
    height: 226px;
    margin-top: 20px;
    padding: 10px 20px;
    border-width: 1px;
    border-color: rgb(222, 222, 222);
    font-size: 26px;
    color:rgb(102, 102, 102);
  }
  .tooltip{
    flex-direction: row;
    justify-content: flex-end;
  }
  .number_tip{
    font-size: 20px;
    color: rgb(153, 153, 153);
    margin-bottom: 20px;
  }
</style>
