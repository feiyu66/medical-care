<template>
  <div class="box" style="position: relative;">
    <image style="position: absolute; left: 0; top: 0; width: 100%;" class="bg" :src="getImgPath('bg.png')"/>    
    <div class="header">
      <div class="head_left">
        <image @click="minibarLeftButtonClick" class="icon_back_white" :src="getImgPath('icon_back_white.png')"/>
      </div>
      <div class="head_right"><text v-if="hasPrevious" @click="jump('historicalReport')" class="head_r_word">历史健康报告</text></div>
    </div>
    <scroller class="scroller" :style="scrollStyle">
      <div class="presentation">
        <div class="title_too">
          <text class="presentation_title">{{name}}的健康报告</text>
          <text class="presentation_tooltip">报告周期：运动的第{{weekCount}}周</text>
        </div>
        <div class="message">
          <div class="tooltip_title">
            <text class="too_word">— 健康记录 —</text>
          </div>
          <div class="content_box">
            <div class="healthy">
              <text class="heal_word">这是{{name}}运动的第</text>
              <text class="heal_color">{{weekCount}}</text>
              <text class="heal_word">周，</text>
              <text class="heal_word">在此期间你记录了</text>
              <text class="heal_big">{{countWeight}}</text>
              <text class="heal_word">次体重，平均体重</text>
              <text class="heal_big">{{weightAvg}}</text>
              <text class="heal_word">kg，</text>
              <div v-if="hasPrevious" class="healthy_children"> 
                <text class="heal_word">比</text>
                <text class="heal_color" @click="lastPhase">上一期健康报告</text>
                <text class="heal_word">减少/增加了</text>
                <text class="heal_big">{{contrastPre}}</text>
                <text class="heal_word">kg，最低体重为</text>
                <text class="heal_big">{{weightMin}}</text>
                <text class="heal_word">kg，最高体重为</text>
                <text class="heal_big">{{weightMax}}</text>
                <text class="heal_word">kg;</text>
              </div>
            </div>
            <div class="healthy">
              <text class="heal_word">您测量了</text>
              <text class="heal_big">{{countBloodPressure}}</text>
              <text class="heal_word">次血压，其中有</text>
              <text class="heal_big">{{heightPressure}}</text>
              <text class="heal_word">次偏高，</text>
              <text class="heal_big">{{normalPressure}}</text>
              <text class="heal_word">次正常;</text> 
            </div>
            <div class="healthy">
              <text class="heal_word">您测量了</text>
              <text class="heal_big">{{countSuger}}</text>
              <text class="heal_word">次血糖，</text>
              <text class="heal_big">{{heightSuger}}</text>
              <text class="heal_word">次偏高。</text>
            </div>
          </div>
        </div> 
        <div class="message">
          <div class="tooltip_title">
            <text class="too_word">— 健康行为评分 —</text>
          </div>
          <div class="content">
            <text class="heal_word">此次报告周期你的运动情况如下：</text>
            <div class="healthy">
              <text class="heal_word">记录运动</text>
              <text class="heal_big">{{eSportsSum}}</text>
              <text class="heal_word">次，记录饮食</text>
              <text class="heal_big">{{eDietSum}}</text>
              <text class="heal_word">次；</text>
            </div>
            <div class="healthy">
              <text class="heal_word">记录体重</text>
              <text class="heal_big">{{countWeight}}</text>
              <text class="heal_word">次，每次必读</text>
              <text class="heal_big">{{eReadSum}}</text>
              <text class="heal_word">篇；</text>
            </div>
            <div class="healthy">
                <text class="heal_word">健康行为平均分</text>
                <text class="heal_big">{{scoreAvg}}</text>
                <text class="heal_word">分，其中</text>
                <text class="heal_big">{{goodSum}}</text>
                <text class="heal_word">次优秀，</text>
                <text class="heal_big">{{normalSum}}</text>
                <text class="heal_word">次表现一般，</text>
                <text class="heal_big">{{badSum}}</text>
                <text class="heal_word">次表现较差。</text>
            </div>
          </div>
        </div>
        <div class="message">
          <div class="tooltip_title">
            <text class="too_word">— 医师补充建议 —</text>
          </div>
          <div class="content">
            <textarea @input="inputTextWord" class="proposal" placeholder="请填写建议"></textarea>
            <div class="number_too">
              <text class="num_tooltip">字数限制：{{wordNum}}/1000字</text>
            </div>
          </div>
        </div>
        <div class="sure"><text class="sureBtn" @click="sureBtnData">确定提交</text></div>
      </div>
    </scroller>
    <wxc-dialog
      content="内容为空，是否提交？"
      :show="show"
      :single="false"
      :is-checked="isChecked"
      :show-no-prompt="false"
      main-btn-color="#02b4ed"
      @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
      @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
      @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
    </wxc-dialog>
  </div>
