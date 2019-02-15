import foodReplace from '../../pages/onhealth/foodReplace.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

foodReplace.el = '#root'
new Vue(foodReplace)
