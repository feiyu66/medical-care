import prescriptionReview from '../../pages/prescription/prescriptionReview.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

prescriptionReview.el = '#root'
new Vue(prescriptionReview)
