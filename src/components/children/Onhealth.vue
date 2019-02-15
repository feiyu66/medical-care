<template>
    <div class="box">
        <wxc-minibar title='用户详情'
            background-color="#02b3ed"
            text-color="#ffffff"
            right-text="随访"
            :left-button="getImgPath('icon_back_white.png')"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
        <scroller class="scroller" :style="scrollStyle">
            <div class="modular">
                <div class="classification" @click="jump('archives')">
                    <image class="record_img" :src="getImgPath('record_img.png')"/>
                    <text class="classification_word">健康档案</text>
                </div>
                <div class="classification" @click="jump('presentation')">
                    <image class="record_img" :src="getImgPath('report.png')"/>                    
                    <text class="classification_word">健康报告</text>
                </div>
                <div class="classification">
                    <image class="record_img" :src="getImgPath('Sports.png')"/>                    
                    <text class="classification_word">运动处方</text>
                </div>
                <div class="classification" @click="jump('foodReplace')">
                    <image class="record_img" :src="getImgPath('diet.png')"/>                    
                    <text class="classification_word">饮食处方</text>
                </div>
            </div>
            <!-- 健康行为 -->
            <div class="health_behavior">
                <div class="health_title">
                    <image class="icon_health" :src="getImgPath('icon_health.png')"/>                    
                    <text class="health_word">健康行为</text>
                </div>
                <div class="health_fraction">
                    <div class="fraction_left">
                        <text class="left_f">{{healthScore}}</text>
                        <text class="left_word">分</text>
                    </div>
                    <div class="fraction_right">
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{sportWeekSum}}</text>
                            <text class="fr_child_word">今日运动</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{dietWeekSum}}</text>
                            <text class="fr_child_word">今日饮食</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{measureWeekSum}}</text>
                            <text class="fr_child_word">体重检测</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{mustreadWeekSum}}</text>
                            <text class="fr_child_word">今日必读</text>
                        </div>
                    </div>
                </div>
                <div class="more_box">
                    <text class="more_date">{{startData}}</text>
                    <div class="more_items" @click="jump('healthBehavior')">
                        <text class="more_i_w">查看更多数据</text>
                        <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>                        
                    </div>
                </div>
            </div>
            <!-- 运动 -->
            <div class="health_behavior">
                <div class="health_title">
                    <image class="icon_health" :src="getImgPath('icon_sports.png')"/>                    
                    <text class="health_word">运动</text>
                </div>
                <div class="health_fraction">
                    <div class="fraction_left">
                        <text class="left_f">{{sportScore}}</text>
                        <text class="left_word">分</text>
                    </div>
                    <div class="fraction_right">
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{validTime}}分钟</text>
                            <text class="fr_child_word">有效运动时长</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{validAvgHeart}}次/分钟</text>
                            <text class="fr_child_word">有效运动平均心率</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{hheartExcTime}}分钟</text>
                            <text class="fr_child_word">过强运动时长</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{hAvgHeart}}次/分钟</text>
                            <text class="fr_child_word">过强运动平均心率</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{calorie}}分钟</text>
                            <text class="fr_child_word">运动能量消耗</text>
                        </div>
                        <div class="fr_children" style="width: 50%;">
                            <text class="fr_child_num">{{stepCount}}步</text>
                            <text class="fr_child_word">步数</text>
                        </div>
                    </div>
                </div>
                <div class="more_box">
                    <text class="more_date">{{startData}}</text>
                    <div class="more_items">
                        <text class="more_i_w">查看更多数据</text>
                        <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>                        
                    </div>
                </div>
            </div>
            <!-- 饮食记录 -->
            <div class="health_behavior">
                <div class="health_title">
                    <image class="icon_health" :src="getImgPath('icon_diet.png')"/>                    
                    <text class="health_word">饮食记录</text>
                </div>
                <div class="data_state">
                    <div class="diet_img">
                        <image v-if="dietaryState == '未记录'" class="diet_one" :src="getImgPath('diet_two.png')"/>
                        <image v-else class="diet_one" :src="getImgPath('diet_one.png')"/>
                        <text :class="[dietaryState == '未记录' ? 'state_color' : '']" class="dietary_state">{{dietaryState}}</text>
                    </div>
                    <text class="dietary_data">{{startData}}</text>
                </div>
                <div class="arrow_img" @click="jump('dietaryRecords')">
                    <text class="more_i_w">查看更多数据</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/> 
                </div>
            </div>
            <!-- 答题记录 -->
            <div class="health_behavior">
                <div class="health_title">
                    <image class="icon_health" :src="getImgPath('icon_question.png')"/>                    
                    <text class="health_word">答题记录</text>
                </div>
                <div class="data_state">
                    <div class="diet_img">
                        <image v-if="isAnswered == '未答题'" class="diet_one" :src="getImgPath('question_two.png')"/>                        
                        <image v-else class="diet_one" :src="getImgPath('question_one.png')"/>                        
                        <text :class="[isAnswered == '未答题' ? 'state_color' : '']" class="dietary_state" >{{isAnswered}}</text>
                    </div>
                    <text class="dietary_data">{{startData}}</text>
                </div>
                <div class="arrow_img" @click="jump('recordAnswer')">
                    <text class="more_i_w">查看更多数据</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/> 
                </div>
            </div>
            <text @click="jump('record')">随访记录</text>
            <!-- <div class="punch_the_clock"><text>打卡</text></div> -->
        </scroller>
    </div>
