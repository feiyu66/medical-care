import review from '../../pages/prescription/review.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

review.el = '#root'
new Vue(review)
