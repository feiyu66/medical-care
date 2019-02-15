<template>
  <div class="box">
    <wxc-minibar title='饮食处方'
      background-color="#02b3ed"
      text-color="#ffffff"
      left-button="http://doctor.dlcaring.com/icon_back_white.png"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"></wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
      <div class="headEnergy">
          <text class="totalEnergy">总计 ({{totalEnergy}})</text>
          <image class="editImg" @click="totalEnergyNum" :src="getImgPath('total.png')"/>
      </div>
      <div>
        <div class="food_box" v-for="(item, index) in breData">
            <div class="food_title">
                <text class="title_word" style="background-color: rgb(255, 226, 226);">早餐（{{item.energy}}kcal）</text>
                <image @click="openPopup('早餐', '5,1,3', breData, BRE_SHARE)" class="breakfast" :src="getImgPath('breakfast.png')"/>                
                <!-- <image @click="jump('itemModify', '早餐', '5,1,3', breFood, BRE_SHARE)" class="editImg" :src="getImgPath('icon_record.png')"/> -->
            </div>
            <div class="food_content">
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
      </div>
      <div class="food_box" v-for="(item, index) in lunData">
          <div class="food_title">
              <text class="title_word" style="background-color: rgb(255, 237, 225);">午餐（{{item.energy}}kcal）</text>              
              <image  @click="openPopup('午餐', '2,4,7,1,3', lunData, LUN_SHARE)" class="breakfast" :src="getImgPath('lunch.png')"/>
              <!-- <image  @click="jump('itemModify', '午餐', '2,4,7,1,3', lunFood, LUN_SHARE)" class="editImg" :src="getImgPath('icon_record.png')"/> -->
          </div>
          <div class="food_content">
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
      <div class="food_box" v-for="(item, index) in dinData">
          <div class="food_title">
              <text class="title_word" style="background-color: rgb(255, 247, 213);">晚餐（{{item.energy}}kcal）</text>              
              <image @click="openPopup('晚餐', '2,1,3,7', dinData, DIN_SHARE)" class="breakfast" :src="getImgPath('supper.png')"/>
              <!-- <image @click="jump('itemModify', '晚餐', '2,1,3,7', dinFood, DIN_SHARE)" class="editImg" :src="getImgPath('icon_record.png')"/> -->
          </div>
           <div class="food_content">
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
              <text class="title_word" style="background-color: rgb(237, 255, 213);">水果（{{PLU_ENERGY}}kcal）</text>
              <image @click="openPopup('水果', '6', fruitsData, PLU_SHARE)" class="breakfast" :src="getImgPath('fruits.png')"/>              
              <!-- <image @click="jump('itemModify', '水果', '6', pluFood, PLU_SHARE)" class="editImg" :src="getImgPath('icon_record.png')"/> -->
          </div>
          <div class="food_content">
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
      <div class="footer" @click="submissionData">
        <text class="foo_word">确定</text>
       </div>
    </scroller>
    <!-- 修改总kcal -->
    <wxc-popup popup-color="rgb(255, 255, 255)"
        :show="isBottomShow"
        style="z-index: 9;"
        pos="bottom"
        height="400">
      <div class="demo-content" style="position: relative;">
        <div class="close_box" @click="closeBox">
            <image class="icon_cancel_img" :src="getImgPath('icon_cancel.png')"/> 
        </div>
        <div class="demo_title"><text class="demo_t_word">修改总卡路里</text></div>
        <div class="kl_box">
            <text class="kl_total">总计:</text>
            <input @input="inputNum" class="inputBox" type="text">
            <text class="kl_total">kcal</text>
        </div>
        <div class="sure_modify" @click="sureData">
            <text class="sure_word">确定</text>
        </div>
      </div>
    </wxc-popup>
    <!-- 修改饮食处方 -->
    <wxc-popup popup-color="rgb(238, 238, 238)"
        :show="show"
        style="z-index: 9;"
        pos="right">
        <div class="demo-title">
            <div class="icon_block" @click="showCalendarModel"><image class="icon_back_white" :src="getImgPath('icon_back_white.png')"/></div>
            <text class="title_content">修改{{modifyName}}</text>
            <text class="preservation"></text>
        </div>
        <div class="foodTitle">
            <text :class="[num == index ? 'woed_on' : '']" @click="foodDatas(index, item.type, item.ne)" class="foodType" v-for="(item, index) in titleFoodData" :key='index'>{{item.name}}</text>
        </div>
        <scroller class="modify_the_p" :style="popupStyle">
            <div class="classification_box">
                <div class="classification" v-for="(item, index) in itemFood" :key='index'>
                    <text :class="[item.value == 0 ? 'class_type_on' : '']" class="classification_type">{{item.name}}（{{item.perUnitG}}g/份、{{item.kcal}}kcal）</text>
                    <div class="symbol_box">
                        <div class="symbol_a" @click="symbolReduce(index)">
                            <text :class="[item.value == 0 ? 'symbol_word_color' : '']" class="symbol_word">-</text>
                        </div>
                        <text :class="[item.value == 0 ? 'symbol_num_color' : '']" class="symbol_num">{{item.value}}</text>
                        <div class="symbol_b" @click="symbolAdd(index)">
                            <text :class="[item.value == 0 ? 'symbol_word_color' : '']" class="symbol_word">+</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="share_box">
                <text class="share_word">共</text>
                <text class="share_f">{{theSum}}</text>
                <text class="share_word">/{{share}}份</text>
            </div>
            <div class="submission">
                <text :class="[theSum == share ? 'bg' : 'on']" @click="eachModification">保存</text>
            </div>
        </scroller>
    </wxc-popup>
  </div>
