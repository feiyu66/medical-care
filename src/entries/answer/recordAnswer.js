import recordAnswer from '../../pages/answer/recordAnswer.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

recordAnswer.el = '#root'
new Vue(recordAnswer)