</template>
<script>
    import { WxcMinibar, Utils } from 'weex-ui';
    import { createLink, storage_getItem, printLog } from '../../shared/utils'
    import api from '../../shared/request'
    const storage = weex.requireModule('storage')
    export default {
        components: { WxcMinibar },
        data () {
            return {
                baseURL: '',
                oldBaseURL: '',
                mbrId: '',
                startData: '', // 饮食记录时间
                dietaryState: '', // 饮食记录状态
                publishTime: '', // 今日答题时间
                isAnswered: '', // 今日答题状态
                
                healthScore: '--', // 健康行为评分
                sportWeekSum: '--', // 运动
                dietWeekSum: '--', // 饮食
                measureWeekSum: '--', // 体重检测
                mustreadWeekSum: '--', // 今日必读

                sportScore: '--', //运动得分
                validTime: "--", // 有效运动时长
                validAvgHeart: "--", // 有效运动平均心率
                calorie: "--", //运动能量消耗
                stepCount: "--", //步数
                hheartExcTime: "--", //过强运动时长
                hAvgHeart: "--", //过强运动平均心率
            }
        },
        created () {
            if (WXEnvironment.platform == "Web") {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() - 190 + "px"
                };
            } else {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() + "px"
                };
            }
            this.articleToday()
        },
        methods: {
            articleToday: async function () {
                this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("newApiBase");
                this.oldBaseURL = await storage_getItem("oldApiBase");
                this.oldMBRID = '13690000001-mbr'
                this.startData = new Date(new Date().setDate(new Date().getDate()) - new Date().getTimezoneOffset() * 60000
                ).toISOString().slice(0, 10);
                // 健康行为
                let healthParams = {
                    start: this.startData,
                    end: this.startData
                }
                api.get(`${this.baseURL}health/evaluations/13690000000-mbr?`, healthParams, data => {
                    console.log(data, 'health')
                })
                // 运动
                let getsport = {
                    date: "2018-10-20",
                    mbrId: this.oldMBRID
                }
                api.get(
                    `${this.oldBaseURL}appehrservice/getsportsumdata.json?`,
                    getsport,
                    data => {
                    if (data.sportSumEntity) {
                        let entity = data.sportSumEntity;
                        this.sportScore = entity.sportScore;
                        this.validTime = Math.round(entity.validTime);
                        this.validAvgHeart = entity.validAvgHeart;
                        this.calorie = entity.calorie;
                        this.stepCount = entity.stepCount;
                        if (entity.hheartExcTime > 0) {
                            this.hheartExcTime = entity.hheartExcTime;
                        }
                        if (entity.hAvgHeart > 0) {
                            this.hAvgHeart = entity.hAvgHeart;
                        }
                    }
                })
                // 饮食记录
                let foodParams = {
                    date: this.startData,
                    userId: this.mbrId
                };
                api.get(`${this.baseURL}health/diet/one?`, foodParams, data => { // 饮食记录
                    console.log(data, 'food')
                    if (data.code == 200) {
                        data.data.questions.map(item => {
                            if (item.chose == null) {
                                this.dietaryState = '未记录'
                            } else {
                                this.dietaryState = '已记录'
                            }
                        })
                    }
                })
                // 答题记录
                let params = {
                    userId: this.mbrId
                };
                api.get(`${this.baseURL}health/article/today?`, params, data => { // 答题
                    console.log(data, 'data')
                    if (data.code == 200) {
                        if (data.data.isAnswered == 0) {
                            this.isAnswered = '未答题'
                        } else {
                            this.isAnswered = '已答题'
                        }
                    } else if (data.code == 202) {
                        this.isAnswered = '未答题'
                    }
                })
            },
            jump (path) {
                if(!path) return;
                const navigator = weex.requireModule('navigator')
                navigator.push({
                    url: createLink(path),
                    animated: "true"
                })
            },
            minibarLeftButtonClick () {},
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
        }
    }
