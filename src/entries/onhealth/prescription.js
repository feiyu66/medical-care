import prescription from '../../pages/onhealth/food_prescription.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

prescription.el = '#root'
new Vue(prescription)
