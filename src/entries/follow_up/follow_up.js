import follow from '../../pages/follow_up/follow_up.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

follow.el = '#root'
new Vue(follow)
