import record from '../../pages/record/record.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

record.el = '#root'
new Vue(record)
