<template>
    <div class="box">
        <div class="header">
            <div class="header-left" @click="toBack">
                <image class="header-item-return" :src="getImgPath('icon_back_white.png')"/>
            </div>
            <div class="header-title"><text class="header-title-text">{{title}}随访统计</text></div>
            <div class="header-right" @click='openMask'>
                <text class="header-item-text">选择人员</text>
            </div>
        </div>
        <div class="main">
            <div v-if="statistics" class="reserror">
                <text class="tootipWord">当前无随访记录~</text>
            </div>
            <div v-else class="statistics">
                <div v-for="(list, index) in statistics" :key="index">
                    <div class="year"><text class="data">{{list.year}}年</text></div>
                    <div class="message">
                        <div style="width: 712px; marginLeft: 38px;">
                            <div class="msg" v-for="(item, index) in list.datas" :key="index">
                                <text class="month">{{item.month.split('-')[1]}}月份统计</text>
                                <text class="should">（应随访人次：{{item.planCount}}</text>
                                <text class="actual">实际随访人次：{{item.realCount}}）</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <wxc-mask height="590"
              width="520"
              border-radius="20"
              duration="200"
              mask-bg-color="#FFFFFF"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :overlay-can-close="false"
              :show-close="false"
              :show="show">
            <div class="content" style="flex:1;">
                <div class="demo-title">
                    <image @click="wxcMaskSetHidden" class="icon_cancel" :src="getImgPath('icon_cancel.png')"/>
                </div>
                <div class="demo-main">
                    <text class="title">选择人员</text>
                    <text v-for="(item, index) in doctorsData" :key="index" :class="[num == index ? 'name_on' : '']" @click="personnel(index, item.id, item.name)" class="name">{{item.name}}</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>
<script>
    import { WxcMask } from 'weex-ui';
    import { createLink, printLog, storage_getItem} from "../../shared/utils"
    import api from '../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: { WxcMask },
        data () {
            return {
                title: '我的',
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                num: null,
                statistics: [],
                doctorsData: [],
                doctorsFlag: false,
                baseURL: ""
            }
        },
        created () {
            this.defaultData()
        },
        methods: {
            personnel (index, idPhone, name) {
                this.num = index
                this.drId = idPhone
                this.title = name
                this.defaultData()
                this.show = false
            },
            openMask (e) {
                printLog(this.doctorsData)
                if (this.doctorsData && this.doctorsData.length > 0) {
                    this.show = true;
                    this.hasAnimation = true;
                } else {
                    modal.toast({ message: "当前无可选择的人员~", duration: 1 });
                }
            },
            defaultData: async function () {
                this.drId = this.drId ? this.drId : await storage_getItem("drId");
                this.baseURL = await storage_getItem("newApiBase");
                this.statistics = []
                let params = {}
                api.get(`${this.baseURL}health/punchStatistics/${this.drId}`, params, data => {
                    console.log(data)
                    data.data.statistics.map(item => {
                        let year = item.month.split('-')[0]
                        if (this.statistics.indexOf(year) == -1) {
                            this.statistics.push(year)
                        }
                    })
                    this.statistics = this.statistics.map( year => {
                        let obj = {
                            year,
                            datas: []
                        }
                        data.data.statistics.forEach(v => {
                            if (v.month.indexOf(year) !=  -1) {
                                obj.datas.push(v)
                            }
                        })
                        return obj
                    })
                    if (data.data.doctors == null) {
                        this.doctorsFlag = false
                    } else {
                        this.doctorsFlag = true
                        this.doctorsData = data.data.doctors
                    }

                })
            },
            wxcMaskSetHidden () {
                this.show = false;
            },
            toBack () {
                let navigator = weex.requireModule("navigator");
                navigator.pop({
                    animated: "true"
                });
            }
        }
    }
</script>

<style lang="less" scoped>
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
  flex: 1.1;
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
.header-item-text {
  font-size: 28px;
  color: #fff;
  margin-right: 20px;
}
.header-item-return {
  width: 50px;
  height: 50px;
}
    .main{
        flex: 1;
        background-color: #eeeeee;
    }
    .statistics{
        background-color: rgb(255, 255, 255);
        margin-top: 10px;
    }
    .year{
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(221, 221, 221);
    }
    .data{
        font-size: 30px;
        color:rgb(2, 179, 237);
        margin-left: 40px;
    }
    .msg{
        flex-direction: row;
        align-items: center;
        padding-top: 24px;
        padding-bottom: 24px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .month, .should, .actual{
        color: rgb(102, 102, 102);
    }
    .month{
        font-size: 28px
    }
    .should, .actual{
        font-size: 24px;
    }
    .actual{
        margin-left: 25px;
    }
    // 选择人员弹层
    .demo-title{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10px;
    }
    .icon_cancel{
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }
    .demo-main{
        flex-direction: column;
    }
    .title{
        text-align: center;
        font-size: 34px;
        color:rgb(51, 51, 51);
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .name{
        height: 70px;
        line-height: 70px;
        text-align: center;
        border-top-width: 1px;
        border-top-color: rgb(238, 238, 238);
        color:rgb(2, 179, 237);
        font-size: 32px;
    }
    .name:last-child{
        margin-bottom: 20px;
    }
    .name_on{
        background-color: rgb(240, 240, 240);
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
</style>

