import noFollow from '../../pages/no_follow_up/no_follow_up.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

noFollow.el = '#root'
new Vue(noFollow)
