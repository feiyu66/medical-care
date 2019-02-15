import recordDetails from '../../pages/answer/recordDetails.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

recordDetails.el = '#root'
new Vue(recordDetails)
