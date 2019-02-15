import dieteticDiary from '../../pages/diet/dieteticDiary.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

dieteticDiary.el = '#root'
new Vue(dieteticDiary)