</template>
<script>
import { WxcMinibar, WxcPopup, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
const storage = weex.requireModule('storage')
export default {
    components: {
        WxcMinibar, WxcPopup
    },
    data () {
        return {
            mbrId: '15081209790-mbr',
            MBRId: '',
            baseURL: '',
            isBottomShow: false, // 总卡路里
            show: false, // 饮食处方
            inputValue: 0, // input value
            totalEnergy: '', // 总能量
            PLU_ENERGY: '', // 水果总能量
            breData: [], // 早餐
            lunData: [], // 午餐
            dinData: [], // 晚餐
            fruitsData: [], // 水果
            breFood: [], // 早餐食物
            lunFood: [], // 午餐食物
            dinFood: [], // 晚餐食物
            pluFood: [], // 水果
            BRE_SHARE: [], // 早餐总份数
            LUN_SHARE: [], // 午餐总分数
            DIN_SHARE: [], // 晚餐总分数
            PLU_SHARE: [], // 水果总份数

            modifyName: '', // 早午晚
            foodTypes: '', // 食物类型
            titleFoodData: [],
            num: 0,
            type: null,
            itemFood: [], // 食物分类
            share: 0, // 总份数
            share_num: 0, // 未选
            theSum: 0, // 已选
            prescriptionVo: [], // 保存修改数据
            prescriptionId: null, // 饮食推荐id
            FOOD_DATA: [],
            BRE_food: []
        }
    },
    created () {
        if (WXEnvironment.platform == "Web") {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() - 170 + "px"
            };
            this.popupStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() - 170 + "px"
            };
        } else {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() + "px"
            };
            this.popupStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() + "px"
            };
        }
        this.foodQuantity()
    },
    methods: {
        foodQuantity: async function() {
            this.MBRId = await storage_getItem("mbrId");
            this.baseURL = await storage_getItem("newApiBase");
            // this.date = await storage_getItem("date");
            console.log(this.mbrId, this.baseURL);
            let params = {
                patientId: this.mbrId
            }
            api.get(`${this.baseURL}health/patient/teamInfo?`, params, data => {
                console.log(data, 'mbrId')
                if (data.code == 200) {
                    this.drId = data.data.drId
                    this.foodPrescription(this.drId)
                }
            })
        },
        foodPrescription (drId) {
            this.breData = [] // 早餐
            this.lunData = [] // 午餐
            this.dinData = [] // 晚餐
            this.fruitsData = [] // 水果
            this.breFood = [] // 早餐食物
            this.lunFood = [] // 午餐食物
            this.dinFood = [] // 晚餐食物
            this.pluFood = [] // 水果
            this.BRE_SHARE = [] // 早餐总份数
            this.LUN_SHARE = [] // 午餐总分数
            this.DIN_SHARE = [] // 晚餐总分数
            this.PLU_SHARE = [] // 水果总份数
            let params = {
                userId: this.mbrId,
                energy: this.inputValue
            }
            api.get(`${this.baseURL}health/food/prescription/1/${drId}?`, params, data => {
                console.log(data)
                let prescription = data.data.prescription
                this.prescriptionId = data.data.id
                this.prescriptionVo = data.data.prescription
                if (data.code == 200) {
                    this.prescriptionData(prescription)
                    if (this.isBottomShow) {
                        modal.toast({ message: '修改成功', duration: 1 });
                        setTimeout(() => {
                            this.isBottomShow = false
                        }, 1000)
                    }
                    this.$forceUpdate() 
                }
            }) 
        },
        prescriptionData (prescription) {
            for (let i in prescription) {
                if (i == 'totalEnergy') { // 总能量
                    this.totalEnergy = prescription[i]
                } else if (i == 'fruitEnergy') { // 水果能量
                    this.PLU_ENERGY = prescription[i]
                } else if (i == 'bre') { // 早餐
                    this.breData.push(prescription[i])
                    prescription[i].mils.map(item => {
                        this.breFood.push(item.name) // 早餐食物
                        this.BRE_SHARE.push(item.piece) // 早餐总份数
                    })
                    prescription[i].gras.map(item => {
                        this.breFood.push(item.name) // 早餐食物
                        this.BRE_SHARE.push(item.piece) // 早餐总份数
                    })
                    prescription[i].meas.map(item => {
                        this.breFood.push(item.name) // 早餐食物
                        this.BRE_SHARE.push(item.piece) // 早餐总份数
                    })
                } else if (i == 'lun') { // 午餐
                    this.lunData.push(prescription[i])
                    prescription[i].vges.map(item => {
                        this.lunFood.push(item.name) // 午餐食物
                        this.LUN_SHARE.push(item.piece) // 午餐总分数
                    })
                    prescription[i].beas.map(item => {
                        this.lunFood.push(item.name) // 午餐食物
                        this.LUN_SHARE.push(item.piece) // 午餐总分数
                    })
                    prescription[i].oils.map(item => {
                        this.lunFood.push(item.name) // 午餐食物
                        this.LUN_SHARE.push(item.piece) // 午餐总分数
                    })
                    prescription[i].gras.map(item => {
                        this.lunFood.push(item.name) // 午餐食物
                        this.LUN_SHARE.push(item.piece) // 午餐总分数
                    })
                    prescription[i].meas.map(item => {
                        this.lunFood.push(item.name) // 午餐食物
                        this.LUN_SHARE.push(item.piece) // 午餐总分数
                    })
                } else if (i == 'din') { // 晚餐
                    this.dinData.push(prescription[i])
                    prescription[i].vges.map(item => {
                        this.dinFood.push(item.name) // 晚餐食物
                        this.DIN_SHARE.push(item.piece) // 晚餐总分数 
                    })
                    prescription[i].gras.map(item => {
                        this.dinFood.push(item.name) // 晚餐食物
                        this.DIN_SHARE.push(item.piece) // 晚餐总分数 
                    })
                    prescription[i].meas.map(item => {
                        this.dinFood.push(item.name) // 晚餐食物
                        this.DIN_SHARE.push(item.piece) // 晚餐总分数 
                    })
                    prescription[i].oils.map(item => {
                        this.dinFood.push(item.name) // 晚餐食物
                        this.DIN_SHARE.push(item.piece) // 晚餐总分数 
                    })
                } else if (i == 'fruits') { // 水果
                    this.fruitsData = prescription[i]
                    prescription[i].map(item => {
                        this.pluFood.push(item.name) // 水果
                        this.PLU_SHARE.push(item.piece) // 水果总份数
                    })
                }
            }
        },
        inputNum (event) { // 获取input value
            this.inputValue = event.value
        },
        sureData () { // 提交修改卡路里数据
            if (this.inputValue < 1000) {
                modal.toast({ message: "不能低于1000kal", duration: 1 });
            } else if (this.inputValue > 4000) {
                modal.toast({ message: "不能超过4000kal", duration: 1 });
            } else {
                this.foodPrescription('13693371465-dr')
            }
        },
        totalEnergyNum () { // 显示修改卡路里弹框
            this.isBottomShow = true;
        },
        closeBox () { // 关闭修改卡路里弹框
            this.isBottomShow = false
        },
        openPopup (name, type, BRE_food, share) {
            this.show = true
            this.BRE_food = BRE_food
            this.modifyName = name // 修改时间
            this.titleFoodData = []
            let types = type.split(',')
            types.map((item, i) => {
                let obj = {}
                let foodName = ''
                let ne = ''
                if (item == 1) { 
                    foodName = '谷薯类' 
                    ne = 'gras'
                } else if (item == 2) { 
                    foodName = '蔬菜类'
                    ne = 'vges'
                } else if (item == 3) { 
                    foodName = '肉蛋类'
                    ne = 'meas'
                } else if (item == 4) { 
                    foodName = '大豆类'
                    ne = 'beas'
                } else if (item == 5) { 
                    foodName = '奶类'
                    ne = 'mils'
                } else if (item == 6) { 
                    foodName = '水果类'
                    ne = 'fruits'
                } else if (item == 7) { 
                    foodName = '油脂类'
                    ne = 'oils'
                }
                obj.name = foodName
                obj.type = item
                obj.ne = ne
                // obj.food  = food[i]
                // obj.share = share[i]
                this.titleFoodData.push(obj)
            })
            this.type = this.titleFoodData[0].type
            let NAME = this.titleFoodData[0].ne
            this.datas(NAME)
        },
        datas (names) {
            this.share = 0
            let params = {
                types: this.type
            }
            this.itemFood = []
            console.log(this.BRE_food)
            api.get(`${this.baseURL}health/food/tool?`, params, data => {
                this.itemFood = data.data
                this.itemFood.map(item => {
                    if (this.type == 6) {
                        this.BRE_food.map(list => {
                            console.log(list.name)
                            if (list.name.indexOf(item.name) !== -1) {
                                item.value = list.piece
                                this.share += list.piece 
                            } else {
                                item.value = 0
                            }
                        })
                    } else {
                        console.log(111111)
                        this.BRE_food.map(list => {
                            for(let i in list) {
                                console.log(i)
                                if (i == names) {
                                    console.log(i)
                                    list[i].map(a => {
                                        if (a.name.indexOf(item.name) !== -1) {
                                            item.value = a.piece
                                            this.share += a.piece
                                        } else {
                                            item.value = 0
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
                this.theSum = this.share
                this.share_num = this.share - this.theSum
                this.$forceUpdate()
            })
        },
        foodDatas (index, type, name) {
            this.num = index
            this.type = type
            this.datas(name)
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
        eachModification () { // 保存修改每项
            if (this.share == this.theSum) {
                this.FOOD_DATA = []
                this.itemFood.map(item => {
                    if (item.value != 0) {
                        let obj = {
                            name: item.name + item.perUnitG + 'g/ ' + item.kcal + 'kcal',
                            piece: item.value
                        }
                        // 1谷薯类；2蔬菜类；3肉蛋类；4大豆类；5奶类；6水果类；7油脂类
                        if (this.modifyName == '早餐' && this.type == 5) {
                            this.FOOD_DATA.push(obj) // 早餐牛奶
                            this.prescriptionVoData('bre', 'mils')
                        } else if (this.modifyName == '早餐' && this.type == 1) {
                            this.FOOD_DATA.push(obj) // 早餐谷署
                            this.prescriptionVoData('bre', 'gras')
                        } else if (this.modifyName == '早餐' && this.type == 3) {
                            this.FOOD_DATA.push(obj) // 早餐肉蛋
                            this.prescriptionVoData('bre', 'meas')
                        } else if (this.modifyName == '午餐' && this.type == 2) {
                            this.FOOD_DATA.push(obj) // 午餐蔬菜
                            this.prescriptionVoData('lun', 'vegs')                       
                        } else if (this.modifyName == '午餐' && this.type == 4) {
                            this.FOOD_DATA.push(obj) // 午餐豆类
                            this.prescriptionVoData('lun', 'beas')                        
                        } else if (this.modifyName == '午餐' && this.type == 7) {
                            this.FOOD_DATA.push(obj) // 午餐油脂
                            this.prescriptionVoData('lun', 'oils')                       
                        } else if (this.modifyName == '午餐' && this.type == 1) {
                            this.FOOD_DATA.push(obj) // 午餐谷署
                            this.prescriptionVoData('lun', 'gras')                       
                        } else if (this.modifyName == '午餐' && this.type == 3) {
                            this.FOOD_DATA.push(obj) // 午餐肉蛋
                            this.prescriptionVoData('lun', 'meas')
                        } else if (this.modifyName == '晚餐' && this.type == 2) {
                            this.FOOD_DATA.push(obj) // 晚餐蔬菜
                            this.prescriptionVoData('din', 'vges')                       
                        } else if (this.modifyName == '晚餐' && this.type == 1) {
                            this.FOOD_DATA.push(obj) // 晚餐谷署
                            this.prescriptionVoData('din', 'gras')                      
                        } else if (this.modifyName == '晚餐' && this.type == 3) {
                            this.FOOD_DATA.push(obj) // 晚餐肉蛋
                            this.prescriptionVoData('din', 'meas')                       
                        } else if (this.modifyName == '晚餐' && this.type == 7) {
                            this.FOOD_DATA.push(obj) // 晚餐油脂
                            this.prescriptionVoData('din', 'oils')                       
                        } else if (this.modifyName == '水果' && this.type == 6) {
                            this.FOOD_DATA.push(obj) // 水果
                            for (let i in this.prescriptionVo) {
                                if (i == 'fruits') {
                                    this.prescriptionVo[i] = this.FOOD_DATA
                                }
                            }
                        }
                    }
                })
                modal.toast({ message: "保存成功!", duration: 1 });
            }
        },
        prescriptionVoData (name, type) {
            for(let i in this.prescriptionVo) {
                if(i == name) {
                    for (let j in this.prescriptionVo[i]) {
                        if (j == type) {
                            this.prescriptionVo[i][j] = this.FOOD_DATA
                        }
                    }
                }
            }
        },
        submissionData () {
            api.jsonpost(`${this.baseURL}health/food/uploadPrescription/${this.prescriptionId}/13693371465-dr`, 
                JSON.stringify(this.prescriptionVo), data => {
                console.log(data)
                if (data.code == 200) {
                    modal.toast({ message: "修改成功!", duration: 1 });
                } else {
                    modal.toast({ message: "修改失败!", duration: 1 });
                }
            })
        },
        showCalendarModel () {
            this.show = false
        },
        jump (path, name, type, food, share) {
            if(!path) return;
            const navigator = weex.requireModule('navigator')
            navigator.push({
                url: createLink('itemModify'),
                animated: "true"
            })
            storage.setItem('modifyName', name)
            storage.setItem('foodTypes', type)
            storage.setItem('breFood', food)
            storage.setItem('BRE_SHARE', share)
        },
        minibarLeftButtonClick () {},
    }
}
</script>
<style lang="less" scoped>
  .scroller{
      background-color: rgb(255, 255, 255);
  }
  .headEnergy{
      height: 85px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: rgb(238, 238, 238);
  }
  .totalEnergy{
    margin-left: 30px;
    font-size: 30px;
    color: rgb(2, 179, 237);
  }
  .editImg{
      width: 60px;
      height: 60px;
      margin-right: 30px;
  }
  .food_box{
      position: relative;
      margin-top: 60px;
      margin-left: 30px;
      margin-right: 30px;
  }
  .food_title{
    margin-top: 20px;
    padding-bottom: 20px;
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 0;
    top: -55px;
  }
  .breakfast{
    margin-left: 30px;
    width: 60px;
    height: 60px;
    z-index: 1;
  }
  .title_word{
    width: 300px;
    height: 64px;
    text-align: center;
    line-height: 64px;
    font-size: 30px;
    color: rgb(51, 51, 51);
    border-radius: 99px;
    margin-right: 100px;
    z-index: 1;
  }
  .food_content{
      flex: 1;
      border-radius: 25px;
      box-shadow: 0 0 10px rgb(238, 238, 238);
      padding-top: 60px;
  }
  .food_type{
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
  }
  .food_type:last-child, .details_div:last-child{
      border-bottom: none;
  }
  .name{
    flex: 1;
    font-size: 30px;
    color: rgb(102, 102, 102);
    margin-left: 30px;
  }
  .food_item{
      flex: 3;
      margin-right: 20px;
      flex-direction: column;
  }
  .details_div{
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      padding-bottom: 15px;
      border-bottom-width: 1px;
      border-bottom-color: rgb(238, 238, 238);
  }
  .food_name, .share{
    font-size: 26px;
    color:rgb(153, 153, 153);
  }
  .footer{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 750px;
      height: 80px;
      background-color: #02b3ed;
      flex-direction: row;
      align-items: center;
      justify-content: center;
  }
  .foo_word{
      font-size: 36px;
      color:rgb(255, 255, 255);
  }
  //-------修改总卡路里--------
  .demo-content{
      height: 400px;
  }
  .close_box{
      flex-direction: row;
      justify-content: flex-end;
  }
  .icon_cancel_img{
      width: 36px;
      height: 36px;
      margin-top: 20px;
      margin-right: 20px;
  }
  .demo_title{
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-bottom-width: 1px;
      border-bottom-color: rgb(238, 238, 238);
  }
  .demo_t_word{
      color: rgb(51, 51, 51);
      font-size: 32px;
      margin-top: 10px;
      margin-bottom: 20px;
  }
  .kl_box{
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 54px;
  }
  .kl_total{
      font-size: 30px;
      color:rgb(102, 102, 102);
  }
  .inputBox{
      width: 144px;
      height: 56px;
      border-width: 1px;;
      border-color: rgb(2, 179, 237);
      outline: none;
      border-radius: 10px;
      margin-left: 10px;
      margin-right: 10px;
      text-align: center;
      font-size: 30px;
      color:rgb(170, 170, 170);
  }
  .sure_modify{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 750px;
      height: 80px;
      background-color: #02b3ed;
      flex-direction: row;
      align-items: center;
      justify-content: center;
  }
  .sure_word{
      font-size: 36px;
      color: rgb(255, 255, 255);
  }
//   -------修改饮食记录--------
  .demo-title{
    height: 90px;
    background-color: #02b4ed;
    flex-direction: row;
    align-items: center;
  }
  .icon_block{
    flex: 1;
    height: 90px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .title_content{
    flex: 4;
    height: 90px;
    text-align: center;
    line-height: 90px;
    color: rgb(255, 255, 255);
  }
  .preservation{
    flex: 1;
  }
  .icon_back_white{
    width: 40px;
    height: 40px;
  }
  .foodTitle{
    height: 80px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: rgb(255, 255, 255);
    margin-bottom: 10px;
  }
  .foodType{
    font-size: 32px;
    color: rgb(102, 102, 102);
    height: 80px;
    line-height: 80px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .woed_on{
    color: rgb(2, 179, 237);
    border-bottom-width: 1px;
    border-bottom-color: rgb(2, 179, 237);
  }
  .modify_the_p{
      background-color: rgb(255, 255, 255);
  }
  .classification_box{
    margin-left: 30px;
    margin-right: 30px;
  }
  .classification{
      margin-top: 15px;
      padding-bottom: 15px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom-width: 1px;
      border-bottom-color: rgb(238, 238, 238);
  }
  .classification_type{
      font-size: 30px;
      color:rgb(102, 102, 102);
  }
  .class_type_on{
      color: rgb(153, 153, 153);
  }
  .symbol_box{
      flex-direction: row;
      align-items: center;
  }
  .symbol_a, .symbol_b{
      width: 60px;
      height: 50px;
      background-color: rgb(238, 238, 238);
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
      text-align: center;
      line-height: 50px;
      font-size: 44px;
      color: #999999;
  }
  .symbol_word_color{
      color: #cccccc;
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
  .symbol_num_color{
      color:#999999;
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
    margin-right: 30px;
  }
  .share_word{
      font-size: 28px;
      color: rgb(102, 102, 102);
  }
  .share_f{
      font-size: 28px;
      color:rgb(2, 179, 237);
  }
  .submission{
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 70px;
    margin-bottom: 20px;
  }
  .bg, .on{
    width: 440px;
    height: 70px;
    border-radius: 99px;
    text-align: center;
    line-height: 70px;
    color: rgb(255, 255, 255);
    font-size: 30px;
  }
  .bg{
    background-color: rgb(2, 179, 237);
  }
  .on{
    background-color: rgb(153, 153, 153);
  }
</style>
