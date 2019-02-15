<template>
  <div class="box">
    <wxc-minibar :title="'修改' + modifyName"
      background-color="#02b3ed"
      text-color="#ffffff"
      left-button="http://p87909xfg.bkt.clouddn.com/icon_back.png"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <div class="food_title">
      <text :class="[num == index ? 'woed_on' : '']" @click="foodDatas(index, item.type, item.food, item.share)" class="food_type" v-for="(item, index) in titleFoodData" :key='index'>{{item.name}}</text>
    </div>
    <scroller class="scroller" :style="scrollStyle">
      <div class="classification_box">
          <div class="classification" v-for="(item, index) in itemFood" :key='index'>
              <text class="classification_type">{{item.name}}（{{item.perUnitG}}g/份、{{item.kcal}}kcal）</text>
              <div class="symbol_box">
                  <div class="symbol_a" @click="symbolReduce(index)"><text class="symbol_word">-</text></div>
                  <text class="symbol_num">{{item.value}}</text>
                  <div class="symbol_b" @click="symbolAdd(index)"><text class="symbol_word">+</text> </div>
              </div>
          </div>
      </div>
      <div class="share_box">
          <text class="share_word">已选</text>
          <text class="share">{{theSum}}</text>
          <text class="share_word">份，还可选择</text>
          <text class="share">{{share_num}}</text>
          <text class="share_word">份</text>
      </div>
      <div class="submission">
        <text :class="[theSum == share ? 'bg' : 'on']">保存</text>
      </div>
    </scroller>
  </div>
</template>
<script>
import { WxcMinibar, WxcPopup, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcMinibar, WxcPopup
  },
  data () {
      return {
        mbrId: '',
        baseURL: '',
        modifyName: '', // 早午晚
        foodTypes: '', // 食物类型
        titleFoodData: [],
        num: 0,
        type: null,
        itemFood: [], // 食物分类
        BREFOOD: [],
        BRE_SHARE: [],
        share: 0, // 总份数
        share_num: 0, // 未选
        theSum: 0, // 已选
      }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 170 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.foodTool()
  },
  methods: {
    foodTool: async function () {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.modifyName = await storage_getItem('modifyName')
      this.foodTypes = await storage_getItem('foodTypes')
      this.BREFOOD = await storage_getItem('breFood')
      this.BRE_SHARE = await storage_getItem('BRE_SHARE')
      this.titleFoodData = []
      let type = this.foodTypes.split(',')
      let BREFOOD = this.BREFOOD.split(',')
      let BRE_SHARE = this.BRE_SHARE.split(',')
      type.map((item, i) => {
        let obj = {}
        let foodName = ''
        if (item == 1) { foodName = '谷薯类'}
        else if (item == 2) { foodName = '蔬菜类'}
        else if (item == 3) { foodName = '肉蛋类'}
        else if (item == 4) { foodName = '大豆类'}
        else if (item == 5) { foodName = '奶类'}
        else if (item == 6) { foodName = '水果类'}
        else if (item == 7) { foodName = '油脂类'}
        obj.name = foodName
        obj.type = item
        obj.food  = BREFOOD[i]
        obj.share = BRE_SHARE[i]
        this.titleFoodData.push(obj)
      })
      this.type = this.titleFoodData[0].type
      let food = this.titleFoodData[0].food
      this.share = this.titleFoodData[0].share
      this.theSum = this.share
      this.share_num = this.share - this.theSum
      let params = {
          types: this.type
      }
      this.itemFood = []
      api.get(`${this.baseURL}health/food/tool?`, params, data => {
          this.itemFood = data.data
          this.itemFood.map(item => {
            if (food.indexOf(item.name) !== -1) {
              item.value = this.share
            } else {
              item.value = 0
            }
          })
      })
    },
    foodDatas (index, type, food, share) {
      this.num = index
      this.type = type
      this.share = share
      this.theSum = this.share
      let params = {
          types: this.type
      }
      this.itemFood = []
      api.get(`${this.baseURL}health/food/tool?`, params, data => {
          console.log(data)
          this.itemFood = data.data
          this.itemFood.map(item => {
            if (food.indexOf(item.name) !== -1) {
              item.value = share
            } else {
              item.value = 0
            }
          })
      })
    },
    symbolReduce (index) { // 减份数
      let idx = this.itemFood[index]
      let reduceNum = 0
      if (idx.value <= 0) {
          reduceNum = 0
      } else {
          reduceNum = Number(idx.value) - 0.5
      }
      this.itemFood.map(item => {
          if (item.name == idx.name) {
              item.value = reduceNum
          }
      })
      this.$forceUpdate()
      this.theSum = 0
      this.itemFood.map(item => {
          this.theSum += Number(item.value)
      })
      this.share_num = this.share - this.theSum
    },
    symbolAdd (index) { // 添加份数
      let idx = this.itemFood[index]
      this.itemFood.map(item => {
          if (this.theSum < this.share && item.name == idx.name) {
              item.value = Number(idx.value) + 0.5
          }
      })
      this.$forceUpdate()
      this.theSum = 0
      this.itemFood.map(item => {
          this.theSum += Number(item.value)
      })
      this.share_num = this.share - this.theSum
    },
    minibarLeftButtonClick () {}
  }
}
</script>
<style lang="less" scoped>
  .food_title{
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #02b3ed;
  }
  .food_type{
    flex: 1;
    height: 80px;
    text-align: center;
    line-height: 80px;
  }
  .woed_on{
    color: #02b3ed;
  }
  .classification_box{
    padding-bottom: 30px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .classification{
      margin-top: 20px;
      margin-left: 30px;
      margin-right: 30px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
  }
  .classification_type{
      font-size: 28px;
      color:rgb(2, 179, 237);
  }
  .symbol_box{
      flex-direction: row;
      align-items: center;
  }
  .symbol_a, .symbol_b{
      width: 60px;
      height: 50px;
      background-color: #EEEEEE;
  }
  .symbol_a{
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
  }
  .symbol_b{
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
  }
  .symbol_word{
      font-size: 44px;
      color: #CCCCCC;
      text-align: center;
      line-height: 50px;
  }
  .symbol_num{
      width: 50px;
      height: 50px;
      font-size: 26px;
      color:rgb(2, 179, 237);
      text-align: center;
      line-height: 50px;
      background-color: #F8F8F8;
  }
  .replace_box{
      height: 90px;
      background-color: rgb(2, 179, 237);
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
  .replace_word{
      font-size: 36px;
      color: rgb(255, 255, 255);
  }
  .share_box{
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-top: 50px;
    margin-right: 20px;
  }
  .share_word{
      font-size: 28px;
      color: rgb(102, 102, 102);
  }
  .share{
      border-width: 1px;
      border-color: rgb(2, 179, 237);
      border-radius: 5px;
      padding: 2px 20px;
      font-size: 24px;
      color:rgb(2, 179, 237);
      margin-left: 10px;
      margin-right: 10px;
  }
  .submission{
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 70px;
    margin-bottom: 20px;
  }
  .bg, .on{
    width: 200px;
    height: 70px;
    border-radius: 10px;
    text-align: center;
    line-height: 70px;
    color: rgb(255, 255, 255)
  }
  .bg{
    background-color: #02b3ed;
  }
  .on{
    background-color: rgb(238, 238, 238);
  }
</style>
