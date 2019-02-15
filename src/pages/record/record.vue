<template>
    <div class="box">
        <wxc-minibar :title='title'
            background-color="#02b3ed"
            text-color="#ffffff"
            :left-button="getImgPath('icon_back_white.png')"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <div class="main">
            <div class="record">
                <div v-for="(list, index) in recordData" :key="index">
                    <div class="year_div"><text class="year">{{list.year}}</text></div>
                    <div style="width: 712px; marginLeft: 38px;">
                        <div class="revord-plan" v-for="(item, index) in list.datas" :key="index">
                            <image v-if="item.isPunch == 0" class="icon_unfinished" :src="getImgPath('icon_unfinished.png')"/><!-- 未随访  -->
                            <image v-if="item.isPunch == 1" class="icon_unfinished" :src="getImgPath('icon_wait.png')"/> <!-- 待随访  -->
                            <image v-if="item.isPunch == 2" class="icon_unfinished" :src="getImgPath('icon_complete.png')"/>  <!--已随访 -->  
                            <text class="data">{{item.punchTime.split(' ')[0]}}</text>
                            <div>
                                <text v-if="item.isPunch == 0" class="result">未随访</text>
                                <text style="color: rgb(2, 179, 237);" v-if="item.isPunch == 1" class="result">待随访</text>
                                <text style="color: rgb(55, 199, 52);" v-if="item.isPunch == 2" class="result">已随访({{item.punchTime.split(' ')[0]}})</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { WxcMinibar } from 'weex-ui';
    import { createLink, storage_getItem} from "../../shared/utils"
    import api from "../../shared/request"
    const modal = weex.requireModule("modal");
    export default {
        components: { WxcMinibar },
        data () {
            return {
                title: '随访记录',
                result: '',
                recordData: [],
                mbrId: '',
                baseURL: ''
            }
        },
        created () {
            this.title = '王琦' + this.title
            this.punchRecordData()
        },
        methods: {
            punchRecordData: async function () {
                this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("newApiBase");
                let params = {}
                api.get(`${this.baseURL}health/punchRecord/13164228483-dr/15011091987-mbr`, params, data => {
                    console.log(data)
                    this.recordData = []
                    data.data.forEach(v => {
                        let year = v.punchTime.split('-')[0]
                        if (this.recordData.indexOf(year) == -1) {
                            this.recordData.push(year)
                        }
                    })
                    this.recordData = this.recordData.map(year =>{
                        let obj = {
                            year,
                            datas: []
                        }
                        data.data.forEach(v => {
                            if (v.punchTime.indexOf(year) != -1) {
                                obj.datas.push(v)
                            }
                        })
                        return obj
                    })
                })
            },
            minibarLeftButtonClick () {

            },
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
        }
    }
</script>
<style lang="less" scoped>
    .main{
        flex: 1;
        background-color: #eeeeee;
    }
    .record{
        background-color: #ffffff;
        margin-top: 10px;
    }
    .year_div{
        border-bottom-width: 1px;
        border-bottom-color: rgb(221, 221, 221);
    }
    .year{
        margin-top: 20px;
        margin-bottom: 20px;
        margin-left: 50px;
        font-size: 30px;
        color: rgb(51, 51, 51);
    }
    .revord-plan{
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .icon_unfinished{
        width: 32px;
        height: 32px;
    }
    .data{
        margin-left: 20px;
        font-size: 26px;
        color:rgb(102, 102, 102);
    }
    .result{
        margin-left: 80px;
        font-size: 26px;
        color:rgb(153, 153, 153);
    }
</style>


