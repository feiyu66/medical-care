import follow from '../../pages/follow/follow.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

follow.el = '#root'
new Vue(follow)
