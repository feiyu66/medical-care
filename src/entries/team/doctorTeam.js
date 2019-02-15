import doctorTeam from '../../pages/team/doctorTeam.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

doctorTeam.el = '#root'
new Vue(doctorTeam)
