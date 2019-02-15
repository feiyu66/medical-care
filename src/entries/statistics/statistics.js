import statistics from '../../pages/statistics/statistics.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

statistics.el = '#root'
new Vue(statistics)
