import generationReport from '../../pages/onhealth/generationReport.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

generationReport.el = '#root'
new Vue(generationReport)
