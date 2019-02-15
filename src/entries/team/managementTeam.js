import managementTeam from '../../pages/team/managementTeam.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

managementTeam.el = '#root'
new Vue(managementTeam)
