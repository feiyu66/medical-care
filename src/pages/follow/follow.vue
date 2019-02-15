<template>
    <div class="box">
        <wxc-minibar :title='title'
            background-color="#02b3ed"
            text-color="#ffffff"
            :left-button="getImgPath('icon_back_white.png')"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <scroller class="scroller" :style="scrollStyle" style="position: relative;">
            <text v-if="majorCustomers.length == 0" class="tootipWord" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">暂无重点关注用户~</text>
            <list v-else>
                <cell class="item-box" v-for="(item, index) in majorCustomers" :key='index' style="height: 180px; marginTop: 0;">
                    <div class="list" style="width: 712px; marginLeft: 38px;">
                        <div class="item-dl">
                            <image class="logo" :src="getImgPath('logo.png')" alt=""></image>
                        </div>
                        <div class="item-entry">
                            <div class="entry-border">
                                <div class="message">
                                    <text class="msg">{{item.mbrName}}</text>
                                    <text class="msg">{{item.mbrSex}}</text>
                                    <text class="msg">{{item.mbrAge}}岁</text>
                                </div>
                                <text class="record">建档：{{item.createdTime}}</text>
                            </div>
                            <div class="entry-mark">
                                <text class="disease">{{item.checkResult}}</text>
                                <div class="details">
                                    <text class="ellipsis">{{item.groupName}}</text>
                                    <image class="emphasis_red" :src="getImgPath('emphasis_red.png')" alt=""></image>
                                </div>
                            </div>
                            <div class="ols">
                                <text class="each_item">{{item.weeks}}周/</text>
                                <text class="span mg-r">3周</text>
                                <text class="each_item mL">最近：</text>
                                <text class="span">15</text>
                                <text class="each_item mg-r">/40分钟</text>
                                <text class="each_item mL">{{item.endTime}}</text>
                            </div>
                        </div>
                    </div>
                </cell>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <text class="indicator-text">Loading ...</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </list>
        </scroller>
    </div>
</template>
<script>
    import { WxcMinibar, Utils } from 'weex-ui';
    import { createLink, storage_getItem} from "../../shared/utils";
    import api from '../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: { WxcMinibar },
        data () {
            return {
                loadinging: false,
                title: '重点关注',
                majorCustomers: [],
                num: 0,
                baseURL: '',
                mbrId: ''
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
            this.getmbrgroupdetaillistbygroupData()
            
        },
        methods: {
            getmbrgroupdetaillistbygroupData: async function () {
                this.mbrId = await storage_getItem("drId");
                this.baseURL = await storage_getItem("oldApiBase");
                let obj = {
                    drId: this.mbrId,
                    fastLabel: "03",
                    groupId: "dr_all",
                    key: "",
                    orderType: 1
                };
                api.get(`${this.baseURL}iapptsmservice/getmbrgroupdetaillistbygroup.json?`, obj, data => {
                    console.log(data);
                    data.mbrGroupDetailQueryList.forEach(item => {
                        item.createdTime = item.createdTime.split(" ")[0];
                        item.endTime = item.endTime.split(" ")[0];
                        if (item.checkResult == '') {
                            item.checkResult = '无'
                        }
                        if (item.mbrSex == "01") {
                            item.mbrSex = "男";
                        } else {
                            item.mbrSex = "女";
                        }
                    });
                    this.majorCustomers = data.mbrGroupDetailQueryList;
                    this.num = this.majorCustomers.length;
                    this.title = this.title + '(' + this.num + ')'
                });
            },
            onloading(event) {
                modal.toast({ message: "Loading", duration: 1 });
                this.loadinging = true;
                setTimeout(() => {
                    this.loadinging = false;
                }, 2000);
            },
            minibarLeftButtonClick () {

            },
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
        }
    }
</script>
<style>
.weex-list-inner,
.weex-scroller-inner,
.weex-waterfall-inner {
  height: 1244px;
}
</style>
<style lang="less" scoped>
    .scroller{
        background-color: #eeeeee;
    }
    .tootipWord {
        color: rgb(153, 153, 153);
        font-size: 30px;
    }
    .item-box {
        background-color: rgb(255, 255, 255);
        flex-direction: row;
    }
    .list{
        border-bottom-color: rgb(238, 238, 238);
        border-bottom-width: 1px;
        flex-direction: row;
    }
    .item-box:last-child .list{
        border: none;
    }
    .item-dl {
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .logo {
        width: 110px;
        height: 110px;
    }
    .item-entry {
        flex: 4;
        height: 180px;
        display: -webkit-flex;
        flex-direction: column;
        margin-left: 0;
    }
    .entry-border {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }
    .message{
        flex-direction: row;
        align-items: center;
    }
    .msg {
        font-size: 30px;
        margin-right: 15px;
        color: rgb(51, 51, 51);
    }
    .record {
        font-size: 26px;
        color: rgb(102, 102, 102);
        margin-right: 30px;
    }
    .entry-mark {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
    .disease {
        font-size: 26px;
        color: rgb(2, 179, 237);
    }
    .details {
        flex-direction: row;
        align-items: center;
        margin-right: 30px;
    }
    .ellipsis {
        width: 120px;
        font-size: 22px;
        color: rgb(102, 102, 102);
        margin-right: 10px;
        overflow: hidden;
        lines: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .emphasis_red {
        width: 55px;
        height: 55px;
    }
    .ols {
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
    }
    .each_item {
        font-size: 24px;
        color: rgb(153, 153, 153);
    }
    .mL {
        padding-left: 24px;
        border-left-width: 1px;
        border-left-color: rgb(153, 153, 153);
    }
    .span {
        font-size: 30px;
        color: rgb(21, 186, 255);
    }
    .mg-r {
        margin-right: 24px;
    }
</style>

