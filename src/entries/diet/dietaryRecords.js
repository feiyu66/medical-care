import dietaryRecords from '../../pages/diet/dietaryRecords.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

dietaryRecords.el = '#root'
new Vue(dietaryRecords)
