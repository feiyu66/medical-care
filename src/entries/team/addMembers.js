import addMembers from '../../pages/team/addMembers.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

addMembers.el = '#root'
new Vue(addMembers)
