<template>
  <div class="box">
    <div class="medical_history" v-for="(item, index) in historyData" :key='index'>
      <text class="time">{{item.time}}</text>
      <div class="history_title" style="width: 95%; marginLeft: 5%;">
        <image class="illness" :src="getImgPath('family.png')"/>
        <text class="word">家族史：</text>
        <text v-if="diseaseFlag" class="diseaseData">{{item.familyHistory}}</text>
        <text v-else class="noWord">无</text>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../shared/request'
import { storage_getItem, printLog } from "../../shared/utils";
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  data () {
    return {
      baseURL: "",
      mbrId: "",
      historyData: [],
      diseaseFlag: false, // 疾病史
    }
  },
  created () {
    this.medicalHistoryData()
  },
  methods: {
    medicalHistoryData: async function() {
      this.historyData = []
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let userId = '13965100566-mbr'
      console.log(this.mbrId, this.baseURL)
      let params = {
        // userId: '13978100708-mbr'
      };
      api.get(`${this.baseURL}health/healthCheck/medicalHistory/${userId}`, params, data => {
        console.log(data)
        for (let i in data.data) {
          if (i == 'familyHistory') {
            this.historyData.push(data.data[i])
            this.historyData.map(item => {
              let newDate = new Date(item.time);
              let Month = newDate.getMonth() + 1
              let Data = newDate.getDate()
              Month = Month < 10 ? '0' + Month : Month // 月
              Data = Data <10 ? '0' + Data : Data // 日
              item.time = newDate.getFullYear() + '年' + Month + '月' + Data + '日'
              this.diseaseFlag = item.familyHistory == '' ? false : true
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .box{
    background-color: rgb(255, 255, 255);
    flex: 1;
    margin-top: 10px;
  }
  .time{
    margin-left: 30px;
    font-size: 32px;
    color: rgb(51, 51, 51);
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    margin-top: 30px;
    padding-bottom: 30px;
  }
  .medical_history{
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
  }
  .history_title{
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    flex-direction: row;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .medical_history>.history_title:last-child{
    border: none;
  }
  .illness{
    width: 40px;
    height: 40px;
  }
  .word{
    font-size: 30px;
    color: rgb(68, 68, 68);
    margin-left: 10px;
  }
  .diseaseData, .noWord{
    width: 500px;
    margin-left: 20px;
    font-size: 28px;
    color: rgb(2, 179, 237);
  }
</style>