</script>

<style lang="less" scoped>
    .scroller{
        background-color: rgb(238, 238, 238);
    }
    .modular{
        flex-direction: row;
        background-color: rgb(255, 255, 255);
    }
    .classification{
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .record_img{
        width: 112px;
        height: 112px;
        margin-top: 20px;
    }
    .classification_word{
        font-size: 30px;
        color: rgb(51, 51, 51);
        margin-bottom: 20px;
    }
    .health_behavior{
        flex-direction: column;
        background-color: rgb(255, 255, 255);
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 10px;
    }
    .health_title{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .icon_health{
        width: 40px;
        height: 40px;
    }
    .health_word{
        margin-left: 20px;
        font-size: 30px;
        color:rgb(51, 51, 51);
    }
    .health_fraction{
        flex-direction: row;
    }
    .fraction_left{
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-right-width: 1px;
        border-right-color: rgb(238, 238, 238);
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .left_f{
        font-size: 90px;
        color: rgb(2, 179, 237);
    }
    .left_word{
        font-size: 30px;
        color:rgb(2, 179, 237);
        margin-bottom: -35px;
    }
    .fraction_right{
        flex: 2.5;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .fr_children{
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
        border-right-width: 1px;
        border-right-color: rgb(238, 238, 238);
    }
    .fr_children:nth-child(even) {
        border-right: none;
    }
    .fr_child_num{
        margin-top: 25px;
        font-size: 36px;
        color: rgb(2, 179, 237);
        margin-bottom: 15px;
    }
    .fr_child_word{
        font-size: 30px;
        color:rgb(102, 102, 102);
        margin-bottom: 25px;
    }
    .more_box{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .more_date{
        font-size: 28px;
        color:rgb(102, 102, 102);
        margin-left: 30px;
    }
    .more_items{
        flex-direction: row;
        align-items: center;
    }
    .more_i_w{
        font-size: 26px;
        color:rgb(2, 179, 237);
        margin-right: 20px;
    }
    .arrow_right_blue{
        width: 20px;
        height: 24px;
    }
    .data_state{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .diet_img{
        flex-direction: row;
        align-items: center;
        margin-left: 50px;
    }
    .diet_one{
        width: 72px;
        height: 68px;
    }
    .dietary_state{
        font-size: 28px;
        color:rgb(2, 179, 237);
        margin-left: 30px;
    }
    .state_color{
        color:rgb(161, 161, 161);
    }
    .dietary_data{
        font-size: 28px;
        color:rgb(102, 102, 102);
        margin-right: 30px;
    }
    .arrow_img{
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .punch_the_clock{
        position: fixed;
        bottom: 100px;
        // right: 100px;
    }
</style>

