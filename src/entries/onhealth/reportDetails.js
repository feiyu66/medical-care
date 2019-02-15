import reportDetails from '../../pages/onhealth/reportDetails.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

reportDetails.el = '#root'
new Vue(reportDetails)
