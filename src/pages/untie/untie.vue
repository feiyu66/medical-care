<template>
    <div class="box">
        <div v-if="isEmptyList" class="reserror">
            <text class="tootipWord">暂无已解绑用户~</text>
        </div>
        <list class="main" :style="listStyle" v-else>
            <cell class="item" v-for="(item, index) in mbrGroupDetailQueryList" :key='index'>
                    <div class="imgs">
                        <image class="logo" :src="getImgPath('logo.png')"/>
                    </div>
                    <div class="subject">
                        <div class="subject-left">
                            <div class="message">
                                <text class="name">{{item.mbrName}}</text>
                                <text class="sex">{{item.mbrSex}}</text>
                                <text class="age">{{item.mbrAge}}</text>
                            </div>
                            <text class="condition">{{item.checkResult ? item.checkResult : ""}}</text>
                            <text class="data">建档：{{item.fileCreatedTime ? item.fileCreatedTime.split(' ')[0] : ""}}</text>
                        </div>
                        <div class="subjecr-right">
                            <div class="sub-btn" @click="deleteData(item.mbrId)">
                                <image class="delete" :src="getImgPath('trash.png')" alt=""></image>
                                <text class="word">删除</text>
                            </div>
                        </div>
                    </div>
            </cell>
        </list>
        <div class="header">
            <div class="header-left" @click="toBack">
                    <image class="icon_back" :src="getImgPath('icon_back_white.png')"/>
                    <text class="back">返回</text>
            </div>
            <div class="header-title"><text class="title">已解绑({{num}})</text></div>
            <div class="header-right"></div>
        </div>
        <wxc-dialog
            content="你确定要删除吗?"
            :show="show"
            :single="false"
            :show-no-prompt="false"
            :main-btn-color="mainbtncolor"
            :second-btn-color="secondbtncolor"
            @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
            @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
        </wxc-dialog>
    </div>
</template>
<script>
import { WxcDialog, Utils } from "weex-ui";
import api from "../../shared/request";
import { printLog } from "../../shared/utils";
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcDialog
  },
  data() {
    return {
      num: 0, // 已解绑数目
      mbrGroupDetailQueryList: [],
      baseURL: "",
      drId: "",
      show: false,
      mainbtncolor: "#ff0000",
      secondbtncolor: "#02b3ed",
      mbrId: "",
      listStyle: "",
      isEmptyList: false
    };
  },
  created() {
    if (WXEnvironment.platform == "Web") {
      weex.config.drId = "13900000009-dr";
    }
    if (weex.config.drId != null) {
      this.drId = weex.config.drId;
    }
    if (weex.config.baseURL != null) {
      this.baseURL = weex.config.baseURL + "/rest/";
    } else {
      this.baseURL = "http://47.93.97.118:8088/dl_biz/rest/";
      //this.baseURL = 'http://biz.dlcaring.com:8099/dl_biz/rest/';
    }
    printLog(Utils.env.getPageHeight());
    this.listStyle = { height: Utils.env.getPageHeight() - 100 + "px" };
    this.getRemovedUserList();
  },
  methods: {
    deleteData(mbrId) {
      this.mbrId = mbrId;
      this.openDialog();
    },
    getRemovedUserList() {
      let obj = {
        drId: this.drId,
        fastLabel: "",
        groupId: "org_removed",
        key: "",
        orderType: 1
      };
      api.get(
        this.baseURL + "iapptsmservice/getmbrgroupdetaillistbygroup.json?",
        obj,
        data => {
          printLog(data);
          if (!data.mbrGroupDetailQueryList) {
            this.isEmptyList = true
          }else {
            this.isEmptyList = false
            this.num = data.mbrGroupDetailQueryList.length;
            this.mbrGroupDetailQueryList = data.mbrGroupDetailQueryList;
            data.mbrGroupDetailQueryList.map(item => {
              if (item.checkResult == "") {
                item.checkResult = "无";
              }
              if (item.mbrSex == "01") {
                item.mbrSex = "男";
              } else {
                item.mbrSex = "女";
              }
            });
          }
        }
      );
    },
    openDialog() {
      this.show = true;
    },
    wxcDialogCancelBtnClicked() {
      // must setting,control by yourself
      this.show = false;
    },
    wxcDialogConfirmBtnClicked() {
      // must setting,control by yourself
      this.show = false;
      let obj = {
        drId: this.drId,
        mbrId: this.mbrId
      };
      api.post(
        this.baseURL + "iapptsmservice/deletemember.json?",
        obj,
        data => {
          printLog(data)
          if (!data.ERROR_TYPE) {
            modal.toast({
              message: "删除成功"
            });
            this.getRemovedUserList();
          } else if ( data.ERROR_TYPE == "3") {
            const modal = weex.requireModule("modal");
            modal.toast({
              message: "您没有删除权限"
            });
          } else {
            const modal = weex.requireModule("modal");
            modal.toast({
              message: "删除失败，系统异常"
            });
          }
        }
      );
    },
    wxcDialogNoPromptClicked(e) {},
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  position: absolute;
  top: 0px;
  width: 750px;
  height: 100px;
  background-color: #02b3ed;
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
.back {
  font-size: 28px;
  color: #ffffff;
}
.icon_back {
  width: 40px;
  height: 40px;
}
.title {
  font-size: 38px;
  color: #ffffff;
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
.main {
  margin-top: 100px;
  flex: 1;
  //background-color: #eeeeee;
  //background-color: red;
}
.item {
  height: 180px;
  border-bottom-color: #fff;
  border-bottom-width: 1px;
  flex-direction: row;
}
.iten:last-child {
  border-bottom: none;
}
.imgs {
  flex: 1.2;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 130px;
  height: 130px;
}
.subject {
  flex: 4;
  flex-direction: row;
  justify-content: space-between;
}
.subject-left {
  flex-direction: column;
}
.message {
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.name,
.sex,
.age {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.sex,
.age {
  margin-left: 20px;
}
.condition {
  font-size: 26px;
  color: rgb(2, 179, 237);
  margin-bottom: 15px;
}
.data {
  font-size: 24px;
  color: rgb(102, 102, 102);
}
.subjecr-right {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.sub-btn {
  width: 130px;
  height: 50px;
  background-color: rgb(228, 55, 55);
  border-radius: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 50px;
}
.delete {
  width: 30px;
  height: 30px;
}
.word {
  margin-left: 10px;
  font-size: 24px;
  color: rgb(255, 255, 255);
}
</style>

