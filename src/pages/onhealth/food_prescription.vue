<template>
  <div class="box">
    <wxc-minibar title='饮食处方'
      background-color="#02b3ed"
      text-color="#ffffff"
      left-button="http://doctor.dlcaring.com/icon_back_white.png"
      right-text='更换推荐'
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
      @wxcMinibarRightButtonClicked="minibarRightButtonClick"></wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
      <div><text class="totalEnergy">总计：{{totalEnergy}}</text></div>
      <div class="food_box" v-for="(item, index) in breData" :key='item.energy'>
        <div class="food_title">
            <image class="breakfast" :src="getImgPath('breakfast.png')"/>
            <text class="title_word">早餐（总计{{item.energy}}kcal）</text>
        </div>
        <div style="width: 95%; marginLeft: 5%;" class="food_content">
            <div class="food_type">
                <text class="name">奶类</text>
                <div class="food_item">
                    <div class="details_div" v-for="(list, idx) in item.mils" :key='idx'>
                        <text class="food_name">{{list.name}}</text>
                        <text class="share">{{list.piece}}份</text>
                    </div>
                </div>
            </div>
            <div class="food_type">
                <text class="name">谷薯类</text>
                <div class="food_item">
                    <div class="details_div" v-for="(list, idx) in item.gras" :key='idx'>
                        <text class="food_name">{{list.name}}</text>
                        <text class="share">{{list.piece}}份</text>
                    </div>
                </div>
            </div>
            <div class="food_type">
                <text class="name">肉蛋类</text>
                <div class="food_item">
                    <div class="details_div" v-for="(list, idx) in item.meas" :key='idx'>
                        <text class="food_name">{{list.name}}</text>
                        <text class="share">{{list.piece}}份</text>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div class="food_box" v-for="(item, index) in lunData" :key='item.energy'>
          <div class="food_title">
              <image class="breakfast" :src="getImgPath('lunch.png')"/>
              <text class="title_word">午餐（总计{{item.energy}}kcal）</text>
          </div>
          <div style="width: 95%; marginLeft: 5%;" class="food_content">
              <div class="food_type">
                  <text class="name">蔬菜类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.vges" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">大豆类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.beas" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">油脂类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.oils" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">谷薯类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.gras" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">肉蛋类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.meas" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="food_box" v-for="(item, index) in dinData" :key='item.energy'>
          <div class="food_title">
              <image class="breakfast" :src="getImgPath('supper.png')"/>
              <text class="title_word">晚餐（总计{{item.energy}}kcal）</text>
          </div>
          <div style="width: 95%; marginLeft: 5%;" class="food_content">
              <div class="food_type">
                  <text class="name">蔬菜类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.vges" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
               <div class="food_type">
                  <text class="name">谷薯类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.gras" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">肉蛋类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.meas" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
              <div class="food_type">
                  <text class="name">油脂类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in item.oils" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="food_box">
          <div class="food_title">
              <image class="breakfast" :src="getImgPath('fruits.png')"/>
              <text class="title_word">水果（总计{{PLU_ENERGY}}kcal）</text>
          </div>
          <div style="width: 95%; marginLeft: 5%;" class="food_content">
              <div class="food_type">
                  <text class="name">水果类</text>
                  <div class="food_item">
                        <div class="details_div" v-for="(list, idx) in fruitsData" :key='idx'>
                            <text class="food_name">{{list.name}}</text>
                            <text class="share">{{list.piece}}份</text>
                        </div>
                  </div>
              </div>
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
      drId: '',
      totalEnergy: '', // 总能量
      PLU_ENERGY: '', // 水果总能量
      breData: [], // 早餐
      lunData: [], // 午餐
      dinData: [], // 晚餐
      fruitsData: [], // 水果
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
    this.foodQuantity()
  },
  methods: {
    foodQuantity: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      // this.date = await storage_getItem("date");
      console.log(this.mbrId, this.baseURL);
      let mbrId = '15081209790-mbr'
      let params = {
          patientId: mbrId
      }
      api.get(`${this.baseURL}health/patient/teamInfo?`, params, data => {
          console.log(data, 'mbrId')
          if (data.code == 200) {
              this.drId = data.data.drId
              let ps = {
                userId: mbrId,
                energy: 0
              }
              api.get(`${this.baseURL}health/food/prescription/1/${this.drId}?`, ps, data => {
                console.log(data)
                if (data.code == 200) {
                   for (let i in data.data.prescription) {
                       if (i == 'totalEnergy') { // 总能量
                          this.totalEnergy = data.data.prescription[i]
                       } else if (i == 'fruitEnergy') { // 水果能量
                           this.PLU_ENERGY = data.data.prescription[i]
                       } else if (i == 'bre') { // 早餐
                            this.breData.push(data.data.prescription[i])
                       } else if (i == 'lun') { // 午餐
                            this.lunData.push(data.data.prescription[i])
                       } else if (i == 'din') { // 晚餐
                            this.dinData.push(data.data.prescription[i])
                       } else if (i == 'fruits') { // 水果
                           this.fruitsData = data.data.prescription[i]
                       }
                   } 
                }
              })
          }
      })
    },
    minibarLeftButtonClick () {},
    minibarRightButtonClick () {
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink('foodReplace'),
        animated: "true"
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .totalEnergy{
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 30px;
    color: rgb(51, 51, 51);
  }
  .food_title{
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    flex-direction: row;
    align-items: center;
  }
  .breakfast{
    margin-left: 30px;
    width: 60px;
    height: 60px;
  }
  .title_word{
    margin-left: 20px;
    font-size: 30px;
    color: rgb(51, 51, 51);
  }
  .food_type{
    width: 712px;
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    padding-bottom: 20px;
    margin-top: 20px;
  }
  .name{
    width: 200px;
    font-size: 26px;
    color: rgb(102, 102, 102);
    margin-left: 30px;
  }
  .food_item{
      flex-direction: column;
  }
  .details_div{
      width: 512px;
      flex-direction: row;
      align-items: center;
  }
  .food_name{
      width: 300px;
  }
  .food_name, .share{
    font-size: 24px;
    color:rgb(153, 153, 153);
  }
</style>