</template>
<script>
import { WxcMinibar, WxcDialog, Utils } from "weex-ui";
import { createLink, storage_getItem} from "../../shared/utils"
import api from '../../shared/request'
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  components: {
    WxcMinibar, WxcDialog
  },
  data () {
    return {
      show: false,
      isChecked: false,
      name: '许嵩',
      wordNum: 0,
      proposalWord: '',
      drId: '15010520610-dr', // 医生id
      reportId: 0, // 报告id
      badSum: null, // 较差次数
      contrastPre: null, // 平均体重比较上一次差值, 
      countBloodPressure: null, // 血压测量次数, 
      countSuger: null, // 血糖测量次数, 
      countWeight: null, // 体重测量次数, 
      eDietSum: null, // 饮食次数, 
      eMeasureSum: null, // 必测次数, 
      eReadSum: null, // 必读次数, 
      eSportsSum: null, // 运动次数, 
      goodSum: null, // 评价优秀次数, 
      heightPressure: null, // 0高血压次数, 
      heightSuger: null, // 高血糖次数, 
      normalPressure: null, // 正常血压次数, 
      normalSum: null, // 评价一般次数, 
      scoreAvg: null, // 评价平均分, 
      weekCount: null, // 周期
      weightAvg: null, // 平均体重, 
      weightMax: null, // 最大体重, 
      weightMin: null, // 体重最小值
      hasPrevious: null, // 是否有上个报告
      previousId: null, // 上个报告ID
    }
  },
  created () {
    this.title = this.name + '的健康报告'
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
    this.reportData()
  },
  methods: {
    reportData: async function () {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      console.log(this.mbrId, this.baseURL)
      let params = {
        mbrId: '001111-mbr'
      }
      api.get(`${this.baseURL}health/report/${this.reportId}?`, params, data =>{
        console.log(data)
        if (data.code == 200) {
          this.badSum = data.data.badSum // 较差次数
          this.contrastPre = data.data.contrastPre // 平均体重比较上一次差值, 
          this.countBloodPressure = data.data.countBloodPressure // 血压测量次数, 
          this.countSuger = data.data.countSuger // 血糖测量次数, 
          this.countWeight = data.data.countWeight // 体重测量次数, 
          this.eDietSum = data.data.eDietSum // 饮食次数, 
          this.eMeasureSum = data.data.eMeasureSum // 必测次数, 
          this.eReadSum = data.data.eReadSum // 必读次数, 
          this.eSportsSum = data.data.eSportsSum // 运动次数, 
          this.goodSum = data.data.goodSum // 评价优秀次数, 
          this.heightPressure = data.data.heightPressure // 0高血压次数, 
          this.heightSuger = data.data.heightSuger // 高血糖次数, 
          this.normalPressure = data.data.normalPressure // 正常血压次数, 
          this.normalSum = data.data.normalSum // 评价一般次数, 
          this.scoreAvg = data.data.scoreAvg // 评价平均分, 
          this.weekCount = data.data.weekCount
          this.weightAvg = data.data.weightAvg // 平均体重, 
          this.weightMax = data.data.weightMax // 最大体重, 
          this.weightMin = data.data.weightMin // 体重最小值
          this.hasPrevious = data.data.hasPrevious // 是否有上个报告
          this.reportId = data.data.reportId
          if (data.data.previousId) {
            this.previousId = data.data.previousId
          }
        }
      })
    },
    lastPhase () {
      this.reportId = this.previousId
      this.reportData()
    },
    inputTextWord (event){
      this.wordNum = 1000 - event.value.length
      this.proposalWord = event.value
    },
    sureBtnData () {
      if (this.wordNum == 0) {
        this.show = true
      } else {
        this.reportFillSuggest()
      }
    },
    wxcDialogCancelBtnClicked () { //取消
      //此处必须设置，组件为无状态组件，自己管理
      this.show = false;
    },
    wxcDialogConfirmBtnClicked () { // 确定
      //此处必须设置，组件为无状态组件，自己管理
      this.reportFillSuggest()
      this.show = false;
    },
    reportFillSuggest () {
      let params = {
        suggest: this.proposalWord
      }
      console.log(this.reportId)
      console.log(JSON.stringify(params))
      api.jsonpost(`${this.baseURL}health/report/fillSuggest/${this.reportId}/${this.drId}?`, 
      JSON.stringify(params),
      data => {
        console.log(data)
        if (data.code == 200) {
          modal.toast({ message: data.msg, duration: 1 });
          setTimeout(() => {
            const navigator = weex.requireModule('navigator')
            navigator.push({
                url: createLink('reportDetails'),
                animated: "true"
            })
            storage.setItem('reportId', this.reportId)
          }, 1000)
        } else {
          modal.toast({ message: data.msg, duration: 1 });
        }
      })
    },
    wxcDialogNoPromptClicked (e) {
      //此处必须设置，组件为无状态组件，自己管理
      this.isChecked = e.isChecked;
    },
    jump (path) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink(path),
        animated: "true"
      })
    },
    minibarLeftButtonClick () {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    }
  }
}
</script>
<style lang="less" scoped>
  .box{
    background-color: rgb(255, 255, 255);
  }
  .bg{
    height: 503px;
  }
  .header{
    height: 90px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .head_left{
    margin-left: 30px;
  }
  .icon_back_white{
    width: 40px;
    height: 40px;
  }
  .head_right{
    margin-right: 30px;
  }
  .head_r_word{
    font-size: 30px;
    color: rgb(255, 255, 255);
  }
  .title_too{
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .presentation{
    flex-direction: column;
    align-items: center;
  }
  .presentation_title{
    margin-top: 10px;
    padding-bottom: 30px;
    font-size: 34px;
    color: rgb(255, 255, 255);
  }
  .presentation_tooltip{
    font-size: 34px;
    color:rgb(255, 255, 255);
    margin-bottom: 26px;
  }
  .message{
    width: 690px;
    background-color: rgb(255, 255, 255);
    border-width: 1px;
    border-color: rgb(219, 219, 219);
    border-radius: 15px;
    margin-bottom: 20px;
    padding: 30px;
    box-shadow: 0 0 10px rgb(221, 221, 221);
  }
  .tooltip_title{
    flex-direction: row;
    justify-content: center;
    margin-bottom: 5px;
  }
  .too_word{
    font-size: 32px;
    color: rgb(2, 179, 237);
  }
  .healthy{
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .healthy_children{
    width: 628px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .healthy{
    margin-top: 25px;
  }
  .heal_word{
    font-size: 28px;
    color: rgb(102, 102, 102);
  }
  .heal_color{
    font-size: 28px;
    color: rgb(2, 179, 237);
  }
  .heal_big{
    font-size: 34px;
    color:rgb(102, 102, 102);
  }
  .content{
    margin-top: 30px;
  }
  .proposal{
    height: 178px;
    border-width: 1px;
    border-color: rgb(221, 221, 221);
    padding: 20px;
    font-size: 26px;
    color: rgb(187, 187, 187);
  }
  .number_too{
    flex-direction: row;
    justify-content: flex-end;
  }
  .num_tooltip{
    font-size: 24px;
    color:rgb(187, 187, 187);
  }
  .sure{
    flex-direction: row;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .sureBtn{
    width: 510px;
    height: 80px;
    background-color: rgb(2, 179, 237);
    color:rgb(255, 255, 255);
    text-align: center;
    line-height: 80px;
    border-radius: 999px;
    font-size: 32px;
  }
</style>

